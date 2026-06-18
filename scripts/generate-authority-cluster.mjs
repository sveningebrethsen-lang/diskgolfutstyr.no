import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const baseUrl = "https://diskgolfutstyr.no";
const updatedIso = "2026-06-03";
const updatedDisplay = "3. juni 2026";
const statusNotice = "Dette er en statisk, kildebasert side. Informasjon om klubber, turneringer og baner kan endre seg. Sjekk alltid offisiell kilde før du melder deg på, møter opp eller planlegger reise.";

const clubs = [
  {
    id: "stovner-frisbeeklubb",
    name: "Stovner Frisbeeklubb",
    slug: "stovner-frisbeeklubb",
    city: "Oslo",
    municipality: "Oslo",
    county: "Oslo",
    website_url: "https://www.stovnerfrisbee.no/",
    facebook_url: "",
    instagram_url: "",
    contact_url: "https://www.stovnerfrisbee.no/",
    associated_courses: ["Stovner Discgolfpark"],
    short_description: "Oslo-klubb med aktivitet knyttet til Stovner-miljøet og lokale arrangementer.",
    source_urls: ["https://www.stovnerfrisbee.no/"],
    last_checked: updatedIso,
    notes: "Ikke et samarbeid. Bruk klubbens egen side for oppdatert informasjon."
  },
  {
    id: "muselunden-frisbeeklubb",
    name: "Muselunden Frisbeeklubb",
    slug: "muselunden-frisbeeklubb",
    city: "Oslo",
    municipality: "Oslo",
    county: "Oslo",
    website_url: "https://muselunden.idrettenonline.no/next/page/hjem",
    facebook_url: "",
    instagram_url: "",
    contact_url: "https://muselunden.no/kontakt-1",
    associated_courses: ["Muselunden DiscGolfPark"],
    short_description: "Oslo-klubb knyttet til Muselunden-miljøet. God kandidat for lokale rettelser og baneinfo senere.",
    source_urls: ["https://muselunden.idrettenonline.no/next/page/hjem", "https://muselunden.no/kontakt-1"],
    last_checked: updatedIso,
    notes: "Kontaktinfo bør sjekkes på klubbens side før bruk."
  },
  {
    id: "ekeberg-sendeplateklubb",
    name: "Ekeberg Sendeplateklubb",
    slug: "ekeberg-sendeplateklubb",
    city: "Oslo",
    municipality: "Oslo",
    county: "Oslo",
    website_url: "https://ekebergsk.com/",
    facebook_url: "",
    instagram_url: "",
    contact_url: "https://ekebergsk.com/",
    associated_courses: ["Ekeberg Frisbeegolfbane", "Krokhol Disc Golf Course"],
    short_description: "Oslo-basert disksportklubb som er relevant for Ekeberg og Krokhol-kontekst.",
    source_urls: ["https://ekebergsk.com/krokhol/"],
    last_checked: updatedIso,
    notes: "Kilden omtaler Krokhol-etableringen. Ikke påstå samarbeid med Diskgolfutstyr."
  },
  {
    id: "trondheim-frisbeeklubb",
    name: "Trondheim Frisbeeklubb",
    slug: "trondheim-frisbeeklubb",
    city: "Trondheim",
    municipality: "Trondheim",
    county: "Trøndelag",
    website_url: "https://www.trondheimfrisbeeklubb.no/",
    facebook_url: "",
    instagram_url: "",
    contact_url: "https://www.trondheimfrisbeeklubb.no/",
    associated_courses: ["Dragvoll Diskgolfarena", "Hallset Diskgolfpark"],
    short_description: "Trondheim-klubb med relevant aktivitet for baner, lokale serier og turneringer i området.",
    source_urls: ["https://www.discgolfscene.com/club/3376/trondheim-frisbeeklubb", "https://www.trondheimfrisbeeklubb.no/"],
    last_checked: updatedIso,
    notes: "Disc Golf Scene viser klubb- og turneringskontekst."
  },
  {
    id: "kristiansand-frisbeegolfklubb",
    name: "Kristiansand Frisbeegolfklubb",
    slug: "kristiansand-frisbeegolfklubb",
    city: "Kristiansand",
    municipality: "Kristiansand",
    county: "Agder",
    website_url: "https://kfgk.no/",
    facebook_url: "https://www.facebook.com/groups/423005157734224",
    instagram_url: "",
    contact_url: "https://kfgk.no/",
    associated_courses: ["Bølgane Frisbeegolfpark"],
    short_description: "Kristiansand-klubb relevant for Bølgane og lokalt discgolfmiljø i Agder.",
    source_urls: ["https://kfgk.no/", "https://kfgk.no/?page_id=2253"],
    last_checked: updatedIso,
    notes: "Klubbens side bør brukes for siste nytt."
  },
  {
    id: "porsgrunn-disksportklubb",
    name: "Porsgrunn Disksportklubb",
    slug: "porsgrunn-disksportklubb",
    city: "Porsgrunn",
    municipality: "Porsgrunn",
    county: "Telemark",
    website_url: "https://www.pdsk.no/",
    facebook_url: "",
    instagram_url: "",
    contact_url: "https://www.pdsk.no/",
    associated_courses: ["Porsgrunn - Heistad", "Porsgrunn - Kjølnes"],
    short_description: "Grenland-klubb med aktivitet rundt Porsgrunn-banene og lavterskel klubbmiljø.",
    source_urls: ["https://www.pdsk.no/", "https://aktivitetsportalenporsgrunn.no/aktivitetstilbyder/porsgrunn-disksportklubb/"],
    last_checked: updatedIso,
    notes: "Aktivitetsportalen og klubbside brukes som kilder."
  },
  {
    id: "baerum-frisbeeklubb",
    name: "Bærum Frisbeeklubb",
    slug: "baerum-frisbeeklubb",
    city: "Bærum",
    municipality: "Bærum",
    county: "Akershus",
    website_url: "https://www.baerumfrisbeeklubb.no/",
    facebook_url: "",
    instagram_url: "",
    contact_url: "https://www.baerumfrisbeeklubb.no/",
    associated_courses: ["Vollen Frisbeegolf"],
    short_description: "Akershus-klubb som er relevant for spillere vest for Oslo.",
    source_urls: ["https://www.baerumfrisbeeklubb.no/"],
    last_checked: updatedIso,
    notes: "Sjekk klubbens side for oppdatert aktivitet."
  }
];

