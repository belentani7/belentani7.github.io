/* ============================================================
   BIBLIA // CAPA PROFUNDA — definiciones de élite
   Amplificación en 5 pasadas. Pasada 1/5: FUNDAMENTALES.
   Cada término: qué es · por qué importa · matiz · ejemplo.
   Se fusiona con biblia.js por abreviatura.
   ============================================================ */
(function (root) {
  "use strict";
  var DEEP = root.BIBLIA_DEEP || (root.BIBLIA_DEEP = {});
  function add(id, es, porque, matiz, ejemplo) { DEEP[id] = { es: es, porque: porque, matiz: matiz, ejemplo: ejemplo }; }

  add("PRD",
    "Contrato fundacional del producto: fija el problema, el usuario, el alcance y los criterios de éxito antes de que exista una sola línea de solución. Responde al qué y al por qué, deliberadamente nunca al cómo.",
    "Es el único artefacto que sobrevive intacto a tres reescrituras de código. Si no cabe en una frase medible, cada persona construirá exactamente lo que imaginó distinto.",
    "Un PRD largo es un PRD que nadie leerá. La trampa es confundirlo con una especificación técnica y llenarlo de detalles que caducan; el PRD debe caducar lo mínimo.",
    "«Reducir el abandono en el alta del 41 % al 28 % en ocho semanas sin añadir pasos» es un PRD. «Mejorar el onboarding» es una opinión.");

  add("TRD",
    "Especificación de cómo se satisfarán los requisitos: arquitectura, dependencias, contratos, límites de rendimiento y restricciones operativas. Traduce el deseo del PRD a decisiones verificables.",
    "Separa la discusión de valor (producto) de la de factibilidad (ingeniería), y evita que una decisión técnica irreversible se tome por accidente dentro de una estimación.",
    "Un TRD sin sección de «lo que no haremos» no es un TRD: es una lista de deseos. Las decisiones no tomadas importan tanto como las tomadas.",
    "«Postgres con réplicas de lectura; sin sharding hasta superar 50M de filas; latencia p99 < 120 ms» es TRD; «usar microservicios» sin umbral es moda.");

  add("SDD",
    "Documento de diseño que describe la estructura interna: módulos, fronteras, interfaces, flujos de datos y los invariantes que cada componente garantiza. Es el plano antes del edificio.",
    "Permite revisar el diseño sin construir. Corregir una frontera mal trazada en un diagrama cuesta minutos; corregirla en producción cuesta migraciones.",
    "Describe responsabilidades y contratos, no algoritmos línea a línea. El detalle de implementación se pudre; las fronteras deben durar.",
    "Definir que «facturación jamás conoce envío; se comunican por eventos» evita un acoplamiento que se paga durante años.");

  add("ADR",
    "Registro corto e inmutable de una decisión arquitectónica: contexto, opciones consideradas, decisión y consecuencias. Una decisión por documento, numerada y fechada.",
    "Captura el porqué, que es lo único que el código no puede contar. Sin ADR, cada nuevo miembro reabre debates ya resueltos y repite errores ya pagados.",
    "No se reescribe un ADR aprobado: se marca como superado por otro. El valor está en la trazabilidad temporal, no en tener razón para siempre.",
    "ADR-007: «Adoptamos Postgres en lugar de MongoDB porque necesitamos transacciones multi-tabla; aceptamos esquema rígido como coste.»");

  add("BDD",
    "Práctica que describe el comportamiento del sistema en lenguaje natural estructurado (Dado-Cuando-Entonces), de modo que negocio y código compartan literalmente los mismos criterios.",
    "Elimina la ambigüedad donde nace la mayoría de los bugs: la interpretación distinta de una misma historia por producto y desarrollo.",
    "BDD sin colaboración real es TDD disfrazado de poesía. El valor no es la sintaxis Gherkin, sino la conversación que produce antes de escribirla.",
    "«Dado un usuario sin saldo, cuando intenta comprar, entonces ve el aviso de fondos insuficientes y la compra no se registra.»");

  add("TDD",
    "Ciclo rojo-verde-refactor: escribir una prueba que falle, el mínimo código que la pase, y limpiar el diseño sin romperla. La prueba precede al código.",
    "Convierte cada requisito en algo ejecutable y cada regresión en algo detectado en segundos, no en producción. Diseña por presión: el test empuja interfaces limpias.",
    "El objetivo no es cobertura alta, es diseño dirigido por pruebas. Test tras codificar valida lo que hiciste; TDD diseña lo que deberías hacer.",
    "Antes de implementar el descuento se escribe un test que exige 10 % sobre pedidos mayores a 50; luego el código nace ya correcto.");

  add("CI/CD",
    "Automatización que integra cada cambio en la rama principal de forma continua (CI) y lo entrega a producción de forma reproducible y reversible (CD).",
    "Reduce el tamaño del cambio y con él el riesgo: integrar diez veces al día es más seguro que una vez al mes. La entrega deja de ser un evento y pasa a ser un hábito.",
    "CI sin tests que fallen por buenas razones es teatro verde. Y CD no es desplegar sin red: es poder revertir en un clic.",
    "Cada push dispara lint, typecheck y tests; si todo pasa, va a staging y, tras aprobación, a producción con rollback automático.");

  add("MVP",
    "La versión más pequeña que entrega el núcleo de valor y permite aprender del uso real. No es un producto a medias: es la apuesta mínima a la hipótesis más arriesgada.",
    "Convierte supuestos en datos al menor coste. La mayoría de las funciones imaginadas no se usan; el MVP descubre cuáles importan antes de financiarlas.",
    "El mayor error es un MVP sin la parte difícil: si se elimina justo la hipótesis a validar, no aprende nada. «Viable» es la palabra que se olvida.",
    "Antes de construir reservas con pago, un formulario que recoge correos y mide interés valida demanda sin escribir el motor de pagos.");

  add("SLA",
    "Compromiso contractual medible sobre el servicio: disponibilidad, latencia o tiempo de respuesta, con consecuencias definidas si no se cumple.",
    "Convierte «alta disponibilidad» de eslogan en número auditable, y alinea ingeniería y negocio sobre cuánto fallo es tolerable y cuánto cuesta evitarlo.",
    "Prometer 99,99 % sin la arquitectura que lo sostiene es deuda oculta. El SLA es una promesa presupuestada, no un deseo de marketing.",
    "«99,9 % de disponibilidad mensual; por debajo, créditos del 10 % de la factura» define el coste real de una caída.");

  add("API",
    "Interfaz de programación: el contrato estable por el que un sistema ofrece capacidades a otro sin exponer su interior. Define entradas, salidas, errores y garantías.",
    "Es la frontera que permite cambiar la implementación sin romper a quien la usa. Un buen contrato sobrevive a reescrituras; uno mal diseñado acopla para siempre.",
    "Una API es una promesa pública: añadir es fácil, cambiar es caro. La compatibilidad hacia atrás no es cortesía, es supervivencia.",
    "Stripe expone los cobros como recursos estables; por dentro ha reescrito su infraestructura varias veces sin que nadie lo note.");

  add("App Flow",
    "El recorrido de estados y pantallas que sigue una persona para completar un objetivo, con sus decisiones, ramas y puntos de retorno.",
    "La mayoría de la fricción no está en cada pantalla sino en las transiciones entre ellas. Diseñar el flujo es diseñar dónde la gente se pierde o abandona.",
    "Un flujo lineal asume comportamiento lineal; los usuarios tejen atajos, retrocesos y salidas. Debe sobrevivir al usuario real, no al ideal.",
    "Alta: correo, código, perfil. Si el usuario cierra en el código, al volver reanuda exactamente ahí, no desde el principio.");

  add("UI",
    "La capa visible e interactiva: lo que la persona ve, toca y entiende. Es la materialización de decisiones de producto en píxeles y estados.",
    "Es donde el valor abstracto se vuelve tangible o se pierde. La misma lógica con peor UI se percibe como peor producto, aunque haga exactamente lo mismo.",
    "UI no es decoración. Un control bello que no comunica su estado es peor que uno feo que sí lo hace; claridad antes que ornamento.",
    "Un botón de guardado que cambia a confirmación al pulsar comunica más que un tooltip explicando qué pasará.");

  add("UX",
    "La calidad global de la experiencia: cómo se siente completar la tarea, cuánto esfuerzo cuesta y qué recuerda la persona después.",
    "Determina adopción y retención más que cualquier función. La gente no recuerda la arquitectura; recuerda si logró lo que vino a hacer.",
    "UX no es solo facilidad: también es ritmo, confianza y salidas. Reducir fricción donde sobra y añadirla donde previene errores costosos.",
    "Confirmar una acción destructiva con un paso extra es buena UX, aunque sea más fricción: evita pérdidas irreversibles.");

  add("Design",
    "La disciplina de tomar decisiones intencionadas sobre forma, jerarquía y comportamiento para que algo resulte a la vez útil y comprensible.",
    "Sin diseño deliberado, el resultado por defecto es el genérico. El diseño es la diferencia entre lo que funciona y lo que se quiere usar.",
    "Diseño no es estética: es decisión. La estética es la consecuencia de decisiones coherentes, no el punto de partida.",
    "Una sola tipografía con tres pesos produce más coherencia que combinar cinco fuentes «bonitas».");

  add("Schema",
    "La estructura formal de los datos: campos, tipos, relaciones y restricciones que definen qué es válido dentro de un sistema.",
    "Es la ley física de la aplicación. Cambiarla es la operación más costosa que existe; por eso conviene acertar en la forma, aunque los nombres evolucionen.",
    "Un esquema permisivo hoy es un infierno de validación mañana. Las restricciones son documentación que la base de datos hace cumplir.",
    "Definir «email» como único y no nulo convierte un bug de duplicados en un error imposible, no en un incidente.");

  add("Backend",
    "La capa que ejecuta la lógica, custodia los datos y aplica las reglas: lo que el usuario nunca ve pero de lo que todo depende.",
    "Concentra la autoridad, la seguridad y la verdad de los datos. Un frontend puede mentir; el backend decide qué es real.",
    "El backend no es «donde va la lógica» por defecto: cierta lógica pertenece al cliente por latencia. La frontera se elige por seguridad y coste, no por costumbre.",
    "El precio se calcula y valida en el backend; si se confía en el número que envía el cliente, se regalan descuentos.");

  add("Frontend",
    "La capa que presenta e interpreta la interacción en el dispositivo del usuario: render, estado de vista y respuesta inmediata.",
    "Es la única parte que la persona toca. Su rendimiento y claridad determinan la percepción completa del sistema, sin importar la potencia detrás.",
    "El frontend no es tonto por estar delante: valida por conveniencia, nunca por seguridad. La validación que protege vive en el servidor.",
    "Mostrar el formulario de forma optimista mejora la sensación de velocidad, pero el servidor debe confirmar cada dato antes de persistirlo.");

  add("Full-Stack",
    "Quien opera con soltura en ambas mitades: modelo de datos, lógica y API tanto como interfaz, estado y accesibilidad. La ventaja es la frontera, no acumular herramientas.",
    "Reduce la fricción en el punto más delicado, el contrato cliente-servidor, y permite decisiones coherentes de extremo a extremo sin saltos de traducción.",
    "Full-stack no es hacerlo todo uno mismo, sino entender las consecuencias de cada lado sobre el otro. Profundidad real en una capa rinde más que superficie en diez.",
    "Detectar que un filtro del frontend provoca N+1 en el backend exige ver los dos lados a la vez; ahí vale el perfil full-stack.");

  add("Tech Stack",
    "El conjunto coherente de lenguajes, frameworks, bases de datos e infraestructura elegidos para un proyecto, y las razones por las que encajan entre sí.",
    "Cada pieza paga un coste en mantenimiento, contratación y curva de aprendizaje. La coherencia del conjunto importa más que la brillantez de cada pieza.",
    "La tentación es añadir tecnología por novedad. Un stack que nadie domina es más caro que uno aburrido que todos entienden.",
    "Un stack de TypeScript de extremo a extremo comparte tipos y reduce errores de contrato; migrar a tres lenguajes por moda los multiplica.");

  add("Tech Debt",
    "El coste futuro acumulado de decisiones técnicas que aceleraron el presente. No es suciedad: es un préstamo, deliberado o accidental, contra el mantenimiento.",
    "Todo proyecto sano tiene algo. El problema no es deber, sino deber sin saber cuánto ni a qué interés; el interés se paga en cada cambio que se vuelve más lento.",
    "No toda deuda es mala: el prototipo que se tira al día siguiente no merece arquitectura. La deuda se juzga por su interés y su plazo, no por su existencia.",
    "Hardcodear una tarifa «de momento» es deuda barata si se paga la semana siguiente; si sobrevive años, el interés devora la velocidad.");

  add("Boilerplate",
    "El código estructural obligatorio y repetitivo que no aporta lógica propia: configuración, andamiaje, definiciones recurrentes.",
    "Reconocerlo permite generarlo o eliminarlo en lugar de escribirlo a mano, liberando atención para la parte que sí decide el producto.",
    "Generar boilerplate reduce errores pero también comprensión; quien no entiende la plantilla no sabe cuándo dejar de seguirla.",
    "Las treinta líneas de imports y tipos de una API son boilerplate candidatas a generarse desde el esquema.");

  add("Scaffold",
    "La estructura inicial de un proyecto generada automáticamente: carpetas, configuración y archivos base sobre los que empezar a construir.",
    "Arrancar cuesta menos y con menos errores de configuración, además de estandarizar la forma de trabajar entre equipos y herramientas.",
    "Un scaffold trae decisiones ajenas y, a menudo, dependencias de más. Conviene podarlo al inicio en lugar de arrastrar peso muerto para siempre.",
    "«npm create vite» genera un proyecto listo; borrar lo que no se usará al empezar evita años de dependencias fantasma.");

  add("Linter",
    "Herramienta que analiza el código estáticamente para detectar errores, olvidos y desviaciones de estilo antes de ejecutarlo.",
    "Convierte convenciones discutibles en reglas automáticas y traslada la revisión de estilo a la máquina, para que las revisiones humanas discutan diseño, no comas.",
    "Un linter con demasiadas reglas se vuelve ruido y se ignora. Su valor está en pocas reglas que atrapan errores reales, aplicadas sin excepciones.",
    "La regla que prohíbe variables no usadas detecta imports y lógica muerta que de otro modo sobrevive años.");

  add("Formatter",
    "Herramienta que reescribe el código según un formato único e innegociable, eliminando toda discusión sobre espacios, saltos y comillas.",
    "El estilo deja de ser un tema de gusto y pasa a ser automático, lo que reduce el ruido en los diffs y la fricción entre personas.",
    "Formatear sin acordar el momento produce diffs gigantes ajenos al cambio. El formato se aplica al guardar o al commit, no a mitad de una revisión.",
    "Prettier reformatea al guardar; el diff de un pull request solo muestra lógica, nunca sangrías.");

  add("Bundler",
    "Herramienta que toma muchos módulos y recursos y los combina en pocos archivos óptimos para el navegador, resolviendo dependencias y rutas.",
    "Reduce el número de peticiones, permite tree shaking y code splitting, y transforma código moderno en algo que los navegadores ejecutan hoy.",
    "El bundler es invisible hasta que algo se rompe: duplicaciones, módulos no resueltos o bundles enormes. Su configuración es diseño de entrega, no detalle.",
    "Un bundle que pasa de 200 KB a 2 MB tras añadir una librería revela que se importó entera en vez de por partes.");

  add("Transpiler",
    "Herramienta que traduce código de un lenguaje o versión a otro manteniendo su comportamiento: TypeScript a JavaScript, JavaScript nuevo a JavaScript antiguo.",
    "Permite usar el lenguaje moderno que uno quiere sin renunciar a los entornos que debe soportar, separando lo que se escribe de lo que se ejecuta.",
    "Transpilar no arregla un diseño; solo cambia la superficie. Un tipo que brilla en desarrollo no protege en ejecución si el dato llega por la red.",
    "El compilador de TypeScript elimina los tipos al transpilar: la validación de datos externos sigue siendo imprescindible en ejecución.");

  add("Runtime",
    "El entorno que ejecuta el programa y le ofrece recursos: memoria, entrada y salida, temporizadores y las reglas de su lenguaje en marcha.",
    "Comprender su modelo (un solo hilo, bucle de eventos, hilos) explica por qué el código se comporta como se comporta y dónde se bloquea.",
    "Muchos bugs de rendimiento no son de lógica sino de runtime: un bucle que bloquea el hilo, una promesa que nunca se resuelve. Se depuran en el entorno, no en el editor.",
    "JavaScript corre en un solo hilo: una operación pesada síncrona congela toda la interfaz hasta que termina.");

  add("Framework",
    "Un esqueleto con convenciones y puntos de extensión que invierte el control: el framework llama a tu código, no tu código al framework.",
    "Aporta estructura, herramientas y decisiones ya resueltas, lo que acelera el trabajo común y estandariza cómo lo hace un equipo.",
    "El framework decide por ti y esas decisiones caducan. Adoptar uno es apostar a su comunidad y a su ritmo de cambio, no solo a su API de hoy.",
    "En un framework defines rutas y componentes; el propio framework orquesta ciclo de vida, render y enrutado.");

  add("Library",
    "Un conjunto de funciones o módulos que tu código invoca cuando quiere. Tú mantienes el control del flujo; la librería ofrece capacidades.",
    "Permite reutilizar trabajo probado sin ceder el control del programa, y sustituirla si aparece una mejor sin reescribir la aplicación.",
    "Cada dependencia es código ajeno que hereda sus bugs y sus actualizaciones. La pregunta no es «¿me ahorra tiempo?» sino «¿me ahorra más de lo que costará mantenerla?».",
    "Una librería de fechas evita reinventar husos horarios y calendarios; una dependencia para sumar dos números añade riesgo sin valor.");

  add("Dependency",
    "Cualquier pieza externa de la que tu proyecto depende para funcionar: paquetes, servicios o binarios, con sus versiones y sus propias dependencias.",
    "El árbol de dependencias es superficie de ataque y de fallo: lo que no controlas puede romperte, y una actualización puede traer una regresión ajena.",
    "Cada dependencia añadida es permanente hasta que alguien la quite. El coste real incluye auditoría de seguridad, licencias y compatibilidad.",
    "Bloquear las versiones con un lockfile garantiza reproducibilidad, pero exige actualizaciones deliberadas para no quedarse vulnerable.");

  add("SemVer",
    "Convención de versionado MAYOR.MENOR.PARCHE donde mayor indica cambios incompatibles, menor añade funciones compatibles y parche corrige sin romper.",
    "Permite a los consumidores actualizar con confianza: el número comunica el riesgo de la actualización antes de leer el código.",
    "SemVer es una promesa que se rompe por accidente: publicar un cambio incompatible como parche traiciona a quien confió en el número.",
    "De 2.4.1 a 2.5.0 se puede actualizar sin miedo; de 2.x a 3.0.0 hay que leer la guía de migración, porque algo cambió de forma.");

  /* ---------- pasada 2 (aider): cadena de documentos ---------- */
add("SRS",
    "Software Requirements Specification: especificación formal de requisitos con IDs trazables (FR-XXX funcionales; NFR-XXX con umbrales numéricos) y palabras normativas SHALL/SHOULD/MAY. Es el puente entre el PRD y el diseño.",
    "Es la fuente de verdad verificable: sin IDs trazables no se puede demostrar que un requisito está probado, ni que un test prueba algo necesario.",
    "El error es escribir requisitos sin números ni casos negativos; «rápido» no es un NFR, «p95 < 200 ms» sí. Todo happy path exige su caso negativo emparejado.",
    "FR-001: «El sistema SHALL enviar un correo de confirmación tras el alta.» NFR-002: «El alta completa en p95 < 200 ms.»"
  );
    add("Plan",
    "Plan de implementación (work plan): convierte los requisitos aprobados en orden de ejecución. Fases dependientes con un milestone cada una, tareas atómicas (una sesión, hasta 5 archivos), riesgos con mitigación y una fase final obligatoria de QA.",
    "Ordena el trabajo por dependencia, no por capricho, y hace visible qué desbloquea qué. Sin plan, el código se escribe en el orden en que se piensa, no en el que conviene.",
    "El plan no es una predicción inmutable: es un instrumento de negociación. Cambiar el orden sin actualizarlo rompe la trazabilidad requisito-test.",
    "Fase 1 contratos e interfaces, Fase 2 lógica con unit tests, Fase 3 integración, Fase 4 QA con el 100 % de los criterios verificados."
  );
    add("Rules",
    "Reglas del proyecto para el agente: el archivo AGENTS.md (o .cursor/rules) que fija stack con versiones, convenciones de nombres, estructura de carpetas, formato de commits y la referencia a la cadena de documentos. Se aplica en cada interacción.",
    "Fija el contexto que el modelo necesita para no reinventar decisiones ya tomadas ni introducir stacks obsoletos. Sin Rules, cada sesión arranca desde cero.",
    "El error es escribir reglas vagas o contradictorias; deben ser concretas y versionadas («Auth.js v5», «TS strict») y actualizarse cuando cambia una decisión.",
    "AGENTS.md: «Next.js 16 App Router, TypeScript strict, commits convencionales, leer @docs/prd.md al inicio de cada tarea.»"
  );
  add("GWT",
    "Given-When-Then es un formato de especificación de comportamiento (Behavior-Driven Development) que describe el contexto, la acción y el resultado esperado.",
    "Facilita la comunicación entre técnicos y no técnicos, y sirve como base para la generación de pruebas automatizadas legibles.",
    "La trampa es escribir escenarios demasiado granulares o ambiguos; cada GWT debe representar un caso de uso atómico y verificable.",
    "Escribir un escenario GWT para verificar que un usuario no autenticado redirige a la página de login al intentar acceder a su perfil."
  );
  add("EARS",
    "Easy Approach to Requirements Syntax es un método para escribir requisitos no funcionales y funcionales de forma inequívoca y estructurada.",
    "Reduce la ambigüedad en las especificaciones, minimizando malentendidos durante el desarrollo y las pruebas de aceptación.",
    "El error común es mezclar múltiples condiciones en una sola regla EARS; cada requisito debe seguir estrictamente una de las cinco patrones (ubiquitous, event-driven, state-driven, optional, unwanted behavior).",
    "Redactar un requisito EARS: 'When el usuario hace clic en enviar, el sistema validará el formato del email'."
  );
  add("MoSCoW",
    "Técnica de priorización que clasifica requisitos en Must have, Should have, Could have y Won't have (this time).",
    "Permite gestionar el alcance del proyecto bajo restricciones de tiempo y presupuesto, asegurando que se entregue el valor máximo posible.",
    "La trampa es clasificar todo como 'Must have' por presión de stakeholders; esto anula la capacidad de priorización y pone en riesgo la entrega.",
    "En la planificación del Sprint 1, decidir que la integración con la pasarela de pago es un 'Must have', mientras que el modo oscuro es un 'Could have'."
  );
  add("FR",
    "Functional Requirement (Requisito Funcional) describe una función específica que el sistema debe realizar, como procesar datos o responder a entradas.",
    "Definen el comportamiento observable del software; son la base para el diseño de la arquitectura y la implementación de la lógica de negocio.",
    "El error común es confundir FR con NFR; un FR dice qué hace el sistema, no cómo de bien lo hace (velocidad, seguridad, etc.).",
    "Un FR específico: 'El sistema debe calcular el total del carrito sumando el precio de cada artículo y aplicando el impuesto correspondiente'."
  );
  add("NFR",
    "Non-Functional Requirement (Requisito No Funcional) especifica criterios de calidad como rendimiento, seguridad, usabilidad o disponibilidad.",
    "Determinan la escalabilidad y robustez del sistema; ignorarlos lleva a soluciones que funcionan en el papel pero fallan en producción bajo carga.",
    "La trampa es definir NFRs vagos (ej. 'debe ser rápido'); deben ser medibles y cuantificables (ej. 'tiempo de respuesta < 200ms al 95 percentil').",
    "Especificar un NFR de seguridad: 'El sistema debe cifrar todas las contraseñas en reposo utilizando el algoritmo bcrypt con un factor de coste de 12'."
  );


  if (typeof module !== "undefined" && module.exports) module.exports = DEEP;
})(typeof window !== "undefined" ? window : globalThis);
