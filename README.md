# BELENTANI // OMEGA CORE — JUDAS_OS v12.0

> Esto no es una web. Es un organismo. Un terminal místico-cyberpunk donde cada módulo
> es un nodo vivo con memoria, misión y secretos.

Portal unificado del ecosistema **Belentani**: arte, música, misión social, oráculos y
herramientas, envueltos en una narrativa de sistema operativo vivo (**JUDAS_OS v12.0**)
afinado a **432 Hz**.

## ✦ Arquitectura

- `index.html` es el punto de entrada estático de GitHub Pages; no hay build requerido para publicar.
- `belentani-universe.js` dibuja el atlas de fondo en Canvas 2D y respeta pausa, visibilidad y movimiento reducido.
- `judas-sessions.js` aporta el mapa de nueve sesiones y las preescuchas optativas; no reproduce audio ni solicita cámara al cargar.
- `biblia.js` y `biblia.deep.js` contienen el glosario local. `biblia/index.html` permite buscar por sigla, nombre, categoría y definiciones ampliadas, sin distinguir mayúsculas ni acentos; conserva siglas ambiguas por contexto. Las pruebas de datos e interfaz se ejecutan con `node --test tests/biblia.test.js tests/biblia-page.test.js`.
- Three.js, GSAP y Tone.js se cargan desde CDN para los módulos 3D, animaciones y forja de beats; hay degradación cuando un CDN no está disponible.
- El espejo arranca en demo; la cámara se activa solo con clic y permiso del navegador.
- `build/` contiene material auxiliar antiguo, ignorado por Git. No ejecutes `build/assemble.ps1`: no es necesario para Pages y puede sobrescribir `index.html`.

## ✦ Módulos (comandos de terminal)

| Comando | Nodo | Tipo |
|---|---|---|
| `JUDAS` | Portal 3D publicado, ficha, demo generativa y preescuchas sin autoplay | Experiencia |
| `JUDAS UNIFICADO` | Cosmos 3D unificado publicado | Experiencia |
| `JUDAS EXPANDED` | Alias del destino unificado, identificado como tal | Experiencia |
| `JUDAS SCIFI` | Variante experimental; la ficha advierte que no se verificó una escena funcional | Experimento |
| `JUDAS ACCESS` | Ficha del destino de acceso; no se afirman funciones de permiso no verificadas | Experiencia |
| `JUDAS OMEGA` | Bóveda pública de versiones | Archivo |
| `JUDAS AUDIO` | Ocho muestras públicas cortas; los WAV máster no se incluyen | Música |
| `JUDAS SESSIONS` | Mapa navegable de nueve recorridos | Atlas |
| `OMEGA` | Archivo visual simbólico RECORD_01 → RECORD_12 | Arte |
| `MANOS` | ManosAbiertas — educación gratuita | Misión |
| `CRUZAR` | Cruzando-el-charco — comunidad LGBT+ migrantes | Comunidad |
| `TENDER` | tender-words-connect — mapa TLP/vínculos | Psicología |
| `IVY` | ivy-la-vie — arte visual queer | Visual |
| `CARQUIDEC` | Arquitectura paramétrica | Arquitectura |
| `CV` | Belentani.cv-ai — Document Studio | Herramienta |
| `DUCK` | Duck ecosystem — estudio creativo | Estudio |
| `SCAN` | Escaneo de arquetipo (5 gemas: PEDRO·LA ROCA, MARCOS·EL CRONISTA, SANTOS·LA ANTENA, BELENTANI·EL ARTEFACTO, THE HUMAN·LA INTERFAZ) | Oráculo |
| `TAROT` | Lectura de 3 cartas (origen, herida, camino) | Oráculo |
| `DREAM` | Lectura creativa de símbolos; no es diagnóstico | Oráculo |
| `FORGE` | Forja de beats (Tone.js, 16 pasos, bajo a 108 Hz) | Herramienta |
| `DETECT` | Indicador heurístico DARVO para reflexión; no determina hechos | Herramienta |
| `WRITE` | Generador de letra dark pop | Herramienta |
| `ZION` | Dimensión dorada interactiva (código oculto) | Secreto |

## ✦ Elementos vivos

- Campo de universo Canvas 2D con perfiles galácticos y movimiento reducido
- Registro narrativo y pulso visual (no representa telemetría real del equipo)
- Ubicación desactivada por defecto y disponible solo tras pulsar `ACTIVAR`
- Síntesis local 432 Hz opcional (`FREQ`)
- El sistema recuerda: nombre (`WHOAMI` / `NAME …`), visitas, gemas, secretos (localStorage)
- **Secreto:** código Konami `↑↑↓↓←→←→BA` desbloquea ZION DIMENSION (modo dorado)

## ✦ Desarrollo

Abre `index.html` con un servidor estático local o publícalo directamente en GitHub Pages. El selector de ubicación y la cámara solo preguntan después de una acción explícita; ambos tienen alternativa y no son necesarios para recorrer el sitio.

---

*LA HERIDA SE CONVIERTE EN ARQUITECTURA VIVA — sin traición no hay redención — 432 Hz*