const sourceMap = {
  pdgaRules: ["PDGA Official Rules", "https://www.pdga.com/book/export/html/8371/home/", "offisiell regel- og konkurransemanual"],
  pdga: ["PDGA", "https://www.pdga.com/", "offisiell internasjonal organisasjon"],
  dgsNorway: ["Disc Golf Scene Norge", "https://www.discgolfscene.com/tournaments/Norway", "turneringsoversikt, bruk offisiell side for datoer"],
  metrix: ["Disc Golf Metrix", "https://discgolfmetrix.com/?locale=no&u=main", "turneringer, scoring og Metrix-rating"],
  naif: ["NAIF Amerikanske Idretter", "https://amerikanskeidretter.no/", "norsk forbundskontekst"],
  udiscNorway: ["UDisc Norge", "https://udisc.com/places/norway", "baner og lokale miljøer"],
  clubs: ["Klubbdata", "/data/clubs/norway.json", "statisk kildebank for Diskgolfutstyr"]
};

function esc(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function attr(value) {
  return esc(value).replaceAll("\n", " ");
}

function nav(prefix = "/") {
  return `<header class="site-header"><div class="nav-wrap"><a class="brand" href="${prefix}index.html"><img src="${prefix}assets/logo-full.svg" alt="Diskgolfutstyr"></a><button class="menu-button" type="button" aria-label="Åpne meny" aria-expanded="false" data-menu-button>☰</button><nav class="nav" aria-label="Hovedmeny" data-nav><a href="${prefix}nybegynnerguide.html">Nybegynner</a><a href="${prefix}artikler.html">Guider</a><a href="${prefix}utstyr/">Utstyr</a><a href="${prefix}baner/">Baner</a><a href="${prefix}klubber/">Klubber</a><a href="${prefix}turneringer/">Turneringer</a><a href="${prefix}om.html">Om</a></nav></div></header>`;
}

function footer(prefix = "/") {
  return `<footer class="site-footer"><div class="footer-inner"><div class="footer-brand"><img src="${prefix}assets/logo-light.svg" alt="Diskgolfutstyr"><span>Uavhengig norsk discgolfportal. Guider først, affiliate sekundært, kilder synlig.</span></div><div class="footer-links"><a href="${prefix}baner/">Baner</a><a href="${prefix}klubber/">Klubber</a><a href="${prefix}turneringer/">Turneringer</a><a href="${prefix}teknikk/">Teknikk</a><a href="${prefix}trening/">Trening</a><a href="${prefix}redaksjonelle-retningslinjer/">Retningslinjer</a><a href="${prefix}kontakt/">Kontakt</a><a href="${prefix}personvern/">Personvern</a></div></div></footer>`;
}

function pills(items) {
  return `<div class="pill-row">${items.map(([href, label]) => `<a class="pill" href="${href}">${esc(label)}</a>`).join("")}</div>`;
}

function sources(keysOrUrls) {
  return keysOrUrls.map((key) => {
    const item = sourceMap[key];
    if (item) return `<li><a href="${esc(item[1])}">${esc(item[0])}</a> - ${esc(item[2])}</li>`;
    return `<li><a href="${esc(key)}">${esc(String(key).replace(/^https?:\/\//, ""))}</a></li>`;
  }).join("");
}

function schemas(page) {
  const list = [
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

  if (page.faq?.length) {
    list.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faq.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } }))
    });
  }
  return JSON.stringify(list);
}

function pageShell(page) {
  return `<!doctype html>
<html lang="no">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(page.title)}</title>
  <meta name="description" content="${attr(page.description)}">
  <meta name="robots" content="index, follow">
  <meta property="og:title" content="${attr(page.h1)}">
  <meta property="og:description" content="${attr(page.description)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${baseUrl}/${page.path}">
  <meta property="og:image" content="${baseUrl}/assets/hero-banner.svg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${attr(page.h1)}">
  <meta name="twitter:description" content="${attr(page.description)}">
  <meta name="twitter:image" content="${baseUrl}/assets/hero-banner.svg">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="canonical" href="${baseUrl}/${page.path}">
  <link rel="stylesheet" href="/assets/css/styles.css">
  <script src="/assets/js/site.js" defer></script>
  <script type="application/ld+json" data-managed-seo>${schemas(page)}</script>
</head>
<body>
${nav("/")}
  <main>
    <article>
      <section class="page-hero"><div class="container"><p class="eyebrow">${esc(page.eyebrow)}</p><h1>${esc(page.h1)}</h1><p class="lead">${esc(page.intro)}</p><div class="article-meta"><span>Oppdatert: ${updatedDisplay}</span><span>${esc(page.badge || "Kildebasert")}</span><span>Statisk side</span></div></div></section>
      <section class="section"><div class="container article-layout"><aside class="toc" aria-label="Innholdsfortegnelse"><h2>Innhold</h2><ol>${page.sections.map((section) => `<li><a href="#${section.id}">${esc(section.heading)}</a></li>`).join("")}${page.faq?.length ? `<li><a href="#faq">Ofte stilte spørsmål</a></li>` : ""}</ol></aside><div class="article-body">
        <p class="update-note">${statusNotice}</p>
        ${page.sections.map((section) => `<section id="${section.id}"><h2>${esc(section.heading)}</h2>${section.body}</section>`).join("")}
        ${page.faq?.length ? `<section id="faq"><h2>Ofte stilte spørsmål</h2>${page.faq.map((item) => `<h3>${esc(item.q)}</h3><p>${esc(item.a)}</p>`).join("")}</section>` : ""}
        <section><h2>Les også</h2>${pills(page.related || commonRelated())}</section>
        <section><h2>Kilder</h2><ul class="source-list">${sources(page.sources || [])}</ul></section>
      </div></div></section>
    </article>
  </main>
${footer("/")}
</body>
</html>`;
}

