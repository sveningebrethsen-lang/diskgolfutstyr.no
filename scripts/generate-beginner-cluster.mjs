import { mkdirSync, writeFileSync } from "node:fs";

const baseUrl = "https://diskgolfutstyr.no";
const updatedDisplay = "3. juni 2026";
const updatedIso = "2026-06-03";

const researchLabel = "Dette er en research-basert sammenligning basert på produsentdata, offentlige spesifikasjoner og spillererfaringer. Produktene er ikke fysisk testet av Diskgolfutstyr.";

const sources = {
  pdgaBeginner: ["PDGA - Disc golf beginner guide", "https://www.pdga.com/node/276016", "grunnleggende forklaring av sporten"],
  pdgaRules: ["PDGA Official Rules", "https://www.pdga.com/rules", "offisiell regelkilde"],
  udisc: ["UDisc", "https://udisc.com/", "baner, score og baneinformasjon"],
  udiscNorway: ["UDisc - Norway courses", "https://udisc.com/best-disc-golf-courses/norway", "norske baner og spillervurderinger"],
  naif: ["NAIF Amerikanske Idretter", "https://amerikanskeidretter.no/", "norsk organisering og konkurranser"],
  latitude: ["Latitude 64 - Beginner guide", "https://latitude64.com/disc-golf-beginner-guide", "produsentguide om disktyper og startoppsett"],
  innovaStarter: ["Innova - Starter set", "https://www.innovadiscs.com/disc-golf-starter-set/", "eksempel på typisk startsett"],
  innovaCompare: ["Innova - Disc comparison", "https://www.innovadiscs.com/disc-golf-discs/disc-comparison/", "flight numbers og diskroller"]
};

const links = {
  hub: ["/nybegynnerguide.html", "Nybegynnerhub"],
  hva: ["/guider/hva-er-discgolf.html", "Hva er discgolf?"],
  start: ["/guider/hvordan-begynne-med-discgolf.html", "Hvordan begynne med discgolf"],
  regler: ["/guider/discgolf-regler-for-nybegynnere.html", "Regler for nybegynnere"],
  diskvalg: ["/guider/hvilken-discgolfdisk-skal-jeg-velge.html", "Velg riktig disk"],
  typer: ["/guider/putter-midrange-og-driver-forklart.html", "Putter, midrange og driver"],
  flight: ["/guider/flight-numbers.html", "Flight numbers"],
  besteDisker: ["/guider/beste-disker-for-nybegynnere.html", "Beste disker for nybegynnere"],
  startsett: ["/guider/discgolf-startsett.html", "Discgolf startsett"],
  feil: ["/guider/vanlige-feil-for-nybegynnere.html", "Vanlige feil"],
  backhand: ["/guider/backhand-for-nybegynnere.html", "Backhand"],
  forehand: ["/guider/forehand-for-nybegynnere.html", "Forehand"],
  putting: ["/guider/putting-for-nybegynnere.html", "Putting"],
  ord: ["/guider/discgolf-ord-og-uttrykk.html", "Ord og uttrykk"],
  utstyr: ["/guider/hva-trenger-du-av-discgolfutstyr.html", "Hva trenger du av utstyr?"],
  forsteRunde: ["/guider/slik-spiller-du-forste-runde.html", "Første runde"],
  putter: ["/guider/hvordan-velge-riktig-putter.html", "Velg putter"],
  midrange: ["/guider/hvordan-velge-riktig-midrange.html", "Velg midrange"],
  driver: ["/guider/hvordan-velge-riktig-driver.html", "Velg driver"],
  etikette: ["/guider/discgolf-etikette.html", "Discgolf etikette"],
  faq: ["/guider/ofte-stilte-sporsmal-om-discgolf.html", "Ofte stilte spørsmål"],
  utstyrHub: ["/utstyrsguide.html", "Utstyrsguide"],
  tester: ["/tester/beste-discgolf-startsett.html", "Research-basert startsettguide"]
};

function nav(prefix = "/") {
  return `<header class="site-header"><div class="nav-wrap"><a class="brand" href="${prefix}index.html"><img src="${prefix}assets/logo-full.svg" alt="Diskgolfutstyr"></a><button class="menu-button" type="button" aria-label="Åpne meny" aria-expanded="false" data-menu-button>☰</button><nav class="nav" aria-label="Hovedmeny" data-nav><a href="${prefix}nybegynnerguide.html">Nybegynner</a><a href="${prefix}artikler.html">Guider</a><a href="${prefix}regler.html">Regler</a><a href="${prefix}utstyr/">Utstyr</a><a href="${prefix}tester.html">Tester</a><a href="${prefix}baneguide.html">Baner</a></nav></div></header>`;
}

function footer(prefix = "/") {
  return `<footer class="site-footer"><div class="footer-inner"><div class="footer-brand"><img src="${prefix}assets/logo-light.svg" alt="Diskgolfutstyr"><span>Uavhengig norsk portal for discgolf. Guider først, affiliate sekundært.</span></div><div class="footer-links"><a href="${prefix}nybegynnerguide.html">Nybegynner</a><a href="${prefix}artikler.html">Guider</a><a href="${prefix}affiliate-info.html">Affiliate-info</a><a href="${prefix}om.html">Om</a></div></div></footer>`;
}

function sourceList(keys) {
  return keys.map((key) => {
    const [name, url, note] = sources[key];
    return `<li><a href="${url}">${name}</a>${note ? ` - ${note}` : ""}</li>`;
  }).join("");
}

function pillLinks(items) {
  return `<div class="pill-row">${items.map(([href, label]) => `<a class="pill" href="${href}">${label}</a>`).join("")}</div>`;
}

function productBox({ name, type, fits, why, pros, cons }) {
  return `<article class="product-box">
    <span class="badge badge-research">Research-basert - ikke fysisk testet</span>
    <h3>${name}</h3>
    <p><strong>Type:</strong> ${type}</p>
    <p><strong>Passer for:</strong> ${fits}</p>
    <p>${why}</p>
    <div class="pros-cons"><div><h4>Fordeler</h4><ul>${pros.map((x) => `<li>${x}</li>`).join("")}</ul></div><div><h4>Ulemper</h4><ul>${cons.map((x) => `<li>${x}</li>`).join("")}</ul></div></div>
    <a class="button button-disabled" href="#" aria-disabled="true">Se produkt</a>
  </article>`;
}

function faqBlock(faq) {
  if (!faq?.length) return "";
  return `<section id="faq"><h2>Ofte stilte spørsmål</h2>${faq.map((item) => `<h3>${item.q}</h3><p>${item.a}</p>`).join("")}</section>`;
}

