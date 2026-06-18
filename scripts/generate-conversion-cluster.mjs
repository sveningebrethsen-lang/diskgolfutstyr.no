import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const baseUrl = "https://diskgolfutstyr.no";
const updatedIso = "2026-06-03";
const updatedDisplay = "3. juni 2026";
const affiliateNotice = "Noen lenker kan være annonselenker. Det koster deg ikke noe ekstra, men kan gi Diskgolfutstyr en liten provisjon. Anbefalingene skal være redaksjonelt uavhengige.";
const researchNotice = "Dette er en research-basert sammenligning basert på produsentdata, offentlige spesifikasjoner og spillererfaringer. Produktene er ikke fysisk testet av Diskgolfutstyr.";
const evaluationNotice = "Når produkter ikke er fysisk testet av Diskgolfutstyr, baserer vi vurderingen på produsentdata, offentlige spesifikasjoner, kjent bruk i discgolfmiljøet og tilgjengelige spillererfaringer. Vi markerer tydelig når en artikkel er research-basert.";

const discs = JSON.parse(readFileSync("data/products/discs.json", "utf8"));
const bags = JSON.parse(readFileSync("data/products/bags.json", "utf8"));
const baskets = JSON.parse(readFileSync("data/products/baskets.json", "utf8"));
const accessories = JSON.parse(readFileSync("data/products/accessories.json", "utf8"));
const allProducts = [...discs, ...bags, ...baskets, ...accessories];
const byId = Object.fromEntries(allProducts.map((product) => [product.id, product]));

const affiliateLinks = {
  links: allProducts.map((product) => ({
    id: product.id,
    product_id: product.id,
    merchant: "",
    affiliate_url: "#",
    regular_url: product.source_urls?.[0] || "",
    link_type: "placeholder",
    last_checked: updatedIso,
    notes: "Affiliate-lenke ikke lagt inn ennå."
  }))
};

mkdirSync("data/affiliate", { recursive: true });
writeFileSync("data/affiliate/links.json", JSON.stringify(affiliateLinks, null, 2), "utf8");

