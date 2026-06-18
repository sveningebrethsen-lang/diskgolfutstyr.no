import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const baseUrl = "https://diskgolfguiden.no";
const updatedIso = "2026-06-03";
const updatedDisplay = "3. juni 2026";
const researchNotice = "Dette er en research-basert sammenligning basert på produsentdata, offentlige spesifikasjoner og spillererfaringer. Produktene er ikke fysisk testet av Diskgolfguiden.";
const affiliateNotice = "Noen lenker kan være annonselenker. Det koster deg ikke noe ekstra, men kan gi Diskgolfguiden en liten provisjon. Anbefalingene skal være redaksjonelt uavhengige.";

const discs = JSON.parse(readFileSync("data/products/discs.json", "utf8"));
const bags = JSON.parse(readFileSync("data/products/bags.json", "utf8"));
const baskets = JSON.parse(readFileSync("data/products/baskets.json", "utf8"));
const accessories = JSON.parse(readFileSync("data/products/accessories.json", "utf8"));

const sourceMap = {
  pdga: ["PDGA", "https://www.pdga.com/", "regler, godkjente disker og offisiell discgolfkontekst"],
  pdgaRules: ["PDGA Official Rules", "https://www.pdga.com/rules", "offisiell regelkilde"],
  innovaCompare: ["Innova Disc Comparison", "https://www.innovadiscs.com/disc-golf-discs/disc-comparison/", "flight numbers og diskroller"],
  innovaStarter: ["Innova Starter Set", "https://www.innovadiscs.com/disc-golf-starter-set/", "eksempel på startsett"],
  latitudeBeginner: ["Latitude 64 Beginner Guide", "https://latitude64.com/disc-golf-beginner-guide", "produsentguide om nybegynnerutstyr"],
  udisc: ["UDisc", "https://udisc.com/", "baner og discgolfkontekst"],
  affiliate: ["Affiliate-info", "/affiliate-info.html", "hvordan Diskgolfguiden merker annonselenker"]
};

function nav(prefix = "/") {
  return `<header class="site-header"><div class="nav-wrap"><a class="brand" href="${prefix}index.html"><img src="${prefix}assets/logo-full.svg" alt="Diskgolfguiden"></a><button class="menu-button" type="button" aria-label="Åpne meny" aria-expanded="false" data-menu-button>☰</button><nav class="nav" aria-label="Hovedmeny" data-nav><a href="${prefix}nybegynnerguide.html">Nybegynner</a><a href="${prefix}artikler.html">Guider</a><a href="${prefix}regler.html">Regler</a><a href="${prefix}utstyr/">Utstyr</a><a href="${prefix}tester.html">Tester</a><a href="${prefix}baneguide.html">Baner</a></nav></div></header>`;
}

function footer(prefix = "/") {
  return `<footer class="site-footer"><div class="footer-inner"><div class="footer-brand"><img src="${prefix}assets/logo-light.svg" alt="Diskgolfguiden"><span>Produktguider med tydelig research-merking. Affiliate sekundært.</span></div><div class="footer-links"><a href="${prefix}utstyr/">Utstyr</a><a href="${prefix}nybegynnerguide.html">Nybegynner</a><a href="${prefix}affiliate-info.html">Affiliate-info</a><a href="${prefix}om.html">Om</a></div></div></footer>`;
}

function esc(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function productCard(product) {
  const flight = product.flight_numbers ? `<p><strong>Flight numbers:</strong> ${esc(product.flight_numbers)}</p>` : "";
  const stability = product.stability ? `<p><strong>Stabilitet:</strong> ${esc(product.stability)}</p>` : "";
  const capacity = product.capacity ? `<p><strong>Kapasitet:</strong> ${esc(product.capacity)}</p>` : "";
  return `<article class="product-card">
    <div class="product-card__top"><p class="eyebrow">${esc(product.type || product.category)}</p><span class="badge badge-research">Research-basert</span></div>
    <h3>${esc(product.name)}</h3>
    <p>${esc(product.description)}</p>
    ${flight}${stability}${capacity}
    <p><strong>Passer for:</strong> ${esc(product.suitable_for)}</p>
    <div class="pros-cons"><div><h4>Fordeler</h4><ul>${product.pros.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div><div><h4>Ulemper</h4><ul>${product.cons.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div></div>
    <p class="muted">Annonselenke kan bli lagt til senere.</p>
    <a class="button button-disabled" href="#" aria-disabled="true">Se produkt</a>
  </article>`;
}

function discTable(items) {
  return `<table class="comparison"><thead><tr><th>Produkt</th><th>Type</th><th>Flight numbers</th><th>Stabilitet</th><th>Passer for</th><th>Kommentar</th></tr></thead><tbody>${items.map((p) => `<tr><td>${esc(p.name)}</td><td>${esc(p.type)}</td><td>${esc(p.flight_numbers || "Ikke oppgitt")}</td><td>${esc(p.stability || "Ikke oppgitt")}</td><td>${esc(p.suitable_for)}</td><td>${esc(p.description)}</td></tr>`).join("")}</tbody></table>`;
}

function bagTable(items) {
  return `<table class="comparison"><thead><tr><th>Produkt</th><th>Kapasitet</th><th>Passer for</th><th>Fordeler</th><th>Ulemper</th></tr></thead><tbody>${items.map((p) => `<tr><td>${esc(p.name)}</td><td>${esc(p.capacity)}</td><td>${esc(p.suitable_for)}</td><td>${esc(p.pros.join(", "))}</td><td>${esc(p.cons.join(", "))}</td></tr>`).join("")}</tbody></table>`;
}

function basketTable(items) {
  return `<table class="comparison"><thead><tr><th>Produkt</th><th>Type</th><th>Portabel</th><th>Passer for</th><th>Kommentar</th></tr></thead><tbody>${items.map((p) => `<tr><td>${esc(p.name)}</td><td>${esc(p.type)}</td><td>${p.portable ? "Ja" : "Ikke oppgitt"}</td><td>${esc(p.suitable_for)}</td><td>${esc(p.description)}</td></tr>`).join("")}</tbody></table>`;
}

function pills(items) {
  return `<div class="pill-row">${items.map(([href, label]) => `<a class="pill" href="${href}">${label}</a>`).join("")}</div>`;
}

function sources(keys, productItems = []) {
  const sourceItems = keys.map((k) => sourceMap[k]).filter(Boolean);
  for (const product of productItems) {
    for (const url of product.source_urls || []) sourceItems.push([product.name, url, "produsentdata"]);
  }
  return sourceItems.map(([name, url, note]) => `<li><a href="${url}">${esc(name)}</a>${note ? ` - ${esc(note)}` : ""}</li>`).join("");
}

function faqHtml(faq) {
  if (!faq?.length) return "";
  return `<section id="faq"><h2>Ofte stilte spørsmål</h2>${faq.map((x) => `<h3>${esc(x.q)}</h3><p>${esc(x.a)}</p>`).join("")}</section>`;
}

function schema(page) {
  const schemas = [
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
      author: { "@type": "Organization", name: "Diskgolfguiden" },
      publisher: { "@type": "Organization", name: "Diskgolfguiden", logo: { "@type": "ImageObject", url: `${baseUrl}/assets/logo-icon.svg` } }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Diskgolfguiden", item: `${baseUrl}/` },
        { "@type": "ListItem", position: 2, name: "Utstyr", item: `${baseUrl}/utstyrsguide.html` },
        { "@type": "ListItem", position: 3, name: page.h1, item: `${baseUrl}/${page.path}` }
      ]
    }
  ];
  if (page.faq?.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faq.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } }))
    });
  }
  return JSON.stringify(schemas);
}

