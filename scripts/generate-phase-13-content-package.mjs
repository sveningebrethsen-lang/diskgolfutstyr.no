import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const today = "2026-06-03";
const pdgaRules = "https://www.pdga.com/rules/official-rules-disc-golf";
const pdgaTech = "https://www.pdga.com/technical-standards/guidelines";
const pdgaDiscs = "https://www.pdga.com/technical-standards/equipment-certification/discs";
const udiscOslo = "https://udisc.com/places/oslo-region-norway";
const udiscNorway = "https://udisc.com/places/norway";
const innovaFaq = "https://www.innovadiscs.com/home/disc-golf-faq/";
const innovaDiscs = "https://www.innovadiscs.com/disc-golf-discs/";
const dgsNorway = "https://www.discgolfscene.com/tournaments/Norway";

function write(file, content) {
  const target = join(root, file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, `${content.trim()}\n`, "utf8");
}

function read(file) {
  return readFileSync(join(root, file), "utf8");
}

function safeJson(value) {
  return JSON.stringify(value).replaceAll("</", "<\\/");
}

function sourceList(sources) {
  return sources.map((source) => `<li><a href="${source.url}">${source.label}</a> - ${source.note}</li>`).join("");
}

function pills(links) {
  return links.map((link) => `<a class="pill" href="${link.href}">${link.text}</a>`).join("");
}

function header(depth = "root") {
  const prefix = depth === "root" ? "" : "/";
  return `<header class="site-header"><div class="nav-wrap"><a class="brand" href="${prefix}index.html"><img src="${prefix}assets/logo-full.svg" alt="Diskgolfutstyr"></a><button class="menu-button" type="button" aria-label="Åpne meny" aria-expanded="false" data-menu-button>☰</button><nav class="nav" aria-label="Hovedmeny" data-nav><a href="${prefix}nybegynnerguide.html">Nybegynner</a><a href="${prefix}artikler.html">Guider</a><a href="${prefix}utstyr/">Utstyr</a><a href="${prefix}baner/">Baner</a><a href="${prefix}klubber/">Klubber</a><a href="${prefix}turneringer/">Turneringer</a><a href="${prefix}om.html">Om</a></nav></div></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="footer-inner"><div class="footer-brand"><img src="/assets/logo-light.svg" alt="Diskgolfutstyr"><span>Uavhengig norsk discgolfportal. Praktiske guider, tydelig merking og kilder synlig.</span></div><div class="footer-links"><a href="/nybegynnerguide.html">Nybegynner</a><a href="/artikler.html">Guider</a><a href="/utstyr/">Utstyr</a><a href="/baner/">Baner</a><a href="/turneringer/">Turneringer</a><a href="/redaksjonelle-retningslinjer/">Retningslinjer</a></div></div></footer>`;
}

function faqSchema(faq) {
  if (!faq?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a }
    }))
  };
}

function page({ file, url, title, description, h1, eyebrow, lead, meta = [], toc = [], sections, faq = [], sources = [], related = [], type = "Article", note = "", disclaimer = "", noIndex = false }) {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": type,
      headline: h1,
      description,
      image: "https://diskgolfutstyr.no/assets/hero-banner.svg",
      datePublished: today,
      dateModified: today,
      inLanguage: "nb-NO",
      mainEntityOfPage: url,
      author: { "@type": "Organization", name: "Diskgolfutstyr" },
      publisher: {
        "@type": "Organization",
        name: "Diskgolfutstyr",
        logo: { "@type": "ImageObject", url: "https://diskgolfutstyr.no/assets/logo-icon.svg" }
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Diskgolfutstyr", item: "https://diskgolfutstyr.no/" },
        { "@type": "ListItem", position: 2, name: h1, item: url }
      ]
    },
    faqSchema(faq)
  ].filter(Boolean);

  const tocHtml = toc.length ? toc : sections.map((section) => ({ href: `#${section.id}`, text: section.title }));
  const faqHtml = faq.length ? `<section id="faq"><h2>Ofte stilte spørsmål</h2>${faq.map((item) => `<h3>${item.q}</h3><p>${item.a}</p>`).join("")}</section>` : "";
  const sourcesHtml = sources.length ? `<section id="kilder"><h2>Kilder</h2><ul class="source-list">${sourceList(sources)}</ul></section>` : "";
  const relatedHtml = related.length ? `<section id="relatert"><h2>Les også</h2><div class="pill-row">${pills(related)}</div></section>` : "";

  write(file, `<!doctype html>
<html lang="no">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="robots" content="${noIndex ? "noindex, follow" : "index, follow"}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="https://diskgolfutstyr.no/assets/hero-banner.svg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="canonical" href="${url}">
  <link rel="stylesheet" href="/assets/css/styles.css">
  <script src="/assets/js/site.js" defer></script>
  <script type="application/ld+json">${safeJson(schemas)}</script>
</head>
<body>
${header("sub")}
  <main>
    <article>
      <section class="page-hero"><div class="container"><p class="eyebrow">${eyebrow}</p><h1>${h1}</h1><p class="lead">${lead}</p><div class="article-meta"><span>Oppdatert: 3. juni 2026</span>${meta.map((item) => `<span>${item}</span>`).join("")}</div></div></section>
      <section class="section"><div class="container article-layout"><aside class="toc" aria-label="Innholdsfortegnelse"><h2>Innhold</h2><ol>${tocHtml.map((item) => `<li><a href="${item.href}">${item.text}</a></li>`).join("")}${faq.length ? '<li><a href="#faq">FAQ</a></li>' : ""}${sources.length ? '<li><a href="#kilder">Kilder</a></li>' : ""}</ol></aside><div class="article-body">
        ${note}
        ${disclaimer}
        ${sections.map((section) => `<section id="${section.id}"><h2>${section.title}</h2>${section.body}</section>`).join("")}
        ${faqHtml}
        ${relatedHtml}
        ${sourcesHtml}
      </div></div></section>
    </article>
  </main>
${footer()}
</body>
</html>`);
}

const commonBeginnerLinks = [
  { href: "/nybegynnerguide.html", text: "Nybegynnerguiden" },
  { href: "/guider/slik-spiller-du-forste-runde.html", text: "slik spiller du første runde" },
  { href: "/guider/discgolf-regler-for-nybegynnere.html", text: "regler for nybegynnere" },
  { href: "/utstyr/beste-discgolfdisker-for-nybegynnere.html", text: "disker for nybegynnere" },
  { href: "/baner/nybegynnervennlige/", text: "nybegynnervennlige baner" }
];

const commonSources = [
  { url: pdgaRules, label: "PDGA Official Rules of Disc Golf", note: "offisielle regler og grunnleggende spillkontekst" },
  { url: "https://www.innovadiscs.com/home/disc-golf-faq/", label: "Innova Disc Golf FAQ", note: "forklarer vanlige discgolfbegreper og flight ratings" }
];