function writePage(path, html) {
  mkdirSync(path, { recursive: true });
  writeFileSync(`${path}/index.html`, html, "utf8");
}

function commonRelated() {
  return [
    ["/nybegynnerguide.html", "Nybegynner"],
    ["/baner/", "Baner"],
    ["/utstyrsguide.html", "Utstyr"],
    ["/guider/discgolf-regler-for-nybegynnere.html", "Regler"],
    ["/kontakt/", "Send tips"]
  ];
}

function clubCard(club) {
  const links = [
    club.website_url ? `<a class="button" href="${esc(club.website_url)}">Se klubbside</a>` : "",
    club.contact_url ? `<a class="button button-dark" href="${esc(club.contact_url)}">Kontakt/info</a>` : ""
  ].filter(Boolean).join("");
  return `<article class="course-card"><div class="product-card__top"><p class="eyebrow">${esc(club.city)}</p><span class="badge">${esc(club.county)}</span></div><h3>${esc(club.name)}</h3><p>${esc(club.short_description)}</p><dl class="product-facts"><div><dt>Sted</dt><dd>${esc(club.city)}</dd></div><div><dt>Tilknyttede baner</dt><dd>${esc(club.associated_courses.join(", ") || "Ikke verifisert")}</dd></div></dl><p class="muted">${esc(club.notes)}</p><div class="actions course-actions">${links}</div></article>`;
}

mkdirSync("data/clubs", { recursive: true });
writeFileSync("data/clubs/norway.json", JSON.stringify(clubs, null, 2), "utf8");

writePage("klubber", pageShell({
  path: "klubber/",
  title: "Discgolfklubber i Norge - finn klubb, miljø og lokale aktiviteter",
  description: "Finn norske discgolfklubber, lær hvorfor klubbmiljø er nyttig, og se hvordan du kan sende inn rettelser til klubbdata.",
  h1: "Discgolfklubber i Norge",
  eyebrow: "Klubber",
  intro: "Klubber er ofte veien inn til ukesgolf, dugnad, turneringer og lokale spillere. Denne første klubbseksjonen er forsiktig og kildebasert.",
  breadcrumb: [{ name: "Diskgolfutstyr", path: "" }, { name: "Klubber", path: "klubber/" }],
  sources: ["clubs", "naif", "dgsNorway"],
  related: [["/baner/", "Discgolfbaner i Norge"], ["/turneringer/", "Turneringer"], ["/guider/hvordan-begynne-med-discgolf.html", "Hvordan begynne"], ["/guider/discgolf-etikette.html", "Etikette"], ["/kontakt/", "Send klubbinfo"]],
  faq: [
    { q: "Må jeg være medlem i klubb for å spille discgolf?", a: "Som regel kan du spille mange baner uten klubbmedlemskap, men klubb kan gi miljø, ukesgolf, opplæring og dugnadsfellesskap." },
    { q: "Er Diskgolfutstyr samarbeidspartner med klubbene?", a: "Nei. Klubbene er listet som kildebasert informasjon, ikke som samarbeidspartnere." },
    { q: "Hvordan retter jeg klubbdata?", a: "Bruk kontaktsiden og send kilde, klubbnavn, område og hva som bør endres." }
  ],
  sections: [
    { id: "hva", heading: "Hva er en discgolfklubb?", body: "<p>En klubb organiserer ofte lokale aktiviteter som ukesgolf, dugnad, trening, turneringer eller sosiale runder. Noen klubber driver baner, andre er mer knyttet til et miljø eller en region.</p>" },
    { id: "hvorfor", heading: "Hvorfor bli med?", body: "<ul><li>Du møter spillere på eget nivå.</li><li>Du får enklere vei inn i ukesgolf og turneringer.</li><li>Du lærer regler, etikette og lokale baneforhold raskere.</li><li>Medlemskap kan støtte banevedlikehold og nye anlegg.</li></ul>" },
    { id: "liste", heading: "Klubber i første datapakke", body: `<div class="course-grid">${clubs.map(clubCard).join("")}</div>` },
    { id: "omrader", heading: "Lokale klubbområder", body: pills([["/klubber/oslo/", "Oslo"], ["/klubber/bergen/", "Bergen"], ["/klubber/trondheim/", "Trondheim"], ["/klubber/stavanger/", "Stavanger/Sandnes"]]) },
    { id: "finn", heading: "Slik finner du klubb", body: "<p>Start med banene du spiller mest, sjekk lokale grupper, se etter ukesgolf i Metrix/UDisc/Disc Golf Scene og spør arrangører eller spillere på banen. Bruk offisielle klubbsider når du trenger kontaktinfo.</p>" }
  ]
}));

