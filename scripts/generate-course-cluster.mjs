import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const baseUrl = "https://diskgolfutstyr.no";
const updatedIso = "2026-06-03";
const updatedDisplay = "3. juni 2026";
const courseNotice = "Informasjon om baner kan endre seg. Sjekk alltid oppdatert informasjon fra klubb, arrangør eller banetjeneste før du drar.";

const cityPages = [
  { slug: "oslo", city: "Oslo", title: "Discgolf i Oslo - baner, tips og nybegynnerguide", description: "Finn discgolfbaner i Oslo, se hvilke baner som kan passe for nybegynnere, og få tips til første runde.", intro: "Oslo har både korte lavterskelbaner og mer krevende 18-hullsbaner. Start med en enkel bane hvis du er helt ny, og sjekk alltid oppdatert banestatus før du drar." },
  { slug: "bergen", city: "Bergen", title: "Discgolf i Bergen - baner, tips og nybegynnerguide", description: "Oversikt over aktuelle discgolfbaner i Bergen, med tips til nybegynnere og lenker til oppdatert baneinformasjon.", intro: "Bergen har flere baner med ulik lengde og vanskelighetsgrad. Denne siden gir en forsiktig oversikt basert på åpne kilder." },
  { slug: "trondheim", city: "Trondheim", title: "Discgolf i Trondheim - baner, tips og nybegynnerguide", description: "Finn discgolfbaner i Trondheim, fra korte nybegynnervennlige alternativer til mer krevende 18-hullsbaner.", intro: "Trondheim er en sterk discgolfby med flere baner, ligaer og aktive miljøer. Velg bane etter tid, nivå og hvor mye teknisk skog du vil møte." },
  { slug: "stavanger", city: "Stavanger", title: "Discgolf i Stavanger - baner og tips", description: "Oversikt over discgolf i Stavanger og nærområdet, med aktuelle baner, nybegynnertips og kilder.", intro: "Stavanger-regionen har mange baner innen kort reiseavstand. Noen baner ligger i selve Stavanger, mens flere gode alternativer finnes i Sandnes, Sola, Randaberg og Jæren." },
  { slug: "kristiansand", city: "Kristiansand", title: "Discgolf i Kristiansand - baner og nybegynnertips", description: "Finn discgolfbaner i Kristiansand og få tips til hvilke baner som kan passe nye spillere.", intro: "Kristiansand har både større baner og kortere lavterskelalternativer. Bruk siden som startpunkt, og sjekk alltid kilde før du reiser." },
  { slug: "tromso", city: "Tromsø", title: "Discgolf i Tromsø - baner og tips", description: "Oversikt over discgolfbaner i Tromsø, med kilder og praktiske tips til spillere i nord.", intro: "Tromsø har baner der sesong, vær og terreng kan være ekstra viktig. Sjekk status tett på avreise." },
  { slug: "drammen", city: "Drammen", title: "Discgolf i Drammen - baner og tips", description: "Finn discgolfbane i Drammen, med oppdatert-dato, kilde og praktiske tips.", intro: "Drammen har foreløpig en mindre datapakke i Diskgolfutstyr. Derfor er kilde og oppdatert-dato ekstra viktig." },
  { slug: "fredrikstad", city: "Fredrikstad", title: "Discgolf i Fredrikstad - baner og nybegynnertips", description: "Oversikt over discgolfbaner i Fredrikstad, inkludert korte baner som kan passe nye spillere.", intro: "Fredrikstad er relevant for lavterskel discgolf på Østlandet, med korte baner som kan være fine for første runder." },
  { slug: "skien", city: "Skien og Porsgrunn", aliases: ["Skien", "Porsgrunn"], title: "Discgolf i Skien og Porsgrunn - baner i Grenland", description: "Finn discgolfbaner i Skien, Porsgrunn og Grenland, med tips for nybegynnere og viderekomne.", intro: "Grenland har flere relevante baner, både i Skien og Porsgrunn. Denne siden samler dem fordi mange lokale søk handler om hele området." },
  { slug: "sandnes", city: "Sandnes", title: "Discgolf i Sandnes - baner og tips", description: "Oversikt over discgolfbaner i Sandnes og nærliggende Jæren-områder, med kildebasert informasjon.", intro: "Sandnes-området har flere baner med ulik vanskelighetsgrad. Nye spillere bør starte med de kortere og enklere alternativene." },
  { slug: "alesund", city: "Ålesund", title: "Discgolf i Ålesund - baner og nybegynnertips", description: "Finn discgolfbaner i Ålesund, med korte beskrivelser, kilder og tips før første runde.", intro: "Ålesund har korte baner som kan være aktuelle for nybegynnere, men sjekk alltid banestatus og lokale forhold før du drar." },
  { slug: "bodo", city: "Bodø", title: "Discgolf i Bodø - baner og tips", description: "Oversikt over discgolfbaner i Bodø, med kilder, nivå og praktiske tips.", intro: "Bodø har flere baner og tydelige sesong-/terrenghensyn. Bruk oppdatert baneinformasjon før du planlegger runden." }
];