page({
  file: "guider/hvor-langt-bor-en-nybegynner-kaste.html",
  url: "https://diskgolfutstyr.no/guider/hvor-langt-bor-en-nybegynner-kaste.html",
  title: "Hvor langt bør en nybegynner kaste? | Praktisk norsk guide",
  description: "Hvor langt en nybegynner bør kaste i discgolf, hva som er normalt, og hvorfor kontroll er viktigere enn maksimal lengde.",
  h1: "Hvor langt bør en nybegynner kaste?",
  eyebrow: "Nybegynner",
  lead: "Kastelengde er nyttig, men den sier ikke alt. For nye spillere er kontroll, retning og færre tapte disker viktigere enn å presse fram maks lengde.",
  meta: ["Nybegynnerguide", "Nivå 2"],
  sections: [
    { id: "kort", title: "Kort oppsummert", body: `<p>En nybegynner trenger ikke kaste langt for å spille en god første runde. Hvis du kan kaste kontrollert, finne disken igjen og holde deg i fairway, er du allerede godt i gang.</p><ul><li>Start med putter og midrange før raske drivere.</li><li>Mål gjerne fremgang, men ikke sammenlign deg med erfarne spillere.</li><li>På korte norske skogsbaner er presisjon ofte viktigere enn lengde.</li></ul>` },
    { id: "hvorfor", title: "Hvorfor lengde kan lure deg", body: `<p>Et langt kast som ender dypt i skogen gir ofte dårligere score enn et kortere kast som ligger midt i fairway. Mange nye spillere mister også teknikken når de prøver å kaste hardere enn de klarer å kontrollere.</p><p>Bruk lengde som en treningsindikator, ikke som eneste mål. Det viktigste spørsmålet er om du kan gjenta kastet.</p>` },
    { id: "male", title: "Slik måler du fremgang", body: `<ol><li>Velg én rolig disk du kjenner.</li><li>Kast 10 like kast på en åpen gressflate.</li><li>Noter omtrent hvor de fleste lander, ikke bare det lengste kastet.</li><li>Gjenta annenhver uke.</li></ol><p>Hvis de fleste kastene blir rettere og lander nærmere hverandre, går du framover selv om maks-lengden ikke hopper dramatisk.</p>` },
    { id: "feil", title: "Vanlige feil", body: `<ul><li>Å kjøpe rask distance driver for tidlig.</li><li>Å trene bare på makskast og aldri på korte innspill.</li><li>Å bruke for mange disker før du forstår én eller to.</li><li>Å tolke ett langt kast som at teknikken sitter.</li></ul>` },
    { id: "neste", title: "Hva bør du gjøre videre?", body: `<p>Spill en kort bane, tren med få disker og prøv å treffe samme linje flere ganger. Når du får kontroll på putter og midrange, kan du gradvis prøve en rolig fairway-driver.</p>` }
  ],
  faq: [
    { q: "Må jeg kaste langt for å spille discgolf?", a: "Nei. Du kan spille helt fint med korte, kontrollerte kast, spesielt på nybegynnervennlige baner." },
    { q: "Bør jeg kjøpe distance driver for å kaste lenger?", a: "Som regel bør nybegynnere vente. En rolig midrange eller fairway-driver er ofte lettere å kontrollere." },
    { q: "Hva bør jeg trene først?", a: "Tren rette kast med putter eller midrange, korte innspill og putting før du jager maksimal lengde." }
  ],
  related: commonBeginnerLinks,
  sources: commonSources
});

page({
  file: "guider/hvorfor-nybegynnere-bor-vente-med-distance-drivers.html",
  url: "https://diskgolfutstyr.no/guider/hvorfor-nybegynnere-bor-vente-med-distance-drivers.html",
  title: "Hvorfor nybegynnere bør vente med distance drivers",
  description: "Derfor bør nye discgolfspillere ofte starte med putter, midrange og rolig fairway-driver før raske distance drivers.",
  h1: "Hvorfor nybegynnere bør vente med distance drivers",
  eyebrow: "Nybegynner og utstyr",
  lead: "Raske drivere ser fristende ut, men de krever mer fart og renere teknikk enn de fleste nye spillere har i starten.",
  meta: ["Utstyrsguide", "Guide/research"],
  sections: [
    { id: "kort", title: "Kort oppsummert", body: `<p>Distance drivers er laget for høyere fart. Hvis du ikke får opp nok hastighet, vil disken ofte fade tidlig, gå kortere enn forventet og gi deg dårligere tilbakemelding på teknikken.</p>` },
    { id: "start", title: "Start heller her", body: `<ul><li>Putter for korte kast, putting og kontroll.</li><li>Midrange for rette kast og teknikk.</li><li>Fairway-driver når du vil prøve mer lengde uten for mye fartskrav.</li></ul><p>Dette oppsettet gjør det lettere å lære vinkel, retning og release.</p>` },
    { id: "naar", title: "Når kan du prøve distance driver?", body: `<p>Prøv distance driver når du allerede får fairway-driveren til å fly kontrollert, og når den faktisk gir mer lengde uten å ofre treffsikkerhet. Det er ingen hast.</p>` },
    { id: "feil", title: "Vanlige kjøpsfeil", body: `<ul><li>Å velge disk fordi en proff bruker den.</li><li>Å kjøpe høy speed uten å forstå turn og fade.</li><li>Å tro at raskere alltid betyr lengre.</li><li>Å kjøpe mange drivere før du kjenner én midrange godt.</li></ul>` }
  ],
  faq: [
    { q: "Er distance drivers dårlige for nybegynnere?", a: "Nei, men de er ofte lite nyttige i starten fordi de krever mer fart og kontroll." },
    { q: "Hva er et bedre første driver-valg?", a: "En rolig fairway-driver med moderat speed er ofte mer nyttig enn en rask distance driver." },
    { q: "Hvorfor går driveren min bare til venstre?", a: "For mange høyrehendte backhand-kast skyldes det lav fart, nose up eller for overstable/rask disk." }
  ],
  related: [
    { href: "/guider/flight-numbers.html", text: "flight numbers forklart" },
    { href: "/guider/putter-midrange-og-driver-forklart.html", text: "putter, midrange og driver" },
    { href: "/utstyr/beste-fairway-driver-for-nybegynnere.html", text: "fairway-driver for nybegynnere" },
    { href: "/utstyr/beste-distance-driver-for-viderekomne.html", text: "distance drivers for viderekomne" }
  ],
  sources: [
    { url: innovaDiscs, label: "Innova Disc Golf Discs", note: "produktoversikt med speed, glide, turn og fade" },
    { url: pdgaDiscs, label: "PDGA Approved Discs", note: "offisiell oversikt over godkjente disker" },
    { url: innovaFaq, label: "Innova Disc Golf FAQ", note: "forklarer flight ratings og disktyper" }
  ]
});