const clubCities = [
  { slug: "oslo", title: "Discgolfklubber i Oslo", city: "Oslo", intro: "Oslo har flere aktive miljøer og klubber. Denne siden samler verifiserte klubbpeker uten å påstå samarbeid." },
  { slug: "bergen", title: "Discgolfklubber i Bergen", city: "Bergen", intro: "Bergen-siden er foreløpig en forsiktig lokal klubbguide. Vi har banedata for Bergen, men trenger bedre åpne klubbkilder før konkrete klubber listes." },
  { slug: "trondheim", title: "Discgolfklubber i Trondheim", city: "Trondheim", intro: "Trondheim har en tydelig klubb- og turneringskontekst. Sjekk klubbside og turneringskilder før du møter opp." },
  { slug: "stavanger", title: "Discgolfklubber i Stavanger og Sandnes", city: "Stavanger", aliases: ["Stavanger", "Sandnes"], intro: "Stavanger/Sandnes-siden er en regional inngang. Flere klubbkilder bør verifiseres før datapakken utvides." }
];

for (const city of clubCities) {
  const aliases = city.aliases || [city.city];
  const items = clubs.filter((club) => aliases.includes(club.city));
  writePage(`klubber/${city.slug}`, pageShell({
    path: `klubber/${city.slug}/`,
    title: `${city.title} - klubbmiljø og lokale lenker`,
    description: `Finn klubbmiljø og relevante discgolf-lenker for ${city.title.replace("Discgolfklubber i ", "")}.`,
    h1: city.title,
    eyebrow: "Lokal klubbguide",
    intro: city.intro,
    breadcrumb: [{ name: "Diskgolfutstyr", path: "" }, { name: "Klubber", path: "klubber/" }, { name: city.title, path: `klubber/${city.slug}/` }],
    sources: items.length ? [...new Set(items.flatMap((club) => club.source_urls))] : ["udiscNorway", "dgsNorway"],
    sections: [
      { id: "klubber", heading: "Klubber og miljøer", body: items.length ? `<div class="course-grid">${items.map(clubCard).join("")}</div>` : `<p class="notice">Vi har ikke nok verifisert klubbdata til å liste en konkret klubb her ennå. Siden beholdes fordi mange søker lokalt etter klubb, og oppdateres når åpne kilder er kontrollert.</p>` },
      { id: "finn", heading: "Slik finner du lokalt miljø", body: "<ul><li>Sjekk lokale baner og oppslag om ukesgolf.</li><li>Se etter arrangementer i Metrix eller Disc Golf Scene.</li><li>Spør lokale spillere eller arrangører på banen.</li><li>Send gjerne kilde til Diskgolfutstyr hvis en klubb mangler.</li></ul>" },
      { id: "lenker", heading: "Nyttige lokale steg", body: pills([["/baner/", "Finn bane"], ["/turneringer/", "Turneringer"], ["/guider/slik-spiller-du-forste-runde.html", "Første runde"], ["/kontakt/", "Send rettelse"]]) }
    ]
  }));
}