const courses = [
  {
    id: "krokhol-disc-golf-course",
    name: "Krokhol Disc Golf Course",
    slug: "krokhol-disc-golf-course",
    city: "Siggerud",
    municipality: "Nordre Follo",
    county: "Akershus",
    country: "Norge",
    holes: 18,
    difficulty: "Svært krevende",
    beginner_friendly: false,
    family_friendly: null,
    course_type: "Golfbane/skog og åpent terreng",
    terrain: "Blandet skog, åpne partier og høydeforskjell",
    short_description: "Krokhol er en større og mer krevende bane ved Oslo-området, mest aktuell for spillere som tåler lengde, høydeforskjell og tekniske hull.",
    good_for: ["viderekomne", "turneringsspillere", "banetur"],
    facilities: ["Se oppdatert kilde for fasiliteter og booking"],
    udisc_url: "https://udisc.com/courses/krokhol-disc-golf-course-TKtF",
    club_url: "",
    map_url: "https://www.google.com/maps/search/?api=1&query=Krokhol%20Disc%20Golf%20Course",
    source_urls: ["https://www.pdga.com/course-directory/course/krokhol-disc-golf-course", "https://udisc.com/courses/krokhol-disc-golf-course-TKtF"],
    last_checked: updatedIso,
    notes: "PDGA og UDisc viser 18 hull. Status, betaling og åpningstid må sjekkes før spill."
  },
  {
    id: "klemetsrud-diskgolfbane",
    name: "Klemetsrud diskgolfbane",
    slug: "klemetsrud-diskgolfbane",
    city: "Oslo",
    municipality: "Oslo",
    county: "Oslo",
    country: "Norge",
    holes: 18,
    difficulty: "Krevende",
    beginner_friendly: false,
    family_friendly: null,
    course_type: "Skogsbane",
    terrain: "Skog og tekniske fairwayer",
    short_description: "Klemetsrud virker som et teknisk 18-hullsvalg for spillere som vil ha en mer krevende Oslo-runde.",
    good_for: ["viderekomne", "teknisk trening", "lokale spillere"],
    facilities: [],
    udisc_url: "https://udisc.com/courses/klemetsrud-diskgolfbane-qVbT",
    club_url: "https://www.klemetsrudil.no/",
    map_url: "https://www.google.com/maps/search/?api=1&query=Klemetsrud%20diskgolfbane",
    source_urls: ["https://udisc.com/courses/klemetsrud-diskgolfbane-qVbT"],
    last_checked: updatedIso,
    notes: "UDisc viser 18 hull. Sjekk ukesgolf og eventuell stenging før casual runde."
  },
  {
    id: "holmenkollen-discgolfpark",
    name: "Holmenkollen DiscGolfpark",
    slug: "holmenkollen-discgolfpark",
    city: "Oslo",
    municipality: "Oslo",
    county: "Oslo",
    country: "Norge",
    holes: 18,
    difficulty: "Middels",
    beginner_friendly: false,
    family_friendly: null,
    course_type: "Park/skianlegg",
    terrain: "Kupert park- og skiterreng",
    short_description: "Holmenkollen er en 18-hullsbane i kupert terreng. Den kan være fin for spillere som vil ha Oslo-nær bane med utsikt, men helt nye spillere bør starte roligere.",
    good_for: ["hobbyspillere", "viderekomne", "Oslo-runde"],
    facilities: ["Se oppdatert kilde for toalett og sesong"],
    udisc_url: "https://udisc.com/courses/holmenkollen-disc-golfpark-Zh8g",
    club_url: "https://www.skiforeningen.no/holmenkollen/se-og-gjore/holmenkollen-frisbeegolf/",
    map_url: "https://www.google.com/maps/search/?api=1&query=Holmenkollen%20DiscGolfpark",
    source_urls: ["https://udisc.com/courses/holmenkollen-disc-golfpark-Zh8g"],
    last_checked: updatedIso,
    notes: "UDisc viser 18 hull og sesongstatus."
  },
  {
    id: "ekeberg-frisbeegolfbane",
    name: "Ekeberg Frisbeegolfbane",
    slug: "ekeberg-frisbeegolfbane",
    city: "Oslo",
    municipality: "Oslo",
    county: "Oslo",
    country: "Norge",
    holes: 18,
    difficulty: "Middels",
    beginner_friendly: false,
    family_friendly: null,
    course_type: "Parkbane",
    terrain: "Park og blandet terreng",
    short_description: "Ekeberg er en mye spilt Oslo-bane. Den er aktuell for mange nivåer, men nye spillere bør ta hensyn til andre brukere og tempo på banen.",
    good_for: ["Oslo-spillere", "hobbyspillere", "trening"],
    facilities: [],
    udisc_url: "https://udisc.com/places/no/oslo-region-norway",
    club_url: "",
    map_url: "https://www.google.com/maps/search/?api=1&query=Ekeberg%20Frisbeegolfbane",
    source_urls: ["https://udisc.com/places/no/oslo-region-norway"],
    last_checked: updatedIso,
    notes: "UDisc byoversikt viser Ekeberg som 18-hullsbane i Oslo."
  },
  {
    id: "hauketo-diskgolfbane",
    name: "Hauketo Diskgolfbane",
    slug: "hauketo-diskgolfbane",
    city: "Oslo",
    municipality: "Oslo",
    county: "Oslo",
    country: "Norge",
    holes: 11,
    difficulty: "Lett",
    beginner_friendly: true,
    family_friendly: true,
    course_type: "Lavterskelbane",
    terrain: "Ukjent",
    short_description: "Hauketo er markert som lett og nybegynnervennlig i UDisc sin Oslo-oversikt, og kan derfor være et aktuelt førstevalg i byen.",
    good_for: ["nybegynnere", "kort runde", "første runde"],
    facilities: [],
    udisc_url: "https://udisc.com/places/no/oslo-region-norway",
    club_url: "",
    map_url: "https://www.google.com/maps/search/?api=1&query=Hauketo%20Diskgolfbane",
    source_urls: ["https://udisc.com/places/no/oslo-region-norway"],
    last_checked: updatedIso,
    notes: "Byoversikt oppgir 11 hull og beginner-friendly. Sjekk egen baneinfo før du drar."
  },
  {
    id: "lambertseter-diskgolfbane",
    name: "Lambertseter Diskgolfbane",
    slug: "lambertseter-diskgolfbane",
    city: "Oslo",
    municipality: "Oslo",
    county: "Oslo",
    country: "Norge",
    holes: 9,
    difficulty: "Lett",
    beginner_friendly: true,
    family_friendly: true,
    course_type: "Lavterskelbane",
    terrain: "Ukjent",
    short_description: "Lambertseter er et kortere Oslo-alternativ som UDisc markerer som lett og nybegynnervennlig.",
    good_for: ["nybegynnere", "kort runde", "familier"],
    facilities: [],
    udisc_url: "https://udisc.com/places/no/oslo-region-norway",
    club_url: "",
    map_url: "https://www.google.com/maps/search/?api=1&query=Lambertseter%20Diskgolfbane",
    source_urls: ["https://udisc.com/places/no/oslo-region-norway"],
    last_checked: updatedIso,
    notes: "Byoversikt oppgir 9 hull og beginner-friendly."
  },
  {
    id: "alvoen-frisbeegolfbane",
    name: "Alvøen Frisbeegolfbane",
    slug: "alvoen-frisbeegolfbane",
    city: "Bergen",
    municipality: "Bergen",
    county: "Vestland",
    country: "Norge",
    holes: 9,
    difficulty: "Krevende",
    beginner_friendly: false,
    family_friendly: null,
    course_type: "Ukjent",
    terrain: "Ukjent",
    short_description: "Alvøen fremstår som et mer krevende Bergen-alternativ, og bør vurderes etter nivå og dagsform.",
    good_for: ["viderekomne", "Bergen-spillere"],
    facilities: [],
    udisc_url: "https://udisc.com/places/no/bergen-norway",
    club_url: "",
    map_url: "https://www.google.com/maps/search/?api=1&query=Alv%C3%B8en%20Frisbeegolfbane",
    source_urls: ["https://udisc.com/places/no/bergen-norway"],
    last_checked: updatedIso,
    notes: "UDisc byoversikt oppgir 9 hull og hard difficulty."
  },
  {
    id: "sondre-hetlevik",
    name: "Søndre Hetlevik",
    slug: "sondre-hetlevik",
    city: "Bergen",
    municipality: "Bergen",
    county: "Vestland",
    country: "Norge",
    holes: 18,
    difficulty: "Lett til middels",
    beginner_friendly: true,
    family_friendly: null,
    course_type: "Ukjent",
    terrain: "Ukjent",
    short_description: "Søndre Hetlevik er et 18-hullsvalg i Bergen som UDisc markerer som nybegynnervennlig, men runden er lengre enn korte lavterskelbaner.",
    good_for: ["nybegynnere", "hobbyspillere", "18-hulls runde"],
    facilities: [],
    udisc_url: "https://udisc.com/places/no/bergen-norway",
    club_url: "",
    map_url: "https://www.google.com/maps/search/?api=1&query=S%C3%B8ndre%20Hetlevik%20discgolf",
    source_urls: ["https://udisc.com/places/no/bergen-norway"],
    last_checked: updatedIso,
    notes: "UDisc byoversikt oppgir 18 hull og beginner-friendly."
  },
  {
    id: "kalandeid-il",
    name: "Kalandeid IL",
    slug: "kalandeid-il",
    city: "Bergen",
    municipality: "Bergen",
    county: "Vestland",
    country: "Norge",
    holes: 9,
    difficulty: "Lett",
    beginner_friendly: true,
    family_friendly: true,
    course_type: "Lavterskelbane",
    terrain: "Ukjent",
    short_description: "Kalandeid IL er et kortere Bergen-alternativ som kan passe nye spillere basert på tilgjengelig UDisc-informasjon.",
    good_for: ["nybegynnere", "kort runde", "familier"],
    facilities: [],
    udisc_url: "https://udisc.com/places/no/bergen-norway",
    club_url: "",
    map_url: "https://www.google.com/maps/search/?api=1&query=Kalandeid%20IL%20discgolf",
    source_urls: ["https://udisc.com/places/no/bergen-norway"],
    last_checked: updatedIso,
    notes: "UDisc byoversikt oppgir 9 hull og beginner-friendly."
  },
  {
    id: "dragvoll-diskgolfarena",
    name: "Dragvoll Diskgolfarena",
    slug: "dragvoll-diskgolfarena",
    city: "Trondheim",
    municipality: "Trondheim",
    county: "Trøndelag",
    country: "Norge",
    holes: 18,
    difficulty: "Krevende",
    beginner_friendly: false,
    family_friendly: null,
    course_type: "Teknisk bane",
    terrain: "Teknisk og kupert",
    short_description: "Dragvoll er en etablert 18-hullsbane i Trondheim som passer best for spillere som vil ha en lengre og mer teknisk runde.",
    good_for: ["viderekomne", "turnering", "teknisk trening"],
    facilities: [],
    udisc_url: "https://udisc.com/courses/dragvoll-diskgolfpark-J0NI",
    club_url: "https://www.trondheimfrisbeeklubb.no/",
    map_url: "https://www.google.com/maps/search/?api=1&query=Dragvoll%20Diskgolfarena",
    source_urls: ["https://udisc.com/courses/dragvoll-diskgolfpark-J0NI", "https://udisc.com/places/trondheim-norway"],
    last_checked: updatedIso,
    notes: "UDisc viser 18 hull. Sjekk booking og klubbinfo."
  },
  {
    id: "hallset-diskgolfpark",
    name: "Hallset Diskgolfpark",
    slug: "hallset-diskgolfpark",
    city: "Trondheim",
    municipality: "Trondheim",
    county: "Trøndelag",
    country: "Norge",
    holes: 6,
    difficulty: "Lett",
    beginner_friendly: true,
    family_friendly: true,
    course_type: "Kort parkbane",
    terrain: "Park",
    short_description: "Hallset er en kort 6-hullsbane i Trondheim som virker godt egnet for første runder og korte treningsøkter.",
    good_for: ["nybegynnere", "familier", "kort runde"],
    facilities: [],
    udisc_url: "https://app.udisc.com/courses/hallset-diskgolfpark-E1lw",
    club_url: "",
    map_url: "https://www.google.com/maps/search/?api=1&query=Hallset%20Diskgolfpark",
    source_urls: ["https://app.udisc.com/courses/hallset-diskgolfpark-E1lw", "https://udisc.com/places/trondheim-norway"],
    last_checked: updatedIso,
    notes: "UDisc oppgir 6 hull og beginner-friendly."
  },
  {
    id: "trolla-diskgolfpark",
    name: "Trolla Diskgolfpark",
    slug: "trolla-diskgolfpark",
    city: "Trondheim",
    municipality: "Trondheim",
    county: "Trøndelag",
    country: "Norge",
    holes: 10,
    difficulty: "Middels",
    beginner_friendly: false,
    family_friendly: null,
    course_type: "Ukjent",
    terrain: "Ukjent",
    short_description: "Trolla ligger høyt i UDisc sin Trondheim-oversikt og kan være aktuell for spillere som vil ha en middels krevende runde.",
    good_for: ["hobbyspillere", "Trondheim-runde"],
    facilities: [],
    udisc_url: "https://udisc.com/places/trondheim-norway",
    club_url: "",
    map_url: "https://www.google.com/maps/search/?api=1&query=Trolla%20Diskgolfpark",
    source_urls: ["https://udisc.com/places/trondheim-norway"],
    last_checked: updatedIso,
    notes: "UDisc byoversikt oppgir 10 hull og moderate difficulty."
  },
  {
    id: "bolgane-frisbeegolfpark",
    name: "Bølgane Frisbeegolfpark",
    slug: "bolgane-frisbeegolfpark",
    city: "Kristiansand",
    municipality: "Kristiansand",
    county: "Agder",
    country: "Norge",
    holes: 18,
    difficulty: "Middels",
    beginner_friendly: null,
    family_friendly: null,
    course_type: "Blandet bane",
    terrain: "Åpne hull og lettere skog",
    short_description: "Bølgane er en 18-hullsbane i Kristiansand med blandet terreng. Høyt gress og lokale forhold kan påvirke runden.",
    good_for: ["hobbyspillere", "18-hulls runde", "Kristiansand"],
    facilities: [],
    udisc_url: "https://udisc.com/courses/bolgane-frisbeegolfpark-8egx",
    club_url: "",
    map_url: "https://www.google.com/maps/search/?api=1&query=B%C3%B8lgane%20Frisbeegolfpark",
    source_urls: ["https://udisc.com/courses/bolgane-frisbeegolfpark-8egx"],
    last_checked: updatedIso,
    notes: "UDisc viser 18 hull. Sjekk lokale forhold, spesielt i vekstsesong."
  },
  {
    id: "sukkevann-frisbeegolfpark",
    name: "Sukkevann Frisbeegolfpark",
    slug: "sukkevann-frisbeegolfpark",
    city: "Kristiansand",
    municipality: "Kristiansand",
    county: "Agder",
    country: "Norge",
    holes: 27,
    difficulty: "Lett til svært krevende",
    beginner_friendly: true,
    family_friendly: null,
    course_type: "Større baneområde",
    terrain: "Ukjent",
    short_description: "Sukkevann er et større baneområde i Kristiansand-regionen og kan ha alternativer for flere nivåer. Sjekk layout før du velger runde.",
    good_for: ["flere nivåer", "trening", "Kristiansand"],
    facilities: [],
    udisc_url: "https://udisc.com/courses?placeId=lillesand-norway",
    club_url: "",
    map_url: "https://www.google.com/maps/search/?api=1&query=Sukkevann%20Frisbeegolfpark",
    source_urls: ["https://udisc.com/courses?placeId=lillesand-norway"],
    last_checked: updatedIso,
    notes: "UDisc oversikt nær Lillesand/Kristiansand oppgir 27 hull og beginner-friendly."
  },
  {
    id: "skimore-drammen",
    name: "Skimore Drammen",
    slug: "skimore-drammen",
    city: "Drammen",
    municipality: "Drammen",
    county: "Buskerud",
    country: "Norge",
    holes: 18,
    difficulty: "Ukjent",
    beginner_friendly: false,
    family_friendly: null,
    course_type: "Skianlegg",
    terrain: "Kupert skianlegg",
    short_description: "Skimore Drammen er en ny 18-hullsbane i kupert terreng. Siden banen er ny, bør spillere sjekke oppdatert status før de drar.",
    good_for: ["viderekomne", "lokale spillere", "ny bane"],
    facilities: ["Se UDisc for heis, parkering og status"],
    udisc_url: "https://udisc.com/courses/skimore-drammen-o4Ol",
    club_url: "",
    map_url: "https://www.google.com/maps/search/?api=1&query=Skimore%20Drammen%20discgolf",
    source_urls: ["https://udisc.com/courses/skimore-drammen-o4Ol"],
    last_checked: updatedIso,
    notes: "UDisc viser etablert 2026 og difficulty pending."
  },
  {
    id: "kvernhuset-discgolfpark",
    name: "Kvernhuset DiscGolfpark",
    slug: "kvernhuset-discgolfpark",
    city: "Fredrikstad",
    municipality: "Fredrikstad",
    county: "Østfold",
    country: "Norge",
    holes: 9,
    difficulty: "Lett til middels",
    beginner_friendly: true,
    family_friendly: null,
    course_type: "Skole-/skogsområde",
    terrain: "Kort og teknisk",
    short_description: "Kvernhuset er en kort 9-hullsbane i Fredrikstad. Den kan være aktuell for nybegynnere, men tekniske partier og andre brukere bør tas hensyn til.",
    good_for: ["nybegynnere", "kort runde", "lokale spillere"],
    facilities: [],
    udisc_url: "https://udisc.com/courses/kvernhuset-disc-golfpark-tp6J",
    club_url: "",
    map_url: "https://www.google.com/maps/search/?api=1&query=Kvernhuset%20DiscGolfpark",
    source_urls: ["https://udisc.com/courses/kvernhuset-disc-golfpark-tp6J", "https://udisc.com/places/fredrikstad-norway"],
    last_checked: updatedIso,
    notes: "UDisc viser 9 hull og beginner-friendly i byoversikten."
  },
  {
    id: "ambjornrod-skole-discgolfbane",
    name: "Ambjørnrød Skole Discgolfbane",
    slug: "ambjornrod-skole-discgolfbane",
    city: "Fredrikstad",
    municipality: "Fredrikstad",
    county: "Østfold",
    country: "Norge",
    holes: 9,
    difficulty: "Lett",
    beginner_friendly: true,
    family_friendly: true,
    course_type: "Skolebane",
    terrain: "Ukjent",
    short_description: "Ambjørnrød er en kort skolebane i Fredrikstad som kan passe korte lavterskelrunder når området er tilgjengelig.",
    good_for: ["nybegynnere", "familier", "kort runde"],
    facilities: [],
    udisc_url: "https://udisc.com/places/fredrikstad-norway",
    club_url: "",
    map_url: "https://www.google.com/maps/search/?api=1&query=Ambj%C3%B8rnr%C3%B8d%20Skole%20Discgolfbane",
    source_urls: ["https://udisc.com/places/fredrikstad-norway"],
    last_checked: updatedIso,
    notes: "UDisc byoversikt oppgir 9 hull og beginner-friendly."
  },
  {
    id: "skien-frisbeegolfbane",
    name: "Skien Frisbeegolfbane",
    slug: "skien-frisbeegolfbane",
    city: "Skien",
    municipality: "Skien",
    county: "Telemark",
    country: "Norge",
    holes: 18,
    difficulty: "Middels",
    beginner_friendly: false,
    family_friendly: null,
    course_type: "Ukjent",
    terrain: "Ukjent",
    short_description: "Skien Frisbeegolfbane er et 18-hullsvalg i Grenland og en naturlig hovedbane for spillere som søker discgolf i Skien.",
    good_for: ["hobbyspillere", "18-hulls runde", "Grenland"],
    facilities: [],
    udisc_url: "https://udisc.com/places/skien-norway",
    club_url: "",
    map_url: "https://www.google.com/maps/search/?api=1&query=Skien%20Frisbeegolfbane",
    source_urls: ["https://udisc.com/places/skien-norway"],
    last_checked: updatedIso,
    notes: "UDisc byoversikt oppgir 18 hull."
  },
  {
    id: "kollmyr-frisbeegolf",
    name: "Kollmyr Frisbeegolf",
    slug: "kollmyr-frisbeegolf",
    city: "Skien",
    municipality: "Skien",
    county: "Telemark",
    country: "Norge",
    holes: 9,
    difficulty: "Lett",
    beginner_friendly: true,
    family_friendly: true,
    course_type: "Lavterskelbane",
    terrain: "Ukjent",
    short_description: "Kollmyr er et kortere Skien-alternativ som virker godt egnet for nye spillere basert på UDisc sin byoversikt.",
    good_for: ["nybegynnere", "kort runde", "familier"],
    facilities: [],
    udisc_url: "https://udisc.com/places/skien-norway",
    club_url: "",
    map_url: "https://www.google.com/maps/search/?api=1&query=Kollmyr%20Frisbeegolf",
    source_urls: ["https://udisc.com/places/skien-norway"],
    last_checked: updatedIso,
    notes: "UDisc byoversikt oppgir 9 hull og beginner-friendly."
  },
  {
    id: "porsgrunn-heistad",
    name: "Porsgrunn - Heistad",
    slug: "porsgrunn-heistad",
    city: "Porsgrunn",
    municipality: "Porsgrunn",
    county: "Telemark",
    country: "Norge",
    holes: 18,
    difficulty: "Middels",
    beginner_friendly: false,
    family_friendly: null,
    course_type: "Blandet bane",
    terrain: "Åpent og skog",
    short_description: "Heistad er en 18-hullsbane i Porsgrunn med variert terreng. Sjekk lokale restriksjoner og ukesgolf før du spiller.",
    good_for: ["hobbyspillere", "Grenland", "18-hulls runde"],
    facilities: [],
    udisc_url: "https://udisc.com/courses/porsgrunn-heistad-jbco",
    club_url: "https://www.pdsk.no/",
    map_url: "https://www.google.com/maps/search/?api=1&query=Porsgrunn%20Heistad%20discgolf",
    source_urls: ["https://udisc.com/courses/porsgrunn-heistad-jbco", "https://udisc.com/places/porsgrunn-norway"],
    last_checked: updatedIso,
    notes: "UDisc viser 18 hull og sesong/restriksjoner."
  },
  {
    id: "porsgrunn-kjolnes",
    name: "Porsgrunn - Kjølnes",
    slug: "porsgrunn-kjolnes",
    city: "Porsgrunn",
    municipality: "Porsgrunn",
    county: "Telemark",
    country: "Norge",
    holes: 18,
    difficulty: "Lett",
    beginner_friendly: true,
    family_friendly: true,
    course_type: "Park/skoleområde",
    terrain: "Relativt kort baneområde",
    short_description: "Kjølnes er en nyere 18-hullsbane i Porsgrunn som UDisc markerer som lett. Vær ekstra oppmerksom på andre brukere i området.",
    good_for: ["nybegynnere", "hobbyspillere", "Grenland"],
    facilities: [],
    udisc_url: "https://udisc.com/courses/porsgrunn-kjolnes-XKUD",
    club_url: "https://www.pdsk.no/",
    map_url: "https://www.google.com/maps/search/?api=1&query=Porsgrunn%20Kj%C3%B8lnes%20discgolf",
    source_urls: ["https://udisc.com/courses/porsgrunn-kjolnes-XKUD"],
    last_checked: updatedIso,
    notes: "UDisc viser 18 hull, easy difficulty og etablert 2024."
  },
  {
    id: "charlottenlund-discgolfbane",
    name: "Charlottenlund Discgolfbane",
    slug: "charlottenlund-discgolfbane",
    city: "Tromsø",
    municipality: "Tromsø",
    county: "Troms",
    country: "Norge",
    holes: 13,
    difficulty: "Teknisk/kort",
    beginner_friendly: null,
    family_friendly: null,
    course_type: "Park/skianlegg",
    terrain: "Kort og teknisk",
    short_description: "Charlottenlund er en 13-hullsbane i Tromsø. Sesong, vær og føre bør sjekkes før runden.",
    good_for: ["Tromsø-spillere", "kort runde", "teknisk trening"],
    facilities: ["Se UDisc for tilgjengelige fasiliteter"],
    udisc_url: "https://udisc.com/courses/charlottenlund-discgolfbane-0aHf",
    club_url: "",
    map_url: "https://www.google.com/maps/search/?api=1&query=Charlottenlund%20Discgolfbane",
    source_urls: ["https://udisc.com/courses/charlottenlund-discgolfbane-0aHf"],
    last_checked: updatedIso,
    notes: "UDisc viser 13 hull og etablert 2015."
  },
  {
    id: "orndalen-diskgolfpark",
    name: "Ørndalen diskgolfpark",
    slug: "orndalen-diskgolfpark",
    city: "Tromsø",
    municipality: "Tromsø",
    county: "Troms",
    country: "Norge",
    holes: 18,
    difficulty: "Middels til svært krevende",
    beginner_friendly: false,
    family_friendly: null,
    course_type: "Skogsbane",
    terrain: "Kupert og teknisk",
    short_description: "Ørndalen er et 18-hullsvalg i Tromsø for spillere som tåler teknisk og kupert terreng.",
    good_for: ["viderekomne", "Tromsø-spillere", "teknisk runde"],
    facilities: [],
    udisc_url: "https://app.udisc.com/courses/orndalen-diskgolfpark-FrIE",
    club_url: "",
    map_url: "https://www.google.com/maps/search/?api=1&query=%C3%98rndalen%20diskgolfpark",
    source_urls: ["https://app.udisc.com/courses/orndalen-diskgolfpark-FrIE"],
    last_checked: updatedIso,
    notes: "UDisc viser 18 hull, sesong og begrensninger ved arrangementer."
  },
  {
    id: "sandnes-disc-golf-park",
    name: "Sandnes Disc Golf Park",
    slug: "sandnes-disc-golf-park",
    city: "Sandnes",
    municipality: "Sandnes",
    county: "Rogaland",
    country: "Norge",
    holes: 20,
    difficulty: "Svært krevende",
    beginner_friendly: false,
    family_friendly: null,
    course_type: "Større bane",
    terrain: "Ukjent",
    short_description: "Sandnes Disc Golf Park virker som et krevende alternativ i Stavanger/Sandnes-regionen, og passer best for spillere med litt erfaring.",
    good_for: ["viderekomne", "Sandnes", "konkurransepreget runde"],
    facilities: [],
    udisc_url: "https://udisc.com/courses?placeId=stavanger-norway",
    club_url: "",
    map_url: "https://www.google.com/maps/search/?api=1&query=Sandnes%20Disc%20Golf%20Park",
    source_urls: ["https://udisc.com/courses?placeId=stavanger-norway"],
    last_checked: updatedIso,
    notes: "UDisc søkeresultat for Stavanger-regionen oppgir 20 hull og very hard difficulty."
  },
  {
    id: "egeland-diskgolfpark",
    name: "Egeland Diskgolfpark",
    slug: "egeland-diskgolfpark",
    city: "Stavanger",
    municipality: "Stavanger",
    county: "Rogaland",
    country: "Norge",
    holes: 9,
    difficulty: "Lett",
    beginner_friendly: true,
    family_friendly: true,
    course_type: "Lavterskelbane",
    terrain: "Ukjent",
    short_description: "Egeland er et kortere Stavanger-alternativ som kan passe nye spillere basert på UDisc sin regionale oversikt.",
    good_for: ["nybegynnere", "Stavanger", "kort runde"],
    facilities: [],
    udisc_url: "https://udisc.com/courses?placeId=stavanger-norway",
    club_url: "",
    map_url: "https://www.google.com/maps/search/?api=1&query=Egeland%20Diskgolfpark",
    source_urls: ["https://udisc.com/courses?placeId=stavanger-norway"],
    last_checked: updatedIso,
    notes: "UDisc søkeresultat oppgir 9 hull og beginner-friendly."
  },
  {
    id: "enga-discgolfpark-offisiell",
    name: "Enga Discgolfpark Offisiell",
    slug: "enga-discgolfpark-offisiell",
    city: "Bodø",
    municipality: "Bodø",
    county: "Nordland",
    country: "Norge",
    holes: 18,
    difficulty: "Krevende",
    beginner_friendly: false,
    family_friendly: null,
    course_type: "Skianlegg",
    terrain: "Kupert og langt",
    short_description: "Enga er en krevende 18-hullsbane i Bodø. Den passer best for spillere som tåler lengde og høydeforskjell.",
    good_for: ["viderekomne", "Bodø", "lang runde"],
    facilities: [],
    udisc_url: "https://udisc.com/courses/enga-discgolfpark-offisiell-tYlm",
    club_url: "",
    map_url: "https://www.google.com/maps/search/?api=1&query=Enga%20Discgolfpark%20Bod%C3%B8",
    source_urls: ["https://udisc.com/courses/enga-discgolfpark-offisiell-tYlm", "https://udisc.com/places/bodo-norway"],
    last_checked: updatedIso,
    notes: "UDisc viser 18 hull og hard difficulty. Layout kan endres."
  },
  {
    id: "borg-golfbane",
    name: "Borg Golfbane",
    slug: "borg-golfbane",
    city: "Ålesund",
    municipality: "Ålesund",
    county: "Møre og Romsdal",
    country: "Norge",
    holes: 6,
    difficulty: "Lett",
    beginner_friendly: true,
    family_friendly: true,
    course_type: "Kort bane",
    terrain: "Ukjent",
    short_description: "Borg Golfbane er et kort Ålesund-alternativ som kan passe en lavterskelrunde.",
    good_for: ["nybegynnere", "familier", "kort runde"],
    facilities: [],
    udisc_url: "https://udisc.com/places/no/alesund-norway",
    club_url: "",
    map_url: "https://www.google.com/maps/search/?api=1&query=Borg%20Golfbane%20discgolf",
    source_urls: ["https://udisc.com/places/no/alesund-norway"],
    last_checked: updatedIso,
    notes: "UDisc byoversikt oppgir 6 hull og beginner-friendly."
  }
];

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function attr(value) {
  return esc(value).replaceAll("\n", " ");
}

