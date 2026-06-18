import { readFileSync, writeFileSync } from "node:fs";

const date = "2026-06-03";

const metadataUpdates = [
  {
    file: "index.html",
    title: "Diskgolfguiden.no | Norsk discgolfportal for utstyr, baner og regler",
    description: "Start her for norske discgolfguider, baner, utstyr, regler, klubber, turneringer og trening uten falske tester eller tynn affiliate."
  },
  {
    file: "nybegynnerguide.html",
    title: "Nybegynnerguide til discgolf | Kom i gang med disker, regler og bane",
    description: "Lær discgolf fra start: hva du trenger, hvilke disker du bør velge, regler, etikette, første runde og hvor du finner bane."
  },
  {
    file: "utstyrsguide.html",
    title: "Discgolfutstyr | Guide til disker, startsett, bag og kurv",
    description: "Velg discgolfutstyr med kontroll: disker, startsett, puttere, midrange, fairway-drivere, bagger og kurver tydelig merket."
  },
  {
    file: "baner/index.html",
    title: "Discgolfbaner i Norge | Finn bane, byguider og nybegynnervennlige valg",
    description: "Finn discgolfbaner i Norge, se byguider, 18-hullsbaner og nybegynnervennlige alternativer med kilder og oppdatert-dato."
  },
  {
    file: "klubber/index.html",
    title: "Discgolfklubber i Norge | Finn klubb, ukesgolf og lokalt miljø",
    description: "Finn norske discgolfklubber, se hvorfor klubbmiljø er nyttig, og bruk kilder for oppdatert info om lokale aktiviteter."
  },
  {
    file: "turneringer/index.html",
    title: "Discgolfturneringer | Påmelding, PDGA-rating og klasser forklart",
    description: "Guide til discgolfturneringer i Norge: hvem kan delta, påmelding, PDGA-rating, klasser, utstyr og offisielle terminliste-kilder."
  },
  {
    file: "teknikk/index.html",
    title: "Discgolf teknikk | Hyzer, nose angle, brace, forehand og putting",
    description: "Praktisk teknikkhub for discgolf med hyzer, anhyzer, nose angle, brace, forehand-feil, putting-rutine og vindkast."
  },
  {
    file: "trening/index.html",
    title: "Discgolf trening | Program, puttingøvelser og kast-drills",
    description: "Tren discgolf mer strukturert med enkle programmer, puttingtrening, backhand-drills, forehand-drills og konkrete øvelser."
  },
  {
    file: "guider/hvordan-begynne-med-discgolf.html",
    title: "Hvordan begynne med discgolf | Første runde, utstyr og regler",
    description: "Slik begynner du med discgolf: finn bane, velg enkle disker, lær grunnregler, unngå vanlige feil og spill første runde trygt."
  },
  {
    file: "guider/hvilken-discgolfdisk-skal-jeg-velge.html",
    title: "Hvilken discgolfdisk skal jeg velge? | Putter, midrange og driver",
    description: "Finn riktig discgolfdisk for nivået ditt: forstå putter, midrange, fairway-driver, stabilitet, vekt og vanlige nybegynnerfeil."
  },
  {
    file: "utstyr/beste-discgolfdisker-for-nybegynnere.html",
    title: "Beste discgolfdisker for nybegynnere | Research-basert guide",
    description: "Se hvilke discgolfdisker nybegynnere bør vurdere, hvorfor putter og midrange er trygt, og hvorfor raske drivere kan vente."
  },
  {
    file: "utstyr/discgolf-startsett.html",
    title: "Discgolf startsett | Hva bør et godt startsett inneholde?",
    description: "Slik vurderer du discgolf startsett: putter, midrange, fairway-driver, vanlige feil og når enkeltdisker er bedre."
  },
  {
    file: "regler.html",
    title: "Discgolf regler | Enkelt forklart for nybegynnere",
    description: "Lær de viktigste reglene i discgolf, hvordan poeng telles, hva OB betyr, og hva du bør vite før første runde."
  }
];