function jsonLd(page) {
  const article = {
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
    publisher: {
      "@type": "Organization",
      name: "Diskgolfutstyr",
      logo: { "@type": "ImageObject", url: `${baseUrl}/assets/logo-icon.svg` }
    }
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Diskgolfutstyr", item: `${baseUrl}/` },
      { "@type": "ListItem", position: 2, name: "Nybegynner", item: `${baseUrl}/nybegynnerguide.html` },
      { "@type": "ListItem", position: 3, name: page.h1, item: `${baseUrl}/${page.path}` }
    ]
  };
  const schemas = [article, breadcrumb];
  if (page.faq?.length) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a }
      }))
    });
  }
  return JSON.stringify(schemas);
}

function pageHtml(page) {
  const tocItems = [...page.sections.map((s) => [s.id, s.heading]), ...(page.faq?.length ? [["faq", "Ofte stilte spørsmål"]] : [])];
  const sections = page.sections.map((section) => `<section id="${section.id}"><h2>${section.heading}</h2>${section.body}</section>`).join("\n");
  return `<!doctype html>
<html lang="no">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${page.title}</title>
  <meta name="description" content="${page.description}">
  <meta name="robots" content="index, follow">
  <meta property="og:title" content="${page.h1}">
  <meta property="og:description" content="${page.description}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${baseUrl}/${page.path}">
  <meta property="og:image" content="${baseUrl}/assets/hero-banner.svg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${page.h1}">
  <meta name="twitter:description" content="${page.description}">
  <meta name="twitter:image" content="${baseUrl}/assets/hero-banner.svg">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="canonical" href="${baseUrl}/${page.path}">
  <link rel="stylesheet" href="/assets/css/styles.css">
  <script src="/assets/js/site.js" defer></script>
  <script type="application/ld+json" data-managed-seo>${jsonLd(page)}</script>
</head>
<body>
${nav("/")}
  <main>
    <article>
      <section class="page-hero">
        <div class="container">
          <p class="eyebrow">${page.category}</p>
          <h1>${page.h1}</h1>
          <p class="lead">${page.ingress}</p>
          <div class="article-meta"><span>Oppdatert: ${updatedDisplay}</span><span>Målgruppe: ${page.audience}</span><span>${page.evidence || "Guide/research"}</span></div>
        </div>
      </section>
      <section class="section">
        <div class="container article-layout">
          <aside class="toc" aria-label="Innholdsfortegnelse"><h2>Innhold</h2><ol>${tocItems.map(([id, label]) => `<li><a href="#${id}">${label}</a></li>`).join("")}</ol></aside>
          <div class="article-body">
            ${page.notice || ""}
            ${sections}
            ${faqBlock(page.faq)}
            <section><h2>Neste steg</h2>${pillLinks(page.related)}</section>
            <section><h2>Kilder</h2><ul class="source-list">${sourceList(page.sources)}</ul></section>
          </div>
        </div>
      </section>
    </article>
  </main>
${footer("/")}
</body>
</html>`;
}