function nav(prefix = "/") {
  return `<header class="site-header"><div class="nav-wrap"><a class="brand" href="${prefix}index.html"><img src="${prefix}assets/logo-full.svg" alt="Diskgolfutstyr"></a><button class="menu-button" type="button" aria-label="Åpne meny" aria-expanded="false" data-menu-button>☰</button><nav class="nav" aria-label="Hovedmeny" data-nav><a href="${prefix}nybegynnerguide.html">Nybegynner</a><a href="${prefix}artikler.html">Guider</a><a href="${prefix}regler.html">Regler</a><a href="${prefix}utstyr/">Utstyr</a><a href="${prefix}tester.html">Tester</a><a href="${prefix}baner/">Baner</a></nav></div></header>`;
}

function footer(prefix = "/") {
  return `<footer class="site-footer"><div class="footer-inner"><div class="footer-brand"><img src="${prefix}assets/logo-light.svg" alt="Diskgolfutstyr"><span>Uavhengig norsk discgolfportal. Baneinfo oppdateres manuelt og bør alltid sjekkes mot kilde før spill.</span></div><div class="footer-links"><a href="${prefix}baner/">Baner</a><a href="${prefix}baner/nybegynnervennlige/">Nybegynnervennlige baner</a><a href="${prefix}baner/oslo/">Oslo</a><a href="${prefix}baner/bergen/">Bergen</a><a href="${prefix}baner/trondheim/">Trondheim</a><a href="${prefix}affiliate-info.html">Affiliate-info</a></div></div></footer>`;
}