const linkInserts = [
  {
    file: "nybegynnerguide.html",
    marker: "</main>",
    html: `<section class="section alt"><div class="container"><div class="section-head"><div><p class="eyebrow">Neste steg</p><h2>Gå videre etter første runde</h2></div></div><div class="grid"><article class="card"><h3>Finn bane</h3><p>Start med en nybegynnervennlig bane eller en lokal byguide.</p><a href="/baner/">Se discgolfbaner i Norge</a></article><article class="card"><h3>Finn klubb</h3><p>Klubber kan hjelpe deg inn i ukesgolf, miljø og lokale regler.</p><a href="/klubber/">Se discgolfklubber</a></article><article class="card"><h3>Prøv turnering</h3><p>Lær påmelding, klasser og hva første turnering krever.</p><a href="/turneringer/forste-turnering/">Les om første turnering</a></article></div></div></section>\n  `
  },
  {
    file: "utstyrsguide.html",
    marker: "</main>",
    html: `<section class="section alt"><div class="container"><div class="section-head"><div><p class="eyebrow">Bruk utstyret riktig</p><h2>Utstyr henger sammen med bane og nivå</h2></div></div><div class="grid"><article class="card"><h3>Første runde</h3><p>Se hva du faktisk trenger før du kjøper mer.</p><a href="/guider/slik-spiller-du-forste-runde.html">Planlegg første runde</a></article><article class="card"><h3>Baner</h3><p>Velg disker etter banetype, vind og risiko for å miste disk.</p><a href="/baner/">Finn baner</a></article><article class="card"><h3>Trening</h3><p>Få mer ut av få disker med enkle øvelser.</p><a href="/trening/">Se treningshuben</a></article></div></div></section>\n  `
  },
  {
    file: "baner/index.html",
    marker: "<section><h2>Kilder</h2>",
    html: `<section><h2>Gå videre fra baner</h2>${pills([["/klubber/", "Finn klubb"], ["/turneringer/", "Prøv turnering"], ["/guider/slik-spiller-du-forste-runde.html", "Første runde"], ["/utstyr/discgolf-utstyrsliste.html", "Utstyrsliste"], ["/guider/discgolf-etikette.html", "Etikette"]])}</section>`
  },
  {
    file: "klubber/index.html",
    marker: "<section><h2>Les også</h2>",
    html: `<section><h2>Fra klubb til spill</h2>${pills([["/turneringer/", "Turneringer"], ["/baner/", "Baner"], ["/turneringer/forste-turnering/", "Første turnering"], ["/guider/discgolf-regler-for-nybegynnere.html", "Regler"], ["/kontakt/", "Send klubbinfo"]])}</section>`
  },
  {
    file: "turneringer/index.html",
    marker: "<section><h2>Les også</h2>",
    html: `<section><h2>Forbered deg til turnering</h2>${pills([["/guider/discgolf-regler-for-nybegynnere.html", "Regler"], ["/teknikk/putting-rutine/", "Putting-rutine"], ["/trening/putting-trening/", "Puttingtrening"], ["/utstyr/discgolf-utstyrsliste.html", "Utstyrsliste"], ["/klubber/", "Finn klubb"]])}</section>`
  }
];

function pills(items) {
  return `<div class="pill-row">${items.map(([href, label]) => `<a class="pill" href="${href}">${label}</a>`).join("")}</div>`;
}

function getTitle(html) {
  return (html.match(/<title>(.*?)<\/title>/s) || [])[1] || "";
}

function getDescription(html) {
  return (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "";
}

function replaceMeta(html, name, content) {
  const re = new RegExp(`<meta name="${name}" content="[^"]*">`);
  const tag = `<meta name="${name}" content="${content.replaceAll('"', "&quot;")}">`;
  return re.test(html) ? html.replace(re, tag) : html.replace("</head>", `  ${tag}\n</head>`);
}

function replaceProperty(html, property, content) {
  const re = new RegExp(`<meta property="${property}" content="[^"]*">`);
  const tag = `<meta property="${property}" content="${content.replaceAll('"', "&quot;")}">`;
  return re.test(html) ? html.replace(re, tag) : html.replace("</head>", `  ${tag}\n</head>`);
}

function updateMetadata(file, title, description) {
  let html = readFileSync(file, "utf8");
  const oldTitle = getTitle(html);
  const oldDescription = getDescription(html);

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  html = replaceMeta(html, "description", description);
  html = replaceProperty(html, "og:title", title);
  html = replaceProperty(html, "og:description", description);
  html = replaceMeta(html, "twitter:title", title);
  html = replaceMeta(html, "twitter:description", description);
  writeFileSync(file, html, "utf8");

  return { file, oldTitle, title, oldDescription, description };
}

const changes = metadataUpdates.map((item) => updateMetadata(item.file, item.title, item.description));

for (const insert of linkInserts) {
  let html = readFileSync(insert.file, "utf8");
  if (!html.includes(insert.html.trim()) && html.includes(insert.marker)) {
    html = html.replace(insert.marker, `${insert.html}${insert.marker}`);
    writeFileSync(insert.file, html, "utf8");
  }
}

const log = `# Title/meta test log

| URL | Gammel title | Ny title | Gammel meta | Ny meta | Begrunnelse | Dato |
|---|---|---|---|---|---|---|
${changes.map((change) => `| /${change.file.replaceAll("\\", "/")} | ${change.oldTitle.replaceAll("|", "\\|")} | ${change.title.replaceAll("|", "\\|")} | ${change.oldDescription.replaceAll("|", "\\|")} | ${change.description.replaceAll("|", "\\|")} | Mer konkret søkeintensjon og tydeligere nytteverdi uten clickbait | ${date} |`).join("\n")}
`;

writeFileSync("docs/title-meta-test-log.md", log, "utf8");
console.log(JSON.stringify({ metadataChanges: changes.length, linkInsertTargets: linkInserts.length }, null, 2));
