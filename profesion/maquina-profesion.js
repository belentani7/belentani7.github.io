/*!
 * BELENTANI — Máquina Profesión
 * Solo hechos verificables locales. No inventa clientes, métricas ni títulos.
 */
(function (root) {
  "use strict";

  const IDENTITY = {
    name: "Belentani",
    legalHint: "Pedro Belentani (nombre artístico Belentani)",
    born: "São Paulo",
    based: "Barcelona",
    company: "Noiacore",
    github: "https://github.com/belentani7",
    hubs: {
      artistico: "https://belentani.es/",
      profesional: "https://belentani.eu/",
      laboratorio: "https://noiacore.com/",
      instagram: "https://www.instagram.com/belentani_/",
      spotify: "https://open.spotify.com/artist/2bU5Ir70YHHuUnq2f3WCYl",
      apple: "https://music.apple.com/artist/belentani/1522171354",
      youtube: "https://www.youtube.com/@belentani",
      soundcloud: "https://soundcloud.com/belentani"
    }
  };

  /** Carriles profesionales con evidencia local. No son títulos oficiales inventados. */
  const LANES = [
    {
      id: "artista",
      title: "Artista y compositor",
      headline: "Dark pop / R&B / electrónica con universo narrativo",
      promise:
        "Entrego canciones, escucha oficial y un universo visual-narrativo (JUDAS / OMEGA) que convierte la obra en experiencia.",
      evidence: [
        { label: "Spotify artista", url: IDENTITY.hubs.spotify },
        { label: "Apple Music", url: IDENTITY.hubs.apple },
        { label: "YouTube", url: IDENTITY.hubs.youtube },
        { label: "SoundCloud", url: IDENTITY.hubs.soundcloud },
        { label: "Instagram", url: IDENTITY.hubs.instagram },
        { label: "Universo local", url: "../" },
        { label: "Master Judas (local)", url: "../unificado/#judas-listen" }
      ],
      offers: [
        "Sencillos / demos masterizados para streaming",
        "Sesiones en vivo / showcase (a acordar)",
        "Licencia de obra / sincronización (caso a caso)",
        "Colaboraciones vocales / featuring"
      ],
      next: [
        "Publicar Judas en DistroKid con el WAV de masters/judas/",
        "Fijar un rate card mínimo (caché + licencia) en belentani.eu",
        "Una propuesta semanal a un booking / sello / curator con bio + 2 enlaces"
      ]
    },
    {
      id: "inmersivo",
      title: "Creative technologist · experiencias web",
      headline: "Portales 3D, shells narrativos y mundos interactivos",
      promise:
        "Diseño y construyo experiencias web inmersivas ancladas a una historia real del artista: lore, audio y mundos publicados.",
      evidence: [
        { label: "JUDAS Experience", url: "https://belentani7.github.io/judas-experience-web/" },
        { label: "Cósmico unificado", url: "https://belentani7.github.io/judas-experience-unificado/" },
        { label: "Omega Immersive", url: "https://belentani7.github.io/belentani-omega-immersive-portal/" },
        { label: "Fullstack 20 mundos", url: "https://belentani7.github.io/BELENTANI-JUDAS-ERA-FULLSTACK/" },
        { label: "Shell local", url: "../" },
        { label: "GitHub", url: IDENTITY.github }
      ],
      offers: [
        "Landing / portal inmersivo (Three.js / GSAP / estático)",
        "Universo narrativo multi-página unificado",
        "Auditoría y curación de repos web públicos",
        "Prototipo → Pages / Netlify listo para demo"
      ],
      next: [
        "Empaquetar 3 demos como portfolio (JUDAS + Unificado + un mundo OMEGA)",
        "Oferta de 1 página: alcance, plazo, precio base en belentani.eu",
        "Contactar 2 estudios / marcas culturales con case study de 1 página"
      ]
    },
    {
      id: "educacion",
      title: "Educación y legado cívico",
      headline: "Escuela abierta, comunidad migrante, herramientas de cuidado",
      promise:
        "Construyo portales educativos y de acogida (Manos Abiertas, Cruzando el Charco, school) con Noiacore como laboratorio.",
      evidence: [
        { label: "Manos Abiertas", url: "https://belentani7.github.io/ManosAbiertas/" },
        { label: "Cruzando el Charco", url: "https://belentani7.github.io/Cruzando-el-charco/" },
        { label: "School unificado", url: "https://belentani7.github.io/belentani-school-unificado/" },
        { label: "Tender Words", url: "https://belentani7.github.io/tender-words-connect/" },
        { label: "Noiacore", url: IDENTITY.hubs.laboratorio }
      ],
      offers: [
        "Diseño de portal educativo / comunitario",
        "Contenidos y arquitectura de escuela digital",
        "Talleres introductorios (formato a acordar)",
        "Mantenimiento de sitios de misión social"
      ],
      next: [
        "Definir 1 servicio educativo cobrable (diseño de portal) distinto de la misión gratuita",
        "Página de propuesta en belentani.eu con alcance claro",
        "Alianza con 1 entidad local (Hospitalet / Barcelona) con dossier de 2 páginas"
      ]
    },
    {
      id: "hibrido",
      title: "Profesión híbrida Belentani",
      headline: "Artista + technologist + legado — un solo nombre comercial",
      promise:
        "Belentani opera como artista con sistema digital propio (obra JUDAS) y atelier Noiacore para educación y producto. Un solo contacto: belentani.eu.",
      evidence: [
        { label: "Perfil profesional", url: IDENTITY.hubs.profesional },
        { label: "Universo artístico", url: IDENTITY.hubs.artistico },
        { label: "Noiacore", url: IDENTITY.hubs.laboratorio },
        { label: "GitHub belentani7", url: IDENTITY.github },
        { label: "Spotify", url: IDENTITY.hubs.spotify }
      ],
      offers: [
        "Paquete A — Obra: música + universo visual",
        "Paquete B — Web inmersiva para artistas / instituciones",
        "Paquete C — Portal educativo / comunitario",
        "Consultoría creativa-tech (sesión acotada)"
      ],
      next: [
        "Elegir un carril primario 90 días (recomendado: artista O inmersivo)",
        "Publicar rate card en belentani.eu (3 precios, sin inventar casos)",
        "Una venta o colaboración pagada en 30 días usando solo evidencia real"
      ]
    }
  ];

  function laneById(id) {
    return LANES.find((l) => l.id === id) || LANES[3];
  }

  function bio(laneId, tone) {
    const lane = laneById(laneId);
    const base =
      IDENTITY.name +
      " — nacido en " +
      IDENTITY.born +
      ", basado en " +
      IDENTITY.based +
      ". ";
    if (tone === "corto") {
      return (
        base +
        lane.title +
        ". " +
        lane.headline +
        " Contacto: " +
        IDENTITY.hubs.profesional
      );
    }
    if (tone === "pitch") {
      return (
        "En 30 segundos: soy " +
        IDENTITY.name +
        ", " +
        lane.title.toLowerCase() +
        " desde " +
        IDENTITY.based +
        ". " +
        lane.promise +
        " Prueba: " +
        lane.evidence
          .slice(0, 2)
          .map((e) => e.label)
          .join(" + ") +
        ". Hablemos en " +
        IDENTITY.hubs.profesional +
        "."
      );
    }
    return (
      base +
      lane.promise +
      " Company / lab: " +
      IDENTITY.company +
      " (" +
      IDENTITY.hubs.laboratorio +
      "). Perfil profesional: " +
      IDENTITY.hubs.profesional +
      "."
    );
  }

  function onePager(laneId) {
    const lane = laneById(laneId);
    const lines = [
      "══════════════════════════════════════",
      "BELENTANI · MÁQUINA PROFESIÓN · ONE-PAGER",
      "══════════════════════════════════════",
      "Carril: " + lane.title,
      "Base: " + IDENTITY.born + " → " + IDENTITY.based,
      "Lab: " + IDENTITY.company,
      "",
      "PROMESA",
      lane.promise,
      "",
      "QUÉ OFREZCO"
    ];
    lane.offers.forEach((o, i) => lines.push("  " + (i + 1) + ". " + o));
    lines.push("", "EVIDENCIA (enlaces reales)");
    lane.evidence.forEach((e) => lines.push("  · " + e.label + " — " + e.url));
    lines.push("", "PRÓXIMOS PASOS");
    lane.next.forEach((n, i) => lines.push("  " + (i + 1) + ". " + n));
    lines.push(
      "",
      "CONTACTO",
      "  " + IDENTITY.hubs.profesional,
      "  " + IDENTITY.hubs.instagram,
      "",
      "Nota: este documento no inventa clientes, premios ni métricas.",
      "Generado localmente por Máquina Profesión · Belentani.es"
    );
    return lines.join("\n");
  }

  function checklist(laneId) {
    const lane = laneById(laneId);
    return [
      { id: "bio", label: "Bio corta lista para pegar", done: true },
      { id: "evidence", label: "Al menos 3 pruebas públicas enlazadas", done: lane.evidence.length >= 3 },
      { id: "offer", label: "Oferta con 3+ servicios nombrados", done: lane.offers.length >= 3 },
      { id: "hub", label: "Hub profesional belentani.eu activo", done: true },
      { id: "rate", label: "Rate card publicado (pendiente en eu)", done: false },
      { id: "pitch", label: "Pitch 30s memorizado", done: false },
      { id: "first-sale", label: "Primera colaboración o venta pagada", done: false },
      { id: "lane-focus", label: "Carril primario elegido 90 días", done: false }
    ];
  }

  function emailDraft(laneId) {
    const lane = laneById(laneId);
    return (
      "Asunto: Propuesta — " +
      lane.title +
      " · Belentani\n\n" +
      "Hola,\n\n" +
      "Soy Belentani (" +
      IDENTITY.based +
      "). " +
      lane.promise +
      "\n\n" +
      "Puedes ver evidencia aquí:\n" +
      lane.evidence
        .slice(0, 3)
        .map((e) => "- " + e.label + ": " + e.url)
        .join("\n") +
      "\n\n" +
      "Si encaja, propongo una llamada corta o responder a esta nota con el alcance que necesitáis.\n\n" +
      "Perfil: " +
      IDENTITY.hubs.profesional +
      "\n" +
      "Gracias,\nBelentani\n"
    );
  }

  root.BELENTANI_PROFESION = {
    version: "2026-10-02",
    identity: IDENTITY,
    lanes: LANES,
    laneById,
    bio,
    onePager,
    checklist,
    emailDraft
  };
})(typeof window !== "undefined" ? window : globalThis);