function slugPath(path) {
  return path.endsWith("/") ? path : `${path}/`;
}

function coursePath(course) {
  return `baner/${course.slug}/`;
}

function courseTags(course) {
  return [
    course.holes ? `${course.holes} hull` : "Hull ukjent",
    course.beginner_friendly === true ? "Nybegynnervennlig" : "",
    course.family_friendly === true ? "Familievennlig" : "",
    course.course_type && course.course_type !== "Ukjent" ? course.course_type : "",
    course.difficulty && course.difficulty !== "Ukjent" ? course.difficulty : ""
  ].filter(Boolean);
}

function pills(items) {
  return `<div class="pill-row">${items.map(([href, label]) => `<a class="pill" href="${href}">${esc(label)}</a>`).join("")}</div>`;
}

function courseCard(course, prefix = "/") {
  const tags = courseTags(course).map((tag) => `<span class="badge">${esc(tag)}</span>`).join("");
  const facts = [
    ["Sted", `${course.city}${course.county ? `, ${course.county}` : ""}`],
    ["Hull", course.holes ?? "Ukjent"],
    ["Vanskelighetsgrad", course.difficulty || "Ukjent"],
    ["Passer for", course.good_for.join(", ")]
  ].filter(([, value]) => value !== "" && value !== null && value !== undefined);

  return `<article class="course-card" data-course-card data-city="${attr(course.city)}" data-county="${attr(course.county)}" data-holes="${attr(course.holes ?? "")}" data-beginner="${course.beginner_friendly === true ? "true" : "false"}" data-family="${course.family_friendly === true ? "true" : "false"}" data-difficulty="${attr(course.difficulty || "Ukjent")}">
    <div class="product-card__top"><p class="eyebrow">${esc(course.city)}</p><span class="badge">${course.holes ? `${course.holes} hull` : "Hull ukjent"}</span></div>
    <h3>${esc(course.name)}</h3>
    <p>${esc(course.short_description)}</p>
    <dl class="product-facts">${facts.map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join("")}</dl>
    <div class="pill-row">${tags}</div>
    <div class="actions course-actions"><a class="button" href="${prefix}${coursePath(course)}">Les baneprofil</a>${course.udisc_url ? `<a class="button button-dark" href="${esc(course.udisc_url)}">Sjekk baneinfo</a>` : ""}</div>
  </article>`;
}