const pages = [
  {
    path: "guider/hva-er-discgolf.html",
    title: "Hva er discgolf? | Enkel norsk guide for nybegynnere",
    h1: "Hva er discgolf?",
    category: "Nybegynner",
    audience: "Helt nye spillere",
    description: "Lær hva discgolf er, hvordan en runde fungerer, hva du trenger og hvordan du kommer trygt i gang.",
    ingress: "Discgolf er en enkel sport å prøve, men mye lettere å like når du skjønner banen, diskene og de viktigste reglene før første kast.",
    related: [links.start, links.regler, links.diskvalg, links.forsteRunde],
    sources: ["pdgaBeginner", "pdgaRules", "udisc"],
    faq: [
      { q: "Er discgolf gratis?", a: "Mange norske baner er gratis å spille på, men enkelte baner eller arrangementer kan ha avgift. Sjekk lokal baneinformasjon før du reiser." },
      { q: "Trenger jeg egne disker?", a: "Du trenger minst én disk for å spille, men du kan ofte låne av venner eller klubb første gang. En nøytral midrange eller putter er nok til å prøve." },
      { q: "Hvor lang tid tar en runde?", a: "En kort runde kan ta under en time, mens en full 18-hulls runde ofte tar lenger. Antall spillere, kø og banetype betyr mye." },
      { q: "Kan barn spille discgolf?", a: "Ja, barn kan spille discgolf hvis banen er trygg og en voksen følger med. Lette disker og korte hull gjør starten enklere." }
    ],
    sections: [
      { id: "kort-forklart", heading: "Kort forklart", body: "<p>Discgolf spilles omtrent som golf, men med disker og kurver. Du starter på et utslagssted, kaster mot kurven og fortsetter fra der disken lander. Målet er å bruke færrest mulig kast.</p><p>For en ny spiller er det viktigere å kaste trygt og finne neste hull enn å jage lengde. En rolig runde med få disker gir ofte mer læring enn å prøve alt på én gang.</p>" },
      { id: "hva-trenger-du", heading: "Hva trenger du for å prøve?", body: "<p>Du kan starte med én disk. Skal du kjøpe noe, er putter og midrange det mest fornuftige. En rask distance-driver ser fristende ut, men er ofte vanskeligere å kontrollere for nye spillere.</p><div class=\"callout\"><strong>Enkel start:</strong> lån en disk, spill en kort bane, og bruk første runde på å forstå hvordan banen flyter.</div>" },
      { id: "slik-fungerer-banen", heading: "Slik fungerer en bane", body: "<p>En bane består av hull med tee, fairway og kurv. Noen hull har OB, mando eller andre lokale regler. Les tee-skilt og bruk gjerne UDisc eller lokal klubbinfo hvis du er usikker.</p>" },
      { id: "forste-mal", heading: "Hva bør målet være første gang?", body: "<p>Målet bør være å ha kontroll, ikke å kaste lengst. Kast kortere, hold deg i fairway og slipp raskere grupper forbi. Det gjør runden hyggeligere for både deg og andre.</p>" }
    ]
  },
  {
    path: "guider/hvordan-begynne-med-discgolf.html",
    title: "Hvordan begynne med discgolf | Første steg for nye spillere",
    h1: "Hvordan begynne med discgolf",
    category: "Nybegynner",
    audience: "Nye spillere og foreldre",
    description: "Steg-for-steg-guide til å begynne med discgolf: banevalg, disker, regler, etikette og første runde.",
    ingress: "Du trenger ikke mye utstyr eller forkunnskap. Det viktigste er å starte enkelt og velge en bane som passer nivået ditt.",
    related: [links.hva, links.utstyr, links.forsteRunde, links.etikette],
    sources: ["pdgaBeginner", "udiscNorway", "pdgaRules"],
    sections: [
      { id: "steg", heading: "Start med fem enkle steg", body: "<ol><li>Finn en kort eller nybegynnervennlig bane.</li><li>Ta med én til tre disker.</li><li>Les tee-skiltet før du kaster.</li><li>Kast kontrollert, ikke hardt.</li><li>Spill ferdig uten å stresse med score.</li></ol>" },
      { id: "banevalg", heading: "Velg riktig bane", body: "<p>En god førstebane har tydelige skilt, moderate lengder og lite farlig OB. En toppbane for erfarne spillere er ikke alltid den beste banen å lære på.</p>" },
      { id: "utstyr", heading: "Ikke kjøp for mye utstyr", body: "<p>En putter og en midrange holder lenge. Legg til en fairway-driver når du begynner å få kontroll på retning og vinkel.</p>" },
      { id: "vanlige-feil", heading: "Vanlige startfeil", body: "<p>De vanligste feilene er å kjøpe for raske drivere, kaste for hardt og bli for opptatt av score. Bruk første runde på å lære spillet.</p>" }
    ]
  },
  {
    path: "guider/discgolf-regler-for-nybegynnere.html",
    title: "Discgolf regler for nybegynnere | Enkelt forklart",
    h1: "Discgolf regler for nybegynnere",
    category: "Regler",
    audience: "Nye spillere",
    description: "De viktigste discgolfreglene nye spillere bør kunne: rekkefølge, lie, OB, mando, sikkerhet og baneskikk.",
    ingress: "Du trenger ikke kunne hele regelboken før første runde. Men noen få regler gjør spillet tryggere, ryddigere og mer rettferdig.",
    related: [links.hva, links.etikette, links.forsteRunde, ["/regler.html", "Regelhubb"]],
    sources: ["pdgaRules", "pdgaBeginner"],
    sections: [
      { id: "rekkefolge", heading: "Hvem kaster først?", body: "<p>Fra tee kaster vanligvis spilleren med best score på forrige hull først. Etter utslaget kaster den som ligger lengst fra kurven. På en rolig nybegynnerrunde er det viktigste å være enige og spille trygt.</p>" },
      { id: "lie", heading: "Hva er lie?", body: "<p>Lie er stedet du skal kaste neste kast fra. I uformelt spill holder det ofte å kaste fra omtrent der disken ligger. I turnering er fotplassering og markering mer presist regulert.</p>" },
      { id: "ob-mando", heading: "OB og mando", body: "<p>OB betyr out-of-bounds, altså utenfor banen. Mando betyr at du må passere et bestemt hinder på riktig side. Disse reglene står ofte på tee-skilt eller i caddybok.</p>" },
      { id: "sikkerhet", heading: "Sikkerhet først", body: "<p>Kast aldri hvis du kan treffe noen. Rop tydelig hvis en disk er på vei mot folk. Vent heller ti sekunder ekstra enn å skape en farlig situasjon.</p>" }
    ]
  },
  {
    path: "guider/hvilken-discgolfdisk-skal-jeg-velge.html",
    title: "Hvilken discgolfdisk skal jeg velge? | Norsk nybegynnerguide",
    h1: "Hvilken discgolfdisk skal jeg velge?",
    category: "Diskvalg",
    audience: "Nybegynnere som skal kjøpe eller låne disk",
    description: "Praktisk guide til å velge discgolfdisk etter nivå, bane, bruksområde og flight numbers.",
    ingress: "Riktig disk er ikke den raskeste disken. Riktig disk er den du faktisk klarer å kontrollere på banen du spiller.",
    related: [links.typer, links.flight, links.besteDisker, links.startsett],
    sources: ["pdgaBeginner", "latitude", "innovaCompare"],
    sections: [
      { id: "rolle", heading: "Start med rollen disken skal ha", body: "<p>Skal disken brukes til putting, rette kast, korte innspill eller litt mer lengde? Når rollen er klar, blir valget enklere. Nye spillere bør prioritere kontroll fremfor maksimal speed.</p>" },
      { id: "nivaa", heading: "Tilpass disken til nivået ditt", body: "<p>Lavere speed, nøytral stabilitet og godt grep er ofte best i starten. Hvis disken alltid stuper hardt til venstre for høyrehendt backhand, er den sannsynligvis for rask eller for stabil for kastet ditt.</p>" },
      { id: "bane", heading: "Tenk på banen du spiller", body: "<p>På korte norske skogsbaner kan midrange og fairway-driver være mer nyttig enn distance-driver. På åpne hull kan mer glide være fint, men i vind må du være mer forsiktig.</p>" },
      { id: "tre-disker", heading: "Et godt førsteoppsett", body: "<p>Et enkelt oppsett er putter, midrange og rolig fairway-driver. Det gir nok variasjon til å lære spillet uten at bagen blir forvirrende.</p>" }
    ]
  },
  {
    path: "guider/putter-midrange-og-driver-forklart.html",
    title: "Putter, midrange og driver forklart | Discgolf for nybegynnere",
    h1: "Putter, midrange og driver forklart",
    category: "Disktyper",
    audience: "Nye spillere",
    description: "Forstå forskjellen på putter, midrange, fairway-driver og distance-driver, og når du bør bruke dem.",
    ingress: "Disktypene kan virke forvirrende, men rollene er ganske enkle: putter gir kontroll kort, midrange gir rette kast, driver gir mer lengde når du har nok fart.",
    related: [links.diskvalg, links.flight, links.putter, links.midrange],
    sources: ["pdgaBeginner", "latitude", "innovaCompare"],
    sections: [
      { id: "putter", heading: "Putter", body: "<p>Putteren brukes til putting og korte kast. Den har lav speed, er lett å kontrollere og avslører teknikkfeil uten å straffe deg like hardt som en rask driver.</p>" },
      { id: "midrange", heading: "Midrange", body: "<p>Midrange er ofte den beste læringsdisken. Den passer til rette kast, rolige hyzere og hull der presisjon er viktigere enn lengde.</p>" },
      { id: "fairway", heading: "Fairway-driver", body: "<p>Fairway-driveren er et naturlig neste steg når du vil ha mer lengde, men fortsatt trenger kontroll. For mange nybegynnere er dette bedre enn distance-driver.</p>" },
      { id: "distance", heading: "Distance-driver", body: "<p>Distance-drivere krever mer fart og teknikk. Hvis du ikke får dem opp i riktig hastighet, kan de gi kortere og mer ukontrollerte kast enn en roligere fairway-driver.</p>" }
    ]
  },
  {
    path: "guider/flight-numbers.html",
    title: "Flight numbers forklart | Speed, glide, turn og fade",
    h1: "Flight numbers forklart",
    category: "Disktyper",
    audience: "Nye og viderekomne spillere",
    description: "Speed, glide, turn og fade forklart på norsk med praktiske eksempler for discgolfspillere.",
    ingress: "Flight numbers er nyttige, men de er ikke fasit. De sier noe om hvordan disken er ment å fly når den kastes med nok fart og god teknikk.",
    related: [links.typer, links.driver, links.midrange, links.putter],
    sources: ["innovaCompare", "latitude", "pdgaBeginner"],
    sections: [
      { id: "speed", heading: "Speed", body: "<p>Speed beskriver hvor rask disken er laget for å fly. Nye spillere bør ofte velge lavere speed fordi disken da er lettere å få opp i riktig hastighet.</p>" },
      { id: "glide", heading: "Glide", body: "<p>Glide beskriver hvor godt disken holder seg i lufta. Mye glide kan gi ekstra lengde, men kan også gjøre disken mer påvirket av vind.</p>" },
      { id: "turn", heading: "Turn", body: "<p>Turn beskriver hvordan disken oppfører seg i høy fart. Negative turn-tall betyr at disken lettere kan vende før den fader tilbake.</p>" },
      { id: "fade", heading: "Fade", body: "<p>Fade er avslutningen når disken mister fart. Høy fade gir en tydeligere avslutning til venstre for høyrehendt backhand.</p>" },
      { id: "praktisk", heading: "Slik bruker du tallene", body: "<p>Bruk tallene til å sammenligne disker, ikke som en garanti. Din teknikk, vind, vekt, plast og slitasje påvirker flyvningen.</p>" }
    ]
  },
  {
    path: "guider/beste-disker-for-nybegynnere.html",
    title: "Beste disker for nybegynnere | Research-basert guide",
    h1: "Anbefalte disker for nybegynnere",
    category: "Utstyr",
    audience: "Nye spillere som skal kjøpe disk",
    description: "Research-basert guide til gode discgolfdisker for nybegynnere, med tydelig merking av at produktene ikke er fysisk testet.",
    ingress: "Dette er ikke en fysisk test. Målet er å vise typer og konkrete alternativer nye spillere ofte kan vurdere, med tydelige forbehold.",
    evidence: "Research-basert sammenligning",
    notice: `<p class="research-note">${researchLabel}</p><p class="disclaimer">Noen lenker kan være annonselenker. Det koster deg ikke noe ekstra, men kan gi Diskgolfutstyr en liten provisjon.</p>`,
    related: [links.flight, links.startsett, links.diskvalg, links.typer],
    sources: ["pdgaBeginner", "latitude", "innovaStarter", "innovaCompare"],
    faq: [
      { q: "Hvor mange disker trenger en nybegynner?", a: "Én til tre disker er nok. Putter og midrange er viktigst, og en rolig fairway-driver kan legges til etter hvert." },
      { q: "Bør jeg kjøpe driver først?", a: "Som regel nei. Mange nye spillere får bedre kontroll og like god praktisk lengde med midrange eller fairway-driver." },
      { q: "Hvilken vekt bør jeg velge?", a: "Mange nye spillere trives med litt lettere disker, men grep, vind og diskrolle betyr også mye." }
    ],
    sections: [
      { id: "kriterier", heading: "Hva gjør en disk nybegynnervennlig?", body: "<p>En nybegynnervennlig disk bør være lett å få opp i fart, ha forutsigbar flyvning og ikke kreve perfekt teknikk. Lavere speed og nøytral stabilitet er ofte et godt utgangspunkt.</p>" },
      { id: "alternativer", heading: "Gode alternativer å vurdere", body: `<div class="product-grid">${productBox({ name: "Innova Aviar", type: "Putter", fits: "Putting og korte kast", why: "Klassisk puttertype med lav speed og enkel rolle i bagen.", pros: ["Tydelig putterrolle", "Rimelig i baseplast", "Kan brukes fra første dag"], cons: ["Grep og dybde passer ikke alle", "Baseplast slites raskere"] })}${productBox({ name: "Discraft Buzzz", type: "Midrange", fits: "Rette kast og kontroll", why: "Populær midrange-type som ofte brukes lenge etter nybegynnerfasen.", pros: ["Allsidig rolle", "Fin til teknikktrening", "Mange plastvalg"], cons: ["Kan være litt rask for helt ferske", "Ikke best i sterk motvind"] })}${productBox({ name: "Latitude 64 River", type: "Fairway-driver", fits: "Kontrollert lengde", why: "Fairway-driver med mye glide som kan være et roligere steg mot driverkast.", pros: ["Mer kontroll enn distance-driver", "God på skogshull", "Kan gi lengde ved moderat arm"], cons: ["Kan bli følsom i motvind", "Krever vinkelkontroll"] })}</div>` },
      { id: "ikke-kjop-for-mye", heading: "Ikke kjøp for mye først", body: "<p>Det er bedre å lære tre disker godt enn å kjøpe ti disker du ikke forstår. Start enkelt, noter hva du savner, og bygg bagen etter banene du faktisk spiller.</p>" },
      { id: "neste-kjop", heading: "Når bør du kjøpe neste disk?", body: "<p>Kjøp neste disk når du vet hvilken rolle som mangler: mer kontroll i vind, en putter som føles bedre, eller en fairway-driver som gir litt mer lengde uten å miste retning.</p>" }
    ]
  },
  {
    path: "guider/discgolf-startsett.html",
    title: "Discgolf startsett | Hva bør et startsett inneholde?",
    h1: "Discgolf startsett for nybegynnere",
    category: "Utstyr",
    audience: "Nye spillere og gavekjøpere",
    description: "Slik vurderer du discgolf startsett: hvilke disker som bør være med, hva du bør unngå og når enkeltdisker er bedre.",
    ingress: "Et startsett kan være en fin vei inn i sporten, men bare hvis diskene faktisk passer en ny spiller.",
    evidence: "Research-basert guide",
    notice: `<p class="research-note">${researchLabel}</p>`,
    related: [links.besteDisker, links.diskvalg, links.typer, links.tester],
    sources: ["innovaStarter", "latitude", "pdgaBeginner"],
    sections: [
      { id: "innhold", heading: "Hva bør være i et startsett?", body: "<p>Et godt startsett har tydelige roller: putter, midrange og gjerne en rolig fairway-driver. Det bør ikke bare være tre tilfeldige disker i rimelig plast.</p>" },
      { id: "unngaa", heading: "Dette bør du unngå", body: "<p>Unngå sett der driveren er veldig rask eller der diskene overlapper for mye. For en ny spiller er kontroll viktigere enn at pakken ser komplett ut.</p>" },
      { id: "startsett-vs-enkeltdisker", heading: "Startsett eller enkeltdisker?", body: "<p>Startsett er enkelt og ofte rimelig. Enkeltdisker kan være bedre hvis du får hjelp av butikk, klubb eller en erfaren spiller til å velge riktige modeller.</p>" },
      { id: "produktmal", heading: "Produktseksjon som kan fylles ut senere", body: `<div class="product-grid">${productBox({ name: "Typisk 3-disk startsett", type: "Startsett", fits: "Første runder og gave", why: "Gir tre hovedroller uten at du trenger å velge alt selv.", pros: ["Lav terskel", "Enkelt å kjøpe", "Nok til første runde"], cons: ["Ikke alltid optimal driver", "Baseplast kan slites", "Passer ikke alle hender"] })}</div>` }
    ]
  },
  {
    path: "guider/vanlige-feil-for-nybegynnere.html",
    title: "Vanlige feil for nybegynnere i discgolf | Slik unngår du dem",
    h1: "Vanlige feil for nybegynnere i discgolf",
    category: "Vanlige feil",
    audience: "Nye spillere",
    description: "De vanligste feilene nye discgolfspillere gjør med diskvalg, kasteteknikk, regler og første runde.",
    ingress: "De fleste nybegynnerfeil handler ikke om talent. De handler om feil disk, for mye kraft og for lite kontroll.",
    related: [links.diskvalg, links.flight, links.backhand, links.forsteRunde],
    sources: ["pdgaBeginner", "latitude", "pdgaRules"],
    sections: [
      { id: "driver", heading: "1. For rask driver", body: "<p>En rask driver krever mer fart enn mange nye spillere har. Resultatet blir ofte tidlig fade, lite lengde og flere disker i kratt.</p>" },
      { id: "kraft", heading: "2. For mye kraft", body: "<p>Kraft uten balanse gir ofte nesa opp, wobble og dårlig retning. Tren rolige kast med putter eller midrange før du øker tempo.</p>" },
      { id: "mange-disker", heading: "3. For mange disker", body: "<p>Hvis du bytter disk hele tiden, lærer du ikke hva som er disken og hva som er kastet. Bruk få disker til du kjenner dem.</p>" },
      { id: "regler", heading: "4. Glemme sikkerhet og etikette", body: "<p>Vent på folk foran deg, rop hvis en disk kan treffe noen, og slipp raskere grupper forbi. Det betyr mer enn scoren på første runde.</p>" }
    ]
  },
  {
    path: "guider/backhand-for-nybegynnere.html",
    title: "Backhand for nybegynnere | Discgolf teknikk",
    h1: "Backhand for nybegynnere",
    category: "Kasteteknikk",
    audience: "Nye spillere",
    description: "Lær backhand i discgolf med fokus på grep, balanse, retning, release og vanlige feil.",
    ingress: "Backhand er kastet mange starter med. Det viktigste i starten er ikke kraft, men balanse og ren release.",
    related: [links.feil, links.flight, links.typer, links.forehand],
    sources: ["pdgaBeginner", "latitude"],
    sections: [
      { id: "grep", heading: "Grep", body: "<p>Hold disken fast nok til at den ikke glipper, men ikke så hardt at hånden låser seg. Nye spillere kan starte med et kontrollgrep før de trener power grip.</p>" },
      { id: "balanse", heading: "Balanse før fart", body: "<p>Stå stabilt og la kastet gå langs en tydelig linje. Hvis du mister balansen etter kastet, prøver du trolig å skape fart på feil måte.</p>" },
      { id: "release", heading: "Ren release", body: "<p>En ren release gir mindre wobble. Bruk putter eller midrange hvis du vil se teknikkfeil tydelig.</p>" },
      { id: "ovelse", heading: "En enkel øvelse", body: "<p>Kast 10 rolige midrange-kast mot samme punkt. Målet er ikke lengde, men at alle starter på omtrent samme linje.</p>" }
    ]
  },
  {
    path: "guider/forehand-for-nybegynnere.html",
    title: "Forehand for nybegynnere | Discgolf teknikk",
    h1: "Forehand for nybegynnere",
    category: "Kasteteknikk",
    audience: "Nye spillere",
    description: "Forehand forklart enkelt: grep, håndledd, vinkel, diskvalg og vanlige feil for nye discgolfspillere.",
    ingress: "Forehand er nyttig rundt hindringer og på hull som ikke passer backhand. Start kort og kontrollert før du prøver å kaste hardt.",
    related: [links.backhand, links.feil, links.driver, links.etikette],
    sources: ["pdgaBeginner", "latitude"],
    sections: [
      { id: "grep", heading: "Grep og håndledd", body: "<p>Forehandgrep bør gi støtte under kanten av disken. Håndleddet bidrar med spinn, men kastet bør ikke bare være en hard flikk.</p>" },
      { id: "vinkel", heading: "Vinkelkontroll", body: "<p>Forehand avslører vinkel raskt. Start med korte kast og nøytrale disker før du bruker veldig overstabile disker.</p>" },
      { id: "feil", heading: "Vanlige feil", body: "<p>De vanligste feilene er å rulle håndleddet, kaste for hardt og bruke for stabil disk for tidlig.</p>" },
      { id: "bruk", heading: "Når forehand er nyttig", body: "<p>Forehand er nyttig når du må rundt et hinder, når fairwayen bøyer motsatt vei av backhand, eller når du vil se målet på korte innspill.</p>" }
    ]
  },
  {
    path: "guider/putting-for-nybegynnere.html",
    title: "Putting for nybegynnere | Slik trener du discgolf-putting",
    h1: "Putting for nybegynnere",
    category: "Putting",
    audience: "Nye spillere",
    description: "Lær putting i discgolf med enkel rutine, avstandskontroll, grep og øvelser for nye spillere.",
    ingress: "Putting er der mange kast kan spares. Du trenger ikke avansert teknikk først, men du trenger en rutine du kan gjenta.",
    related: [links.putter, links.feil, links.regler, links.utstyr],
    sources: ["pdgaBeginner", "pdgaRules"],
    sections: [
      { id: "rutine", heading: "Lag en enkel rutine", body: "<p>Still deg likt hver gang, velg ett siktepunkt og gjennomfør uten for mange ekstra bevegelser. En enkel rutine gjør putting mindre tilfeldig.</p>" },
      { id: "avstand", heading: "Start nært nok", body: "<p>Tren fra avstander der du treffer ofte. Det er bedre å bygge selvtillit fra fem meter enn å bomme lenge fra ti.</p>" },
      { id: "grep", heading: "Grep og slipp", body: "<p>Disken bør slippe rent fra hånden. Hvis den vingler mye, ro ned og sjekk at du ikke klemmer ujevnt.</p>" },
      { id: "ovelse", heading: "Øvelse: 10 fra samme sted", body: "<p>Sett 10 putter fra fem meter. Når du treffer minst 7 av 10 flere runder på rad, flytter du deg litt lenger unna.</p>" }
    ]
  },
  {
    path: "guider/discgolf-ord-og-uttrykk.html",
    title: "Disc golf ord og uttrykk | Norsk ordliste",
    h1: "Disc golf ord og uttrykk",
    category: "Begreper",
    audience: "Nye spillere",
    description: "Norsk ordliste for discgolf: hyzer, anhyzer, OB, mando, birdie, bogey, fade, turn, lie og flere uttrykk.",
    ingress: "Discgolf bruker mange engelske ord. Denne ordlisten forklarer de viktigste begrepene på praktisk norsk.",
    related: [links.flight, links.regler, links.typer, links.etikette],
    sources: ["pdgaRules", "pdgaBeginner", "innovaCompare"],
    sections: [
      { id: "score", heading: "Scoreord", body: "<p>Par er forventet antall kast. Birdie er ett kast under par, bogey er ett kast over par. På første runde er det helt greit å ignorere score og bare lære banen.</p>" },
      { id: "regler", heading: "Regelord", body: "<p>OB betyr out-of-bounds. Mando betyr en pålagt rute rundt et hinder. Lie er stedet du skal kaste neste kast fra.</p>" },
      { id: "kast", heading: "Kast og vinkler", body: "<p>Hyzer og anhyzer beskriver vinkelen disken slippes på. Nose angle handler om om fronten av disken peker opp eller ned.</p>" },
      { id: "disk", heading: "Diskord", body: "<p>Turn, fade, glide og speed beskriver hvordan disken er ment å fly. Stabilitet beskriver om disken lett vender, flyr rett eller avslutter hardt.</p>" }
    ]
  },
  {
    path: "guider/hva-trenger-du-av-discgolfutstyr.html",
    title: "Hva trenger du av discgolfutstyr? | Nybegynnerguide",
    h1: "Hva trenger du av discgolfutstyr?",
    category: "Utstyr",
    audience: "Nye spillere",
    description: "En enkel guide til hva du faktisk trenger av discgolfutstyr: disker, sko, sekk, håndkle, drikke og valgfritt tilbehør.",
    ingress: "Du trenger mindre utstyr enn du tror. Start med få ting som gjør runden enklere, og vent med resten til du vet hva du savner.",
    related: [links.besteDisker, links.startsett, links.diskvalg, links.forsteRunde],
    sources: ["pdgaBeginner", "udisc", "latitude"],
    sections: [
      { id: "minimum", heading: "Minimum for første runde", body: "<p>Én disk, gode sko og klær etter været er nok for å prøve. Skal du kjøpe litt mer, er putter og midrange et trygt startpunkt.</p>" },
      { id: "praktisk", heading: "Praktiske ting som ofte hjelper", body: "<ul><li>Vannflaske</li><li>Lite håndkle</li><li>Telefon med baneapp eller kart</li><li>Klær og sko som tåler vått gress</li></ul>" },
      { id: "vent", heading: "Dette kan vente", body: "<p>Stor sekk, mange drivere, retriever og spesialisert tilbehør kan vente. Kjøp heller etter faktiske behov fra banene du spiller.</p>" },
      { id: "affiliate", heading: "Affiliate-klar produktstruktur", body: `<p class="disclaimer">Noen lenker kan være annonselenker. Det koster deg ikke noe ekstra, men kan gi Diskgolfutstyr en liten provisjon.</p>${productBox({ name: "Nybegynneroppsett", type: "Utstyrspakke", fits: "Første måned", why: "Putter, midrange, håndkle og enkel bæreplass dekker de fleste første runder.", pros: ["Lite å lære", "Lav pris", "Mindre valgstress"], cons: ["Ikke komplett for turnering", "Må tilpasses lokale baner"] })}` }
    ]
  },
  {
    path: "guider/slik-spiller-du-forste-runde.html",
    title: "Slik spiller du første runde discgolf | Praktisk guide",
    h1: "Slik spiller du din første runde",
    category: "Nybegynner",
    audience: "Helt nye spillere",
    description: "Praktisk steg-for-steg-guide til første runde discgolf: før du drar, på tee, underveis og etter runden.",
    ingress: "Første runde blir best når du gjør det enkelt: kort bane, få disker, rolig tempo og litt baneskikk.",
    related: [links.hva, links.regler, links.etikette, links.utstyr],
    sources: ["pdgaBeginner", "pdgaRules", "udiscNorway"],
    sections: [
      { id: "for-du-drar", heading: "Før du drar", body: "<p>Velg en bane som virker overkommelig, sjekk om den er åpen, og ta med vann. Hvis banen har mange hull, kan du spille bare ni første gang.</p>" },
      { id: "pa-tee", heading: "På første tee", body: "<p>Les tee-skiltet. Se hvor kurven står, og sjekk om det finnes OB eller mando. Kast først når fairwayen er fri.</p>" },
      { id: "underveis", heading: "Underveis på runden", body: "<p>Kast fra der disken ligger, ta deg tid til å finne neste tee, og la raskere grupper spille forbi hvis de tar deg igjen.</p>" },
      { id: "etter-runden", heading: "Etter runden", body: "<p>Noter hva som var vanskelig: retning, lengde, putting eller diskvalg. Det forteller deg hva neste guide bør være.</p>" }
    ]
  },
  {
    path: "guider/hvordan-velge-riktig-putter.html",
    title: "Hvordan velge riktig putter | Discgolf for nybegynnere",
    h1: "Hvordan velge riktig putter",
    category: "Utstyr",
    audience: "Nye spillere",
    description: "Slik velger du discgolf-putter etter grep, form, plast, puttingstil og korte kast.",
    ingress: "Putteren er disken du bruker mest. Velg den etter grep og trygghet, ikke etter hva en proff bruker.",
    evidence: "Research-basert kjøpsguide",
    notice: `<p class="research-note">${researchLabel}</p>`,
    related: [links.putting, links.besteDisker, links.startsett, links.flight],
    sources: ["pdgaBeginner", "latitude", "innovaCompare"],
    sections: [
      { id: "grep", heading: "Grep er viktigst", body: "<p>Putteren bør føles trygg i hånden. Noen liker dyp putter, andre vil ha lavere profil. Hvis mulig, hold flere puttere før du kjøper.</p>" },
      { id: "plast", heading: "Plast til putting", body: "<p>Baseplast gir ofte godt grep og lavere pris. Premiumplast kan være fint til kasteputtere, men er ikke alltid best til putting.</p>" },
      { id: "stabilitet", heading: "Stabilitet", body: "<p>En nøytral putter er ofte enklest å lære med. Veldig overstabile puttere kan være nyttige senere, men er ikke nødvendig for første runde.</p>" },
      { id: "produkt", heading: "Eksempel på puttervalg", body: productBox({ name: "Klassisk nøytral putter", type: "Putter", fits: "Putting og korte innspill", why: "En nøytral putter gjør det lettere å lære rett release.", pros: ["Tydelig rolle", "God til trening", "Rimelig å kjøpe to like"], cons: ["Må kjennes i hånden", "Ikke alle liker samme dybde"] }) }
    ]
  },
  {
    path: "guider/hvordan-velge-riktig-midrange.html",
    title: "Hvordan velge riktig midrange | Discgolf for nybegynnere",
    h1: "Hvordan velge riktig midrange",
    category: "Utstyr",
    audience: "Nye spillere",
    description: "Guide til å velge midrange for discgolf: stabilitet, vekt, plast og hvorfor midrange er viktig for nybegynnere.",
    ingress: "Midrange er ofte den beste disken å lære discgolf med. Den gir nok lengde, men straffer ikke teknikkfeil like hardt som raske drivere.",
    evidence: "Research-basert kjøpsguide",
    notice: `<p class="research-note">${researchLabel}</p>`,
    related: [links.typer, links.flight, links.besteDisker, links.driver],
    sources: ["pdgaBeginner", "latitude", "innovaCompare"],
    sections: [
      { id: "hvorfor", heading: "Hvorfor midrange er nyttig", body: "<p>Midrange passer til rette kast, korte skogshull og teknikktrening. Den viser om du slipper disken med riktig vinkel.</p>" },
      { id: "stabilitet", heading: "Velg nøytral stabilitet først", body: "<p>En nøytral midrange er et trygt førstevalg. Den skal ikke kreve høy fart, og den bør kunne fly relativt rett på rolige kast.</p>" },
      { id: "vekt-plast", heading: "Vekt og plast", body: "<p>Litt lettere midrange kan være enklere for nye spillere. Premiumplast varer lenger, men baseplast kan gi godt grep og lavere pris.</p>" },
      { id: "produkt", heading: "Eksempel på midrange-valg", body: productBox({ name: "Nøytral midrange", type: "Midrange", fits: "Rette kast og læring", why: "En rett midrange hjelper deg å se om kastet er rent.", pros: ["God læringsdisk", "Nyttig på mange hull", "Kan brukes lenge"], cons: ["Mindre nyttig i sterk vind", "Kan avsløre vinkel-feil"] }) }
    ]
  },
  {
    path: "guider/hvordan-velge-riktig-driver.html",
    title: "Hvordan velge riktig driver som nybegynner | Discgolf",
    h1: "Hvordan velge riktig driver som nybegynner",
    category: "Utstyr",
    audience: "Nye spillere som vil ha mer lengde",
    description: "Slik velger du driver i discgolf som nybegynner: fairway-driver før distance-driver, lavere speed og kontroll.",
    ingress: "Den beste første driveren er ofte ikke en distance-driver. For nye spillere er en rolig fairway-driver vanligvis mer nyttig.",
    evidence: "Research-basert kjøpsguide",
    notice: `<p class="research-note">${researchLabel}</p>`,
    related: [links.typer, links.flight, links.diskvalg, ["/sammenligninger/fairway-driver-vs-distance-driver.html", "Fairway vs distance"]],
    sources: ["pdgaBeginner", "latitude", "innovaCompare"],
    sections: [
      { id: "fairway", heading: "Start med fairway-driver", body: "<p>Fairway-drivere har lavere speed og er lettere å kontrollere enn distance-drivere. De passer bedre på mange norske skogshull.</p>" },
      { id: "speed", heading: "Ikke velg for høy speed", body: "<p>Høy speed krever høy armhastighet. Hvis du ikke får disken opp i fart, fader den tidlig og gir ofte mindre praktisk lengde.</p>" },
      { id: "stabilitet", heading: "Stabilitet og vind", body: "<p>Understable eller nøytral fairway kan være lettkastet i rolig vær. I motvind kan den bli vanskeligere, men ikke løs det med en altfor rask driver.</p>" },
      { id: "produkt", heading: "Eksempel på første driver", body: productBox({ name: "Rolig fairway-driver", type: "Fairway-driver", fits: "Nybegynnere som vil ha mer lengde", why: "Gir mer lengde enn midrange uten å kreve samme fart som distance-driver.", pros: ["Kontrollerbar", "Nyttig på skogshull", "God overgang fra midrange"], cons: ["Kan være vanskelig i vind", "Krever mer teknikk enn midrange"] }) }
    ]
  },
  {
    path: "guider/discgolf-etikette.html",
    title: "Discgolf etikette | Baneskikk for nybegynnere",
    h1: "Discgolf etikette for nybegynnere",
    category: "Regler og baneskikk",
    audience: "Nye spillere",
    description: "Lær god discgolf-etikette: sikkerhet, tempo, stillhet, søppel, grupper, hunder og hvordan du oppfører deg på banen.",
    ingress: "God etikette gjør discgolf tryggere og hyggeligere. Det er også den enkleste måten å bli godt mottatt som ny spiller.",
    related: [links.regler, links.forsteRunde, links.hva, links.faq],
    sources: ["pdgaRules", "pdgaBeginner", "udisc"],
    sections: [
      { id: "sikkerhet", heading: "Sikkerhet før alt", body: "<p>Kast aldri hvis du kan treffe noen. Vent til fairwayen er fri, og rop tydelig hvis disken er på vei mot folk.</p>" },
      { id: "tempo", heading: "Hold flyt i runden", body: "<p>Hvis gruppen bak tar dere igjen og spiller raskere, slipp dem forbi. Bruk tid, men ikke stopp hele banen unødvendig.</p>" },
      { id: "stillhet", heading: "Vis hensyn når andre kaster", body: "<p>Stå rolig og hold lavt lydnivå når andre skal kaste eller putte. Det er ekstra viktig i turnering, men fint også på casual-runder.</p>" },
      { id: "natur", heading: "Ta vare på banen", body: "<p>Ta med søppel, ikke knekk greiner, og respekter lokale regler for hund, parkering og bruk av området.</p>" }
    ]
  },
  {
    path: "guider/ofte-stilte-sporsmal-om-discgolf.html",
    title: "Ofte stilte spørsmål om discgolf | Nybegynner-FAQ",
    h1: "Ofte stilte spørsmål om discgolf",
    category: "FAQ",
    audience: "Nye spillere",
    description: "Svar på vanlige spørsmål om discgolf: utstyr, pris, regler, baner, disker, barn, runder og hvordan du kommer i gang.",
    ingress: "Her er korte, praktiske svar på spørsmål mange stiller før de spiller sin første runde.",
    related: [links.hva, links.start, links.diskvalg, links.regler],
    sources: ["pdgaBeginner", "pdgaRules", "udisc"],
    faq: [
      { q: "Hva er forskjellen på discgolf og frisbeegolf?", a: "I praksis brukes ordene ofte om samme sport. Discgolf er det vanligste navnet i sporten, mens frisbeegolf fortsatt brukes av mange i Norge." },
      { q: "Hvor mange disker bør jeg starte med?", a: "Én til tre disker er nok. Putter og midrange er viktigst, og en fairway-driver kan legges til etter hvert." },
      { q: "Hvor langt bør en nybegynner kaste?", a: "Det varierer mye. Kontroll er viktigere enn meter i starten. Mange nye spillere lærer mer av rette kast på kortere hull enn av å presse maksimal lengde." },
      { q: "Må jeg kunne regler før jeg spiller?", a: "Du bør kunne sikkerhet, rekkefølge, OB/mando hvis banen har det, og enkel baneskikk. Offisielle regler finner du hos PDGA." },
      { q: "Hva bør jeg kjøpe først?", a: "Start med en putter og en midrange. Vent med raske distance-drivere til du har bedre kontroll." }
    ],
    sections: [
      { id: "komme-i-gang", heading: "Kom raskt i gang", body: "<p>Hvis du er helt ny, start med guiden om hva discgolf er og siden om første runde. Deretter kan du lese om diskvalg og regler.</p>" },
      { id: "utstyr", heading: "Utstyr og kjøp", body: "<p>Ikke kjøp for mye første dag. Finn ut om du liker sporten, og bygg bagen etter behovet ditt.</p>" },
      { id: "baner", heading: "Baner og spilling", body: "<p>Bruk UDisc, lokale klubber eller baneskilt for å finne baneinformasjon. Husk at lokale forhold kan endre seg.</p>" }
    ]
  }
];