function esc(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function nav(prefix = "/") {
  return `<header class="site-header"><div class="nav-wrap"><a class="brand" href="${prefix}index.html"><img src="${prefix}assets/logo-full.svg" alt="Diskgolfutstyr"></a><button class="menu-button" type="button" aria-label="Åpne meny" aria-expanded="false" data-menu-button>☰</button><nav class="nav" aria-label="Hovedmeny" data-nav><a href="${prefix}nybegynnerguide.html">Nybegynner</a><a href="${prefix}artikler.html">Guider</a><a href="${prefix}utstyr/">Utstyr</a><a href="${prefix}baner/">Baner</a><a href="${prefix}klubber/">Klubber</a><a href="${prefix}turneringer/">Turneringer</a><a href="${prefix}om.html">Om</a></nav></div></header>`;
}

function footer(prefix = "/") {
  return `<footer class="site-footer"><div class="footer-inner"><div class="footer-brand"><img src="${prefix}assets/logo-light.svg" alt="Diskgolfutstyr"><span>Uavhengig norsk discgolfportal. Guider først, affiliate sekundært og tydelig merket.</span></div><div class="footer-links"><a href="${prefix}utstyr/">Utstyr</a><a href="${prefix}tester.html">Tester</a><a href="${prefix}sammenligninger.html">Sammenligninger</a><a href="${prefix}affiliate-info.html">Affiliate-info</a><a href="${prefix}redaksjonelle-retningslinjer/">Retningslinjer</a><a href="${prefix}personvern/">Personvern</a></div></div></footer>`;
}

function productCta(product, placement = "product-card", text = "Se produkt") {
  return `<a class="button" href="#" rel="sponsored nofollow" data-affiliate-id="${esc(product.id)}" data-product-id="${esc(product.id)}" data-link-type="affiliate-placeholder" data-placement="${esc(placement)}">${esc(text)}</a>`;
}

function productCard(product) {
  const flight = product.flight_numbers ? `<p><strong>Flight numbers:</strong> ${esc(product.flight_numbers)}</p>` : "";
  const stability = product.stability ? `<p><strong>Stabilitet:</strong> ${esc(product.stability)}</p>` : "";
  const capacity = product.capacity ? `<p><strong>Kapasitet:</strong> ${esc(product.capacity)}</p>` : "";
  const portable = product.portable != null ? `<p><strong>Portabel:</strong> ${product.portable ? "Ja" : "Ikke oppgitt"}</p>` : "";
  return `<article class="product-card commerce-card">
    <div class="product-card__top"><p class="eyebrow">${esc(product.brand || product.category)}</p><span class="badge badge-research">Research-basert</span></div>
    <h3>${esc(product.name)}</h3>
    <p>${esc(product.description)}</p>
    ${flight}${stability}${capacity}${portable}
    <p><strong>Passer for:</strong> ${esc(product.suitable_for)}</p>
    <div class="pros-cons"><div><h4>Fordeler</h4><ul>${(product.pros || []).map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div><div><h4>Ulemper</h4><ul>${(product.cons || []).map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div></div>
    <p class="microcopy">Annonselenke kan bli lagt til senere. Ingen pris eller lagerstatus vises her.</p>
    ${productCta(product)}
    <p class="microcopy">Sist sjekket produktdata: ${esc(product.last_checked || updatedIso)}</p>
  </article>`;
}

function comparisonTable(products, kind = "disc") {
  const headings = kind === "bag"
    ? ["Produkt", "Kapasitet", "Passer for", "Fordeler", "Ulemper", "CTA"]
    : kind === "basket"
      ? ["Produkt", "Type", "Portabel", "Passer for", "Kommentar", "CTA"]
      : ["Produkt", "Type", "Flight numbers", "Stabilitet", "Passer for", "Beste bruksområde", "CTA"];

  const rows = products.map((product) => {
    if (kind === "bag") return [product.name, product.capacity || "Ukjent", product.suitable_for, (product.pros || []).slice(0, 2).join(", "), (product.cons || []).slice(0, 2).join(", "), productCta(product, "comparison-table", "Se produkt")];
    if (kind === "basket") return [product.name, product.type || "Ukjent", product.portable ? "Ja" : "Ikke oppgitt", product.suitable_for, product.description, productCta(product, "comparison-table", "Se produkt")];
    return [product.name, product.type || "Ukjent", product.flight_numbers || "Ikke oppgitt", product.stability || "Ukjent", product.suitable_for, product.description, productCta(product, "comparison-table", "Se produkt")];
  });

  return `<table class="comparison commerce-table"><thead><tr>${headings.map((heading) => `<th>${esc(heading)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell, index) => `<td>${index === row.length - 1 ? cell : esc(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

function pills(items) {
  return `<div class="pill-row">${items.map(([href, label]) => `<a class="pill" href="${href}">${esc(label)}</a>`).join("")}</div>`;
}

function sources(products) {
  const urls = [...new Set(products.flatMap((product) => product.source_urls || []))];
  return urls.map((url) => `<li><a href="${esc(url)}">${esc(url.replace(/^https?:\/\//, ""))}</a></li>`).join("");
}

function schema(page) {
  return JSON.stringify([
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
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Diskgolfutstyr", item: `${baseUrl}/` },
        { "@type": "ListItem", position: 2, name: page.parentName, item: `${baseUrl}/${page.parentPath}` },
        { "@type": "ListItem", position: 3, name: page.h1, item: `${baseUrl}/${page.path}` }
      ]
    }
  ]);
}

function pageShell(page) {
  const toc = page.sections.map((section) => `<li><a href="#${section.id}">${esc(section.heading)}</a></li>`).join("");
  return `<!doctype html>
<html lang="no">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(page.title)}</title>
  <meta name="description" content="${esc(page.description)}">
  <meta name="robots" content="index, follow">
  <meta property="og:title" content="${esc(page.title)}">
  <meta property="og:description" content="${esc(page.description)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${baseUrl}/${page.path}">
  <meta property="og:image" content="${baseUrl}/assets/hero-banner.svg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(page.title)}">
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
      <section class="page-hero"><div class="container"><p class="eyebrow">${esc(page.eyebrow)}</p><h1>${esc(page.h1)}</h1><p class="lead">${esc(page.intro)}</p><div class="article-meta"><span>Oppdatert: ${updatedDisplay}</span><span>Research-basert</span><span>Affiliate-klar</span></div></div></section>
      <section class="section"><div class="container article-layout"><aside class="toc" aria-label="Innholdsfortegnelse"><h2>Innhold</h2><ol>${toc}</ol></aside><div class="article-body">
        <p class="research-note">${researchNotice}</p>
        <p class="disclaimer">${affiliateNotice}</p>
        <section id="kort"><h2>Kort anbefaling</h2>${page.summary}</section>
        ${page.sections.map((section) => `<section id="${section.id}"><h2>${esc(section.heading)}</h2>${section.body}</section>`).join("")}
        <section id="metode"><h2>Slik vurderer vi produkter</h2><p class="notice">${evaluationNotice}</p><p>Les også <a href="/redaksjonelle-retningslinjer/">redaksjonelle retningslinjer</a> og <a href="/affiliate-info.html">affiliate-info</a>.</p></section>
        <section id="relatert"><h2>Neste steg</h2>${pills(page.related)}</section>
        <section id="kilder"><h2>Kilder</h2><ul class="source-list">${sources(page.products || [])}</ul></section>
      </div></div></section>
    </article>
  </main>
${footer("/")}
</body>
</html>`;
}

const productPages = [
  {
    path: "utstyr/beste-discgolfdisker-for-nybegynnere.html",
    title: "Beste discgolfdisker for nybegynnere | Research-basert guide",
    h1: "Anbefalte discgolfdisker for nybegynnere",
    eyebrow: "Disker",
    description: "Se hvilke discgolfdisker nybegynnere bør vurdere, hvorfor putter og midrange er trygt, og hvorfor raske drivere kan vente.",
    intro: "Start med kontroll, ikke maksimal fart. En putter, en midrange og eventuelt en rolig fairway-driver er nok for de fleste nye spillere.",
    products: [byId["innova-dx-aviar"], byId["dynamic-discs-judge"], byId["discraft-buzzz"], byId["innova-mako3"], byId["latitude-64-river"], byId["innova-leopard3"]],
    summary: "<p>Velg en putter for korte kast, en nøytral midrange for kontroll og en rolig fairway-driver først når du vil prøve mer lengde. Vent med distance-driver.</p>",
    related: [["/guider/flight-numbers.html", "Flight numbers forklart"], ["/guider/putter-midrange-og-driver-forklart.html", "Putter vs midrange vs driver"], ["/utstyr/discgolf-startsett.html", "Startsett"], ["/baner/nybegynnervennlige/", "Finn nybegynnervennlig bane"]],
    sections: [
      { id: "tabell", heading: "Sammenlign anbefalte disker", body: comparisonTable([byId["innova-dx-aviar"], byId["dynamic-discs-judge"], byId["discraft-buzzz"], byId["innova-mako3"], byId["latitude-64-river"], byId["innova-leopard3"]]) },
      { id: "produkter", heading: "Produktkort", body: `<div class="product-grid">${[byId["innova-dx-aviar"], byId["dynamic-discs-judge"], byId["discraft-buzzz"], byId["innova-mako3"], byId["latitude-64-river"], byId["innova-leopard3"]].map(productCard).join("")}</div>` },
      { id: "unngaa", heading: "Dette bør nye spillere unngå", body: "<ul><li>For raske distance drivers som fader tidlig.</li><li>For mange disker før du kjenner de første.</li><li>Å velge disk bare fordi en proff bruker den.</li></ul>" }
    ]
  },
  {
    path: "utstyr/discgolf-startsett.html",
    title: "Discgolf startsett | Hva bør et godt startsett inneholde?",
    h1: "Discgolf startsett for nybegynnere",
    eyebrow: "Startsett",
    description: "Slik vurderer du discgolf startsett: putter, midrange, fairway-driver, vanlige feil og når enkeltdisker er bedre.",
    intro: "Et godt startsett gjør discgolf enklere å lære. Det bør ha tydelige roller, ikke bare en rask driver.",
    products: [byId["innova-dx-aviar"], byId["discraft-buzzz"], byId["innova-leopard3"]],
    summary: "<p>Se etter putter, midrange og eventuelt en rolig fairway-driver. Hvis driveren er for rask, er enkeltdisker ofte bedre.</p>",
    related: [["/utstyr/beste-discgolfdisker-for-nybegynnere.html", "Anbefalte disker"], ["/utstyr/hva-koster-det-a-begynne-med-discgolf.html", "Hva koster det?"], ["/guider/hva-trenger-du-av-discgolfutstyr.html", "Hva trenger du?"]],
    sections: [
      { id: "tabell", heading: "Hva bør et startsett dekke?", body: comparisonTable([byId["innova-dx-aviar"], byId["discraft-buzzz"], byId["innova-leopard3"]]) },
      { id: "enkelt", heading: "Startsett vs enkeltdisker", body: "<p>Startsett er enkelt. Enkeltdisker er bedre hvis du får hjelp og vil velge mer presist. Begge deler kan være riktig.</p>" },
      { id: "produkter", heading: "Diskroller i et godt startsett", body: `<div class="product-grid">${[byId["innova-dx-aviar"], byId["discraft-buzzz"], byId["innova-leopard3"]].map(productCard).join("")}</div>` }
    ]
  },
  {
    path: "utstyr/beste-putter-for-nybegynnere.html",
    title: "Beste putter for nybegynnere | Grep, plast og trygge valg",
    h1: "Beste putter for nybegynnere",
    eyebrow: "Putter",
    description: "Velg putter for discgolf med fokus på grep, følelse, stabilitet og hva nye spillere bør se etter.",
    intro: "Putteren brukes på nesten alle hull. Velg først og fremst en putter som føles trygg i hånden.",
    products: [byId["innova-dx-aviar"], byId["dynamic-discs-judge"]],
    summary: "<p>Grep og komfort er viktigere enn små forskjeller i tall. Baseplast kan være et godt førstevalg fordi den ofte gir godt grep.</p>",
    related: [["/guider/putting-for-nybegynnere.html", "Putting for nybegynnere"], ["/guider/hvordan-velge-riktig-putter.html", "Hvordan velge putter"], ["/teknikk/putting-rutine/", "Putting-rutine"]],
    sections: [
      { id: "tabell", heading: "Sammenlign puttere", body: comparisonTable([byId["innova-dx-aviar"], byId["dynamic-discs-judge"]]) },
      { id: "produkter", heading: "Puttere å vurdere", body: `<div class="product-grid">${[byId["innova-dx-aviar"], byId["dynamic-discs-judge"]].map(productCard).join("")}</div>` },
      { id: "passer-ikke", heading: "Hvem passer dette ikke for?", body: "<p>Hvis du allerede har en putter du putter godt med, trenger du ikke bytte bare fordi en annen modell er populær.</p>" }
    ]
  },
  {
    path: "utstyr/beste-midrange-for-nybegynnere.html",
    title: "Beste midrange for nybegynnere | Rette kast og kontroll",
    h1: "Beste midrange for nybegynnere",
    eyebrow: "Midrange",
    description: "Velg midrange for nybegynnere med fokus på rette kast, kontroll, stabilitet og læring.",
    intro: "Midrange er ofte den beste disken for å lære vinkler, retning og kontroll uten driverfart.",
    products: [byId["discraft-buzzz"], byId["innova-mako3"]],
    summary: "<p>Velg en nøytral midrange som flyr rett når du kaster rolig. Den hjelper deg å se hva kastet faktisk gjør.</p>",
    related: [["/guider/hvordan-velge-riktig-midrange.html", "Hvordan velge midrange"], ["/guider/flight-numbers.html", "Flight numbers"], ["/teknikk/hyzer-og-anhyzer/", "Hyzer og anhyzer"]],
    sections: [
      { id: "tabell", heading: "Sammenlign midrange-disker", body: comparisonTable([byId["discraft-buzzz"], byId["innova-mako3"]]) },
      { id: "produkter", heading: "Midrange-disker å vurdere", body: `<div class="product-grid">${[byId["discraft-buzzz"], byId["innova-mako3"]].map(productCard).join("")}</div>` },
      { id: "feil", heading: "Vanlige feil", body: "<p>Ikke bruk midrange bare som en kort driver. Bruk den til å lære release-vinkel og retning.</p>" }
    ]
  },
  {
    path: "utstyr/beste-fairway-driver-for-nybegynnere.html",
    title: "Beste fairway driver for nybegynnere | Kontroll før fart",
    h1: "Beste fairway driver for nybegynnere",
    eyebrow: "Fairway-driver",
    description: "Velg fairway driver for nybegynnere med lavere speed, mer kontroll og tryggere overgang fra midrange.",
    intro: "Fairway-driver kan gi mer lengde, men bør være rolig nok til at du faktisk får den opp i fart.",
    products: [byId["latitude-64-river"], byId["innova-leopard3"]],
    summary: "<p>Start med speed rundt 6-7 og unngå distance drivers til du har bedre kontroll.</p>",
    related: [["/guider/hvordan-velge-riktig-driver.html", "Hvordan velge driver"], ["/sammenligninger/fairway-driver-vs-distance-driver.html", "Fairway vs distance"], ["/teknikk/kast-i-vind/", "Kast i vind"]],
    sections: [
      { id: "tabell", heading: "Sammenlign fairway-drivere", body: comparisonTable([byId["latitude-64-river"], byId["innova-leopard3"]]) },
      { id: "produkter", heading: "Fairway-drivere å vurdere", body: `<div class="product-grid">${[byId["latitude-64-river"], byId["innova-leopard3"]].map(productCard).join("")}</div>` },
      { id: "vind", heading: "Vind og fairway-drivere", body: "<p>Understable fairway-drivere kan bli krevende i motvind. Bruk roligere kast og vurder mer stabil disk først når du kjenner behovet.</p>" }
    ]
  },
  {
    path: "utstyr/beste-discgolfbag-for-nybegynnere.html",
    title: "Beste discgolfbag for nybegynnere | Sekk, kapasitet og behov",
    h1: "Discgolfbag for nybegynnere",
    eyebrow: "Bag",
    description: "Velg discgolfbag med riktig kapasitet, komfort og organisering uten å kjøpe mer enn du trenger.",
    intro: "Du trenger ikke stor bag første dag. En dedikert bag blir nyttig når du spiller oftere og bærer flere disker.",
    products: bags,
    summary: "<p>Start med enkel bæring. Kjøp dedikert bag når du faktisk har disker, drikke og småting du vil organisere.</p>",
    related: [["/utstyr/discgolf-utstyrsliste.html", "Utstyrsliste"], ["/utstyr/billig-discgolfutstyr.html", "Billig utstyr"], ["/baner/", "Finn bane"]],
    sections: [
      { id: "tabell", heading: "Sammenlign bagger", body: comparisonTable(bags, "bag") },
      { id: "produkter", heading: "Bagger å vurdere", body: `<div class="product-grid">${bags.map(productCard).join("")}</div>` },
      { id: "unngaa", heading: "Ikke kjøp for stort for tidlig", body: "<p>Stor bag kan være tung og unødvendig hvis du fortsatt bare bruker tre disker.</p>" }
    ]
  },
  {
    path: "utstyr/beste-discgolfkurv-til-hagen.html",
    title: "Discgolfkurv til hagen | Kurv for puttingtrening hjemme",
    h1: "Discgolfkurv til hagen",
    eyebrow: "Kurv",
    description: "Velg discgolfkurv til hagen med fokus på portabilitet, støy, stabilitet og puttingtrening.",
    intro: "En hjemmekurv kan gjøre puttingtrening enklere, men tenk på støy, plass og hvor ofte du faktisk vil bruke den.",
    products: baskets,
    summary: "<p>Hjemmekurv passer best hvis du vil trene putting jevnlig. Hvis du bare spiller av og til, kan du vente.</p>",
    related: [["/trening/putting-trening/", "Puttingtrening"], ["/teknikk/putting-rutine/", "Putting-rutine"], ["/utstyr/gave-til-discgolfspiller.html", "Gaveguide"]],
    sections: [
      { id: "tabell", heading: "Sammenlign kurver", body: comparisonTable(baskets, "basket") },
      { id: "produkter", heading: "Kurver å vurdere", body: `<div class="product-grid">${baskets.map(productCard).join("")}</div>` },
      { id: "stoy", heading: "Støy og naboer", body: "<p>Kjeder lager lyd. Tenk på tidspunkt, plassering og naboer hvis kurven står i boligområde.</p>" }
    ]
  }
];

for (const page of productPages) {
  writeFileSync(page.path, pageShell({ ...page, parentName: "Utstyr", parentPath: "utstyr/" }), "utf8");
}

function hub() {
  const groups = [
    ["Start her", [["/utstyr/discgolf-startsett.html", "Discgolf startsett"], ["/utstyr/beste-discgolfdisker-for-nybegynnere.html", "Disker for nybegynnere"], ["/utstyr/discgolf-utstyrsliste.html", "Utstyrsliste"], ["/utstyr/hva-koster-det-a-begynne-med-discgolf.html", "Hva koster det?"]]],
    ["Disker", [["/utstyr/beste-putter-for-nybegynnere.html", "Puttere"], ["/utstyr/beste-midrange-for-nybegynnere.html", "Midrange"], ["/utstyr/beste-fairway-driver-for-nybegynnere.html", "Fairway-drivere"], ["/utstyr/beste-distance-driver-for-viderekomne.html", "Distance-drivere"]]],
    ["Bæring, trening og gaver", [["/utstyr/beste-discgolfbag-for-nybegynnere.html", "Bag"], ["/utstyr/beste-discgolfkurv-til-hagen.html", "Kurv til hagen"], ["/utstyr/gave-til-discgolfspiller.html", "Gaveguide"], ["/utstyr/billig-discgolfutstyr.html", "Billig utstyr"]]]
  ];
  return `<!doctype html>
<html lang="no">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Discgolfutstyr | Disker, startsett, bagger og kurver</title>
  <meta name="description" content="Finn guider til discgolfutstyr: startsett, disker for nybegynnere, puttere, midrange, fairway-drivere, bagger, kurver og gaveideer.">
  <meta name="robots" content="index, follow">
  <meta property="og:title" content="Discgolfutstyr">
  <meta property="og:description" content="Research-baserte guider til discgolfutstyr med tydelig affiliate-disclaimer.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${baseUrl}/utstyr/">
  <meta property="og:image" content="${baseUrl}/assets/hero-banner.svg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="canonical" href="${baseUrl}/utstyr/">
  <link rel="stylesheet" href="/assets/css/styles.css">
  <script src="/assets/js/site.js" defer></script>
</head>
<body>
${nav("/")}
  <main>
    <section class="page-hero"><div class="container"><p class="eyebrow">Utstyr</p><h1>Discgolfutstyr uten falske tester</h1><p class="lead">Start med riktig behov: få disker, tydelige roller og utstyr du faktisk bruker. Affiliate kan komme senere, men anbefalingene skal være redaksjonelt uavhengige.</p><div class="article-meta"><span>Oppdatert: ${updatedDisplay}</span><span>Research-basert</span><span>Affiliate-klar</span></div></div></section>
    <section class="section"><div class="container content-flow"><p class="research-note">${researchNotice}</p><p class="disclaimer">${affiliateNotice}</p>
    ${groups.map(([heading, links]) => `<section><h2>${heading}</h2><div class="grid">${links.map(([href, label]) => `<article class="guide-card"><p class="eyebrow">Kjøpsguide</p><h3>${esc(label)}</h3><p>Praktisk guide med fordeler, ulemper, hvem det passer for og tydelig merking av research-status.</p><a href="${href}">Les guiden</a></article>`).join("")}</div></section>`).join("")}
    <section><h2>Slik vurderer vi produkter</h2><p class="notice">${evaluationNotice}</p>${pills([["/affiliate-info.html", "Affiliate-info"], ["/redaksjonelle-retningslinjer/", "Redaksjonelle retningslinjer"], ["/tester.html", "Testmetodikk"]])}</section>
    </div></section>
  </main>
${footer("/")}
</body>
</html>`;
}

mkdirSync("utstyr", { recursive: true });
writeFileSync("utstyr/index.html", hub(), "utf8");

const comparisonPages = [
  ["putter-vs-midrange", "Putter vs midrange", "Når bør du bruke putter, og når bør du bruke midrange?", [byId["innova-dx-aviar"], byId["discraft-buzzz"]]],
  ["startsett-vs-enkelt-disker", "Startsett vs enkeltdisker", "Hva passer best for nye spillere: ferdig startsett eller å velge enkeltdisker?", [byId["innova-dx-aviar"], byId["discraft-buzzz"], byId["innova-leopard3"]]],
  ["understable-vs-overstable-disk", "Understable vs overstable disk", "Forskjellen på lette, svingende disker og mer stabile vind-/kontrolldisker.", [byId["innova-leopard3"], byId["innova-wraith"]]],
  ["billig-vs-dyr-discgolfbag", "Billig vs dyr discgolfbag", "Når holder en enkel bag, og når gir dyrere sekk faktisk nytte?", bags],
  ["portable-vs-permanente-discgolfkurver", "Portabel vs permanent discgolfkurv", "Hva bør du velge til hagebruk og puttingtrening?", baskets],
  ["buzzz-vs-mako3", "Buzzz vs Mako3", "To populære midrange-disker med litt ulik bruk og følelse.", [byId["discraft-buzzz"], byId["innova-mako3"]]],
  ["aviar-vs-judge", "Aviar vs Judge", "To klassiske puttervalg for nye spillere.", [byId["innova-dx-aviar"], byId["dynamic-discs-judge"]]],
  ["discgolfbag-vs-vanlig-sekk", "Discgolfbag vs vanlig sekk", "Når trenger du egentlig en dedikert discgolfbag?", bags]
];

for (const [slug, title, intro, products] of comparisonPages) {
  const kind = products[0]?.category === "bag" ? "bag" : products[0]?.category === "basket" ? "basket" : "disc";
  const path = `sammenligninger/${slug}.html`;
  writeFileSync(path, pageShell({
    path,
    title: `${title} | Research-basert sammenligning`,
    h1: title,
    eyebrow: "Sammenligning",
    description: `${title}: research-basert sammenligning med fordeler, ulemper, hvem alternativene passer for og tydelige neste steg.`,
    intro,
    products,
    summary: "<p>Velg etter nivå, bane, bruksområde og hva du faktisk får brukt. Denne siden kårer ikke en testvinner.</p>",
    parentName: "Sammenligninger",
    parentPath: "sammenligninger.html",
    related: [["/utstyr/", "Utstyrshub"], ["/utstyr/beste-discgolfdisker-for-nybegynnere.html", "Disker for nybegynnere"], ["/affiliate-info.html", "Affiliate-info"]],
    sections: [
      { id: "tabell", heading: "Sammenligning", body: comparisonTable(products, kind) },
      { id: "produkter", heading: "Alternativer", body: `<div class="product-grid">${products.map(productCard).join("")}</div>` },
      { id: "velg", heading: "Slik velger du", body: "<p>Velg alternativet som passer kastelengde, banetype og hvor ofte du spiller. Ikke kjøp dyrere eller raskere bare fordi det virker mer avansert.</p>" }
    ]
  }), "utf8");
}

const sitemapPath = "sitemap.xml";
const existing = [...readFileSync(sitemapPath, "utf8").matchAll(/<loc>https:\/\/diskgolfutstyr\.no\/(.*?)<\/loc>/g)].map((m) => m[1]);
const additions = ["utstyr/", ...productPages.map((p) => p.path), ...comparisonPages.map(([slug]) => `sammenligninger/${slug}.html`)];
const urls = Array.from(new Set([...existing, ...additions])).sort((a, b) => a.localeCompare(b, "nb"));
writeFileSync(sitemapPath, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${baseUrl}/${url}</loc><lastmod>${updatedIso}</lastmod></url>`).join("\n")}\n</urlset>\n`, "utf8");

console.log(JSON.stringify({ affiliateLinks: affiliateLinks.links.length, productPages: productPages.length, comparisonPages: comparisonPages.length, sitemapUrls: urls.length }, null, 2));