function sourcesList(urls) {
  return urls.map((url) => `<li><a href="${esc(url)}">${esc(url.replace(/^https?:\/\//, ""))}</a></li>`).join("");
}

function schemas(page) {
  const items = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: page.h1,
      description: page.description,
      image: `${baseUrl}/assets/hero-banner.svg`,
      datePublished: updatedIso,
      dateModified: updatedIso,
      inLanguage: "nb-NO",
      mainEntityOfPage: `${baseUrl}/${page.path}`,
      author: { "@type": "Organization", name: "Diskgolfutstyr" },
      publisher: { "@type": "Organization", name: "Diskgolfutstyr", logo: { "@type": "ImageObject", url: `${baseUrl}/assets/logo-icon.svg` } }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: page.breadcrumb.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: `${baseUrl}/${item.path}` }))
    }
  ];

  if (page.itemList?.length) {
    items.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: page.itemList.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: `${baseUrl}/${coursePath(item)}`
      }))
    });
  }

  if (page.faq?.length) {
    items.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faq.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } }))
    });
  }

  return JSON.stringify(items);
}

function pageShell({ path, title, description, h1, eyebrow, intro, body, faq = [], itemList = [], breadcrumb = [] }) {
  const normalized = slugPath(path);
  const crumbs = breadcrumb.length ? breadcrumb : [{ name: "Diskgolfutstyr", path: "" }, { name: h1, path: normalized }];
  return `<!doctype html>
<html lang="no">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${attr(description)}">
  <meta name="robots" content="index, follow">
  <meta property="og:title" content="${attr(h1)}">
  <meta property="og:description" content="${attr(description)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${baseUrl}/${normalized}">
  <meta property="og:image" content="${baseUrl}/assets/hero-banner.svg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${attr(h1)}">
  <meta name="twitter:description" content="${attr(description)}">
  <meta name="twitter:image" content="${baseUrl}/assets/hero-banner.svg">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="canonical" href="${baseUrl}/${normalized}">
  <link rel="stylesheet" href="/assets/css/styles.css">
  <script src="/assets/js/site.js" defer></script>
  <script type="application/ld+json" data-managed-seo>${schemas({ path: normalized, h1, description, faq, itemList, breadcrumb: crumbs })}</script>
</head>
<body>
${nav("/")}
  <main>
    <section class="page-hero"><div class="container"><p class="eyebrow">${esc(eyebrow)}</p><h1>${esc(h1)}</h1><p class="lead">${esc(intro)}</p><div class="article-meta"><span>Oppdatert: ${updatedDisplay}</span><span>Kildebasert baneinfo</span><span>Statisk side</span></div></div></section>
    <section class="section"><div class="container content-flow">
      <p class="update-note">${courseNotice}</p>
      ${body}
      ${faq.length ? `<section id="faq"><h2>Ofte stilte spørsmål</h2>${faq.map((item) => `<h3>${esc(item.q)}</h3><p>${esc(item.a)}</p>`).join("")}</section>` : ""}
    </div></section>
  </main>
${footer("/")}
</body>
</html>`;
}

