# MÁXIMAS — BELENTANI // OMEGA CORE · JUDAS_OS v12.0

> Destiladas de las mejores skills del entorno: `karpathy-coder`, `resource-guardian`,
> `lean-build`, `surgical-patch`, `anti-slop`, `frontend-design`, `design-taste`,
> `advanced-frontend-skill`, `backend-expert`, `artifacts-builder`.
> Reglas accionables, no eslóganes.

---

## CÓDIGO

1. **Piensa antes de codificar.** Supuestos explícitos; si hay dos lecturas, preséntalas, no elijas en silencio.
2. **Simplicidad primero.** El mínimo código que resuelve. Si escribes 200 líneas y caben en 50, reescríbelo.
3. **Cambio quirúrgico.** Cada línea modificada debe rastrear a la petición. No "mejores" el vecindario.
4. **Meta antes que instrucción.** Define criterio de éxito verificable e itera hasta que pase.
5. **Arregla en la capa más estrecha** que posee el fallo. Reproduce primero; prueba de regresión después.
6. **Para antes del tercer intento.** Dos fallos iguales = detente, diagnostica, pregunta.
7. **Reutiliza antes de generar.** Un seam que ya encaja vale más que una abstracción nueva.
8. **Nombra lo específico.** `data`, `temp`, `result` son slop; el nombre dice qué es.
9. **Sin comentarios obvios** ni abstracciones de un solo uso. Documenta el *porqué*, no el *qué*.
10. **Compacta el contexto** a ~25K. El olvido de instrucciones es una pérdida total, no un coste.

## FRONT

1. **Lee el brief antes de tocar código.** Declara el *Design Read*: tipo de página, audiencia, vibra.
2. **Nunca entregues la primera versión.** Construir → criticar con ojos frescos → refinar.
3. **Un solo acento.** Todo lo demás lo apoya. Gasta tu audacia en un solo lugar y quita un accesorio.
4. **La tipografía lleva la personalidad.** Máx 2-3 familias, contraste de escala ≥1.25, sin Inter por reflejo.
5. **Movimiento con propósito.** <300ms, `ease-out`, solo `transform`/`opacity`, respeta `prefers-reduced-motion`.
6. **Diseña los 8 estados.** default, hover, focus, active, disabled, loading, error, success. Focus nunca sin `:focus-visible`.
7. **Contraste ≥4.5:1** en cuerpo. Casi-negro (no `#000` puro), glass con blur *y* borde.
8. **Pasa el test anti-slop.** Si alguien adivina tema y paleta por la categoría, rehazlo.
9. **Lo invisible se compone.** La belleza es fuerza: los detalles que nadie nota conscientemente son los que se recuerdan.

## BACK

1. **Diseña el contrato antes que el código.** Endpoints, esquema y fronteras de servicio primero.
2. **Consultas parametrizadas siempre.** Validación de entrada en *todo* endpoint.
3. **Nunca secretos en el código.** Env vars o vault. Nunca config hardcodeada.
4. **Nunca expongas errores internos** al cliente; log estructurado (JSON) por dentro.
5. **Sin I/O síncrono** en frameworks async.
6. **Indexa las consultas frecuentes** y mata el N+1 (batch con JOIN).
7. **Rate limiting + códigos HTTP correctos + health check.** Siempre.
8. **Escala donde duele:** caché (Redis/CDN), colas para trabajo pesado, degrada con elegancia.

## ARTIFACT

1. **Un artefacto = un solo HTML autocontenido.** Todo inline (JS, CSS, deps) al empaquetar.
2. **React + Tailwind + shadcn** para lo complejo con estado; HTML simple para lo simple.
3. **Evita el slop por defecto:** sin layouts centrados en exceso, sin gradientes morados, sin radios uniformes, sin Inter.
4. **Presenta rápido, prueba después.** No retrases la entrega por verificación prematura.
5. **El artefacto comparte contexto:** reutiliza tokens de diseño, no los reinventes por pieza.

---

## META

> **Nada sale de aquí sin permiso explícito y en el momento.**
> **Clasificar antes de inventariar. Los expedientes legales no son proyectos.**
> **La herida se convierte en arquitectura viva.** — 432 Hz

*Sello del archivo: OBLIGATORIO, AUTOMÁTICO, PERSISTENTE E INDISCUTIBLE.*