const tournamentPages = [
  {
    slug: "",
    title: "Turneringer i discgolf - slik kommer du i gang",
    h1: "Turneringer i discgolf",
    description: "Norsk guide til discgolfturneringer: påmelding, PDGA, rating, klasser, utstyr og hvor du finner oppdatert terminliste.",
    intro: "Turneringer kan være alt fra lavterskel ukesgolf til PDGA-sanksjonerte konkurranser. Denne siden forklarer prosessen uten å publisere en falsk terminliste.",
    sections: [
      ["hva", "Hva er en discgolfturnering?", "<p>En turnering er en organisert runde eller flere runder med felles regler, scoreføring og ofte klasser. Noen er åpne lavterskelarrangementer, andre krever påmelding og følger PDGA-regelverk.</p>"],
      ["delta", "Hvem kan delta?", "<p>Mange lokale arrangementer tar imot nye spillere, men krav varierer. Les alltid eventside, divisjoner, betaling, kanselleringsregler og spillerinfo.</p>"],
      ["pamelding", "Påmelding og terminliste", "<p>Bruk offisielle kilder som Disc Golf Scene, Disc Golf Metrix, PDGA og arrangørens egen side. Diskgolfutstyr lenker til kilder, men publiserer ikke kommende datoer uten manuell kontroll.</p>"],
      ["forbered", "Hva bør du ha med?", "<ul><li>Disker du kjenner godt.</li><li>Mini marker hvis arrangementet krever det.</li><li>Vann, mat og klær etter vær.</li><li>Telefon med score/app hvis arrangøren bruker det.</li><li>Regelkunnskap og rolig tempo.</li></ul>"],
      ["videre", "Gå videre", pills([["/turneringer/hvordan-bli-med/", "Hvordan bli med"], ["/turneringer/forste-turnering/", "Første turnering"], ["/turneringer/pdga-rating/", "PDGA-rating"], ["/turneringer/klasser/", "Klasser"], ["/turneringer/terminliste/", "Terminliste-kilder"]])]
    ]
  },
  {
    slug: "hvordan-bli-med",
    title: "Hvordan bli med i discgolfturnering",
    h1: "Hvordan bli med i discgolfturnering",
    description: "Steg-for-steg guide til å finne, forstå og melde seg på en discgolfturnering i Norge.",
    intro: "Start med lavterskelarrangementer, les eventinfo nøye og spør arrangør hvis du er usikker.",
    sections: [
      ["steg", "Steg for steg", "<ol><li>Finn arrangement i Metrix, Disc Golf Scene, PDGA eller klubbkanal.</li><li>Les krav til nivå, klasse, betaling og frister.</li><li>Sjekk om du trenger PDGA-nummer eller klubbmedlemskap.</li><li>Meld deg på via offisiell kanal.</li><li>Les spillerinfo og møt i god tid.</li></ol>"],
      ["feil", "Vanlige feil", "<ul><li>Å melde seg på feil klasse.</li><li>Å ikke lese caddybok eller lokale regler.</li><li>Å møte uten mat, drikke eller klær for været.</li><li>Å tro at turnering bare er for veldig gode spillere.</li></ul>"]
    ]
  },
  {
    slug: "forste-turnering",
    title: "Første discgolfturnering - dette bør du vite",
    h1: "Første discgolfturnering",
    description: "Praktisk guide for nye spillere som skal spille sin første discgolfturnering.",
    intro: "Første turnering handler mest om trygg gjennomføring, regler, tempo og å forstå formatet.",
    sections: [
      ["forvent", "Hva kan du forvente?", "<p>Du spiller i gruppe, fører score, følger regler og tar hensyn til tempo. Det er normalt å være nervøs. Målet første gang bør være å lære formatet.</p>"],
      ["sjekkliste", "Sjekkliste", "<ul><li>Les eventinfo.</li><li>Spill banen på forhånd hvis mulig.</li><li>Ha med få, kjente disker.</li><li>Spør gruppen hvis du er usikker på regel eller scoreføring.</li><li>Vær raus med deg selv.</li></ul>"]
    ]
  },
  {
    slug: "pdga-rating",
    title: "PDGA-rating forklart på norsk",
    h1: "PDGA-rating forklart",
    description: "Forstå hva PDGA-rating er, hva den brukes til og hvorfor nye spillere ikke bør stresse for mye med tallet.",
    intro: "Rating er et tall som forsøker å beskrive prestasjon over tid i PDGA-sanksjonerte runder. Det er nyttig, men ikke hele bildet.",
    sections: [
      ["hva", "Hva betyr rating?", "<p>PDGA-rating brukes i konkurransekontekst og kan påvirke hvilke divisjoner du kan spille. Den oppdateres basert på registrerte runder og PDGA-systemet.</p>"],
      ["ny", "For nye spillere", "<p>Ikke gjør rating til hovedmålet første sesong. Fokuser på regler, trygg putting, kontrollert kast og å fullføre runder uten stress.</p>"],
      ["metrix", "PDGA-rating vs Metrix-rating", "<p>Metrix kan ha eget ratingsystem for runder i plattformen. Det er nyttig lokalt, men er ikke det samme som offisiell PDGA-rating.</p>"]
    ]
  },
  {
    slug: "klasser",
    title: "Klasser og divisjoner i discgolfturneringer",
    h1: "Klasser i discgolfturneringer",
    description: "En enkel forklaring av klasser og divisjoner i discgolf, og hvordan nye spillere bør lese eventinfo.",
    intro: "Klasser handler om nivå, alder, kjønn og om du spiller proff eller amatør. Les alltid arrangørens informasjon.",
    sections: [
      ["grunn", "Grunnprinsipp", "<p>PDGA-arrangementer bruker divisjoner med egne krav. Lokale arrangementer kan ha enklere klasseinndeling. Eventside og arrangør er alltid fasit.</p>"],
      ["valg", "Hvordan velge klasse?", "<ul><li>Les divisjonskrav.</li><li>Se om ratinggrense gjelder.</li><li>Spør arrangør hvis du er ny.</li><li>Velg lavterskel/amatørklasse når du vil lære formatet.</li></ul>"]
    ]
  },
  {
    slug: "terminliste",
    title: "Terminliste for discgolf - hvor finner du oppdaterte turneringer?",
    h1: "Terminliste for discgolf",
    description: "Her finner du sikre kilder til discgolfturneringer i Norge uten at Diskgolfutstyr publiserer uverifiserte datoer.",
    intro: "Turneringsdatoer endrer seg. Derfor peker Diskgolfutstyr til offisielle kilder i stedet for å vedlikeholde en manuell falsk kalender.",
    sections: [
      ["kilder", "Kilder til terminliste", "<ul><li>Disc Golf Scene for mange PDGA- og klubbarrangementer.</li><li>Disc Golf Metrix for live score, klubbserier og lokale arrangementer.</li><li>PDGA event search for sanksjonerte arrangementer.</li><li>NAIF og arrangør/klubb for norsk konkurransekontekst.</li></ul>"],
      ["bruk", "Slik bruker du kildene", "<p>Sjekk dato, bane, klasse, påmeldingsfrist, refund policy, spillerinfo og om arrangementet er fullt. Lagre eventside og følg arrangørens oppdateringer.</p>"]
    ]
  }
];

for (const page of tournamentPages) {
  const path = page.slug ? `turneringer/${page.slug}` : "turneringer";
  writePage(path, pageShell({
    path: `${path}/`,
    title: page.title,
    description: page.description,
    h1: page.h1,
    eyebrow: "Turneringer",
    intro: page.intro,
    breadcrumb: [{ name: "Diskgolfutstyr", path: "" }, { name: "Turneringer", path: "turneringer/" }, ...(page.slug ? [{ name: page.h1, path: `${path}/` }] : [])],
    sources: ["pdgaRules", "dgsNorway", "metrix", "naif"],
    related: [["/guider/discgolf-regler-for-nybegynnere.html", "Regler"], ["/klubber/", "Klubber"], ["/baner/", "Baner"], ["/teknikk/putting-rutine/", "Putting-rutine"], ["/utstyr/discgolf-utstyrsliste.html", "Utstyrsliste"]],
    faq: page.slug ? [] : [
      { q: "Publiserer Diskgolfutstyr kommende turneringer?", a: "Ikke i denne fasen. Vi lenker til offisielle kilder for å unngå utdatert eller feil terminliste." },
      { q: "Kan nybegynnere spille turnering?", a: "Ja, mange arrangementer er åpne for nye spillere, men les alltid krav, klasse og format." }
    ],
    sections: page.sections.map(([id, heading, body]) => ({ id, heading, body }))
  }));
}