function cityCourses(cityPage) {
  const aliases = cityPage.aliases || [cityPage.city];
  return courses.filter((course) => aliases.includes(course.city) || aliases.includes(course.municipality));
}

function relatedGuides() {
  return pills([
    ["/guider/hvordan-begynne-med-discgolf.html", "Hvordan begynne med discgolf"],
    ["/guider/slik-spiller-du-forste-runde.html", "Slik spiller du første runde"],
    ["/guider/discgolf-regler-for-nybegynnere.html", "Regler for nybegynnere"],
    ["/guider/discgolf-etikette.html", "Discgolf etikette"],
    ["/guider/hva-trenger-du-av-discgolfutstyr.html", "Hva trenger du av utstyr?"],
    ["/utstyr/beste-discgolfdisker-for-nybegynnere.html", "Beste disker for nybegynnere"]
  ]);
}

function writePage(path, html) {
  mkdirSync(path, { recursive: true });
  writeFileSync(`${path}/index.html`, html, "utf8");
}

mkdirSync("data/courses", { recursive: true });
writeFileSync("data/courses/norway.json", JSON.stringify(courses, null, 2), "utf8");

const popularCities = cityPages.slice(0, 9);
const beginnerCourses = courses.filter((course) => course.beginner_friendly === true);
const eighteenHoleCourses = courses.filter((course) => Number(course.holes) >= 18);
const familyCourses = courses.filter((course) => course.family_friendly === true);