function pageHtml(page) {
  const sections = page.sections.map((section) => `<section id="${section.id}"><h2>${section.heading}</h2>${section.body}</section>`).join("");
  const toc = [...page.sections.map((s) => [s.id, s.heading]), ...(page.faq?.length ? [["faq", "Ofte stilte spørsmål"]] : [])];
  return `<!doctype html>
<html lang="no">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(page.title)}</title>
  <meta name="description" content="${esc(page.description)}">
  <meta name="robots" content="index, follow">
  <meta property="og:title" content="${esc(page.h1)}">
  <meta property="og:description" content="${esc(page.description)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${baseUrl}/${page.path}">
  <meta property="og:image" content="${baseUrl}/assets/hero-banner.svg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(page.h1)}">
  <meta name="twitter:description" content="${esc(page.description)}">
  <meta name="twitter:image" content="${baseUrl}/assets/hero-banner.svg">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="canonical" href="${baseUrl}/${page.path}">
  <link rel="stylesheet" href="/assets/css/styles.css">
  <script src="/assets/js/site.js" defer></script>
  <script type="application/ld+json" data-managed-seo>${schema(page)}</script>
</head>
<body>
${nav("/")}
  <main>
    <article>
      <section class="page-hero"><div class="container"><p class="eyebrow">${esc(page.category)}</p><h1>${esc(page.h1)}</h1><p class="lead">${esc(page.ingress)}</p><div class="article-meta"><span>Oppdatert: ${updatedDisplay}</span><span>Research-basert</span><span>Affiliate-klar</span></div></div></section>
      <section class="section"><div class="container article-layout"><aside class="toc" aria-label="Innholdsfortegnelse"><h2>Innhold</h2><ol>${toc.map(([id, label]) => `<li><a href="#${id}">${esc(label)}</a></li>`).join("")}</ol></aside><div class="article-body">
        <p class="research-note">${researchNotice}</p>
        <p class="disclaimer">${affiliateNotice}</p>
        ${sections}
        ${faqHtml(page.faq)}
        <section><h2>Les også</h2>${pills(page.related)}</section>
        <section><h2>Kilder</h2><ul class="source-list">${sources(page.sources, page.products || [])}</ul></section>
      </div></div></section>
    </article>
  </main>
${footer("/")}
</body>
</html>`;
}

const byId = Object.fromEntries([...discs, ...bags, ...baskets, ...accessories].map((p) => [p.id, p]));
const putters = [byId["innova-dx-aviar"], byId["dynamic-discs-judge"]];
const mids = [byId["discraft-buzzz"], byId["innova-mako3"]];
const fairways = [byId["latitude-64-river"], byId["innova-leopard3"]];
const beginnerDiscs = [...putters, ...mids, ...fairways];

const commonRelated = [
  ["/guider/hvilken-discgolfdisk-skal-jeg-velge.html", "Velg riktig disk"],
  ["/guider/flight-numbers.html", "Flight numbers"],
  ["/guider/putter-midrange-og-driver-forklart.html", "Driver vs midrange vs putter"],
  ["/nybegynnerguide.html", "Nybegynnerhub"]
];