const seasonal = [
  ["discgolf-om-varen", "Discgolf om våren", "Vårdiscgolf handler om vått føre, gjørme, skiftende temperatur og baner som åpner gradvis.", ["Bruk sko som tåler vann og gjørme.", "Ta med håndkle til diskene.", "Sjekk banestatus etter snøsmelting.", "Velg kontroll før aggressive driverkast."]],
  ["discgolf-om-sommeren", "Discgolf om sommeren", "Sommeren gir lange dager og mye spill, men også kø, varme, høyt gress og større risiko for å miste disker.", ["Ta med nok vann.", "Bruk spotter i høyt gress.", "Unngå blindkast når parken er travel.", "Velg lyse disker som er lettere å finne."]],
  ["discgolf-om-hosten", "Discgolf om høsten", "Høsten gir vind, vått grep, løv og kortere dager. Planlegg runden litt mer enn om sommeren.", ["Bruk håndkle og eventuelt grepstilbehør.", "Velg disker du lett finner i løv.", "Start tidlig nok før det blir mørkt.", "Vær forsiktig på glatte teepads."]],
  ["discgolf-om-vinteren", "Discgolf om vinteren", "Vinterdiscgolf kan være gøy, men krever ekstra respekt for kulde, is, snø, mørke og sesongstengte baner.", ["Sjekk om banen er åpen.", "Bruk bånd eller synlige disker hvis snøen er dyp.", "Kle deg lagvis.", "Ikke ødelegg skiløyper eller vinteranlegg."]],
  ["vinterdiscgolf", "Vinterdiscgolf", "En praktisk vinterguide for norske forhold, med fokus på sikkerhet, synlighet og banestatus.", ["Spill kortere runder.", "Velg putter/midrange når grepet er dårlig.", "Ta med hodelykt ved lav sol.", "Sjekk lokale regler rundt skiløyper."]],
  ["discgolf-i-regn", "Discgolf i regn", "Regn endrer grep, teepads og risiko. Målet er å spille tryggere, ikke hardere.", ["Ha minst ett tørt håndkle.", "Bruk plast og grep du stoler på.", "Senk tempoet på run-up.", "Vurder å droppe banen hvis teepads er farlige."]],
  ["discgolf-i-vind", "Discgolf i vind", "Vind påvirker stabilitet, høyde og vinkler. Nye spillere bør prioritere lave, kontrollerte kast.", ["Hold kast lavere.", "Bruk mer stabil disk i motvind.", "Ikke overkompenser med for rask driver.", "Øv på putter i vind før turnering."]],
  ["hvordan-unnga-a-miste-disker", "Hvordan unngå å miste disker", "Mange bomkjøp og frustrasjoner starter med mistede disker. Litt planlegging hjelper mye.", ["Merk diskene dine.", "Bruk spotter på blinde hull.", "Velg synlige farger.", "Ikke kast maksimal kraft på ukjente hull."]]
];

for (const [slug, h1, intro, tips] of seasonal) {
  writePage(`guider/${slug}`, pageShell({
    path: `guider/${slug}/`,
    title: `${h1} - praktiske tips for norske forhold`,
    description: `${h1}: konkrete råd om klær, disker, sikkerhet, banestatus og hva nybegynnere bør vite.`,
    h1,
    eyebrow: "Sesongguide",
    intro,
    breadcrumb: [{ name: "Diskgolfutstyr", path: "" }, { name: "Guider", path: "artikler.html" }, { name: h1, path: `guider/${slug}/` }],
    sources: ["pdgaRules", "udiscNorway"],
    related: [["/baner/", "Finn bane"], ["/utstyr/discgolf-utstyrsliste.html", "Utstyrsliste"], ["/guider/slik-spiller-du-forste-runde.html", "Første runde"], ["/teknikk/kast-i-vind/", "Kast i vind"]],
    sections: [
      { id: "kort", heading: "Kort oppsummert", body: `<ul>${tips.map((tip) => `<li>${esc(tip)}</li>`).join("")}</ul>` },
      { id: "utstyr", heading: "Hva bør du ha med?", body: "<p>Start med få disker du kjenner, klær etter forholdene, vann og et håndkle. Ved krevende føre er kontroll viktigere enn mange alternativer.</p>" },
      { id: "nybegynnere", heading: "For nybegynnere", body: "<p>Velg kortere baner, kast roligere og unngå hull der du ikke ser landingsområdet. En trygg runde gir mer læring enn å presse lengde.</p>" },
      { id: "sikkerhet", heading: "Sikkerhet", body: "<p>Ikke kast når folk kan være innen rekkevidde. Vær ekstra forsiktig med blindkast, glatte teepads, skiløyper, turgåere og andre brukere av området.</p>" }
    ]
  }));
}

