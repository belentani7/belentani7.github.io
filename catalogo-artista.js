/*!
 * BELENTANI — banco de datos del artista (canon local)
 * Fuente verificada 2026-10-01: Apple Music artist/1522171354 + Spotify artist/2bU5Ir70YHHuUnq2f3WCYl
 * No inventa métricas. status: canon | collab | archive | withdraw
 */
(function (root) {
  "use strict";

  const ARTIST = {
    name: "Belentani",
    born: "São Paulo",
    based: "Barcelona",
    genres: ["pop alternativo", "R&B", "electrónica experimental"],
    spotify: "https://open.spotify.com/artist/2bU5Ir70YHHuUnq2f3WCYl",
    apple: "https://music.apple.com/artist/belentani/1522171354",
    youtube: "https://www.youtube.com/@belentani",
    soundcloud: "https://soundcloud.com/belentani",
    instagram: "https://www.instagram.com/belentani_/",
    hubs: {
      artistico: "https://belentani.es/",
      profesional: "https://belentani.eu/",
      laboratorio: "https://noiacore.com/"
    },
    statement:
      "Artista y compositor. La obra cruza pop alternativo, R&B y electrónica: voz, emoción e imagen en un mismo sistema."
  };

  /** @type {Array<{id:string,title:string,year:number,type:string,status:string,role:string,apple?:string,note?:string,era?:string}>} */
  const RELEASES = [
    {
      id: "judas",
      title: "Judas",
      year: 2026,
      type: "single",
      status: "canon",
      role: "lead",
      era: "JUDAS / traición",
      apple: null,
      localAudio: null,
      note: "Master streaming de archivo (−14 LUFS), conservado en el archivo del proyecto y no publicado en el sitio. Aún no listado como lanzamiento de plataforma en este catálogo."
    },
    {
      id: "mon-amour-mitm",
      title: "Mon Amour (Man in the Middle Remix)",
      year: 2026,
      type: "single",
      status: "canon",
      role: "lead",
      era: "JUDAS / noche",
      apple: "https://music.apple.com/us/album/mon-amour-man-in-the-middle-remix-single/6773920710",
      note: "Remix reciente; título técnico intencional (mitm), no un error de publicación."
    },
    {
      id: "mon-amour",
      title: "Mon Amour",
      year: 2025,
      type: "single",
      status: "canon",
      role: "lead",
      era: "JUDAS / deseo",
      apple: "https://music.apple.com/us/album/mon-amour-single/1820620452"
    },
    {
      id: "mon-amour-acapella",
      title: "Mon Amour (Acapella)",
      year: 2026,
      type: "single",
      status: "archive",
      role: "lead",
      era: "JUDAS / voz nuda",
      apple: "https://music.apple.com/us/album/mon-amour-acapella-single/6773552028"
    },
    {
      id: "anti-love-mayzer",
      title: "ANTI-LOVE (feat. Belentani & Hey Duck)",
      year: 2025,
      type: "single",
      status: "collab",
      role: "featured",
      era: "Hey Duck / MAYZER",
      apple: "https://music.apple.com/us/album/anti-love-feat-belentani-hey-duck-single/1796709423",
      note: "Colaboración; artista principal MAYZER."
    },
    {
      id: "heart-breaking",
      title: "Heart Breaking",
      year: 2023,
      type: "single",
      status: "canon",
      role: "lead",
      era: "herida / pop",
      apple: "https://music.apple.com/us/album/heart-breaking-single/1716854706"
    },
    {
      id: "america-has-a-problem",
      title: "America Has a Problem",
      year: 2023,
      type: "single",
      status: "canon",
      role: "lead",
      era: "cover / electrónica",
      apple: "https://music.apple.com/us/album/america-has-a-problem/1705393094?i=1705393095"
    },
    {
      id: "therapist",
      title: "Therapist",
      year: 2023,
      type: "single",
      status: "canon",
      role: "lead",
      era: "intimidad",
      apple: "https://music.apple.com/us/album/therapist/1699047840?i=1699047841"
    },
    {
      id: "i-wrote-a-song",
      title: "I Wrote a Song",
      year: 2023,
      type: "single",
      status: "canon",
      role: "lead",
      era: "escritura",
      apple: "https://music.apple.com/us/album/i-wrote-a-song/1688140750?i=1688140751"
    },
    {
      id: "baila-conmigo",
      title: "Baila Conmigo",
      year: 2023,
      type: "single",
      status: "canon",
      role: "lead",
      era: "cuerpo",
      apple: "https://music.apple.com/us/album/baila-conmigo/1682274248?i=1682274249"
    },
    {
      id: "sleep-talking",
      title: "Sleep Talking",
      year: 2023,
      type: "single",
      status: "canon",
      role: "lead",
      era: "sueño",
      apple: "https://music.apple.com/us/album/sleep-talking/1670160516?i=1670160521"
    },
    {
      id: "lento",
      title: "Lento",
      year: 2022,
      type: "single",
      status: "canon",
      role: "lead",
      era: "tempo",
      apple: "https://music.apple.com/us/album/lento/1657989541?i=1657989542"
    },
    {
      id: "apaga-a-luz",
      title: "Apaga a Luz",
      year: 2021,
      type: "single",
      status: "canon",
      role: "lead",
      era: "origen",
      apple: null,
      note: "Verificado en Spotify; enlace Apple pendiente de confirmar."
    },
    {
      id: "beautiful-skies",
      title: "Beautiful Skies (feat. Belentani)",
      year: 2020,
      type: "single",
      status: "collab",
      role: "featured",
      era: "Radio Fatima",
      apple: "https://music.apple.com/us/album/beautiful-skies-feat-belentani-single/1522171353"
    },
    {
      id: "heart-breaking-cherry",
      title: "Heart Breaking (Cherry Remix)",
      year: 2023,
      type: "single",
      status: "archive",
      role: "lead",
      apple: "https://music.apple.com/us/album/heart-breaking-cherry-remix-single/6772585851"
    },
    {
      id: "heart-breaking-banana",
      title: "Heart Breaking (Banana Remix)",
      year: 2023,
      type: "single",
      status: "archive",
      role: "lead",
      apple: "https://music.apple.com/us/album/heart-breaking-banana-remix-single/6772587068"
    },
    {
      id: "heart-breaking-acapella",
      title: "Heart Breaking (Special Version Acapella)",
      year: 2023,
      type: "single",
      status: "archive",
      role: "lead",
      apple: "https://music.apple.com/us/album/heart-breaking-special-version-acapella-single/6775823359"
    },
    {
      id: "mon-amour-404",
      title: "Mon Amour (Remix 404 API Key not found)",
      year: 2026,
      type: "single",
      status: "withdraw",
      role: "lead",
      apple: "https://music.apple.com/us/album/mon-amour-remix-404-api-key-not-found-single/6773903781",
      note:
        "ERROR DE PUBLICACIÓN: el título es un mensaje de fallo técnico, no un concepto artístico. Retirar de DistroKid/Spotify/Apple para recuperar valor profesional. No mostrar en la vitrina del sitio."
    }
  ];

  const WORLDS = [
    {
      id: "unificado",
      name: "UNIVERSO UNIFICADO",
      tag: "experiencia local",
      url: "unificado/",
      blurb: "Galaxia, lore y legado en una sola página."
    },
    {
      id: "judas",
      name: "THE JUDAS EXPERIENCE",
      tag: "portal 3D",
      url: "https://belentani7.github.io/judas-experience-web/",
      blurb: "Planeta, diamante, llave dorada — la noche convertida en recorrido."
    },
    {
      id: "omega",
      name: "JUDAS · CÓSMICO UNIFICADO",
      tag: "obra / archivo",
      url: "https://belentani7.github.io/judas-experience-unificado/",
      blurb: "La obra reunida: reliquia, códice, motor 3D y firma sonora."
    },
    {
      id: "sessions",
      name: "NUEVE SESIONES",
      tag: "mapa",
      cmd: "JUDAS SESSIONS",
      blurb: "Autoría, música, mito, reliquias y galería en un solo atlas."
    },
    {
      id: "audio",
      name: "BÓVEDA SONORA",
      tag: "stems",
      cmd: "JUDAS AUDIO",
      blurb: "Preescuchas cortas del archivo público — no son los máster WAV."
    }
  ];

  function byStatus(status) {
    return RELEASES.filter(r => r.status === status);
  }

  function featured() {
    return RELEASES.filter(r => r.status === "canon" && r.role === "lead")
      .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
  }

  function professionalAlert() {
    return byStatus("withdraw");
  }

  root.BELENTANI_CATALOG = {
    version: "2026-10-01",
    artist: ARTIST,
    releases: RELEASES,
    worlds: WORLDS,
    byStatus,
    featured,
    professionalAlert
  };
})(typeof window !== "undefined" ? window : globalThis);