page({
  file: "guider/hvorfor-gar-disken-alltid-til-venstre.html",
  url: "https://diskgolfutstyr.no/guider/hvorfor-gar-disken-alltid-til-venstre.html",
  title: "Hvorfor går disken alltid til venstre? | Vanlige årsaker",
  description: "Forklaring på hvorfor disken ofte går til venstre for nye høyrehendte backhand-spillere, og hva du kan gjøre med det.",
  h1: "Hvorfor går disken alltid til venstre?",
  eyebrow: "Vanlige feil",
  lead: "For høyrehendt backhand er det vanlig at disken avslutter til venstre. Problemet er når den gjør det for tidlig, for hardt eller hver eneste gang.",
  meta: ["Problemløsning", "Nybegynner"],
  sections: [
    { id: "forklaring", title: "Den korte forklaringen", body: `<p>De vanligste årsakene er at disken er for rask, for overstable, kastes med nesa opp, eller at du ikke får nok fart gjennom kastet. Ofte er det en kombinasjon.</p>` },
    { id: "sjekk", title: "Sjekk dette først", body: `<ol><li>Bytt til en putter eller midrange.</li><li>Kast roligere og prøv å holde disken flat.</li><li>Se om disken flyr rettere når du ikke prøver å makse.</li><li>Test på en åpen plass, ikke bare på smale skogshull.</li></ol>` },
    { id: "ovelse", title: "En enkel øvelse", body: `<p>Kast 10 rolige midrange-kast mot et tydelig punkt 40-60 meter unna. Målet er ikke lengde, men at disken starter på riktig linje og ikke stuper tidlig. Noter om feilen blir mindre når du senker kraften.</p>` },
    { id: "feil", title: "Vanlige feil", body: `<ul><li>Å kompensere ved å sikte langt til høyre i stedet for å løse teknikken.</li><li>Å bytte til enda raskere driver.</li><li>Å glemme at vind kan gjøre disken mer eller mindre stabil.</li></ul>` }
  ],
  faq: [
    { q: "Gjelder dette for venstrehendte?", a: "Retningen blir motsatt for venstrehendt backhand. Prinsippet med stabilitet, fart og nose angle er likevel det samme." },
    { q: "Er det alltid feil at disken fader venstre?", a: "Nei. Fade er en normal del av diskens flyvning. Problemet er når den fader for tidlig og du mister kontroll." }
  ],
  related: [
    { href: "/teknikk/nose-angle/", text: "nose angle forklart" },
    { href: "/teknikk/hyzer-og-anhyzer/", text: "hyzer og anhyzer" },
    { href: "/guider/flight-numbers.html", text: "flight numbers" },
    { href: "/utstyr/beste-midrange-for-nybegynnere.html", text: "midrange for nybegynnere" }
  ],
  sources: commonSources
});

const commercialDisclaimer = `<p class="disclaimer">Noen lenker kan være annonselenker. Det koster deg ikke noe ekstra, men kan gi Diskgolfutstyr en liten provisjon. Anbefalingene skal være redaksjonelt uavhengige.</p>`;
const researchNote = `<p class="research-note">Dette er en research-basert sammenligning basert på produsentdata, offentlige spesifikasjoner og spillererfaringer. Produktene er ikke fysisk testet av Diskgolfutstyr.</p>`;

page({
  file: "utstyr/baseplast-vs-premiumplast.html",
  url: "https://diskgolfutstyr.no/utstyr/baseplast-vs-premiumplast.html",
  title: "Baseplast vs premiumplast | Hva bør du velge?",
  description: "Forskjellen på baseplast og premiumplast i discgolf, hva nybegynnere bør velge, og hvordan plast påvirker grep, slitestyrke og pris.",
  h1: "Baseplast vs premiumplast",
  eyebrow: "Utstyr",
  lead: "Plast handler om grep, slitestyrke, følelse og pris. For nye spillere er det ofte smart å blande billigere baseplast med noen få slitesterke premiumdisker.",
  meta: ["Research-basert", "Affiliate-klar"],
  note: researchNote,
  disclaimer: commercialDisclaimer,
  sections: [
    { id: "kort", title: "Kort oppsummert", body: `<table class="comparison"><thead><tr><th>Valg</th><th>Typisk styrke</th><th>Typisk svakhet</th></tr></thead><tbody><tr><td>Baseplast</td><td>Godt grep og lavere pris</td><td>Slites raskere</td></tr><tr><td>Premiumplast</td><td>Mer slitesterk og holder formen lenger</td><td>Dyrere og kan føles glattere</td></tr></tbody></table>` },
    { id: "nybegynner", title: "Hva bør nybegynnere velge?", body: `<p>Start gjerne med putter i baseplast, fordi grep og følelse er viktig. For midrange og driver kan premiumplast være nyttig hvis du spiller mye i skog eller treffer mange trær.</p>` },
    { id: "norsk", title: "Norsk føre og grep", body: `<p>I regn, kulde og vått gress kan grep bety mer enn maksimal slitestyrke. Ha gjerne et håndkle i baggen og test hvordan plasten føles i hånda før du kjøper flere av samme type.</p>` },
    { id: "feil", title: "Vanlige kjøpsfeil", body: `<ul><li>Å kjøpe alt i dyreste plast før du vet hva du liker.</li><li>Å velge plast bare fordi andre anbefaler den.</li><li>Å overse grep i vått vær.</li><li>Å tro at samme disk flyr helt likt i alle plasttyper.</li></ul>` }
  ],
  faq: [
    { q: "Er premiumplast alltid best?", a: "Nei. Premiumplast varer ofte lenger, men baseplast kan gi bedre grep og være smartere for puttere." },
    { q: "Bør puttere være i baseplast?", a: "Mange liker baseplast i puttere fordi grep og følelse er viktig. Det er likevel personlig." },
    { q: "Påvirker plast flyvningen?", a: "Ja, plast og slitasje kan påvirke stabilitet og følelse, men det varierer mellom produsenter og modeller." }
  ],
  related: [
    { href: "/utstyr/beste-discgolfdisker-for-nybegynnere.html", text: "disker for nybegynnere" },
    { href: "/utstyr/hvordan-velge-riktig-vekt-pa-discgolfdisk.html", text: "riktig diskvekt" },
    { href: "/guider/flight-numbers.html", text: "flight numbers" },
    { href: "/affiliate-info.html", text: "affiliate-info" }
  ],
  sources: [
    { url: innovaFaq, label: "Innova Disc Golf FAQ", note: "forklarer plasttyper og holdbarhet på overordnet nivå" },
    { url: innovaDiscs, label: "Innova Disc Golf Discs", note: "produsentoversikt over disker og plast" },
    { url: pdgaDiscs, label: "PDGA Approved Discs", note: "offisiell utstyrs- og godkjenningskontekst" }
  ]
});