const pages = [
  {
    path: "utstyr/beste-discgolfdisker-for-nybegynnere.html",
    title: "Beste discgolfdisker for nybegynnere - slik velger du riktig",
    h1: "Anbefalte discgolfdisker for nybegynnere",
    category: "Disker",
    description: "Se hvilke typer discgolfdisker som passer best for nybegynnere, hva flight numbers betyr og hvilke feil du bør unngå.",
    ingress: "En god nybegynnerdisk er lett å kontrollere, ikke bare rask på papiret. Her får du research-baserte alternativer og en trygg måte å tenke diskvalg på.",
    products: beginnerDiscs,
    sources: ["pdga", "latitudeBeginner", "innovaCompare"],
    related: [["/guider/hvilken-discgolfdisk-skal-jeg-velge.html", "Hvordan velge disk"], ["/utstyr/discgolf-startsett.html", "Startsett"], ["/guider/flight-numbers.html", "Flight numbers"], ["/guider/hvordan-begynne-med-discgolf.html", "Hvordan begynne"]],
    faq: [
      { q: "Hvor mange disker trenger en nybegynner?", a: "Én til tre disker er nok. Putter og midrange er viktigst, og en fairway-driver kan legges til når du vil prøve mer lengde." },
      { q: "Bør nybegynnere kjøpe driver?", a: "Ja, men start med en rolig fairway-driver. Distance-driver bør vente til du har mer fart og kontroll." },
      { q: "Er startsett verdt det?", a: "Startsett kan være verdt det hvis diskene har tydelige roller og ikke inkluderer en for rask driver." }
    ],
    sections: [
      { id: "kort", heading: "Kort oppsummert", body: "<p>Start med putter og midrange. Legg til fairway-driver når du har kontroll på retning. Vent med distance-driver til du faktisk får nytte av hastigheten.</p>" },
      { id: "tabell", heading: "Rask anbefalingstabell", body: discTable(beginnerDiscs) },
      { id: "produkter", heading: "Produkter å vurdere", body: `<div class="product-grid">${beginnerDiscs.map(productCard).join("")}</div>` },
      { id: "se-etter", heading: "Hva bør en nybegynner se etter?", body: "<p>Se etter lav til moderat speed, forutsigbar stabilitet, godt grep og en rolle du forstår. En disk som flyr rett på rolige kast er ofte mer nyttig enn en disk som lover maksimal lengde.</p>" },
      { id: "feil", heading: "Vanlige feil", body: "<ul><li>Kjøpe for rask driver først.</li><li>Kjøpe mange disker før du kjenner de første.</li><li>Velge bare etter hva proffer bruker.</li><li>Ignorere vekt, grep og lokale baneforhold.</li></ul>" }
    ]
  },
  {
    path: "utstyr/discgolf-startsett.html",
    title: "Beste discgolf startsett - hva bør et startsett inneholde?",
    h1: "Discgolf startsett for nybegynnere",
    category: "Startsett",
    description: "Slik vurderer du discgolf startsett: hvilke disker som bør være med, hva du bør unngå og når enkeltdisker er bedre.",
    ingress: "Et startsett kan være en fin inngang til discgolf, men bare hvis diskene passer nye spillere.",
    products: beginnerDiscs.slice(0, 3),
    sources: ["innovaStarter", "latitudeBeginner", "pdga"],
    related: [["/utstyr/beste-discgolfdisker-for-nybegynnere.html", "Beste disker for nybegynnere"], ["/guider/hva-trenger-du-av-discgolfutstyr.html", "Hva trenger du av utstyr?"], ["/utstyr/hva-koster-det-a-begynne-med-discgolf.html", "Hva koster det?"], ["/guider/hvordan-velge-riktig-putter.html", "Velg putter"]],
    faq: [
      { q: "Hva bør et startsett inneholde?", a: "Et godt startsett bør ha putter, midrange og eventuelt en rolig fairway-driver." },
      { q: "Er billige startsett gode nok?", a: "De kan være gode nok for å prøve sporten, men sjekk at driveren ikke er for rask og at diskene har tydelige roller." },
      { q: "Bør jeg kjøpe enkeltdisker i stedet?", a: "Hvis du får god hjelp i butikk eller klubb, kan enkeltdisker gi et mer tilpasset oppsett." }
    ],
    sections: [
      { id: "kort", heading: "Kort oppsummert", body: "<p>Et startsett bør gjøre sporten enklere, ikke fylle bagen med raske disker du ikke får brukt. Tenk roller: putter, midrange og kontrollert driver.</p>" },
      { id: "tabell", heading: "Hva bør være med?", body: discTable(beginnerDiscs.slice(0, 3)) },
      { id: "enkelt", heading: "Startsett vs enkeltdisker", body: "<p>Startsett er enkelt og ofte rimelig. Enkeltdisker er bedre hvis du allerede vet hva du trenger eller får hjelp av noen med erfaring.</p>" },
      { id: "feil", heading: "Vanlige feil", body: "<p>Den vanligste feilen er å tro at et startsett er best fordi det har en driver. For nybegynnere betyr driverens hastighet mindre enn om disken faktisk kan kontrolleres.</p>" }
    ]
  },
  {
    path: "utstyr/beste-putter-for-nybegynnere.html",
    title: "Beste putter for nybegynnere - gode valg å vurdere",
    h1: "Beste putter for nybegynnere",
    category: "Puttere",
    description: "Research-basert guide til puttere for nybegynnere: grep, plast, stabilitet og populære alternativer å vurdere.",
    ingress: "Putteren brukes mest. Derfor bør den først og fremst føles trygg i hånden.",
    products: putters,
    sources: ["pdga", "innovaCompare", "latitudeBeginner"],
    related: [["/guider/putting-for-nybegynnere.html", "Putting for nybegynnere"], ["/guider/hvordan-velge-riktig-putter.html", "Hvordan velge putter"], ["/guider/flight-numbers.html", "Flight numbers"], ["/utstyr/discgolf-startsett.html", "Startsett"]],
    faq: [
      { q: "Hva er viktigst når jeg velger putter?", a: "Grep og trygg følelse i hånden er viktigere enn små forskjeller i tall." },
      { q: "Bør jeg kjøpe to like puttere?", a: "Det kan være nyttig for puttingtrening, men det er ikke nødvendig første dag." }
    ],
    sections: [
      { id: "se-etter", heading: "Hva bør du se etter?", body: "<p>Velg en putter med godt grep, komfortabel dybde og nøytral flyvning. Baseplast kan være et godt startpunkt fordi den ofte gir godt grep.</p>" },
      { id: "tabell", heading: "Puttere å vurdere", body: discTable(putters) },
      { id: "kort", heading: "Produktkort", body: `<div class="product-grid">${putters.map(productCard).join("")}</div>` },
      { id: "feil", heading: "Vanlige feil", body: "<p>Ikke velg putter bare fordi en proff bruker den. Hendene dine, puttingstilen din og grepet ditt betyr mer.</p>" }
    ]
  },
  {
    path: "utstyr/beste-midrange-for-nybegynnere.html",
    title: "Beste midrange for nybegynnere - rette kast og kontroll",
    h1: "Beste midrange for nybegynnere",
    category: "Midrange",
    description: "Research-basert guide til midrange-disker for nybegynnere, med fokus på rette kast, stabilitet og læring.",
    ingress: "Midrange er ofte den beste disken for å lære discgolf fordi den gir kontroll uten å kreve driverfart.",
    products: mids,
    sources: ["pdga", "innovaCompare", "latitudeBeginner"],
    related: [["/guider/hvordan-velge-riktig-midrange.html", "Hvordan velge midrange"], ["/guider/flight-numbers.html", "Flight numbers"], ["/utstyr/beste-discgolfdisker-for-nybegynnere.html", "Beste disker"], ["/guider/putter-midrange-og-driver-forklart.html", "Disktypene forklart"]],
    faq: [
      { q: "Hvorfor er midrange bra for nybegynnere?", a: "Den krever mindre fart enn driver og viser tydelig om kastet ditt er rent." },
      { q: "Bør midrange være stabil eller understable?", a: "En nøytral midrange er ofte tryggest først. Litt understable kan også være nyttig for rolige kast." }
    ],
    sections: [
      { id: "se-etter", heading: "Hva bør du se etter?", body: "<p>Velg en midrange som kan fly rett på rolig kraft. Unngå veldig overstabile midrange-disker som første valg hvis du vil lære rette kast.</p>" },
      { id: "tabell", heading: "Midrange-disker å vurdere", body: discTable(mids) },
      { id: "kort", heading: "Produktkort", body: `<div class="product-grid">${mids.map(productCard).join("")}</div>` },
      { id: "feil", heading: "Vanlige feil", body: "<p>Ikke bruk midrange bare som mellomting. Bruk den aktivt til å lære vinkel, retning og ren release.</p>" }
    ]
  },
  {
    path: "utstyr/beste-fairway-driver-for-nybegynnere.html",
    title: "Beste fairway driver for nybegynnere - kontroll før fart",
    h1: "Beste fairway driver for nybegynnere",
    category: "Fairway-driver",
    description: "Research-basert guide til fairway-drivere for nybegynnere: lavere speed, mer kontroll og gode alternativer å vurdere.",
    ingress: "Fairway-driver er ofte første driver nye spillere bør prøve. Den gir mer lengde uten samme krav som distance-driver.",
    products: fairways,
    sources: ["pdga", "innovaCompare", "latitudeBeginner"],
    related: [["/guider/hvordan-velge-riktig-driver.html", "Hvordan velge driver"], ["/sammenligninger/fairway-driver-vs-distance-driver.html", "Fairway vs distance"], ["/guider/flight-numbers.html", "Flight numbers"], ["/utstyr/beste-discgolfdisker-for-nybegynnere.html", "Beste disker"]],
    faq: [
      { q: "Når bør jeg kjøpe fairway-driver?", a: "Når du får rimelig kontroll med midrange og vil prøve litt mer lengde." },
      { q: "Hva er forskjellen på fairway og distance?", a: "Fairway-driver har lavere speed og er enklere å kontrollere. Distance-driver krever mer fart." }
    ],
    sections: [
      { id: "se-etter", heading: "Hva bør du se etter?", body: "<p>Se etter moderat speed, forutsigbar avslutning og nok glide. For mange nye spillere er speed rundt fairway-nivå mer nyttig enn raske distance-drivere.</p>" },
      { id: "tabell", heading: "Fairway-drivere å vurdere", body: discTable(fairways) },
      { id: "kort", heading: "Produktkort", body: `<div class="product-grid">${fairways.map(productCard).join("")}</div>` },
      { id: "feil", heading: "Vanlige feil", body: "<p>Ikke kjøp en rask driver for å kompensere for teknikk. Driveren bør gjøre linjene dine mer kontrollerte, ikke bare mer dramatiske.</p>" }
    ]
  },
  {
    path: "utstyr/beste-distance-driver-for-viderekomne.html",
    title: "Beste distance driver for viderekomne - når gir det mening?",
    h1: "Distance driver for viderekomne",
    category: "Distance-driver",
    description: "Research-basert guide til når distance-driver gir mening, og hvorfor nybegynnere ofte bør vente.",
    ingress: "Distance-driver kan gi lengde, men bare når du har nok fart, spinn og kontroll til å få den til å fly riktig.",
    products: [byId["innova-wraith"]],
    sources: ["pdga", "innovaCompare", "latitudeBeginner"],
    related: [["/sammenligninger/fairway-driver-vs-distance-driver.html", "Fairway vs distance"], ["/guider/hvordan-velge-riktig-driver.html", "Hvordan velge driver"], ["/utstyr/beste-fairway-driver-for-nybegynnere.html", "Fairway for nybegynnere"], ["/guider/flight-numbers.html", "Flight numbers"]],
    faq: [
      { q: "Bør nybegynnere bruke distance-driver?", a: "Som regel ikke først. Mange får bedre resultat med midrange eller fairway-driver." },
      { q: "Når bør jeg prøve distance-driver?", a: "Når fairway-driveren flyr kontrollert, og du faktisk trenger mer lengde på åpne hull." }
    ],
    sections: [
      { id: "kort", heading: "Kort oppsummert", body: "<p>Distance-driver er et verktøy for mer fart og lengde, ikke en snarvei rundt teknikk. Vent til du har kontroll med roligere disker.</p>" },
      { id: "tabell", heading: "Eksempel på distance-driver", body: discTable([byId["innova-wraith"]]) },
      { id: "produkt", heading: "Produktkort", body: productCard(byId["innova-wraith"]) },
      { id: "feil", heading: "Vanlige feil", body: "<p>Vanlig feil: kjøpe speed 12-14 fordi den lover lengde. Hvis disken fader tidlig, er den trolig for krevende akkurat nå.</p>" }
    ]
  },
  {
    path: "utstyr/understable-stable-overstable-disker.html",
    title: "Understable, stable og overstable disker forklart",
    h1: "Understable, stable og overstable disker",
    category: "Disktyper",
    description: "Forstå stabilitet i discgolf: understable, stable og overstable disker forklart med praktiske valg for norske spillere.",
    ingress: "Stabilitet forklarer hvordan disken oppfører seg i lufta. Det er et av de viktigste begrepene når du skal velge disk.",
    products: beginnerDiscs,
    sources: ["pdga", "innovaCompare", "latitudeBeginner"],
    related: commonRelated,
    faq: [
      { q: "Hva betyr understable?", a: "En understable disk vender lettere i høy fart og kan være lettkastet for roligere armer." },
      { q: "Hva betyr overstable?", a: "En overstable disk avslutter kraftigere og tåler ofte mer vind, men kan være krevende for nye spillere." }
    ],
    sections: [
      { id: "forklaring", heading: "Kort forklart", body: "<p>Understable disker vender lettere, stable disker flyr mer nøytralt, og overstable disker avslutter tydeligere. For nye spillere er nøytrale eller litt understable disker ofte enklest å bruke.</p>" },
      { id: "tabell", heading: "Eksempler fra produktdata", body: discTable(beginnerDiscs) },
      { id: "kjop", heading: "Hva bør du kjøpe først?", body: "<p>Velg kontroll før spesialdisker. En nøytral midrange og en rolig fairway-driver gir mer læring enn en veldig overstable disk som bare stuper ut til siden.</p>" },
      { id: "vind", heading: "Stabilitet og vind", body: "<p>Motvind gjør at disker oppfører seg mer understable. Medvind kan gjøre dem mer stabile. Derfor trenger du erfaring før du kjøper mange vinddisker.</p>" }
    ]
  },
  {
    path: "utstyr/beste-discgolfbag-for-nybegynnere.html",
    title: "Beste discgolfbag for nybegynnere - hva trenger du?",
    h1: "Discgolfbag for nybegynnere",
    category: "Bag",
    description: "Research-basert guide til discgolfbagger for nybegynnere: vanlig sekk, skulderbag, ryggsekkbag og hva du bør se etter.",
    ingress: "Du trenger ikke stor bag første uke. Men når du spiller oftere, gjør riktig bæreoppsett runden mer praktisk.",
    products: bags,
    sources: ["pdga", "udisc", "affiliate"],
    related: [["/utstyr/discgolf-utstyrsliste.html", "Utstyrsliste"], ["/utstyr/hva-koster-det-a-begynne-med-discgolf.html", "Hva koster det?"], ["/utstyr/billig-discgolfutstyr.html", "Billig utstyr"], ["/utstyr/gave-til-discgolfspiller.html", "Gaveguide"]],
    faq: [
      { q: "Hvor stor bag trenger en nybegynner?", a: "En vanlig sekk eller liten discgolfbag holder ofte. Kjøp større bag først når du faktisk har flere disker og tilbehør." },
      { q: "Holder det med vanlig sekk?", a: "Ja, for første runder holder det fint med vanlig sekk eller å bære få disker i hånden." }
    ],
    sections: [
      { id: "kort", heading: "Kort oppsummert", body: "<p>Start enkelt. En dedikert discgolfbag blir nyttig når du har flere disker, drikke, håndkle og småting du vil organisere.</p>" },
      { id: "tabell", heading: "Bagger å vurdere", body: bagTable(bags) },
      { id: "kort-produkt", heading: "Produktkort", body: `<div class="product-grid">${bags.map(productCard).join("")}</div>` },
      { id: "se-etter", heading: "Hva bør du se etter?", body: "<p>Se etter komfort, stabilitet når bagen står, plass til flaske og nok organisering. Ikke kjøp større enn behovet ditt.</p>" }
    ]
  },
  {
    path: "utstyr/beste-discgolfkurv-til-hagen.html",
    title: "Beste discgolfkurv til hagen - research-basert guide",
    h1: "Discgolfkurv til hagen",
    category: "Kurver",
    description: "Research-basert guide til discgolfkurv for hagebruk og puttingtrening, med fokus på portabilitet, støy og praktisk bruk.",
    ingress: "En hjemmekurv kan gjøre puttingtrening mye enklere, men du bør vurdere støy, plass og hvor lett kurven er å flytte.",
    products: baskets,
    sources: ["pdga", "affiliate"],
    related: [["/guider/putting-for-nybegynnere.html", "Putting for nybegynnere"], ["/utstyr/discgolf-utstyrsliste.html", "Utstyrsliste"], ["/utstyr/gave-til-discgolfspiller.html", "Gaveguide"], ["/affiliate-info.html", "Affiliate-info"]],
    faq: [
      { q: "Er hjemmekurv verdt det?", a: "Hvis du vil trene putting ofte, kan hjemmekurv være nyttig. Hvis du bare spiller av og til, kan du vente." },
      { q: "Bråker discgolfkurver?", a: "Ja, kjeder kan lage lyd. Tenk på naboer og tidspunkt hvis kurven står i hage eller boligområde." }
    ],
    sections: [
      { id: "kort", heading: "Kort oppsummert", body: "<p>Velg kurv etter treningstype, plass og om den må flyttes ofte. Ikke kjøp dyr kurv før du vet hvor mye du kommer til å trene hjemme.</p>" },
      { id: "tabell", heading: "Kurver å vurdere", body: basketTable(baskets) },
      { id: "kort-produkt", heading: "Produktkort", body: `<div class="product-grid">${baskets.map(productCard).join("")}</div>` },
      { id: "se-etter", heading: "Hva bør du se etter?", body: "<p>Se etter stabilitet, portabilitet, chain catch, støy og lagringsplass. For hagebruk er praktisk håndtering ofte viktigere enn konkurransestandard.</p>" }
    ]
  },
  {
    path: "utstyr/discgolf-utstyrsliste.html",
    title: "Discgolf utstyrsliste - dette trenger du faktisk",
    h1: "Discgolf utstyrsliste",
    category: "Utstyr",
    description: "En praktisk utstyrsliste for discgolf: disker, bag, sko, håndkle, kurv, retriever og hva som kan vente.",
    ingress: "Utstyr skal gjøre runden enklere, ikke mer komplisert. Her er hva som er nyttig først, og hva som kan vente.",
    products: [...beginnerDiscs.slice(0, 3), ...bags.slice(0, 1), ...accessories],
    sources: ["pdga", "udisc", "latitudeBeginner"],
    related: [["/guider/hva-trenger-du-av-discgolfutstyr.html", "Nybegynnerutstyr"], ["/utstyr/billig-discgolfutstyr.html", "Billig utstyr"], ["/utstyr/beste-discgolfbag-for-nybegynnere.html", "Discgolfbag"], ["/utstyr/beste-discgolfkurv-til-hagen.html", "Hjemmekurv"]],
    faq: [
      { q: "Hva trenger jeg første gang?", a: "Én disk og klær etter været er nok. Putter og midrange er et godt første kjøp hvis du vil ha eget utstyr." },
      { q: "Hva kan vente?", a: "Stor bag, mange drivere, retriever og hjemmekurv kan vente til du spiller oftere." }
    ],
    sections: [
      { id: "minimum", heading: "Minimum", body: "<ul><li>Én putter eller midrange</li><li>Sko som tåler gress og grus</li><li>Vann</li><li>Telefon eller banekart</li></ul>" },
      { id: "nyttig", heading: "Nyttig etter noen runder", body: "<p>Håndkle, enkel bag, flere disker med tydelige roller og eventuelt retriever kan bli nyttig når du spiller oftere.</p>" },
      { id: "tabell", heading: "Utstyr å vurdere", body: bagTable(bags) },
      { id: "tilbehor", heading: "Tilbehør", body: `<div class="product-grid">${accessories.map(productCard).join("")}</div>` }
    ]
  },
  {
    path: "utstyr/hva-koster-det-a-begynne-med-discgolf.html",
    title: "Hva koster det å begynne med discgolf?",
    h1: "Hva koster det å begynne med discgolf?",
    category: "Kostnad",
    description: "En nøktern guide til kostnader ved å begynne med discgolf, uten hardkodede priser som blir utdaterte.",
    ingress: "Discgolf kan være rimelig å starte med. Kostnaden avhenger mest av hvor mye utstyr du kjøper før du vet hva du trenger.",
    products: [...beginnerDiscs.slice(0, 3), ...bags.slice(0, 1)],
    sources: ["pdga", "udisc", "affiliate"],
    related: [["/utstyr/discgolf-startsett.html", "Startsett"], ["/utstyr/billig-discgolfutstyr.html", "Billig utstyr"], ["/utstyr/discgolf-utstyrsliste.html", "Utstyrsliste"], ["/nybegynnerguide.html", "Nybegynnerhub"]],
    faq: [
      { q: "Er discgolf dyrt?", a: "Det trenger ikke være dyrt. Mange baner er gratis, og du kan starte med få disker." },
      { q: "Bør jeg kjøpe alt med en gang?", a: "Nei. Start med få disker og kjøp mer etter behov." }
    ],
    sections: [
      { id: "ingen-priser", heading: "Hvorfor vi ikke hardkoder priser", body: "<p>Priser endrer seg raskt mellom butikker, tilbud og sesonger. Derfor beskriver vi kostnadsnivå og prioritering i stedet for å legge inn tall som fort blir feil.</p>" },
      { id: "lavterskel", heading: "Lav terskel", body: "<p>Du kan prøve sporten med lånt disk eller én egen disk. Det viktigste første kjøpet er ikke en dyr bag, men en disk du klarer å kontrollere.</p>" },
      { id: "prioritering", heading: "Prioritering", body: "<ol><li>Putter eller midrange</li><li>Eventuelt startsett</li><li>Håndkle og enkel bæring</li><li>Bag, kurv og tilbehør når du spiller ofte</li></ol>" },
      { id: "feil", heading: "Vanlige feil", body: "<p>Den dyreste feilen er å kjøpe mange raske drivere tidlig. Det gir ofte mindre læring og flere bomkjøp.</p>" }
    ]
  },
  {
    path: "utstyr/billig-discgolfutstyr.html",
    title: "Billig discgolfutstyr - hva bør du kjøpe først?",
    h1: "Billig discgolfutstyr",
    category: "Utstyr",
    description: "Slik kjøper du billig discgolfutstyr uten å kaste bort penger på feil disker eller unødvendig tilbehør.",
    ingress: "Billig utstyr er smart hvis det dekker riktig behov. Det er mindre smart hvis du kjøper ting du ikke får brukt.",
    products: [...beginnerDiscs.slice(0, 3), ...accessories.slice(0, 1)],
    sources: ["pdga", "latitudeBeginner", "affiliate"],
    related: [["/utstyr/hva-koster-det-a-begynne-med-discgolf.html", "Hva koster det?"], ["/utstyr/discgolf-startsett.html", "Startsett"], ["/utstyr/discgolf-utstyrsliste.html", "Utstyrsliste"], ["/utstyr/beste-discgolfdisker-for-nybegynnere.html", "Beste disker"]],
    faq: [
      { q: "Hva er det billigste jeg kan starte med?", a: "Én nøytral midrange eller putter, eventuelt lånt disk, er nok for å prøve." },
      { q: "Er baseplast dårlig?", a: "Ikke nødvendigvis. Baseplast kan ha godt grep og lav pris, men slites raskere." }
    ],
    sections: [
      { id: "prioriter", heading: "Prioriter riktig", body: "<p>Kjøp få ting som brukes ofte. En god putter, en midrange og et håndkle gir mer nytte enn tre raske drivere.</p>" },
      { id: "tabell", heading: "Billige valg å vurdere", body: discTable(beginnerDiscs.slice(0, 3)) },
      { id: "tilbehor", heading: "Rimelig tilbehør", body: productCard(accessories[0]) },
      { id: "feil", heading: "Vanlige feil", body: "<p>Ikke kjøp billig bare fordi det er billig. Kjøp billig når produktet faktisk dekker behovet ditt.</p>" }
    ]
  },
  {
    path: "utstyr/gave-til-discgolfspiller.html",
    title: "Gave til discgolfspiller - trygge ideer å vurdere",
    h1: "Gave til discgolfspiller",
    category: "Gaver",
    description: "Research-basert gaveguide til discgolfspillere: disker, håndkle, bag, kurv og trygge valg uten falske testpåstander.",
    ingress: "Den beste gaven treffer behovet til spilleren. Hvis du er usikker, er praktisk utstyr ofte tryggere enn en tilfeldig rask driver.",
    products: [...putters.slice(0, 1), ...mids.slice(0, 1), ...bags.slice(0, 1), ...baskets.slice(0, 1), ...accessories],
    sources: ["pdga", "latitudeBeginner", "affiliate"],
    related: [["/utstyr/discgolf-utstyrsliste.html", "Utstyrsliste"], ["/utstyr/beste-discgolfbag-for-nybegynnere.html", "Bag"], ["/utstyr/beste-discgolfkurv-til-hagen.html", "Kurv til hagen"], ["/utstyr/billig-discgolfutstyr.html", "Billig utstyr"]],
    faq: [
      { q: "Hva er en trygg gave til nybegynner?", a: "Putter, midrange, håndkle eller enkel bag er ofte tryggere enn en rask driver." },
      { q: "Bør jeg kjøpe disc uten å vite hva spilleren bruker?", a: "Hvis du ikke vet nivået, velg en nøytral disk eller praktisk tilbehør." }
    ],
    sections: [
      { id: "trygge", heading: "Trygge gaveideer", body: "<p>Håndkle, putter, nøytral midrange, liten bag eller gavekort hos relevant butikk er ofte trygge valg.</p>" },
      { id: "unngaa", heading: "Dette bør du unngå", body: "<p>Unngå svært raske drivere eller spesialdisker hvis du ikke vet hva spilleren ønsker. Det blir fort feil for nybegynnere.</p>" },
      { id: "kort", heading: "Produkter å vurdere", body: `<div class="product-grid">${[putters[0], mids[0], bags[0], baskets[0], accessories[0], accessories[1]].map(productCard).join("")}</div>` },
      { id: "behov", heading: "Velg etter behov", body: "<p>Spiller personen ofte? Da kan bag eller kurv være relevant. Spiller personen lite? Da er enkel disk eller håndkle mer nøkternt.</p>" }
    ]
  },
  {
    path: "utstyr/hvordan-velge-riktig-vekt-pa-discgolfdisk.html",
    title: "Hvordan velge riktig vekt på discgolfdisk",
    h1: "Hvordan velge riktig vekt på discgolfdisk",
    category: "Diskvalg",
    description: "Guide til vekt på discgolfdisker: hva nye spillere bør tenke på, vind, grep, kontroll og disktyper.",
    ingress: "Vekt påvirker hvordan disken føles og flyr, men det finnes ikke én riktig vekt for alle. Velg etter nivå, vind og bruksområde.",
    products: beginnerDiscs,
    sources: ["pdga", "innovaCompare", "latitudeBeginner"],
    related: [["/guider/flight-numbers.html", "Flight numbers"], ["/guider/hvilken-discgolfdisk-skal-jeg-velge.html", "Velg disk"], ["/utstyr/beste-discgolfdisker-for-nybegynnere.html", "Beste disker"], ["/utstyr/understable-stable-overstable-disker.html", "Stabilitet forklart"]],
    faq: [
      { q: "Bør nybegynnere velge lette disker?", a: "Litt lettere disker kan være enklere å få opp i fart, men veldig lette disker kan bli mer påvirket av vind." },
      { q: "Er tunge disker bedre i vind?", a: "Tyngre og mer stabile disker kan være tryggere i vind, men de krever fortsatt kontroll." }
    ],
    sections: [
      { id: "kort", heading: "Kort oppsummert", body: "<p>Velg en vekt som gir kontroll. Nye spillere kan ofte ha nytte av litt lettere disker, men bør ikke ignorere vind og grep.</p>" },
      { id: "disktyper", heading: "Vekt og disktyper", body: "<p>Puttere velges ofte etter grep og følelse. Midrange og fairway kan gjerne være litt lettere for nye spillere. Distance-driver bør vente til teknikken sitter bedre.</p>" },
      { id: "vind", heading: "Vekt og vind", body: "<p>Vind påvirker disken mye. I motvind blir lette og understable disker mer krevende. Ikke løs alt med vekt; stabilitet og vinkel betyr også mye.</p>" },
      { id: "feil", heading: "Vanlige feil", body: "<p>Vanlig feil er å kjøpe maksvekt fordi det virker mest seriøst, eller veldig lett disk uten å tenke på vind. Start heller med kontroll og juster etter erfaring.</p>" }
    ]
  }
];