mkdirSync("guider", { recursive: true });
for (const page of pages) {
  writeFileSync(page.path, pageHtml(page), "utf8");
}

function hubPage() {
  const groups = [
    ["Start her", [links.hva, links.start, links.forsteRunde, links.faq]],
    ["Regler og baneskikk", [links.regler, links.etikette, links.ord]],
    ["Disker og utstyr", [links.diskvalg, links.typer, links.flight, links.besteDisker, links.startsett, links.utstyr]],
    ["Teknikk", [links.backhand, links.forehand, links.putting, links.feil]]
  ];
  const cards = groups.map(([heading, items]) => `<section><h2>${heading}</h2><div class="grid">${items.map(([href, label]) => `<article class="guide-card"><p class="eyebrow">Nybegynner</p><h3>${label}</h3><p>Praktisk guide for deg som vil forstå discgolf steg for steg.</p><a href="${href}">Les guiden</a></article>`).join("")}</div></section>`).join("");
  return `<!doctype html><html lang="no"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Nybegynnerguide til discgolf | Start her</title><meta name="description" content="Startside for nye discgolfspillere: lær regler, diskvalg, teknikk, utstyr og første runde i riktig rekkefølge."><meta name="robots" content="index, follow"><meta property="og:title" content="Nybegynnerguide til discgolf"><meta property="og:description" content="Startside for nye discgolfspillere med guider i anbefalt rekkefølge."><meta property="og:type" content="website"><meta property="og:url" content="${baseUrl}/nybegynnerguide.html"><meta property="og:image" content="${baseUrl}/assets/hero-banner.svg"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="assets/favicon.svg" type="image/svg+xml"><link rel="canonical" href="${baseUrl}/nybegynnerguide.html"><link rel="stylesheet" href="assets/css/styles.css"><script src="assets/js/site.js" defer></script></head><body>${nav("")}<main><section class="page-hero"><div class="container"><p class="eyebrow">Start her</p><h1>Nybegynner i discgolf</h1><p class="lead">En ryddig startside for deg som vil lære discgolf i riktig rekkefølge: hva sporten er, hvilke disker du trenger, regler, teknikk og første runde.</p><div class="article-meta"><span>Oppdatert: ${updatedDisplay}</span><span>20 guider i klyngen</span><span>Guide/research</span></div></div></section><section class="section"><div class="container content-flow"><p class="callout"><strong>Anbefalt rekkefølge:</strong> start med hva discgolf er, les første runde og regler, gå videre til diskvalg, og avslutt med teknikkguidene.</p>${cards}</div></section></main>${footer("")}</body></html>`;
}