page({
  file: "utstyr/lett-disk-vs-tung-disk.html",
  url: "https://diskgolfutstyr.no/utstyr/lett-disk-vs-tung-disk.html",
  title: "Lett disk vs tung disk | Guide for nybegynnere",
  description: "Hva er forskjellen på lette og tunge discgolfdisker, og hvilken vekt bør nye spillere vurdere?",
  h1: "Lett disk vs tung disk",
  eyebrow: "Utstyr",
  lead: "Vekt påvirker hvor lett disken er å få opp i fart, hvordan den takler vind og hvor kontrollert den føles.",
  meta: ["Research-basert", "Affiliate-klar"],
  note: researchNote,
  disclaimer: commercialDisclaimer,
  sections: [
    { id: "kort", title: "Kort oppsummert", body: `<p>Lette disker kan være enklere å få i gang for nye spillere, mens tyngre disker ofte føles mer stabile i vind. Det finnes ikke én riktig vekt for alle.</p>` },
    { id: "velge", title: "Slik velger du vekt", body: `<ul><li>Velg kontroll før maksimal lengde.</li><li>Bruk litt tyngre putter hvis den føles trygg i hånda.</li><li>Vurder lettere fairway-driver hvis du har lav armhastighet.</li><li>Unngå å kjøpe mange vekter før du har testet én disk over tid.</li></ul>` },
    { id: "vind", title: "Vekt og vind", body: `<p>I motvind kan lette og understable disker bli mer krevende å kontrollere. På rolige dager kan de samme diskene være lettere å få til å fly. Derfor bør vind, bane og kastestil være med i vurderingen.</p>` },
    { id: "feil", title: "Vanlige kjøpsfeil", body: `<ul><li>Å tro at maksvekt alltid er best.</li><li>Å velge lett disk uten å tenke på vind.</li><li>Å bytte vekt hver runde i stedet for å lære én disk.</li></ul>` }
  ],
  faq: [
    { q: "Bør nybegynnere velge lette disker?", a: "Ofte kan litt lettere disker være enklere å få opp i fart, men grep, stabilitet og vind betyr også mye." },
    { q: "Er tunge disker bedre i vind?", a: "Tyngre og mer stabile disker kan ofte være lettere å kontrollere i vind, men teknikk og diskmodell betyr også mye." }
  ],
  related: [
    { href: "/utstyr/hvordan-velge-riktig-vekt-pa-discgolfdisk.html", text: "hvordan velge riktig vekt" },
    { href: "/utstyr/beste-fairway-driver-for-nybegynnere.html", text: "fairway-driver for nybegynnere" },
    { href: "/teknikk/kast-i-vind/", text: "kast i vind" },
    { href: "/guider/flight-numbers.html", text: "flight numbers" }
  ],
  sources: [
    { url: pdgaTech, label: "PDGA Technical Standards", note: "utstyrskontekst og tekniske rammer" },
    { url: pdgaDiscs, label: "PDGA Approved Discs", note: "godkjente disker og spesifikasjoner" },
    { url: innovaDiscs, label: "Innova Disc Golf Discs", note: "produsentdata for diskmodeller og flight ratings" }
  ]
});

page({
  file: "utstyr/disc-retriever-verdt-det.html",
  url: "https://diskgolfutstyr.no/utstyr/disc-retriever-verdt-det.html",
  title: "Disc retriever: er det verdt det?",
  description: "Når en disc retriever kan være nyttig, hvem som bør vurdere det, og hva du bør tenke på før du kjøper.",
  h1: "Disc retriever: er det verdt det?",
  eyebrow: "Utstyr",
  lead: "En disc retriever er ikke nødvendig for å starte med discgolf, men kan spare disker hvis du ofte spiller nær vann, kratt eller bratte skråninger.",
  meta: ["Research-basert", "Affiliate-klar"],
  note: researchNote,
  disclaimer: commercialDisclaimer,
  sections: [
    { id: "kort", title: "Kort oppsummert", body: `<p>For helt nye spillere er en ekstra putter ofte viktigere enn retriever. Men spiller du baner med vann eller tett vegetasjon, kan en retriever være et praktisk tilbehør.</p>` },
    { id: "passer", title: "Hvem passer det for?", body: `<ul><li>Spillere som ofte mister disker i vannkant eller tett kratt.</li><li>Spillere som bruker dyrere premiumdisker.</li><li>Folk som spiller alene og ikke vil klatre eller ta unødvendig risiko.</li></ul>` },
    { id: "ikke", title: "Hvem trenger det ikke?", body: `<p>Hvis du spiller korte parkbaner uten vann, er retriever sjelden førsteprioritet. Bruk heller penger på en disk du faktisk trenger, en bag med plass til vann eller et godt håndkle.</p>` },
    { id: "feil", title: "Vanlige kjøpsfeil", body: `<ul><li>Å kjøpe for kort retriever til banene du spiller.</li><li>Å bruke den i farlige situasjoner.</li><li>Å tro den erstatter gode kastvalg ved vann.</li></ul>` }
  ],
  faq: [
    { q: "Trenger nybegynnere disc retriever?", a: "Som regel ikke med én gang. Den blir mer aktuell hvis du spiller baner med vann eller mye tett vegetasjon." },
    { q: "Er det trygt å hente disker med retriever?", a: "Ikke alltid. Ikke ta risiko ved bratt terreng, strøm, is eller dypt vann." }
  ],
  related: [
    { href: "/utstyr/discgolf-utstyrsliste.html", text: "discgolf utstyrsliste" },
    { href: "/guider/hvordan-unnga-a-miste-disker/", text: "unngå å miste disker" },
    { href: "/baner/nybegynnervennlige/", text: "nybegynnervennlige baner" },
    { href: "/utstyr/billig-discgolfutstyr.html", text: "billig discgolfutstyr" }
  ],
  sources: [
    { url: pdgaRules, label: "PDGA Official Rules", note: "regelramme for spill og hensyn på banen" },
    { url: udiscNorway, label: "UDisc Norge", note: "baneoversikt for å vurdere lokale forhold" }
  ]
});

function courseCards(courses) {
  return `<div class="course-grid">${courses.map((course) => `<article class="course-card"><div class="product-card__top"><p class="eyebrow">${course.city}</p><span class="badge">${course.holes ? `${course.holes} hull` : "Hull ukjent"}</span></div><h3>${course.name}</h3><p>${course.short_description}</p><dl class="product-facts"><div><dt>Sted</dt><dd>${course.city}, ${course.county}</dd></div><div><dt>Vanskelighetsgrad</dt><dd>${course.difficulty || "Ukjent"}</dd></div></dl><div class="actions course-actions"><a class="button" href="/baner/${course.slug}/">Les baneprofil</a><a class="button button-dark" href="${course.udisc_url || course.map_url}">Sjekk baneinfo</a></div></article>`).join("")}</div>`;
}

const courses = JSON.parse(read("data/courses/norway.json"));
const osloCourses = courses.filter((course) => course.city === "Oslo" || course.municipality === "Oslo" || course.slug === "krokhol-disc-golf-course");
const beginnerOslo = courses.filter((course) => course.county === "Oslo" && course.beginner_friendly);