mkdirSync("utstyr", { recursive: true });
for (const page of pages) writeFileSync(page.path, pageHtml(page), "utf8");

function hub() {
  const groups = [
    ["Disker", pages.filter((p) => p.path.includes("disk") || p.path.includes("putter") || p.path.includes("midrange") || p.path.includes("driver") || p.path.includes("overstable"))],
    ["Startsett og kostnad", pages.filter((p) => p.path.includes("startsett") || p.path.includes("koster") || p.path.includes("billig"))],
    ["Bagger, kurver og tilbehør", pages.filter((p) => p.path.includes("bag") || p.path.includes("kurv") || p.path.includes("utstyrsliste") || p.path.includes("gave"))]
  ];
  return `<!doctype html>
<html lang="no">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Utstyrsguide for discgolf | Disker, startsett, bagger og kurver</title>
  <meta name="description" content="Uavhengig norsk utstyrsguide for discgolf: disker, startsett, puttere, midrange, fairway-drivere, bagger, kurver og tilbehør.">
  <meta name="robots" content="index, follow">
  <meta property="og:title" content="Utstyrsguide for discgolf">
  <meta property="og:description" content="Research-baserte produktguider og utstyrsråd for norske discgolfspillere.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${baseUrl}/utstyrsguide.html">
  <meta property="og:image" content="${baseUrl}/assets/hero-banner.svg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="canonical" href="${baseUrl}/utstyrsguide.html">
  <link rel="stylesheet" href="assets/css/styles.css">
  <script src="assets/js/site.js" defer></script>
</head>
<body>
${nav("")}
  <main>
    <section class="page-hero"><div class="container"><p class="eyebrow">Utstyr</p><h1>Discgolfutstyr uten falske tester</h1><p class="lead">En ryddig hub for disker, startsett, bagger, kurver og tilbehør. Alt produktnært innhold er merket som research-basert til faktiske tester finnes.</p><div class="article-meta"><span>Oppdatert: ${updatedDisplay}</span><span>${pages.length} produktguider</span><span>Affiliate-klar</span></div></div></section>
    <section class="section"><div class="container content-flow">
      <p class="research-note">${researchNotice}</p>
      <p class="disclaimer">${affiliateNotice}</p>
      <section><h2>Anbefalt leserekkefølge</h2>${pills([["/utstyr/beste-discgolfdisker-for-nybegynnere.html", "Start med disker"], ["/utstyr/discgolf-startsett.html", "Vurder startsett"], ["/utstyr/discgolf-utstyrsliste.html", "Se utstyrsliste"], ["/nybegynnerguide.html", "Tilbake til nybegynnerhub"]])}</section>
      ${groups.map(([heading, groupPages]) => `<section><h2>${heading}</h2><div class="grid">${groupPages.map((p) => `<article class="guide-card"><p class="eyebrow">${esc(p.category)}</p><h3>${esc(p.h1)}</h3><p>${esc(p.description)}</p><a href="/${p.path}">Les guiden</a></article>`).join("")}</div></section>`).join("")}
    </div></section>
  </main>
${footer("")}
</body>
</html>`;
}

writeFileSync("utstyrsguide.html", hub(), "utf8");

const sitemapPath = "sitemap.xml";
const current = readFileSync(sitemapPath, "utf8");
const existing = [...current.matchAll(/<loc>https:\/\/diskgolfguiden\.no\/(.*?)<\/loc>/g)].map((m) => m[1]);
const next = Array.from(new Set([...existing, ...pages.map((p) => p.path), "utstyrsguide.html"]));
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${next.map((p) => `  <url><loc>${baseUrl}/${p}</loc><lastmod>${updatedIso}</lastmod></url>`).join("\n")}\n</urlset>\n`;
writeFileSync(sitemapPath, sitemap, "utf8");

console.log(JSON.stringify({ productPages: pages.length, sitemapUrls: next.length }, null, 2));