writePage("baner", pageShell({
  path: "baner/",
  title: "Discgolfbaner i Norge - finn bane, byguider og nybegynnertips",
  description: "Finn discgolfbaner i Norge med byguider, nybegynnervennlige alternativer, 18-hullsbaner, kilder og tips før første runde.",
  h1: "Discgolfbaner i Norge",
  eyebrow: "Baner",
  intro: "En kildebasert inngang til norske discgolfbaner. Første versjon prioriterer byer, nybegynnervennlige valg og baner med nok åpen informasjon til å lage ryddige statiske sider.",
  itemList: courses,
  breadcrumb: [{ name: "Diskgolfutstyr", path: "" }, { name: "Baner", path: "baner/" }],
  faq: [
    { q: "Hvor finner jeg discgolfbaner i Norge?", a: "Start med en byside eller filtrer banekortene. Sjekk alltid oppdatert informasjon hos UDisc, klubb eller arrangør før du drar." },
    { q: "Hvordan vet jeg om en bane passer for nybegynnere?", a: "Se etter korte hull, lett vanskelighetsgrad, oversiktlige fairwayer og lav risiko for å miste disk. Diskgolfutstyr bruker forsiktige formuleringer når vurderingen er basert på åpne kilder." },
    { q: "Hva bør jeg ha med på banen?", a: "Start med putter eller midrange, vann, sko etter føre, håndkle og gjerne en telefon med oppdatert banekart." },
    { q: "Hvor lang tid tar en runde?", a: "Korte 6-9 hull kan ta under en time. 18 hull kan ofte ta 1,5-2,5 timer, avhengig av bane, nivå og kø." },
    { q: "Er banene åpne hele året?", a: "Noen baner er sesongbaserte eller påvirkes av snø, vedlikehold og arrangementer. Sjekk alltid kilde tett på runden." }
  ],
  body: `<section><h2>Populære byer</h2><div class="grid">${popularCities.map((city) => `<article class="guide-card"><p class="eyebrow">Lokal guide</p><h3>Discgolf ${esc(city.city)}</h3><p>${esc(city.description)}</p><a href="/baner/${city.slug}/">Se byguide</a></article>`).join("")}</div></section>
  <section><h2>Nybegynnervennlige baner</h2><p class="muted narrow">Disse banene virker egnet for nye spillere basert på åpne kilder. Vurderingen er forsiktig, og lokale forhold kan endre seg.</p><div class="course-grid">${beginnerCourses.slice(0, 8).map((course) => courseCard(course)).join("")}</div><p><a class="button" href="/baner/nybegynnervennlige/">Se alle nybegynnervennlige alternativer</a></p></section>
  <section><h2>18-hullsbaner</h2><p class="muted narrow">18 hull passer når du vil spille en full runde. Nye spillere bør sjekke lengde, terreng og tidsbruk først.</p><div class="course-grid">${eighteenHoleCourses.slice(0, 8).map((course) => courseCard(course)).join("")}</div><p><a class="button" href="/baner/18-hull/">Se 18-hullsbaner</a></p></section>
  <section><h2>Familievennlige alternativer</h2><p class="muted narrow">Familievennlig betyr her korte/lavterskel baner der tilgjengelig informasjon tyder på enklere runder. Sjekk alltid lokale forhold.</p><div class="course-grid">${familyCourses.slice(0, 6).map((course) => courseCard(course)).join("")}</div><p><a class="button" href="/baner/familievennlige/">Se familievennlige alternativer</a></p></section>
  <section><h2>Finn bane med enkel filtrering</h2><div class="course-filter" data-course-filter><label>By <select data-filter-city><option value="">Alle byer</option>${[...new Set(courses.map((course) => course.city))].sort((a, b) => a.localeCompare(b, "nb")).map((city) => `<option value="${esc(city)}">${esc(city)}</option>`).join("")}</select></label><label>Fylke <select data-filter-county><option value="">Alle fylker</option>${[...new Set(courses.map((course) => course.county))].sort((a, b) => a.localeCompare(b, "nb")).map((county) => `<option value="${esc(county)}">${esc(county)}</option>`).join("")}</select></label><label>Hull <select data-filter-holes><option value="">Alle</option><option value="18">18+ hull</option><option value="short">Under 18 hull</option></select></label><label class="check-filter"><input type="checkbox" data-filter-beginner> Nybegynnervennlig</label><label class="check-filter"><input type="checkbox" data-filter-family> Familievennlig</label></div><p class="muted" data-filter-count>${courses.length} baner vises.</p><div class="course-grid">${courses.map((course) => courseCard(course)).join("")}</div></section>
  <section><h2>Tips før første runde</h2><ul><li>Velg en kort eller lett bane først.</li><li>Ta med én putter eller midrange hvis du er helt ny.</li><li>Les lokale regler for parkering, ukesgolf og arrangementer.</li><li>Vis hensyn til turgåere, skiløyper, skoleområder og andre brukere.</li><li>Sjekk banestatus før du drar, spesielt vinter, vår og etter kraftig regn.</li></ul>${relatedGuides()}</section>
  <section><h2>Kilder</h2><ul class="source-list"><li><a href="https://udisc.com/places/norway">UDisc Norge</a> - baneoversikt og bysider</li><li><a href="https://www.pdga.com/course-directory/advanced/search/home.html">PDGA Course Directory</a> - kurskatalog</li><li><a href="https://amerikanskeidretter.no/">NAIF Amerikanske Idretter</a> - norsk disksport og konkurransekontekst</li></ul></section>`
}));

for (const city of cityPages) {
  const items = cityCourses(city);
  writePage(`baner/${city.slug}`, pageShell({
    path: `baner/${city.slug}/`,
    title: city.title,
    description: city.description,
    h1: `Discgolf i ${city.city}`,
    eyebrow: "Lokal baneguide",
    intro: city.intro,
    itemList: items,
    breadcrumb: [{ name: "Diskgolfutstyr", path: "" }, { name: "Baner", path: "baner/" }, { name: `Discgolf ${city.city}`, path: `baner/${city.slug}/` }],
    faq: [
      { q: `Hvor kan man spille discgolf i ${city.city}?`, a: items.length ? `Start med banene i listen på denne siden. De er valgt fordi de har åpen kildeinformasjon som kan kontrolleres manuelt.` : `Sjekk UDisc, lokale klubber og arrangører for oppdatert informasjon om discgolf i ${city.city}.` },
      { q: `Finnes det nybegynnervennlige baner i ${city.city}?`, a: items.some((course) => course.beginner_friendly === true) ? "Ja, noen alternativer er merket som nybegynnervennlige basert på tilgjengelige kilder. Sjekk likevel layout og status før du drar." : "Vi har ikke nok kildegrunnlag til å merke en konkret bane som nybegynnervennlig her ennå." },
      { q: "Trenger man eget utstyr for å spille?", a: "Du kan ofte starte med én egen eller lånt disk. Putter eller midrange er tryggest for helt nye spillere." },
      { q: "Er discgolf gratis?", a: "Mange norske baner er gratis, men enkelte kan ha greenfee, frivillig betaling, booking eller sesongregler. Sjekk kilden for banen." },
      { q: "Hvor finner jeg oppdatert baneinformasjon?", a: "Bruk lenkene til UDisc, klubbside eller annen kilde på banekortene. Diskgolfutstyr er en statisk guide og oppdateres manuelt." }
    ],
    body: `<section><h2>Aktuelle baner å vurdere</h2>${items.length ? `<div class="course-grid">${items.map((course) => courseCard(course)).join("")}</div>` : `<p class="notice">Vi har ikke nok verifisert banedata til å liste konkrete baner her ennå. Siden beholdes som lokal SEO-struktur og oppdateres når kilder er kontrollert.</p>`}</section>
    <section><h2>Tips til nye spillere i ${esc(city.city)}</h2><ul><li>Start med den korteste eller letteste banen i området.</li><li>Sjekk om banen ligger i skoleområde, park, skianlegg eller flerbruksområde.</li><li>Unngå travle tidspunkt hvis du er helt ny og vil bruke god tid.</li><li>Ta med håndkle, vann og disk du tåler å miste.</li></ul>${relatedGuides()}</section>
    <section><h2>Kilder</h2><ul class="source-list">${sourcesList([...new Set(items.flatMap((course) => course.source_urls))])}</ul></section>`
  }));
}

const topicPages = [
  {
    slug: "nybegynnervennlige",
    title: "Nybegynnervennlige discgolfbaner i Norge",
    description: "Finn discgolfbaner som kan passe for nybegynnere, og lær hva som gjør en bane tryggere å starte på.",
    h1: "Nybegynnervennlige discgolfbaner",
    intro: "En nybegynnervennlig bane er ikke nødvendigvis den peneste eller mest kjente banen. Den bør være oversiktlig, kort nok og gi lav risiko for å miste disker.",
    items: beginnerCourses,
    bodyIntro: "<p>Vi bruker forsiktige formuleringer fordi baneforhold kan endre seg. En bane kan være enkel på papiret, men vanskelig i vind, høyt gress eller dårlig merking.</p><ul><li>Korte og oversiktlige hull</li><li>Lite tett skog og lite vann</li><li>Lett å finne fram</li><li>Gode tee-skilt eller tydelig kart</li><li>Mulighet for korte kast</li></ul>"
  },
  {
    slug: "18-hull",
    title: "18-hulls discgolfbaner i Norge",
    description: "Oversikt over 18-hullsbaner i første statiske banepakke, med kildebasert informasjon og tips før runden.",
    h1: "18-hulls discgolfbaner",
    intro: "18 hull gir en full runde, men krever mer tid, energi og kontroll. Sjekk lengde, terreng og status før du drar.",
    items: eighteenHoleCourses,
    bodyIntro: "<p>For nye spillere kan 18 hull være mye første gang. Ta pauser, spill rolig og vurder å starte med front nine hvis banen og layouten gjør det mulig.</p>"
  },
  {
    slug: "familievennlige",
    title: "Familievennlige discgolfbaner i Norge",
    description: "Finn korte og lavterskel discgolfbaner som kan passe familier, barn og helt nye spillere.",
    h1: "Familievennlige discgolfbaner",
    intro: "Familievennlig brukes forsiktig: korte hull og lav vanskelighetsgrad hjelper, men sikkerhet, andre brukere og lokalt føre må alltid vurderes.",
    items: familyCourses,
    bodyIntro: "<p>Se etter korte runder, lite vann, oversiktlige kastelinjer og trygg avstand til lekeplasser, veier og gangstier. Barn bør spille sammen med voksne som følger med på sikkerhet.</p>"
  }
];