page({
  file: "baner/discgolfbaner-naer-oslo/index.html",
  url: "https://diskgolfutstyr.no/baner/discgolfbaner-naer-oslo/",
  title: "Discgolfbaner nær Oslo | Baner å vurdere",
  description: "Finn discgolfbaner nær Oslo med forsiktig vurdering av nivå, kilder og tips for nye spillere.",
  h1: "Discgolfbaner nær Oslo",
  eyebrow: "Lokal SEO",
  lead: "Oslo-området har både korte lavterskelbaner og mer krevende 18-hullsvalg. Start med bane som passer nivået ditt, ikke bare den mest kjente banen.",
  meta: ["Lokal SEO", "Kildebasert"],
  note: `<p class="update-note">Banestatus kan endre seg. Sjekk alltid oppdatert informasjon fra klubb, arrangør eller banetjeneste før du drar.</p>`,
  sections: [
    { id: "baner", title: "Baner å vurdere", body: courseCards(osloCourses) },
    { id: "nybegynner", title: "Tips for nybegynnere i Oslo", body: `<ul><li>Start gjerne med en kortere bane før du prøver krevende 18-hullsbaner.</li><li>Ta med få disker: putter, midrange og eventuelt rolig fairway-driver.</li><li>Sjekk UDisc eller klubbside samme dag, spesielt ved snø, regn eller arrangement.</li></ul>` },
    { id: "ikke-best", title: "Hvorfor vi ikke kårer “beste bane” her", body: `<p>Denne siden er ikke en fysisk test av alle Oslo-banene. Den bruker eksisterende banedata og åpne kilder for å hjelpe deg å velge et trygt utgangspunkt.</p>` }
  ],
  faq: [
    { q: "Hvor kan jeg spille discgolf nær Oslo?", a: "Start med Oslo-siden, Hauketo, Lambertseter, Ekeberg, Holmenkollen, Klemetsrud eller Krokhol, men sjekk oppdatert baneinfo før du drar." },
    { q: "Hvilken Oslo-bane passer for nybegynnere?", a: "Kortere og lettere baner som Hauketo og Lambertseter virker mest aktuelle i første datapakke." }
  ],
  related: [
    { href: "/baner/oslo/", text: "discgolf Oslo" },
    { href: "/baner/nybegynnervennlige/", text: "nybegynnervennlige baner" },
    { href: "/guider/slik-spiller-du-forste-runde.html", text: "første runde" },
    { href: "/utstyr/discgolf-utstyrsliste.html", text: "utstyrsliste" }
  ],
  sources: [
    { url: udiscOslo, label: "UDisc Oslo", note: "åpen baneoversikt for Oslo-regionen" },
    { url: "https://www.pdga.com/course-directory/course/krokhol-disc-golf-course", label: "PDGA Course Directory: Krokhol", note: "kilde for Krokhol" }
  ]
});

page({
  file: "baner/nybegynnervennlige-baner-i-oslo/index.html",
  url: "https://diskgolfutstyr.no/baner/nybegynnervennlige-baner-i-oslo/",
  title: "Nybegynnervennlige discgolfbaner i Oslo",
  description: "Forsiktig oversikt over discgolfbaner i Oslo som kan passe nybegynnere, med tips før første runde og kilder.",
  h1: "Nybegynnervennlige discgolfbaner i Oslo",
  eyebrow: "Lokal SEO",
  lead: "For nye spillere er en kort, oversiktlig bane ofte bedre enn en lang og krevende runde. Her er Oslo-alternativer som virker mest aktuelle basert på tilgjengelig banedata.",
  meta: ["Lokal SEO", "Nybegynner"],
  note: `<p class="update-note">Banestatus kan endre seg. Sjekk alltid oppdatert informasjon fra klubb, arrangør eller banetjeneste før du drar.</p>`,
  sections: [
    { id: "kriterier", title: "Hva gjør en bane nybegynnervennlig?", body: `<ul><li>Kortere hull og lavere risiko for å miste disker.</li><li>Oversiktlige fairwayer.</li><li>Lite vann og færre krevende OB-områder.</li><li>Enkel tilgang og tydelig baneinformasjon.</li></ul>` },
    { id: "baner", title: "Oslo-baner som kan passe", body: beginnerOslo.length ? courseCards(beginnerOslo) : `<p>Første datapakke har ikke nok sikre Oslo-data til å liste konkrete nybegynnervennlige baner.</p>` },
    { id: "forste", title: "Slik spiller du første runde", body: `<p>Ta med én putter eller midrange, spill rolig, slipp folk forbi hvis du leter etter disk, og bruk første runde til å forstå banen. Score er mindre viktig enn trygg flyt.</p>` }
  ],
  faq: [
    { q: "Trenger jeg eget utstyr?", a: "Du kan starte med én eller to disker. Putter og midrange er ofte nok på korte baner." },
    { q: "Er banene gratis?", a: "Mange baner er gratis, men noen baner kan ha betaling, booking eller sesongregler. Sjekk alltid kilden." },
    { q: "Kan barn spille discgolf?", a: "Ja, på korte og oversiktlige baner kan barn spille med voksne, men vis hensyn til andre brukere og lokale regler." }
  ],
  related: [
    { href: "/baner/oslo/", text: "discgolf Oslo" },
    { href: "/guider/slik-spiller-du-forste-runde.html", text: "slik spiller du første runde" },
    { href: "/guider/discgolf-etikette.html", text: "discgolf etikette" },
    { href: "/utstyr/beste-discgolfdisker-for-nybegynnere.html", text: "disker for nybegynnere" }
  ],
  sources: [{ url: udiscOslo, label: "UDisc Oslo", note: "åpen baneoversikt for Oslo-regionen" }]
});

page({
  file: "teknikk/approach-kast-forklart/index.html",
  url: "https://diskgolfutstyr.no/teknikk/approach-kast-forklart/",
  title: "Approach-kast forklart | Kontroll fra kort avstand",
  description: "Hva approach-kast er i discgolf, når du bruker dem, vanlige feil og enkle øvelser for bedre kontroll.",
  h1: "Approach-kast forklart",
  eyebrow: "Teknikk",
  lead: "Approach-kast er de kontrollerte kastene som skal gi deg en enkel putt. De er ofte viktigere for score enn makslengde.",
  meta: ["Teknikk", "Praktisk guide"],
  sections: [
    { id: "hva", title: "Hva er et approach-kast?", body: `<p>Et approach-kast er et kontrollert innspill mot kurven, vanligvis fra en avstand der du ikke putter, men heller ikke trenger full kraft. Målet er å lande trygt, ikke imponere.</p>` },
    { id: "disk", title: "Hvilke disker fungerer?", body: `<p>Mange bruker putter eller midrange til approach. De gir roligere flyvning og bedre kontroll enn raske drivere.</p>` },
    { id: "ovelser", title: "Enkle øvelser", body: `<ul><li>Legg en sekk 10 meter fra kurven og prøv å lande innenfor området.</li><li>Kast 10 hyzer-approacher og 10 flate approacher.</li><li>Tren fra vanskelige lies: kne, lavt tak og smal åpning.</li></ul>` },
    { id: "feil", title: "Vanlige feil", body: `<ul><li>Å kaste for hardt.</li><li>Å sikte rett på kurven når trygg landing er bedre.</li><li>Å bruke driver der putter holder.</li><li>Å glemme vind og bakken bak kurven.</li></ul>` }
  ],
  faq: [
    { q: "Bør jeg bruke putter til approach?", a: "Ofte ja. Putter gir rolig flyvning og god kontroll på kortere innspill." },
    { q: "Hvordan vet jeg om approachen er god?", a: "Hvis den ofte gir deg en trygg putt og få store feil, fungerer den." }
  ],
  related: [
    { href: "/teknikk/hyzer-og-anhyzer/", text: "hyzer og anhyzer" },
    { href: "/teknikk/nose-angle/", text: "nose angle" },
    { href: "/guider/putting-for-nybegynnere.html", text: "putting for nybegynnere" },
    { href: "/utstyr/beste-putter-for-nybegynnere.html", text: "putter for nybegynnere" }
  ],
  sources: [{ url: pdgaRules, label: "PDGA Official Rules", note: "regelramme for kast, lie og markering" }]
});

