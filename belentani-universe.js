/* BELENTANI UNIVERSE — procedural canvas, no external dependencies. */
(function (root) {
  "use strict";

  var profiles = {
    galaxia: { count: 1450, speed: 0.00006, colors: ["#4de8e0", "#f4f0f2", "#d4af37", "#ff073a"], arms: 4, haze: ["rgba(212,175,55,.11)", "rgba(77,232,224,.035)"] },
    nebulosa: { count: 1050, speed: 0.000025, colors: ["#ff073a", "#4de8e0", "#f4f0f2"], arms: 3, haze: ["rgba(255,7,58,.13)", "rgba(77,232,224,.045)"] },
    red: { count: 720, speed: 0.00011, colors: ["#ff073a", "#d4af37", "#4de8e0"], arms: 0, haze: ["rgba(255,7,58,.14)", "rgba(212,175,55,.035)"] }
  };

  function seededRandom(seed) {
    var value = seed >>> 0;
    return function () {
      value += 0x6d2b79f5;
      var sample = value;
      sample = Math.imul(sample ^ (sample >>> 15), sample | 1);
      sample ^= sample + Math.imul(sample ^ (sample >>> 7), sample | 61);
      return ((sample ^ (sample >>> 14)) >>> 0) / 4294967296;
    };
  }

  function attach(container, options) {
    if (!container) throw new Error("BelentaniUniverse: falta el contenedor");
    options = options || {};
    var mode = profiles[options.mode] ? options.mode : "galaxia";
    var onMotionChange = typeof options.onMotionChange === "function" ? options.onMotionChange : null;
    function notifyMotionChange() { if (onMotionChange) onMotionChange({ reduced: reduced, paused: reduced || userPaused }); }
    var canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:fixed;inset:0;width:100vw;height:100vh;display:block;pointer-events:none;z-index:0";
    canvas.id = "belentani-universe-canvas";
    canvas.className = "belentani-universe-canvas";
    container.appendChild(canvas);
    var ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) { container.removeChild(canvas); throw new Error("BelentaniUniverse: canvas 2D no disponible"); }
    var mobile = window.matchMedia && window.matchMedia("(max-width: 760px)").matches;
    var lowPower = mobile || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || (navigator.deviceMemory && navigator.deviceMemory <= 4);
    var baseScale = lowPower ? 0.52 : 1;
    var qualityScale = 1, sampleTime = 0, sampleFrames = 0;
    var width = 0, height = 0, dpr = 1, stars = [], nodes = [], clouds = [], meteors = [];
    var pointerX = 0, pointerY = 0, smoothX = 0, smoothY = 0;
    var scrollTarget = 0, scrollProgress = 0;
    var frame = null, lastTime = 0, alive = true, visible = !document.hidden, userPaused = false;
    var motionQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    var reduced = motionQuery ? motionQuery.matches : false;

    function seed() {
      var profile = profiles[mode];
      var random = seededRandom(mode === "galaxia" ? 17091988 : mode === "nebulosa" ? 7061995 : 4322026);
      stars = [];
      var starCount = Math.max(180, Math.round(profile.count * baseScale));
      for (var i = 0; i < starCount; i++) {
        var arm = Math.floor(random() * (profile.arms || 1));
        var radius = Math.sqrt(random());
        var angle = random() * Math.PI * 2;
        if (profile.arms) angle = arm * Math.PI * 2 / profile.arms + radius * 4.2 + (random() - 0.5) * (0.35 + radius * 0.7);
        stars.push({
          x: profile.arms ? Math.cos(angle) * radius : random() * 2 - 1,
          y: profile.arms ? Math.sin(angle) * radius * 0.68 : random() * 2 - 1,
          radius: radius,
          size: random() * 1.45 + 0.35,
          phase: random() * Math.PI * 2,
          color: profile.colors[Math.floor(random() * profile.colors.length)],
          alpha: random() * 0.5 + 0.28,
          depth: 0.22 + random() * 0.78
        });
      }
      meteors = [];
      for (var meteor = 0; meteor < 3; meteor++) {
        meteors.push({ x: random() * 1.1 - 0.05, y: random() * 0.5, start: random() * 7000, duration: 520 + random() * 380, angle: 0.42 + random() * 0.35, strength: 0.35 + random() * 0.45 });
      }
      clouds = [];
      for (var cloud = 0; cloud < 7; cloud++) {
        clouds.push({ x: random() * 2 - 1, y: random() * 1.5 - 0.75, radius: random() * 0.3 + 0.16, phase: random() * Math.PI * 2, color: cloud % 3 === 0 ? "255,7,58" : cloud % 2 ? "77,232,224" : "212,175,55" });
      }
      nodes = [];
      for (var row = 0; row < 6; row++) {
        for (var col = 0; col < 8; col++) {
          nodes.push({ x: (col / 7 - 0.5) * 1.75 + (random() - 0.5) * 0.12, y: (row / 5 - 0.5) * 1.5 + (random() - 0.5) * 0.12, phase: random() * Math.PI * 2 });
        }
      }
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1 : 1.35);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(now) {
      if (!alive || !visible) return;
      if (!lastTime) lastTime = now;
      if (!sampleTime) sampleTime = now;
      sampleFrames++;
      if (now - sampleTime >= 1600) {
        var fps = sampleFrames * 1000 / (now - sampleTime);
        if (fps < 42) qualityScale = Math.max(0.42, qualityScale - 0.16);
        else if (fps > 57) qualityScale = Math.min(1, qualityScale + 0.06);
        sampleTime = now;
        sampleFrames = 0;
      }
      var profile = profiles[mode];
      var delta = lastTime ? Math.min(now - lastTime, 50) : 16;
      lastTime = now;
      var parallaxEase = 1 - Math.exp(-delta * 0.0035);
      var cx = width * (0.5 + smoothX * 0.035);
      var cy = height * (0.48 + smoothY * 0.035 - scrollProgress * 0.075);
      var scale = Math.min(width, height) * 0.52;
      smoothX += (pointerX - smoothX) * parallaxEase;
      smoothY += (pointerY - smoothY) * parallaxEase;
      scrollProgress += (scrollTarget - scrollProgress) * parallaxEase;

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);
      var haze = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 1.28);
      haze.addColorStop(0, profile.haze[0]);
      haze.addColorStop(0.43, profile.haze[1]);
      haze.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, width, height);

      if (mode === "red") drawNetwork(now, cx, cy, scale);
      if (mode === "nebulosa") drawNebula(now, cx, cy, scale);
      if (mode !== "red") drawOrbits(now, cx, cy, scale);
      ctx.globalCompositeOperation = "lighter";
      var visibleStars = Math.max(120, Math.floor(stars.length * qualityScale));
      for (var i = 0; i < visibleStars; i++) {
        var star = stars[i];
        var rotation = now * profile.speed * (1 - star.radius * 0.5) * star.depth;
        var cos = Math.cos(rotation), sin = Math.sin(rotation);
        var layerScale = 0.68 + star.depth * 0.48;
        var x = cx + (star.x * cos - star.y * sin) * scale * layerScale;
        var y = cy + (star.x * sin + star.y * cos) * scale * layerScale;
        var twinkle = reduced ? 1 : 0.76 + Math.sin(now * 0.0012 + star.phase) * 0.24;
        var alpha = Math.max(0.08, Math.min(0.92, star.alpha * twinkle * (0.42 + star.depth * 0.58)));
        ctx.fillStyle = star.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(x, y, star.size * (0.7 + (1 - star.radius) * 0.55) * (0.55 + star.depth * 0.65), 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduced) drawMeteors(now);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }

    function drawMeteors(now) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (var i = 0; i < meteors.length; i++) {
        var meteor = meteors[i];
        var phase = (now + meteor.start) % 8200;
        if (phase > meteor.duration) continue;
        var progress = phase / meteor.duration;
        var x = meteor.x * width + progress * width * 0.32;
        var y = meteor.y * height + progress * height * 0.22;
        var tail = Math.min(width, height) * 0.12 * meteor.strength;
        var gradient = ctx.createLinearGradient(x, y, x - Math.cos(meteor.angle) * tail, y - Math.sin(meteor.angle) * tail);
        var glow = Math.max(0, 1 - progress);
        gradient.addColorStop(0, "rgba(255,255,255," + (glow * 0.86) + ")");
        gradient.addColorStop(0.22, "rgba(255,7,58," + (glow * 0.48) + ")");
        gradient.addColorStop(1, "rgba(77,232,224,0)");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - Math.cos(meteor.angle) * tail, y - Math.sin(meteor.angle) * tail);
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawNebula(now, cx, cy, scale) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (var i = 0; i < clouds.length; i++) {
        var cloud = clouds[i];
        var pulse = reduced ? 1 : 1 + Math.sin(now * 0.00024 + cloud.phase) * 0.08;
        var x = cx + cloud.x * scale * 0.82;
        var y = cy + cloud.y * scale * 0.68;
        var radius = scale * cloud.radius * pulse;
        var gradient = ctx.createRadialGradient(x, y, radius * 0.04, x, y, radius);
        gradient.addColorStop(0, "rgba(" + cloud.color + ",.095)");
        gradient.addColorStop(0.46, "rgba(" + cloud.color + ",.034)");
        gradient.addColorStop(1, "rgba(" + cloud.color + ",0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      }
      ctx.restore();
    }

    function drawOrbits(now, cx, cy, scale) {
      var pulse = 1 + (reduced ? 0 : Math.sin(now * 0.0011) * 0.025);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.18);
      [0.16, 0.29, 0.42].forEach(function (factor, index) {
        ctx.beginPath();
        ctx.ellipse(0, 0, scale * factor * pulse, scale * factor * 0.58 * pulse, 0, 0, Math.PI * 2);
        ctx.strokeStyle = index === 1 ? "rgba(255,7,58,.16)" : "rgba(212,175,55,.13)";
        ctx.lineWidth = 0.7;
        ctx.stroke();
      });
      var core = ctx.createRadialGradient(0, 0, 0, 0, 0, scale * 0.17);
      core.addColorStop(0, "rgba(255,255,255,.24)");
      core.addColorStop(0.16, "rgba(255,7,58,.19)");
      core.addColorStop(1, "rgba(255,7,58,0)");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(0, 0, scale * 0.17, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawNetwork(now, cx, cy, scale) {
      var points = [];
      for (var i = 0; i < nodes.length; i++) {
        var node = nodes[i];
        var drift = reduced ? 0 : Math.sin(now * 0.0003 + node.phase) * 0.012;
        points.push({ x: cx + (node.x + drift) * scale, y: cy + (node.y - drift) * scale });
      }
      ctx.save();
      for (var row = 0; row < 6; row++) {
        for (var col = 0; col < 8; col++) {
          var index = row * 8 + col, point = points[index];
          [[col < 7 ? index + 1 : -1], [row < 5 ? index + 8 : -1], [row < 5 && col < 7 ? index + 9 : -1]].forEach(function (edge) {
            if (edge[0] < 0) return;
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(points[edge[0]].x, points[edge[0]].y);
            ctx.strokeStyle = "rgba(255,7,58,.19)";
            ctx.lineWidth = 0.8;
            ctx.stroke();
          });
        }
      }
      ctx.globalCompositeOperation = "lighter";
      for (var j = 0; j < points.length; j++) {
        ctx.beginPath();
        ctx.arc(points[j].x, points[j].y, 1.05, 0, Math.PI * 2);
        ctx.fillStyle = j % 9 === 0 ? "#d4af37" : j % 5 === 0 ? "#4de8e0" : "#ff073a";
        ctx.fill();
      }
      ctx.restore();
    }

    function move(event) {
      pointerX = event.clientX / Math.max(window.innerWidth, 1) * 2 - 1;
      pointerY = event.clientY / Math.max(window.innerHeight, 1) * 2 - 1;
    }
    function updateScroll() {
      scrollTarget = window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      if (reduced && !userPaused) draw(performance.now());
    }
    function stop() {
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
    }
    function tick(now) {
      frame = null;
      if (!alive || !visible || reduced) return;
      draw(now);
      frame = window.requestAnimationFrame(tick);
    }
    function start() {
      if (alive && visible && !reduced && !userPaused && frame === null) frame = window.requestAnimationFrame(tick);
    }
    function visibility() {
      visible = !document.hidden;
      if (visible) { lastTime = 0; sampleTime = 0; sampleFrames = 0; draw(performance.now()); start(); }
      else { stop(); lastTime = 0; sampleTime = 0; sampleFrames = 0; }
    }
    function motionChange(event) {
        reduced = event.matches;
        stop();
        lastTime = 0;
        sampleTime = 0;
        sampleFrames = 0;
        draw(performance.now());
        start();
        notifyMotionChange();
      }


    resize();
    seed();
    draw(performance.now());
    start();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", updateScroll, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    if (motionQuery) {
      if (motionQuery.addEventListener) motionQuery.addEventListener("change", motionChange);
      else if (motionQuery.addListener) motionQuery.addListener(motionChange);
    }
    container.dataset.universeMode = mode;

    return {
      setMode: function (nextMode) {
        if (!profiles[nextMode]) return false;
        mode = nextMode;
        lastTime = 0;
        sampleTime = 0;
        sampleFrames = 0;
        qualityScale = 1;
        seed();
        container.dataset.universeMode = mode;
        draw(performance.now());
        stop();
        start();
        return true;
      },
      setMotionPaused: function (paused) {
        userPaused = Boolean(paused);
        stop();
        lastTime = 0;
        sampleTime = 0;
        sampleFrames = 0;
        if (userPaused) draw(performance.now());
        else start();
        notifyMotionChange();
        return userPaused;
      },
      isMotionPaused: function () { return reduced || userPaused; },
      isMotionReduced: function () { return reduced; },
      destroy: function () {
        alive = false;
        stop();
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", move);
        window.removeEventListener("scroll", updateScroll);
        document.removeEventListener("visibilitychange", visibility);
        if (motionQuery) {
          if (motionQuery.removeEventListener) motionQuery.removeEventListener("change", motionChange);
          else if (motionQuery.removeListener) motionQuery.removeListener(motionChange);
        }
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      }
    };
  }

  root.BelentaniUniverse = { attach: attach, modes: Object.keys(profiles) };
})(typeof window !== "undefined" ? window : this);