const techniquePages = [
  ["teknikk", "", "Teknikk i discgolf", "Teknikk i discgolf - backhand, forehand, putting og vind", "Praktisk teknikkhub for discgolf: hyzer, anhyzer, nose angle, brace, forehand-feil, puttingrutine og vindkast.", "Teknikk handler om kontroll, vinkler og gjentakelse. Ikke jag raske resultater; bygg ett element om gangen.", [["/teknikk/hyzer-og-anhyzer/", "Hyzer og anhyzer"], ["/teknikk/nose-angle/", "Nose angle"], ["/teknikk/brace-i-backhand/", "Brace"], ["/teknikk/kast-i-vind/", "Kast i vind"]]],
  ["teknikk", "hyzer-og-anhyzer", "Hyzer og anhyzer", "Hyzer og anhyzer forklart", "Lær forskjellen på hyzer og anhyzer, vanlige feil og enkle øvelser for mer kontroll.", "Vinkelkontroll er grunnleggende for både nybegynnere og viderekomne.", []],
  ["teknikk", "nose-angle", "Nose angle", "Nose angle i discgolf", "Forstå nose angle i discgolf og hvorfor disken ofte stiger, bremser eller faller tidlig.", "Nose angle er en av de vanligste grunnene til at kast mister fart og lengde.", []],
  ["teknikk", "brace-i-backhand", "Brace i backhand", "Brace i backhand", "Praktisk forklaring av brace i backhand med øvelser og vanlige feil.", "Brace handler om å overføre fart kontrollert, ikke bare kaste hardere.", []],
  ["teknikk", "forehand-vanlige-feil", "Vanlige forehand-feil", "Vanlige forehand-feil", "Se vanlige forehand-feil i discgolf og hvordan du trener tryggere release.", "Forehand blir bedre når du rydder opp i grep, håndledd og vinkel før du øker kraft.", []],
  ["teknikk", "putting-rutine", "Putting-rutine", "Putting-rutine i discgolf", "Slik lager du en enkel putting-rutine som holder i trening og turnering.", "En rutine gjør putting mer repeterbart, spesielt når du blir nervøs.", []],
  ["teknikk", "kast-i-vind", "Kast i vind", "Kast i vind", "Lær hvordan vind påvirker discgolfdisker og hvilke justeringer som hjelper.", "Vind straffer høyde, feil vinkel og disker du ikke kjenner.", []],
  ["trening", "", "Discgolf trening", "Discgolf trening - program, putting og drills", "Treningshub for discgolf med enkle programmer, puttingtrening og backhand-/forehand-drills.", "God trening er konkret, repeterbar og ærlig. Du trenger ikke mange disker for å øve bedre.", [["/trening/discgolf-treningsprogram/", "Treningsprogram"], ["/trening/putting-trening/", "Puttingtrening"], ["/trening/backhand-drills/", "Backhand drills"], ["/trening/forehand-drills/", "Forehand drills"]]],
  ["trening", "discgolf-treningsprogram", "Discgolf treningsprogram", "Discgolf treningsprogram", "Et enkelt treningsprogram for discgolfspillere som vil trene jevnere uten å overkomplisere.", "Trening bør starte med mål: putting, kontroll, vinkler eller turneringsforberedelse.", []],
  ["trening", "putting-trening", "Putting-trening", "Putting-trening for discgolf", "Praktiske puttingøvelser for hjemme, bane og turneringstrening.", "Puttingtrening fungerer best når du måler korte økter og bygger rutine.", []],
  ["trening", "backhand-drills", "Backhand drills", "Backhand drills", "Enkle backhand-drills for discgolf med fokus på fotarbeid, release og kontroll.", "Backhand-drills bør være rolige nok til at du faktisk merker hva som skjer.", []],
  ["trening", "forehand-drills", "Forehand drills", "Forehand drills", "Forehand-drills for bedre kontroll, mindre wobble og tryggere vinkel.", "Forehand-trening starter med korte, rene kast før raske drivere.", []]
];

for (const [area, slug, h1, title, description, intro, hubLinks] of techniquePages) {
  const path = slug ? `${area}/${slug}` : area;
  const isHub = !slug;
  writePage(path, pageShell({
    path: `${path}/`,
    title,
    description,
    h1,
    eyebrow: area === "teknikk" ? "Teknikk" : "Trening",
    intro,
    breadcrumb: [{ name: "Diskgolfutstyr", path: "" }, { name: area === "teknikk" ? "Teknikk" : "Trening", path: `${area}/` }, ...(slug ? [{ name: h1, path: `${path}/` }] : [])],
    sources: ["pdgaRules"],
    related: [["/guider/backhand-for-nybegynnere.html", "Backhand for nybegynnere"], ["/guider/forehand-for-nybegynnere.html", "Forehand for nybegynnere"], ["/guider/putting-for-nybegynnere.html", "Putting"], ["/utstyr/beste-discgolfdisker-for-nybegynnere.html", "Diskvalg"], ["/turneringer/", "Turneringer"]],
    sections: isHub ? [
      { id: "start", heading: "Start her", body: `<p>Velg ett tema og tren kortere økter. Teknikk blir bedre når du får repeterbare kast, ikke når du prøver alt på én gang.</p>${pills(hubLinks)}` },
      { id: "plan", heading: "Slik bruker du klyngen", body: "<ul><li>Les forklaring.</li><li>Gjør én øvelse i 10-20 minutter.</li><li>Noter hva som skjedde.</li><li>Lenk tilbake til grunnartiklene hvis noe er uklart.</li></ul>" }
    ] : [
      { id: "forklaring", heading: "Kort forklaring", body: `<p>${esc(intro)}</p>` },
      { id: "ovelser", heading: "Konkrete øvelser", body: "<ul><li>Start med putter eller midrange på korte kast.</li><li>Gjør 10 rolige repetisjoner med samme mål.</li><li>Endre bare én ting om gangen.</li><li>Avslutt når teknikken blir slurvete.</li></ul>" },
      { id: "feil", heading: "Vanlige feil", body: "<ul><li>Å øke kraft før kontroll.</li><li>Å bytte disk for å skjule teknikkfeil.</li><li>Å trene uten mål eller notater.</li><li>Å forvente raske resultater etter én økt.</li></ul>" },
      { id: "neste", heading: "Neste steg", body: "<p>Lenk øvelsen til en faktisk bane eller runde. Målet er ikke perfekt form, men bedre beslutninger og mer repeterbare kast.</p>" }
    ]
  }));
}