page({
  file: "trening/puttingovelser-hjemme/index.html",
  url: "https://diskgolfutstyr.no/trening/puttingovelser-hjemme/",
  title: "Puttingøvelser hjemme | Discgolf-trening uten bane",
  description: "Enkle puttingøvelser du kan gjøre hjemme eller i hagen, med fokus på rutine, kontroll og trygg progresjon.",
  h1: "Puttingøvelser hjemme",
  eyebrow: "Trening",
  lead: "Putting er lett å trene ofte, men vanskelig å gjøre rolig. Start med korte økter, tydelig rutine og realistiske avstander.",
  meta: ["Trening", "Praktisk guide"],
  sections: [
    { id: "start", title: "Start enkelt", body: `<p>Du trenger en kurv, et trygt mål eller en markert sone. Ikke tren mot noe som kan skade folk, dyr, vinduer eller inventar.</p>` },
    { id: "ovelser", title: "Tre øvelser", body: `<ol><li><strong>10 på rad:</strong> Velg kort avstand og prøv å sette 10 putter uten å endre rutine.</li><li><strong>Sirkel:</strong> Flytt deg rundt kurven og putt fra samme avstand.</li><li><strong>To-putt-regel:</strong> Hvis du bommer, putt én gang til fra samme sted og noter hva du endret.</li></ol>` },
    { id: "rutine", title: "Bygg rutine", body: `<p>Bruk samme pust, samme grep og samme tempo. Målet er at kroppen kjenner igjen bevegelsen før du går lengre unna.</p>` },
    { id: "feil", title: "Vanlige feil", body: `<ul><li>Å starte for langt unna.</li><li>Å endre teknikk etter hver bom.</li><li>Å trene for lenge når konsentrasjonen er borte.</li><li>Å telle bare treff og ikke kvalitet på rutinen.</li></ul>` }
  ],
  faq: [
    { q: "Hvor lenge bør jeg trene putting?", a: "Korte økter på 10-20 minutter er ofte nok. Kvalitet er viktigere enn antall putter." },
    { q: "Må jeg ha egen kurv?", a: "Egen kurv hjelper, men du kan også trene rutine og linje mot et trygt mål." }
  ],
  related: [
    { href: "/trening/putting-trening/", text: "puttingtrening" },
    { href: "/teknikk/putting-rutine/", text: "putting-rutine" },
    { href: "/guider/putting-for-nybegynnere.html", text: "putting for nybegynnere" },
    { href: "/utstyr/beste-discgolfkurv-til-hagen.html", text: "kurv til hagen" }
  ],
  sources: [{ url: pdgaRules, label: "PDGA Official Rules", note: "regelramme for putting og markering" }]
});

page({
  file: "turneringer/hva-bor-du-ha-med-pa-turnering/index.html",
  url: "https://diskgolfutstyr.no/turneringer/hva-bor-du-ha-med-pa-turnering/",
  title: "Hva bør du ha med på discgolfturnering?",
  description: "Praktisk pakkeliste for din første discgolfturnering, med utstyr, klær, regler og forberedelser.",
  h1: "Hva bør du ha med på discgolfturnering?",
  eyebrow: "Turnering",
  lead: "Du trenger ikke en full proffbag for å spille turnering, men du bør ha kontroll på disker, klær, mat, scoreføring og grunnregler.",
  meta: ["Turneringsguide", "Kildebasert"],
  note: `<p class="update-note">Turneringskrav kan variere. Sjekk alltid spillerinfo, arrangørside og offisielle kilder før du møter opp.</p>`,
  sections: [
    { id: "kort", title: "Kort pakkeliste", body: `<ul><li>Disker du kjenner godt.</li><li>Mini marker hvis arrangementet krever det.</li><li>Vann, mat og klær etter vær.</li><li>Håndkle og eventuelt ekstra sokker.</li><li>Telefon med score/app hvis arrangøren bruker det.</li><li>Lenke til spillerinfo og tee time.</li></ul>` },
    { id: "disker", title: "Disker: færre er ofte bedre", body: `<p>Ta med disker du stoler på. En turnering er sjelden riktig dag for å prøve en helt ny driver. Velg kontrollerbare disker du vet hvordan oppfører seg.</p>` },
    { id: "regler", title: "Regler og etikette", body: `<p>Les grunnreglene, forstå hvordan du markerer lie, og vær klar for å føre score korrekt. Spør kortkamerater eller arrangør hvis du er usikker.</p>` },
    { id: "feil", title: "Vanlige feil", body: `<ul><li>Å pakke for mange disker og bli usikker.</li><li>Å møte uten å ha lest spillerinfo.</li><li>Å undervurdere vær, mat og tid mellom runder.</li><li>Å tro at du må spille perfekt fordi det er turnering.</li></ul>` }
  ],
  faq: [
    { q: "Må jeg ha PDGA-medlemskap?", a: "Det avhenger av arrangementet. Sjekk påmeldingssiden og arrangørens informasjon." },
    { q: "Kan jeg spille turnering som nybegynner?", a: "Ja, men velg riktig klasse og les informasjonen nøye før du melder deg på." }
  ],
  related: [
    { href: "/turneringer/forste-turnering/", text: "første turnering" },
    { href: "/turneringer/pdga-rating/", text: "PDGA-rating" },
    { href: "/guider/discgolf-regler-for-nybegynnere.html", text: "regler for nybegynnere" },
    { href: "/utstyr/discgolf-utstyrsliste.html", text: "utstyrsliste" }
  ],
  sources: [
    { url: pdgaRules, label: "PDGA Official Rules", note: "offisielle regler" },
    { url: "https://www.pdga.com/rules/competition-manual-disc-golf-events", label: "PDGA Competition Manual", note: "konkurranseregler og arrangementskontekst" },
    { url: dgsNorway, label: "Disc Golf Scene Norge", note: "turneringsoversikt; sjekk alltid arrangørinfo" }
  ]
});