for (const topic of topicPages) {
  writePage(`baner/${topic.slug}`, pageShell({
    path: `baner/${topic.slug}/`,
    title: topic.title,
    description: topic.description,
    h1: topic.h1,
    eyebrow: "Banevalg",
    intro: topic.intro,
    itemList: topic.items,
    breadcrumb: [{ name: "Diskgolfutstyr", path: "" }, { name: "Baner", path: "baner/" }, { name: topic.h1, path: `baner/${topic.slug}/` }],
    faq: [
      { q: "Kan jeg stole på at listen alltid er oppdatert?", a: "Nei. Diskgolfutstyr er statisk og oppdateres manuelt. Bruk listen som startpunkt og sjekk alltid baneinfo hos kilde før du drar." },
      { q: "Hva er viktigst for nye spillere?", a: "Korte hull, tydelig retning, lav risiko for å miste disk og mulighet til å spille i rolig tempo." }
    ],
    body: `<section><h2>Hva betyr denne kategorien?</h2>${topic.bodyIntro}</section><section><h2>Baner å vurdere</h2><div class="course-grid">${topic.items.map((course) => courseCard(course)).join("")}</div></section><section><h2>Relevante guider</h2>${relatedGuides()}</section><section><h2>Kilder</h2><ul class="source-list">${sourcesList([...new Set(topic.items.flatMap((course) => course.source_urls))])}</ul></section>`
  }));
}

for (const course of courses) {
  const nearby = courses.filter((item) => item.id !== course.id && (item.city === course.city || item.county === course.county)).slice(0, 3);
  writePage(`baner/${course.slug}`, pageShell({
    path: coursePath(course),
    title: `${course.name} - baneprofil, sted og tips`,
    description: `Kildebasert baneprofil for ${course.name}: sted, hull, vanskelighetsgrad, hvem banen kan passe for og lenker til oppdatert informasjon.`,
    h1: course.name,
    eyebrow: "Baneprofil",
    intro: course.short_description,
    itemList: nearby,
    breadcrumb: [{ name: "Diskgolfutstyr", path: "" }, { name: "Baner", path: "baner/" }, { name: course.name, path: coursePath(course) }],
    faq: [
      { q: `Hvor ligger ${course.name}?`, a: `${course.name} ligger i ${course.city}, ${course.county}. Sjekk kart- eller banekilde for nøyaktig plassering før du drar.` },
      { q: `Hvor mange hull har ${course.name}?`, a: course.holes ? `Åpne kilder viser ${course.holes} hull per ${updatedDisplay}. Dette kan endre seg ved nye layouter.` : "Antall hull er ikke verifisert i denne versjonen." },
      { q: "Passer banen for nybegynnere?", a: course.beginner_friendly === true ? "Banen virker nybegynnervennlig basert på tilgjengelig informasjon, men sjekk alltid terreng, skilting og status før du drar." : "Denne banen er ikke merket som tydelig nybegynnervennlig i Diskgolfutstyrs første datapakke. Nye spillere bør lese kilde og vurdere en kortere/lavere vanskelighetsgrad først." }
    ],
    body: `<section><h2>Kort fakta</h2><table class="comparison"><tbody><tr><th>Sted</th><td>${esc(course.city)}, ${esc(course.county)}</td></tr><tr><th>Hull</th><td>${esc(course.holes ?? "Ukjent")}</td></tr><tr><th>Vanskelighetsgrad</th><td>${esc(course.difficulty || "Ukjent")}</td></tr><tr><th>Banetype</th><td>${esc(course.course_type || "Ukjent")}</td></tr><tr><th>Terreng</th><td>${esc(course.terrain || "Ukjent")}</td></tr><tr><th>Passer for</th><td>${esc(course.good_for.join(", "))}</td></tr></tbody></table></section>
    <section><h2>Vurdering for nye spillere</h2><p>${course.beginner_friendly === true ? "Dette kan være et aktuelt nybegynneralternativ, særlig hvis du spiller rolig og bruker putter eller midrange først." : "Helt nye spillere bør vurdere en kortere eller tydelig nybegynnervennlig bane først, særlig hvis denne banen har lengde, kupering eller tekniske hull."}</p></section>
    <section><h2>Tips før du spiller banen</h2><ul><li>Sjekk oppdatert status, layout og eventuelle arrangementer.</li><li>Ta med sko etter føre og et håndkle til våte disker.</li><li>Spill med kontroll før lengde, spesielt på ukjente hull.</li><li>Vis hensyn til turgåere, skoleområder, idrettsanlegg og andre brukere.</li></ul><div class="actions">${course.udisc_url ? `<a class="button" href="${esc(course.udisc_url)}">Se baneinfo</a>` : ""}${course.map_url ? `<a class="button button-dark" href="${esc(course.map_url)}">Åpne kart</a>` : ""}${course.club_url ? `<a class="button button-dark" href="${esc(course.club_url)}">Se klubbside</a>` : ""}</div></section>
    ${nearby.length ? `<section><h2>Relaterte baner</h2><div class="course-grid">${nearby.map((item) => courseCard(item)).join("")}</div></section>` : ""}
    <section><h2>Relaterte guider</h2>${relatedGuides()}</section>
    <section><h2>Kilder</h2><ul class="source-list">${sourcesList(course.source_urls)}</ul><p class="muted">Sist kontrollert: ${updatedDisplay}. ${esc(course.notes)}</p></section>`
  }));
}

writeFileSync("baneguide.html", `<!doctype html>
<html lang="no">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Baneguide for discgolf i Norge | Diskgolfutstyr</title>
  <meta name="description" content="Diskgolfutstyrs baneseksjon er flyttet til en ny statisk hub for norske discgolfbaner, byguider og nybegynnervennlige baner.">
  <meta name="robots" content="index, follow">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="canonical" href="${baseUrl}/baner/">
  <link rel="stylesheet" href="assets/css/styles.css">
  <script src="assets/js/site.js" defer></script>
</head>
<body>
${nav("")}
  <main>
    <section class="page-hero"><div class="container"><p class="eyebrow">Baner</p><h1>Baneguide for discgolf i Norge</h1><p class="lead">Baneseksjonen er bygget ut med nye bysider, kategori-sider og baneprofiler.</p><div class="actions"><a class="button" href="/baner/">Gå til discgolfbaner i Norge</a><a class="button button-dark" href="/baner/nybegynnervennlige/">Se nybegynnervennlige baner</a></div></div></section>
  </main>
${footer("")}
</body>
</html>`, "utf8");

const sitemapPath = "sitemap.xml";
const existingSitemap = readFileSync(sitemapPath, "utf8");
const existing = [...existingSitemap.matchAll(/<loc>https:\/\/diskgolfutstyr\.no\/(.*?)<\/loc>/g)].map((match) => match[1]);
const newPaths = [
  "baner/",
  ...cityPages.map((city) => `baner/${city.slug}/`),
  ...topicPages.map((topic) => `baner/${topic.slug}/`),
  ...courses.map((course) => coursePath(course)),
  "baneguide.html"
];
const next = Array.from(new Set([...existing.filter((path) => path !== "baneguide.html"), ...newPaths])).sort((a, b) => a.localeCompare(b, "nb"));
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${next.map((path) => `  <url><loc>${baseUrl}/${path}</loc><lastmod>${updatedIso}</lastmod></url>`).join("\n")}\n</urlset>\n`;
writeFileSync(sitemapPath, sitemap, "utf8");

console.log(JSON.stringify({ courses: courses.length, cityPages: cityPages.length, topicPages: topicPages.length, coursePages: courses.length, sitemapUrls: next.length }, null, 2));