function articlesPage() {
  const list = pages.map((p) => `<article class="guide-card"><p class="eyebrow">${p.category}</p><h3>${p.h1}</h3><p>${p.description}</p><a href="/${p.path}">Les guiden</a></article>`).join("");
  return `<!doctype html><html lang="no"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Guider om discgolf | Diskgolfutstyr</title><meta name="description" content="Alle publiserte discgolfguider på Diskgolfutstyr, med særlig fokus på nybegynnere, regler, diskvalg og teknikk."><meta name="robots" content="index, follow"><meta property="og:title" content="Guider om discgolf"><meta property="og:description" content="Norske guider for discgolfspillere."><meta property="og:type" content="website"><meta property="og:url" content="${baseUrl}/artikler.html"><meta property="og:image" content="${baseUrl}/assets/hero-banner.svg"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="assets/favicon.svg" type="image/svg+xml"><link rel="canonical" href="${baseUrl}/artikler.html"><link rel="stylesheet" href="assets/css/styles.css"><script src="assets/js/site.js" defer></script></head><body>${nav("")}<main><section class="page-hero"><div class="container"><p class="eyebrow">Guider</p><h1>Discgolfguider på norsk</h1><p class="lead">Start med nybegynnerklyngen, eller gå rett til regler, diskvalg og teknikk.</p></div></section><section class="section"><div class="container"><div class="section-head"><div><p class="eyebrow">Nybegynnerklynge</p><h2>Publiserte guider</h2></div><a class="button button-dark" href="nybegynnerguide.html">Start her</a></div><div class="grid">${list}</div></div></section></main>${footer("")}</body></html>`;
}

writeFileSync("nybegynnerguide.html", hubPage(), "utf8");
writeFileSync("artikler.html", articlesPage(), "utf8");

const published = [
  "",
  "nybegynnerguide.html",
  "artikler.html",
  "regler.html",
  "utstyrsguide.html",
  "tester.html",
  "sammenligninger.html",
  "baneguide.html",
  "turneringer-ranking.html",
  "om.html",
  "affiliate-info.html",
  ...pages.map((p) => p.path),
  "tester/beste-discgolf-startsett.html",
  "sammenligninger/fairway-driver-vs-distance-driver.html",
  "guider/norske-discgolfbaner.html"
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${published.map((p) => `  <url><loc>${baseUrl}/${p}</loc><lastmod>${updatedIso}</lastmod></url>`).join("\n")}\n</urlset>\n`;
writeFileSync("sitemap.xml", sitemap, "utf8");

console.log(JSON.stringify({ beginnerArticles: pages.length, sitemapUrls: published.length }, null, 2));