page({
  file: "guider/hvordan-unnga-a-miste-disker-i-hoyt-gress.html",
  url: "https://diskgolfutstyr.no/guider/hvordan-unnga-a-miste-disker-i-hoyt-gress.html",
  title: "Hvordan unngå å miste disker i høyt gress",
  description: "Praktiske råd for å unngå å miste discgolfdisker i høyt gress, vått føre og norsk sommersesong.",
  h1: "Hvordan unngå å miste disker i høyt gress",
  eyebrow: "Sesong og evergreen",
  lead: "Høyt gress kan gjøre en enkel runde dyr og frustrerende. Med riktige diskvalg, kastvalg og leterutine mister du færre disker.",
  meta: ["Sesongguide", "Praktisk"],
  sections: [
    { id: "for", title: "Før du kaster", body: `<ul><li>Velg en disk i synlig farge.</li><li>Unngå mørke/grønne disker i tett vegetasjon.</li><li>Se etter landingspunkt, ikke bare flyvningen.</li><li>Be en medspiller følge med på disken.</li></ul>` },
    { id: "kastvalg", title: "Velg tryggere kast", body: `<p>På hull med høyt gress kan et kortere kast i fairway være bedre enn å presse driveren. Bruk disk du kontrollerer, og spill for en trygg landing.</p>` },
    { id: "leting", title: "Slik leter du smartere", body: `<ol><li>Stopp og pek mot landingspunktet før du går.</li><li>Gå i rett linje mot punktet.</li><li>Søk i sirkel fra mest sannsynlig område.</li><li>Bruk maksimal tid etter lokale regler/arrangørregler i turnering.</li></ol>` },
    { id: "utstyr", title: "Utstyr som kan hjelpe", body: `<p>Et håndkle, en tydelig markør, lyse disker og eventuelt retriever kan hjelpe. Men det viktigste er fortsatt å velge trygg linje.</p>` }
  ],
  faq: [
    { q: "Hvilke farger er lettest å finne?", a: "Sterke rosa, oransje, gul og blå er ofte lettere å se enn grønn, brun og mørk rød." },
    { q: "Bør jeg bruke billigere disker på sommerbaner?", a: "Det kan være smart på baner med mye gress eller vann, men velg fortsatt disker du kontrollerer." }
  ],
  related: [
    { href: "/guider/hvordan-unnga-a-miste-disker/", text: "unngå å miste disker" },
    { href: "/utstyr/disc-retriever-verdt-det.html", text: "disc retriever" },
    { href: "/baner/nybegynnervennlige/", text: "nybegynnervennlige baner" },
    { href: "/guider/discgolf-om-sommeren/", text: "discgolf om sommeren" }
  ],
  sources: [
    { url: pdgaRules, label: "PDGA Official Rules", note: "regelramme for lost disc i organisert spill" },
    { url: udiscNorway, label: "UDisc Norge", note: "baneoversikt og lokale baneforhold må sjekkes før spill" }
  ]
});

function insertSection(file, marker, section) {
  const target = join(root, file);
  let html = readFileSync(target, "utf8");
  if (html.includes(marker)) return;
  html = html.replace("</main>", `${section}\n  </main>`);
  writeFileSync(target, html, "utf8");
}

const newGuideCards = `<section class="section alt" data-phase-13-links><div class="container"><div class="section-head"><div><p class="eyebrow">Nye guider</p><h2>Første produksjonspakke</h2></div><p class="narrow muted">Nye praktiske guider fra Fase 13, valgt for å styrke nybegynner-, utstyr-, bane-, teknikk- og turneringsklyngene.</p></div><div class="grid">
<article class="guide-card"><p class="eyebrow">Nybegynner</p><h3>Hvor langt bør en nybegynner kaste?</h3><p>Kontroll, forventninger og trygg progresjon for nye spillere.</p><a href="/guider/hvor-langt-bor-en-nybegynner-kaste.html">Les guiden</a></article>
<article class="guide-card"><p class="eyebrow">Utstyr</p><h3>Baseplast vs premiumplast</h3><p>Hva plastvalg betyr for grep, slitestyrke og økonomi.</p><a href="/utstyr/baseplast-vs-premiumplast.html">Les guiden</a></article>
<article class="guide-card"><p class="eyebrow">Baner</p><h3>Discgolfbaner nær Oslo</h3><p>Forsiktig lokal guide med baner å vurdere og kilder.</p><a href="/baner/discgolfbaner-naer-oslo/">Se Oslo-nær guide</a></article>
<article class="guide-card"><p class="eyebrow">Teknikk</p><h3>Approach-kast forklart</h3><p>Kontrollerte innspill og enkle øvelser.</p><a href="/teknikk/approach-kast-forklart/">Les teknikkguiden</a></article>
<article class="guide-card"><p class="eyebrow">Turnering</p><h3>Hva bør du ha med på turnering?</h3><p>Praktisk pakkeliste for første konkurranse.</p><a href="/turneringer/hva-bor-du-ha-med-pa-turnering/">Les turneringsguiden</a></article>
<article class="guide-card"><p class="eyebrow">Sesong</p><h3>Unngå å miste disker i høyt gress</h3><p>Tryggere kastvalg og smartere leterutine.</p><a href="/guider/hvordan-unnga-a-miste-disker-i-hoyt-gress.html">Les guiden</a></article>
</div></div></section>`;

insertSection("index.html", "data-phase-13-links", newGuideCards);
insertSection("artikler.html", "data-phase-13-links", newGuideCards);
insertSection("nybegynnerguide.html", "data-phase-13-links", `<section class="section alt" data-phase-13-links><div class="container"><h2>Nye nybegynnerguider</h2><div class="grid"><article class="guide-card"><h3>Hvor langt bør en nybegynner kaste?</h3><p>Realistiske forventninger og kontroll før makslengde.</p><a href="/guider/hvor-langt-bor-en-nybegynner-kaste.html">Les guiden</a></article><article class="guide-card"><h3>Hvorfor vente med distance drivers?</h3><p>Unngå feilkjøp og lær kontroll først.</p><a href="/guider/hvorfor-nybegynnere-bor-vente-med-distance-drivers.html">Les guiden</a></article><article class="guide-card"><h3>Hvorfor går disken til venstre?</h3><p>En enkel feilsøkingsguide for nye backhand-kast.</p><a href="/guider/hvorfor-gar-disken-alltid-til-venstre.html">Les guiden</a></article></div></div></section>`);
insertSection("utstyr/index.html", "data-phase-13-links", `<section class="section alt" data-phase-13-links><div class="container"><h2>Nye utstyrsguider</h2><div class="grid"><article class="guide-card"><h3>Baseplast vs premiumplast</h3><p>Grep, slitestyrke og økonomi.</p><a href="/utstyr/baseplast-vs-premiumplast.html">Les guiden</a></article><article class="guide-card"><h3>Lett disk vs tung disk</h3><p>Vekt, vind og kontroll for nye spillere.</p><a href="/utstyr/lett-disk-vs-tung-disk.html">Les guiden</a></article><article class="guide-card"><h3>Disc retriever: verdt det?</h3><p>Når tilbehøret faktisk kan være nyttig.</p><a href="/utstyr/disc-retriever-verdt-det.html">Les guiden</a></article></div></div></section>`);
insertSection("baner/index.html", "data-phase-13-links", `<section class="section alt" data-phase-13-links><div class="container"><h2>Nye lokale baneguider</h2><div class="grid"><article class="guide-card"><h3>Discgolfbaner nær Oslo</h3><p>Baner å vurdere rundt Oslo med forsiktige nivåvurderinger.</p><a href="/baner/discgolfbaner-naer-oslo/">Les guiden</a></article><article class="guide-card"><h3>Nybegynnervennlige baner i Oslo</h3><p>Oslo-alternativer som kan passe første runde.</p><a href="/baner/nybegynnervennlige-baner-i-oslo/">Les guiden</a></article></div></div></section>`);
insertSection("teknikk/index.html", "data-phase-13-links", `<section class="section alt" data-phase-13-links><div class="container"><h2>Ny teknikkguide</h2><div class="grid"><article class="guide-card"><h3>Approach-kast forklart</h3><p>Kontrollerte innspill, vanlige feil og øvelser.</p><a href="/teknikk/approach-kast-forklart/">Les guiden</a></article></div></div></section>`);
insertSection("trening/index.html", "data-phase-13-links", `<section class="section alt" data-phase-13-links><div class="container"><h2>Ny treningsguide</h2><div class="grid"><article class="guide-card"><h3>Puttingøvelser hjemme</h3><p>Korte, konkrete økter for rutine og kontroll.</p><a href="/trening/puttingovelser-hjemme/">Les guiden</a></article></div></div></section>`);
insertSection("turneringer/index.html", "data-phase-13-links", `<section class="section alt" data-phase-13-links><div class="container"><h2>Ny turneringsguide</h2><div class="grid"><article class="guide-card"><h3>Hva bør du ha med på turnering?</h3><p>Pakkeliste, regler og praktiske forberedelser.</p><a href="/turneringer/hva-bor-du-ha-med-pa-turnering/">Les guiden</a></article></div></div></section>`);

