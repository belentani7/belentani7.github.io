/* JUDAS SESSIONS — guided routes over the public portal and documented archive. */
(function () {
  "use strict";

  var sessions = [
    { id: "home", title: "La puerta", tag: "01 // NÚCLEO", copy: "Un planeta vivo y cuatro reliquias se agrupan alrededor de un núcleo: la experiencia empieza eligiendo dónde mirar.", actions: [["JUDAS", "ENTRAR EN EL PORTAL 3D"], ["JUDAS UNIFICADO", "ABRIR EL COSMOS UNIFICADO"]] },
    { id: "artist", title: "La mano detrás del artefacto", tag: "02 // ORIGEN", copy: "La interfaz habla de obra y autoría; el Judas de ficción y la persona real permanecen como planos distintos.", actions: [["BIBLIA", "LEER LA BIBLIA DEL ATLAS"], ["OMEGA", "ABRIR EL ARCHIVO VISUAL"]] },
    { id: "music", title: "Archivo de escucha", tag: "03 // SONIDO", copy: "Preescuchas cortas documentadas en el catálogo del proyecto. La reproducción requiere una acción y puede depender de conexión y permisos del navegador.", actions: [["JUDAS AUDIO", "ELEGIR UNA PREESCUCHA"], ["JUDAS", "ABRIR LA EXPERIENCIA PRINCIPAL"]] },
    { id: "judas", title: "El beso como umbral", tag: "04 // MITO", copy: "En Gospels of the Night, Pedro besa a Judas y lo elegiría de nuevo. La parábola no convierte a la persona del artista en personaje.", actions: [["JUDAS", "ENTRAR EN EL PORTAL"], ["BIBLIA", "EXPLORAR EL CANON DOCUMENTADO"]] },
    { id: "experience", title: "Reliquias y órbita", tag: "05 // EXPERIENCIA", copy: "Planeta, diamante IOR 2.417, llave dorada PBR y máquina orgánica pertenecen a la escena 3D; no son planetas del canon musical.", actions: [["JUDAS", "RECORRER LA EXPERIENCIA 3D"], ["JUDAS UNIFICADO", "ABRIR LA VERSIÓN UNIFICADA"]] },
    { id: "ailab", title: "Materia para experimentar", tag: "06 // TALLER", copy: "Vuelve al atlas principal: los módulos locales convierten palabras, ritmo y símbolos en herramientas creativas.", actions: [["WRITE", "FORJAR UNA LETRA"], ["FORGE", "ABRIR LA FORJA DE BEATS"]] },
    { id: "gallery", title: "La bóveda visual", tag: "07 // ARCHIVO", copy: "Las imágenes y variaciones se presentan como artefactos y referencias, no como ilustraciones literales de escenas de la historia.", actions: [["OMEGA", "ABRIR EL ARCHIVO DE OMEGA"], ["JUDAS OMEGA", "VISITAR LAS VERSIONES PÚBLICAS"]] },
    { id: "contact", title: "Transmitir una señal", tag: "08 // UPLINK", copy: "Abre la ficha de cada destino antes de seguir: alguno puede estar en modo experimental o funcionar como alias de otro sitio.", actions: [["JUDAS ACCESS", "ABRIR LA PUERTA JUDAS"], ["JUDAS SCIFI", "ABRIR EL EXPERIMENTO SCI-FI"]] },
    { id: "studio", title: "Las nueve puertas", tag: "09 // SESIONES", copy: "Mapa de lectura, no sincronización en tiempo real: las puertas organizan relatos, archivos y experiencias públicas alrededor del mismo núcleo.", actions: [["JUDAS AUDIO", "ESCUCHAR UNA PREVIEW"], ["JUDAS", "VOLVER AL NÚCLEO 3D"]] }
  ];
  var version = "0a493e9a335aa68d17b0664641dd520bb1ebc7b9";
  var audioRoot = "https://raw.githubusercontent.com/belentani7/judas-experience-web/" + version + "/assets/audio/sessions/";
  var audioTracks = [["INSTRUMENTAL", "instrumental.mp3"], ["COROS", "coros.mp3"], ["CORO ALTO", "coro_hi.mp3"], ["CORO BAJO", "coro_lo.mp3"], ["VIOLÍN", "violin.mp3"], ["VIOLÍN · MELODÍA", "violin_m.mp3"], ["MIX A", "mixA.mp3"], ["MIX B", "mixB.mp3"]];
  var activeAudio = null;
  var volumeSlider = null;
  var closeFocus = null;
  var previousOverflow = "";
  var previousFocus = null;
  var isOpen = false;

  var style = document.createElement("style");
  style.textContent = "" +
    "#judasSessions{position:fixed;inset:0;z-index:150;display:none;place-items:center;padding:18px;background:rgba(1,1,4,.86);backdrop-filter:blur(18px)}" +
    "#judasSessions.open{display:grid}" +
    ".js-shell{width:min(1120px,100%);max-height:min(860px,calc(100vh - 36px));max-height:min(860px,calc(100dvh - 36px));overflow:auto;border:1px solid rgba(255,7,58,.42);border-radius:22px;padding:clamp(16px,3vw,30px);background:linear-gradient(145deg,rgba(18,5,12,.98),rgba(2,1,4,.98));box-shadow:0 24px 90px rgba(0,0,0,.72),0 0 45px rgba(255,7,58,.12)}" +
    ".js-head{display:flex;justify-content:space-between;gap:18px;align-items:flex-start}.js-kicker{color:#d4af37;font-size:9px;letter-spacing:.2em}.js-head h2{font-family:var(--display);font-size:clamp(20px,4vw,34px);letter-spacing:.12em;color:#fff}.js-close{border:1px solid var(--border);background:transparent;color:var(--red);width:38px;height:38px;font-size:20px}" +
    ".js-grid{display:grid;grid-template-columns:minmax(240px,.85fr) minmax(0,1.5fr);gap:14px;margin-top:15px}.js-nav{display:grid;gap:6px;align-content:start}.js-nav button{min-height:48px;text-align:left;padding:9px 11px;border:1px solid rgba(255,7,58,.16);background:rgba(255,255,255,.02);color:#d2c9cb;font-size:10px;letter-spacing:.1em}.js-nav button[aria-current=true],.js-nav button:hover{border-color:var(--red);color:#fff;background:rgba(255,7,58,.1)}.js-nav b{color:#d4af37;margin-right:9px}" +
    ".js-detail{min-height:310px;border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:18px;background:radial-gradient(circle at 90% 0,rgba(77,232,224,.09),transparent 38%),rgba(255,255,255,.025)}.js-detail .js-tag{color:var(--gold);font-size:9px;letter-spacing:.18em}.js-detail h3{margin:8px 0 10px;color:#fff;font-family:var(--display);letter-spacing:.08em}.js-detail p{color:#c6bbbd;font-size:12px;line-height:1.8}.js-actions{display:flex;flex-wrap:wrap;gap:7px;margin-top:14px}.js-actions button{border:1px solid var(--border);background:rgba(255,7,58,.08);color:#f0e7e8;padding:9px 11px;font-size:9px;letter-spacing:.08em}.js-audio{border-top:1px solid rgba(255,7,58,.2);padding-top:12px;margin-top:14px}.js-tracks{display:flex;flex-wrap:wrap;gap:6px}.js-tracks button{border:1px solid rgba(77,232,224,.2);background:transparent;color:#bbdbdc;padding:7px 9px;font-size:8px}.js-tracks button[aria-pressed=true]{border-color:var(--cyan);color:#fff;background:rgba(77,232,224,.1)}.js-audio audio{width:100%;margin-top:9px}.js-status{min-height:18px;color:#a99ca0;font-size:9px}.js-foot{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:12px;color:#817579;font-size:9px;letter-spacing:.1em}" +
    "#judasSessions button:focus-visible{outline:2px solid var(--cyan);outline-offset:3px}" +
    "#judasSessions[hidden]{display:none!important}" +
    "@media(max-width:680px){#judasSessions{padding:8px}.js-shell{max-height:calc(100vh - 16px);max-height:calc(100dvh - 16px);padding:13px}.js-grid{grid-template-columns:1fr}.js-nav{grid-template-columns:repeat(3,minmax(0,1fr));gap:4px}.js-nav button{min-height:44px;padding:7px 5px;font-size:8px;letter-spacing:0}.js-nav b{display:block;margin:0 0 4px}.js-detail{min-height:0}}" +
    "@media(prefers-reduced-motion:reduce){#judasSessions *{scroll-behavior:auto!important;transition:none!important;animation:none!important}}";
  document.head.appendChild(style);

  var overlay = document.createElement("section");
  overlay.id = "judasSessions";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-labelledby", "judasSessionsTitle");
  overlay.setAttribute("aria-describedby", "judasSessionsHelp");
  overlay.innerHTML = "<div class='js-shell'><header class='js-head'><div><span class='js-kicker'>JUDAS ATLAS // SESIONES 01—09</span><h2 id='judasSessionsTitle'>NUEVE PUERTAS · UN UNIVERSO</h2><p id='judasSessionsHelp' class='js-status'>Elige una estación; Escape cierra este mapa.</p></div><button class='js-close' type='button' aria-label='Cerrar sesiones'>×</button></header><div class='js-grid'><nav class='js-nav' aria-label='Sesiones de Judas'></nav><article class='js-detail' aria-live='polite'></article></div><footer class='js-foot'><span>PREESCUCHA A ELECCIÓN · SIN AUTOPLAY · SIN WAV MÁSTER</span><span>JUDAS EXPERIENCE · REV 0a493e9</span></footer></div>";
  document.body.appendChild(overlay);
  var nav = overlay.querySelector(".js-nav");
  var detail = overlay.querySelector(".js-detail");
  volumeSlider = document.getElementById("ap-vol");
  if (volumeSlider) {
    volumeSlider.addEventListener("input", function () {
      if (activeAudio) activeAudio.volume = Number(volumeSlider.value) / 100;
    });
  }
  nav.innerHTML = sessions.map(function (session, index) {
    return "<button type='button' data-session-id='" + session.id + "' aria-current='" + String(index === 0) + "'><b>" + String(index + 1).padStart(2, "0") + "</b>" + session.title.toUpperCase() + "</button>";
  }).join("");

  function stopAudio() {
    if (!activeAudio) return;
    activeAudio.pause();
    activeAudio.removeAttribute("src");
    activeAudio.load();
    activeAudio = null;
  }
  function close() {
    stopAudio();
    overlay.classList.remove("open");
    overlay.hidden = true;
    isOpen = false;
    document.body.style.overflow = previousOverflow;
    var restoreTarget = closeFocus && closeFocus.isConnected ? closeFocus : previousFocus;
    if (restoreTarget && restoreTarget.isConnected) restoreTarget.focus();
    closeFocus = null;
    previousFocus = null;
  }
  function render(id) {
    var session = sessions.find(function (item) { return item.id === id; }) || sessions[0];
    stopAudio();
    nav.querySelectorAll("[data-session-id]").forEach(function (button) {
      button.setAttribute("aria-current", String(button.dataset.sessionId === session.id));
    });
    detail.innerHTML = "<span class='js-tag'>" + session.tag + "</span><h3>" + session.title + "</h3><p>" + session.copy + "</p><div class='js-actions'>" +
      session.actions.map(function (action) { return "<button type='button' data-command='" + action[0] + "'>" + action[1] + "</button>"; }).join("") +
      "</div>" + (session.id === "music" ? "<div class='js-audio'><div class='js-tracks'>" +
        audioTracks.map(function (track, index) { return "<button type='button' data-audio-index='" + index + "' aria-pressed='false'>" + String(index + 1).padStart(2, "0") + " · " + track[0] + "</button>"; }).join("") +
        "</div><audio controls preload='none' aria-label='Preescucha de stems Judas'></audio><div class='js-status' role='status' aria-live='polite'>Muestras comprimidas de 20 s. Pulsa una para cargarla; nada reproduce por sí solo.</div></div>" : "");
    detail.querySelectorAll("[data-command]").forEach(function (button) {
      button.addEventListener("click", function () {
        var command = button.dataset.command;
        close();
        if (typeof window.runOmegaCommand === "function") window.runOmegaCommand(command);
      });
    });
    if (session.id !== "music") return;
    var audio = detail.querySelector("audio");
    var status = detail.querySelector(".js-status");
    audio.volume = Math.max(0, Math.min(1, Number(volumeSlider ? volumeSlider.value : 30) / 100));
    audio.addEventListener("error", function () {
      detail.querySelectorAll("[data-audio-index]").forEach(function (item) { item.setAttribute("aria-pressed", "false"); });
      status.textContent = "Muestra no disponible. Prueba otra; el archivo máster no se sirve aquí.";
    });
    audio.addEventListener("playing", function () { status.textContent = "REPRODUCIENDO · usa el control nativo para pausar o buscar."; });
    audio.addEventListener("pause", function () {
      if (audio.dataset.track !== undefined) {
        var selected = detail.querySelector('[data-audio-index="' + audio.dataset.track + '"]');
        if (selected && selected.getAttribute("aria-pressed") === "true") selected.setAttribute("aria-pressed", "false");
        if (isOpen && audio.currentTime > 0 && status.textContent.indexOf("Cargando") !== 0) status.textContent = "Preescucha pausada.";
      }
    });
    detail.querySelectorAll("[data-audio-index]").forEach(function (button) {
      button.addEventListener("click", async function () {
        var index = Number(button.dataset.audioIndex);
        var track = audioTracks[index];
        if (!track) return;
        if (volumeSlider) audio.volume = Number(volumeSlider.value) / 100;
        if (audio.dataset.track === String(index) && !audio.paused) {
          audio.pause(); button.setAttribute("aria-pressed", "false"); status.textContent = "Preescucha pausada."; return;
        }
        stopAudio();
        activeAudio = audio;
        detail.querySelectorAll("[data-audio-index]").forEach(function (item) { item.setAttribute("aria-pressed", String(item === button)); });
        audio.dataset.track = String(index);
        audio.src = audioRoot + encodeURIComponent(track[1]);
        status.textContent = "Cargando preescucha…";
        try { await audio.play(); }
        catch (error) {
          button.setAttribute("aria-pressed", "false");
          status.textContent = "Reproducción bloqueada o sin conexión. Usa Play en el reproductor o selecciona otra muestra.";
        }
      });
    });
  }

  nav.addEventListener("click", function (event) {
    var button = event.target.closest("[data-session-id]");
    if (button) render(button.dataset.sessionId);
  });
  overlay.querySelector(".js-close").addEventListener("click", close);
  overlay.addEventListener("click", function (event) { if (event.target === overlay) close(); });
  document.addEventListener("keydown", function (event) {
    if (!overlay.classList.contains("open")) return;
    if (event.key === "Escape") { event.preventDefault(); close(); return; }
    if (event.key !== "Tab") return;
    var focusable = Array.from(overlay.querySelectorAll("button:not(:disabled), audio[controls], [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled)"));
    if (!focusable.length) { event.preventDefault(); return; }
    var first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || !overlay.contains(document.activeElement))) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !overlay.contains(document.activeElement))) {
      event.preventDefault(); first.focus();
    }
  });
  document.addEventListener("omega:open-sessions", function (event) {
    if (isOpen) return;
    isOpen = true;
    previousFocus = document.activeElement;
    closeFocus = event.detail && event.detail.trigger && event.detail.trigger.isConnected ? event.detail.trigger : previousFocus;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    overlay.hidden = false;
    overlay.classList.add("open");
    render(event.detail && event.detail.session);
    overlay.querySelector(".js-close").focus();
  });
})();