const authorityPages = [
  ["redaksjonelle-retningslinjer", "Redaksjonelle retningslinjer", "Redaksjonelle retningslinjer for Diskgolfutstyr", "Slik lager Diskgolfutstyr guider, bruker kilder, merker affiliate og retter feil.", "Diskgolfutstyr er en uavhengig norsk discgolfside under oppbygging. Vi skal være ærlige om kilder, usikkerhet og hva som faktisk er testet.", [
    ["metode", "Hvordan guider lages", "<p>Guider bygges fra åpne kilder, egne redaksjonelle vurderinger og etter hvert egne testnotater. Vi skal ikke fylle sider med generisk tekst bare for å rangere i Google.</p>"],
    ["kilder", "Kilder og rettelser", "<p>Kilder lenkes der fakta kan endre seg. Feil kan sendes via kontaktsiden med kilde og kort forklaring.</p>"],
    ["tester", "Fysisk test vs research", "<p>Fysisk test brukes bare når Diskgolfutstyr faktisk har testet. Research-basert sammenligning merkes tydelig og skal ikke kalles testvinner.</p>"],
    ["affiliate", "Affiliate", "<p>Affiliate-lenker skal merkes med disclosure og `rel=\"sponsored nofollow\"`. Anbefalinger skal være redaksjonelt uavhengige.</p>"],
    ["banedata", "Banedata", "<p>Banedata kontrolleres mot åpne kilder og merkes med sist sjekket dato. Usikre felt skal stå som ukjent.</p>"]
  ]],
  ["kontakt", "Kontakt Diskgolfutstyr", "Kontakt Diskgolfutstyr", "Send tips om baner, klubber, rettelser, produkter eller samarbeid uten skjema og uten backend.", "Diskgolfutstyr bruker ikke kontaktskjema i denne statiske versjonen. Send heller en kort e-post med kilde og hva saken gjelder.", [
    ["send", "Hva kan du sende inn?", "<ul><li>Tips om ny bane.</li><li>Rettelse til banedata.</li><li>Tips om klubb eller turnering.</li><li>Forslag til artikkel.</li><li>Henvendelse fra butikk eller mulig samarbeidspartner.</li></ul>"],
    ["epost", "E-post", "<p><a class=\"button\" href=\"mailto:tips@diskgolfutstyr.no?subject=Tips%20til%20Diskgolfutstyr\">Send tips på e-post</a></p><p class=\"muted\">Hvis e-postadressen ikke er aktiv ennå, bør den opprettes før offentlig lansering.</p>"],
    ["mal", "Hva bør meldingen inneholde?", "<ul><li>Kort emne.</li><li>Hvilken side det gjelder.</li><li>Kilde eller lenke.</li><li>Hva som bør endres.</li><li>Om du ønsker svar.</li></ul>"]
  ]],
  ["personvern", "Personvern", "Personvern for Diskgolfutstyr", "Enkel personvernerklæring for en statisk GitHub Pages-side uten backend, skjema eller database.", "Diskgolfutstyr er statisk i første versjon. Vi samler ikke inn persondata via egne skjemaer eller backend.", [
    ["data", "Hva samles inn?", "<p>Siden har ingen egen database, innlogging eller kontaktskjema. GitHub Pages og nettleseren kan likevel håndtere tekniske logger som vanlige nettsider.</p>"],
    ["analytics", "Analytics", "<p>Analytics kan bli lagt til senere. Hvis det skjer, skal denne siden oppdateres med hvilken tjeneste som brukes og hvordan den fungerer.</p>"],
    ["affiliate", "Affiliate og eksterne lenker", "<p>Noen lenker kan bli annonselenker. Eksterne nettsteder har egne personvernregler og er utenfor Diskgolfutstyrs kontroll.</p>"],
    ["kontakt", "Kontakt", "<p>Hvis du sender e-post til Diskgolfutstyr, behandles informasjonen du selv velger å sende. Ikke send sensitive personopplysninger.</p>"]
  ]]
];

for (const [slug, h1, title, description, intro, sections] of authorityPages) {
  writePage(slug, pageShell({
    path: `${slug}/`,
    title,
    description,
    h1,
    eyebrow: "Om Diskgolfutstyr",
    intro,
    badge: "Redaksjonelt",
    breadcrumb: [{ name: "Diskgolfutstyr", path: "" }, { name: h1, path: `${slug}/` }],
    sources: ["pdgaRules", "clubs"],
    related: [["/om.html", "Om siden"], ["/affiliate-info.html", "Affiliate-info"], ["/kontakt/", "Kontakt"], ["/personvern/", "Personvern"], ["/klubber/", "Klubber"]],
    sections: sections.map(([id, heading, body]) => ({ id, heading, body }))
  }));
}

const sitemapPath = "sitemap.xml";
const existing = [...readFileSync(sitemapPath, "utf8").matchAll(/<loc>https:\/\/diskgolfutstyr\.no\/(.*?)<\/loc>/g)].map((m) => m[1]);
const newPaths = [
  "klubber/",
  ...clubCities.map((city) => `klubber/${city.slug}/`),
  "turneringer/",
  ...tournamentPages.filter((page) => page.slug).map((page) => `turneringer/${page.slug}/`),
  ...seasonal.map(([slug]) => `guider/${slug}/`),
  "teknikk/",
  ...techniquePages.filter(([area, slug]) => area === "teknikk" && slug).map(([, slug]) => `teknikk/${slug}/`),
  "trening/",
  ...techniquePages.filter(([area, slug]) => area === "trening" && slug).map(([, slug]) => `trening/${slug}/`),
  ...authorityPages.map(([slug]) => `${slug}/`)
];
const urls = Array.from(new Set([...existing, ...newPaths])).sort((a, b) => a.localeCompare(b, "nb"));
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((path) => `  <url><loc>${baseUrl}/${path}</loc><lastmod>${updatedIso}</lastmod></url>`).join("\n")}\n</urlset>\n`;
writeFileSync(sitemapPath, sitemap, "utf8");

console.log(JSON.stringify({ clubs: clubs.length, pages: newPaths.length, sitemapUrls: urls.length }, null, 2));