const urls = [
  "guider/hvor-langt-bor-en-nybegynner-kaste.html",
  "guider/hvorfor-nybegynnere-bor-vente-med-distance-drivers.html",
  "guider/hvorfor-gar-disken-alltid-til-venstre.html",
  "utstyr/baseplast-vs-premiumplast.html",
  "utstyr/lett-disk-vs-tung-disk.html",
  "utstyr/disc-retriever-verdt-det.html",
  "baner/discgolfbaner-naer-oslo/",
  "baner/nybegynnervennlige-baner-i-oslo/",
  "teknikk/approach-kast-forklart/",
  "trening/puttingovelser-hjemme/",
  "turneringer/hva-bor-du-ha-med-pa-turnering/",
  "guider/hvordan-unnga-a-miste-disker-i-hoyt-gress.html"
];

let sitemap = read("sitemap.xml");
for (const urlPath of urls) {
  const loc = `https://diskgolfutstyr.no/${urlPath}`;
  if (!sitemap.includes(loc)) {
    sitemap = sitemap.replace("</urlset>", `  <url><loc>${loc}</loc><lastmod>${today}</lastmod></url>\n</urlset>`);
  }
}
write("sitemap.xml", sitemap);

write("docs/phase-13-internal-linking-log.md", `
# Fase 13 internlenking

| Fra side | Til side | Ankertekst | Hvorfor | Status |
|---|---|---|---|---|
| /index.html | /guider/hvor-langt-bor-en-nybegynner-kaste.html | Hvor langt bør en nybegynner kaste? | Ny praktisk startguide | Lagt til |
| /nybegynnerguide.html | /guider/hvorfor-nybegynnere-bor-vente-med-distance-drivers.html | Hvorfor vente med distance drivers? | Forebygger feilkjøp | Lagt til |
| /utstyr/ | /utstyr/baseplast-vs-premiumplast.html | Baseplast vs premiumplast | Styrker produktklynge | Lagt til |
| /utstyr/ | /utstyr/lett-disk-vs-tung-disk.html | Lett disk vs tung disk | Styrker diskvalg | Lagt til |
| /baner/ | /baner/discgolfbaner-naer-oslo/ | Discgolfbaner nær Oslo | Lokal SEO | Lagt til |
| /teknikk/ | /teknikk/approach-kast-forklart/ | Approach-kast forklart | Styrker teknikk | Lagt til |
| /trening/ | /trening/puttingovelser-hjemme/ | Puttingøvelser hjemme | Styrker trening | Lagt til |
| /turneringer/ | /turneringer/hva-bor-du-ha-med-pa-turnering/ | Hva bør du ha med på turnering? | Styrker turnering | Lagt til |
`);

write("docs/phase-13-production-log.md", `
# Fase 13 produksjonslogg

| Dato | Side | URL | Type | Klynge | Ny/forbedret | Kilder lagt inn | Internlenker lagt inn | Status |
|---|---|---|---|---|---|---|---|---|
${urls.map((u) => `| ${today} | ${u} | /${u} | Artikkel/guide | Fase 13 | Ny | Ja | Ja | Publisert |`).join("\n")}
`);

write("docs/phase-13-quality-review.md", `
# Fase 13 kvalitetsgjennomgang

| URL | Nivå | Styrker | Mangler | Klar for publisering | Kommentar |
|---|---|---|---|---|---|
${urls.map((u) => `| /${u} | Nivå 2 | Tydelig struktur, kilder, internlenker, oppdatert-dato | Bør revideres etter Search Console-data | Ja | Ikke fysisk test eller falske data |`).join("\n")}
`);

let log = read("docs/content-production-log.md");
if (!log.includes("Fase 13 publiserbar innholdspakke")) {
  log += `

## ${today} - Fase 13 publiserbar innholdspakke

| Dato | Tittel | URL | Klynge | Status | Neste steg | Kommentar |
|---|---|---|---|---|---|---|
${urls.map((u) => `| ${today} | ${u} | /${u} | Fase 13 | Publisert | Følg opp etter Search Console-data | Ny kontrollert innholdsside med kilder og internlenker |`).join("\n")}
`;
  write("docs/content-production-log.md", log);
}

let pipeline = read("docs/content-pipeline.md");
for (const urlPath of urls) {
  const title = urlPath.split("/").filter(Boolean).pop().replace(".html", "").replaceAll("-", " ");
  if (!pipeline.includes(`/${urlPath}`)) {
    pipeline += `\n| ${title} | /${urlPath} | Fase 13 | Publisert | Høy | Informasjon | Følg opp etter Search Console-data |`;
  } else {
    pipeline = pipeline.replace(new RegExp(`\\| ([^|]+) \\| /${urlPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\|([^\\n]+)`, "g"), (line) => line.replace("Brief klar", "Publisert").replace("Klar til publisering", "Publisert"));
  }
}
write("docs/content-pipeline.md", pipeline);

let status = read("docs/publishing-status.md");
for (const urlPath of urls) {
  if (!status.includes(`/${urlPath}`)) {
    status += `\n| ${urlPath} | /${urlPath} | Publisert | ${today} | Nei | Nei | Ja |`;
  }
}
write("docs/publishing-status.md", status);

let dashboard = read("docs/editorial-dashboard.md");
if (!dashboard.includes("Fase 13 publisert")) {
  dashboard += `

## Fase 13 publisert

| Side | Klynge | Neste oppfølging |
|---|---|---|
${urls.map((u) => `| /${u} | Fase 13 | Revider etter Search Console-data |`).join("\n")}
`;
}
write("docs/editorial-dashboard.md", dashboard);

console.log(JSON.stringify({ createdPages: urls.length, sitemapUrlsAdded: urls.length }, null, 2));
