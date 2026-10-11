/* hero-galaxia.js — hero de galaxia WebGL para belentani.es
   Referente de calidad: la galaxia "launch hero" (partículas con profundidad, polvo luminoso, respuesta suave al puntero,
   rendimiento adaptativo). Sin dependencias: WebGL puro. Paleta del universo: oro viejo → rojo → violeta.
   - Respeta prefers-reduced-motion (un único fotograma estático, sin bucle ni puntero).
   - Sin WebGL: no se crea el canvas y el hero queda como antes (la aurora CSS sigue de fondo).
   - Se pausa fuera de pantalla y con la pestaña oculta; baja partículas y resolución si el equipo va justo.
   - Arranca cuando termina la "sesión neural" (#boot), para no gastar GPU detrás de la pantalla de carga.
   FIGURA FLOTANTE: pon la ruta de tu imagen en ARTISTA_IMG (PNG con fondo transparente, o foto sobre fondo oscuro).
   Mientras esté vacía no se pide ningún fichero (cero errores 404). */
(function () {
  "use strict";

  var ARTISTA_IMG = ""; /* p. ej. "assets/artista-flotando.png" */

  var hero = document.getElementById("hero");
  if (!hero) return;
  var reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  /* ---------------------------------------------------------------- figura flotante (opcional) */
  var fig = null;
  function mountArtist() {
    if (!ARTISTA_IMG || fig) return;
    var wrap = document.createElement("div");
    wrap.id = "hero-artist";
    wrap.setAttribute("aria-hidden", "true");
    var im = new Image();
    im.alt = "";
    im.decoding = "async";
    im.onload = function () {
      wrap.appendChild(im);
      hero.appendChild(wrap);
      fig = wrap;
      requestAnimationFrame(function () { wrap.classList.add("on"); });
    };
    im.src = ARTISTA_IMG;
  }

  /* ---------------------------------------------------------------- galaxia */
  var cv = null, gl = null, prog = null, buf = null, loc = {}, count = 0, drawCount = 0;
  var dpr = 1, W = 0, H = 0;
  var raf = 0, visible = true, running = false, t0 = 0;
  var tx = 0, ty = 0, px = 0, py = 0;
  var ema = 16, frames = 0, adapted = 0;

  var VS = [
    "attribute vec3 aPos; attribute vec4 aCol; attribute float aSeed;",
    "uniform mat4 uMVP; uniform float uTime; uniform float uScale;",
    "varying vec3 vCol;",
    "void main(){",
    "  float r = length(aPos.xz);",
    "  float ang = uTime * 0.045 / (0.35 + r);", /* rotacion diferencial: el nucleo gira mas rapido que el borde */
    "  float c = cos(ang), s = sin(ang);",
    "  vec3 p = vec3(aPos.x*c - aPos.z*s, aPos.y, aPos.x*s + aPos.z*c);",
    "  vec4 q = uMVP * vec4(p, 1.0);",
    "  gl_Position = q;",
    "  float tw = 0.78 + 0.22 * sin(uTime * 1.6 + aSeed * 40.0);",
    "  gl_PointSize = max(1.0, aCol.w * uScale * tw / max(0.4, q.w));",
    "  vCol = aCol.rgb * tw;",
    "}"
  ].join("\n");
  var FS = [
    "precision mediump float; varying vec3 vCol;",
    "void main(){",
    "  float d = length(gl_PointCoord - 0.5);",
    "  float a = smoothstep(0.5, 0.0, d); a *= a;",
    "  gl_FragColor = vec4(vCol * a * 1.5, a);",
    "}"
  ].join("\n");

  function shader(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  }

  function ramp(t) { /* oro -> rojo -> violeta */
    var k;
    if (t < 0.45) { k = t / 0.45; return [1.0, 0.86 - 0.68 * k, 0.55 - 0.27 * k]; }
    k = (t - 0.45) / 0.55;
    return [1.0 - 0.45 * k, 0.18 + 0.14 * k, 0.28 + 0.72 * k];
  }
  function gauss() { return (Math.random() + Math.random() + Math.random() - 1.5) / 0.75; }

  function build(N) {
    var ARMS = 5, DUST = Math.floor(N * 0.06);
    var total = N + DUST;
    var pos = new Float32Array(total * 3), col = new Float32Array(total * 4), seed = new Float32Array(total);
    var i, o3, o4, r, ang, x, y, z, c, size, bright;
    for (i = 0; i < N; i++) {
      o3 = i * 3; o4 = i * 4;
      if (i % 9 === 0) { /* bulbo central: esferico, para que el nucleo brille como una bola y no como una barra */
        r = Math.pow(Math.random(), 1.5) * 0.3;
        ang = Math.random() * 6.2832;
        var phi = Math.acos(2 * Math.random() - 1);
        x = r * Math.sin(phi) * Math.cos(ang); y = r * Math.cos(phi) * 0.7; z = r * Math.sin(phi) * Math.sin(ang);
        c = ramp(r * 0.9);
        size = 1.2 + Math.random() * 1.8; bright = 0.5;
      } else { /* brazos */
        r = Math.pow(Math.random(), 1.55);
        ang = (i % ARMS) * (6.2832 / ARMS) + r * 5.2 + gauss() * (0.12 + 0.3 * r);
        x = Math.cos(ang) * r; z = Math.sin(ang) * r; y = gauss() * (0.03 + 0.05 * (1 - r)) * (1 - 0.4 * r);
        c = ramp(r);
        size = 1.2 + Math.random() * 2.0; bright = 0.7 + Math.random() * 0.3;
        if (Math.random() < 0.02) { size = 3.8 + Math.random() * 2.6; bright = 1.0; } /* estrellas brillantes */
      }
      pos[o3] = x; pos[o3 + 1] = y; pos[o3 + 2] = z;
      col[o4] = c[0] * bright; col[o4 + 1] = c[1] * bright; col[o4 + 2] = c[2] * bright; col[o4 + 3] = size;
      seed[i] = Math.random();
    }
    for (i = N; i < total; i++) { /* polvo luminoso: puntos grandes y tenues, de ahi la neblina */
      o3 = i * 3; o4 = i * 4;
      r = 0.15 + Math.random() * 0.95; ang = Math.random() * 6.2832;
      pos[o3] = Math.cos(ang) * r; pos[o3 + 1] = gauss() * 0.07; pos[o3 + 2] = Math.sin(ang) * r;
      c = ramp(Math.min(1, r)); bright = 0.14 + Math.random() * 0.12;
      col[o4] = c[0] * bright; col[o4 + 1] = c[1] * bright; col[o4 + 2] = c[2] * bright; col[o4 + 3] = 9 + Math.random() * 12;
      seed[i] = Math.random();
    }
    count = total;
    drawCount = total;
    var inter = new Float32Array(total * 8);
    for (i = 0; i < total; i++) {
      inter[i * 8] = pos[i * 3]; inter[i * 8 + 1] = pos[i * 3 + 1]; inter[i * 8 + 2] = pos[i * 3 + 2];
      inter[i * 8 + 3] = col[i * 4]; inter[i * 8 + 4] = col[i * 4 + 1]; inter[i * 8 + 5] = col[i * 4 + 2]; inter[i * 8 + 6] = col[i * 4 + 3];
      inter[i * 8 + 7] = seed[i];
    }
    return inter;
  }

  function init() {
    cv = document.createElement("canvas");
    cv.id = "hero-galaxy";
    cv.setAttribute("aria-hidden", "true");
    gl = cv.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: "low-power" });
    if (!gl) { cv = null; return false; }
    var vs = shader(gl.VERTEX_SHADER, VS), fs = shader(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) { cv = null; gl = null; return false; }
    prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { cv = null; gl = null; return false; }
    gl.useProgram(prog);
    loc.pos = gl.getAttribLocation(prog, "aPos");
    loc.col = gl.getAttribLocation(prog, "aCol");
    loc.seed = gl.getAttribLocation(prog, "aSeed");
    loc.mvp = gl.getUniformLocation(prog, "uMVP");
    loc.time = gl.getUniformLocation(prog, "uTime");
    loc.scale = gl.getUniformLocation(prog, "uScale");

    var cores = navigator.hardwareConcurrency || 4;
    var small = Math.min(window.innerWidth, window.innerHeight) < 700;
    var N = cores >= 8 ? 90000 : cores >= 4 ? 60000 : 30000;
    if (small) N = Math.min(N, 30000);
    if (reduce) N = Math.min(N, 24000);
    var data = build(N);
    buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    var stride = 32;
    gl.enableVertexAttribArray(loc.pos); gl.vertexAttribPointer(loc.pos, 3, gl.FLOAT, false, stride, 0);
    gl.enableVertexAttribArray(loc.col); gl.vertexAttribPointer(loc.col, 4, gl.FLOAT, false, stride, 12);
    gl.enableVertexAttribArray(loc.seed); gl.vertexAttribPointer(loc.seed, 1, gl.FLOAT, false, stride, 28);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE);
    gl.disable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 0);

    dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75);
    hero.insertBefore(cv, hero.firstChild);
    resize();
    cv.addEventListener("webglcontextlost", function (e) { e.preventDefault(); stop(); }, false);
    return true;
  }

  function resize() {
    if (!cv) return;
    var r = hero.getBoundingClientRect();
    W = Math.max(2, Math.round(r.width * dpr));
    H = Math.max(2, Math.round(r.height * dpr));
    if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
    gl.viewport(0, 0, W, H);
  }

  /* matrices 4x4 en columnas */
  function persp(fov, asp, n, f) {
    var t = 1 / Math.tan(fov / 2);
    return [t / asp, 0, 0, 0, 0, t, 0, 0, 0, 0, (f + n) / (n - f), -1, 0, 0, 2 * f * n / (n - f), 0];
  }
  function mul(a, b) {
    var o = new Array(16), i, j, k, s;
    for (i = 0; i < 4; i++) for (j = 0; j < 4; j++) { s = 0; for (k = 0; k < 4; k++) s += a[k * 4 + i] * b[j * 4 + k]; o[j * 4 + i] = s; }
    return o;
  }
  function rotX(a) { var c = Math.cos(a), s = Math.sin(a); return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]; }
  function rotY(a) { var c = Math.cos(a), s = Math.sin(a); return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]; }
  function trans(x, y, z) { return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]; }

  function draw(t) {
    var pitch = 1.0 + py * 0.22, yaw = px * 0.5 + t * 0.012;
    var asp = W / H;
    /* la galaxia se desplaza hacia la derecha en pantallas anchas para no tapar el texto central */
    var shift = asp > 1.3 ? 0.55 : 0;
    var m = mul(persp(0.9, asp, 0.1, 20), mul(trans(shift, 0.05, -2.35), mul(rotX(pitch), rotY(yaw))));
    gl.uniformMatrix4fv(loc.mvp, false, new Float32Array(m));
    gl.uniform1f(loc.time, t);
    gl.uniform1f(loc.scale, (H / 640) * 2.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, drawCount);
  }

  function frame(now) {
    if (!running) return;
    var dt = now - (frame.last || now); frame.last = now;
    var t = (now - t0) / 1000;
    px += (tx - px) * 0.045; py += (ty - py) * 0.045;
    draw(t);
    if (fig) fig.style.transform = "translate3d(" + (-px * 28).toFixed(1) + "px," + (-py * 18).toFixed(1) + "px,0)";
    /* rendimiento adaptativo: media movil del tiempo de fotograma */
    ema = ema * 0.92 + Math.min(dt, 80) * 0.08;
    if (++frames % 90 === 0 && ema > 27 && adapted < 2) {
      adapted++;
      drawCount = Math.floor(drawCount * 0.6);
      dpr = Math.max(1, dpr * 0.78);
      resize();
    }
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running || !cv || reduce) return;
    running = true; frame.last = 0;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  function boot() {
    if (!init()) { mountArtist(); return; }
    if (reduce) { draw(8); } /* un unico fotograma, sin movimiento */
    requestAnimationFrame(function () { cv.classList.add("on"); });
    mountArtist();
    t0 = performance.now();
    if (!reduce) {
      window.addEventListener("pointermove", function (e) {
        tx = e.clientX / window.innerWidth - 0.5;
        ty = e.clientY / window.innerHeight - 0.5;
      }, { passive: true });
    }
    if ("ResizeObserver" in window) new ResizeObserver(function () { resize(); if (reduce) draw(8); }).observe(hero);
    else window.addEventListener("resize", function () { resize(); if (reduce) draw(8); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
        if (visible && !document.hidden) start(); else stop();
      }, { threshold: 0.02 }).observe(hero);
    }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else if (visible) start();
    });
    start();
  }

  /* esperar a que termine la "sesion neural" (#boot): sin pantalla de carga, arranca ya */
  function whenBootDone(cb) {
    var b = document.getElementById("boot");
    if (!b || b.classList.contains("off")) { cb(); return; }
    var called = false, mo = null, rm = null;
    function once() {
      if (called) return;
      called = true;
      if (mo) mo.disconnect();
      if (rm) rm.disconnect();
      cb();
    }
    mo = new MutationObserver(function () {
      var cur = document.getElementById("boot");
      if (!cur || cur.classList.contains("off")) once();
    });
    mo.observe(b, { attributes: true, attributeFilter: ["class"] });
    rm = new MutationObserver(function () { if (!document.getElementById("boot")) once(); });
    rm.observe(document.body, { childList: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { whenBootDone(boot); });
  else whenBootDone(boot);
})();
