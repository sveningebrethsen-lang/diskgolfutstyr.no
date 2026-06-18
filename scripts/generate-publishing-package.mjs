import { mkdirSync, writeFileSync } from "node:fs";

const updated = "3. juni 2026";
const baseUrl = "https://diskgolfguiden.no";

const nav = `
  <header class="site-header">
    <div class="nav-wrap">
      <a class="brand" href="/index.html"><img src="/assets/logo-full.svg" alt="Diskgolfguiden"></a>
      <button class="menu-button" type="button" aria-label="Åpne meny" aria-expanded="false" data-menu-button>☰</button>
      <nav class="nav" aria-label="Hovedmeny" data-nav>
        <a href="/nybegynnerguide.html">Start her</a>
        <a href="/artikler.html">Guider</a>
        <a href="/tester.html">Tester</a>
        <a href="/sammenligninger.html">Sammenligninger</a>
        <a href="/baneguide.html">Baner</a>
        <a href="/regler.html">Regler</a>
        <a href="/utstyr/">Utstyr</a>
        <a href="/om.html">Om</a>
      </nav>
    </div>
  </header>`;

const footer = `
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <img src="/assets/logo-light.svg" alt="Diskgolfguiden">
        <span>Uavhengig norsk portal for discgolf. Guider først, affiliate sekundært.</span>
      </div>
      <div class="footer-links">
        <a href="/nybegynnerguide.html">Start her</a>
        <a href="/artikler.html">Guider</a>
        <a href="/tester.html">Tester</a>
        <a href="/sammenligninger.html">Sammenligninger</a>
        <a href="/baneguide.html">Baner</a>
      </div>
    </div>
  </footer>`;

function htmlPage(page) {
  const toc = page.sections.map((section) => `<li><a href="#${section.id}">${section.heading}</a></li>`).join("");
  const sections = page.sections.map((section) => `
        <section id="${section.id}">
          <h2>${section.heading}</h2>
          ${section.body}
        </section>`).join("\n");
  const sources = page.sources.map((source) => `<li><a href="${source.url}">${source.name}</a>${source.note ? ` - ${source.note}` : ""}</li>`).join("");
  const links = page.internalLinks.map((link) => `<a class="pill" href="${link.href}">${link.label}</a>`).join("");
  const badge = page.researchNotice ? `<p class="research-note">${page.researchNotice}</p>` : "";

  return `<!doctype html>
<html lang="no">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${page.seoTitle}</title>
  <meta name="description" content="${page.description}">
  <meta name="robots" content="index, follow">
  <meta property="og:title" content="${page.ogTitle || page.title}">
  <meta property="og:description" content="${page.description}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${baseUrl}/${page.path}">
  <meta property="og:image" content="${baseUrl}/assets/hero-banner.svg">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="canonical" href="${baseUrl}/${page.path}">
  <link rel="stylesheet" href="/assets/css/styles.css">
  <script src="/assets/js/site.js" defer></script>
</head>
<body>
${nav}
  <main>
    <article>
      <section class="page-hero">
        <div class="container">
          <p class="eyebrow">${page.category}</p>
          <h1>${page.h1}</h1>
          <p class="lead">${page.ingress}</p>
          <div class="article-meta">
            <span>Oppdatert: ${updated}</span>
            <span>${page.readingTime || "5 min lesing"}</span>
            <span>${page.evidence || "Guide/research"}</span>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="container article-layout">
          <aside class="toc" aria-label="Innholdsfortegnelse">
            <h2>Innhold</h2>
            <ol>${toc}</ol>
          </aside>
          <div class="article-body">
            ${badge}
            ${sections}
            <section>
              <h2>Relaterte guider</h2>
              <div class="pill-row">${links}</div>
            </section>
            <section>
              <h2>Kilder</h2>
              <ul class="source-list">${sources}</ul>
            </section>
          </div>
        </div>
      </section>
    </article>
  </main>
${footer}
</body>
</html>
`;
}

const commonSources = {
  pdgaBeginner: { name: "PDGA - What is Disc Golf? A Complete Beginner's Guide", url: "https://www.pdga.com/node/276016", note: "grunnleggende nybegynnerkilde" },
  pdgaRules: { name: "PDGA Official Rules", url: "https://www.pdga.com/rules", note: "offisiell regelkilde" },
  pdgaRatings: { name: "PDGA ratings", url: "https://www.pdga.com/ratings", note: "offisiell ratingforklaring" },
  udiscNorway: { name: "UDisc - Norway courses", url: "https://udisc.com/best-disc-golf-courses/norway", note: "baneoversikt og spillervurderinger" },
  latitudeBeginner: { name: "Latitude 64 - Disc Golf Beginner Guide", url: "https://latitude64.com/disc-golf-beginner-guide", note: "produsentguide om disktyper og nybegynneroppsett" },
  innovaStarter: { name: "Innova Disc Golf Starter Set", url: "https://www.innovadiscs.com/disc-golf-starter-set/", note: "produsentdata om typisk startsett" },
  innovaComparison: { name: "Innova Disc Comparison", url: "https://www.innovadiscs.com/disc-golf-discs/disc-comparison/", note: "flight numbers og diskoversikt" },
  discGolfSceneNorway: { name: "Disc Golf Scene - Norway tournaments", url: "https://www.discgolfscene.com/tournaments/Norway", note: "turneringer og påmelding" },
  naif: { name: "NAIF - Terminliste 2026", url: "https://amerikanskeidretter.no/terminliste-2026/", note: "norsk turneringsstruktur" }
};

const links = {
  start: { label: "Start her", href: "/nybegynnerguide.html" },
  discs: { label: "Hvilke disker trenger du?", href: "/guider/hvilke-disker-trenger-en-nybegynner.html" },
  choose: { label: "Velg riktig disk", href: "/guider/hvilken-discgolfdisk-skal-jeg-velge.html" },
  types: { label: "Putter, midrange og driver", href: "/guider/putter-midrange-og-driver-forklart.html" },
  flight: { label: "Flight numbers", href: "/guider/flight-numbers.html" },
  rules: { label: "Regler", href: "/regler.html" },
  equipment: { label: "Utstyr", href: "/utstyrsguide.html" },
  courses: { label: "Baner", href: "/baneguide.html" },
  mistakes: { label: "Vanlige feil", href: "/guider/vanlige-feil-for-nybegynnere.html" },
  backhand: { label: "Backhand", href: "/guider/backhand-for-nybegynnere.html" },
  forehand: { label: "Forehand", href: "/guider/forehand-for-nybegynnere.html" },
  putting: { label: "Putting", href: "/guider/putting-for-nybegynnere.html" },
  starter: { label: "Startsett", href: "/tester/beste-discgolf-startsett.html" },
  comparison: { label: "Fairway vs distance", href: "/sammenligninger/fairway-driver-vs-distance-driver.html" },
  glossary: { label: "Ord og uttrykk", href: "/guider/discgolf-ord-og-uttrykk.html" }
};

const pages = [
  {
    path: "guider/hva-er-discgolf.html",
    category: "Nybegynner",
    seoTitle: "Hva er discgolf? | Enkel norsk guide for nybegynnere",
    title: "Hva er discgolf?",
    h1: "Hva er discgolf?",
    description: "Lær hva discgolf er, hvordan en runde fungerer, hva du trenger første gang og hvilke regler som er viktigst å kunne.",
    ingress: "Discgolf er en lavterskelsport der du kaster disker mot kurver, omtrent som golf med færrest mulig kast. Det enkle er at du kan starte med lite utstyr. Det smarte er å starte med riktig utstyr.",
    internalLinks: [links.discs, links.rules, links.courses, links.glossary],
    sources: [commonSources.pdgaBeginner, commonSources.pdgaRules, commonSources.udiscNorway],
    sections: [
      { id: "kort-forklart", heading: "Kort forklart", body: "<p>Du starter på et utslagssted, kaster en disc mot en kurv og fortsetter fra der disken ligger til den lander i kurven. Lavest antall kast vinner, men på første runde er målet heller å forstå banen og kaste kontrollert.</p>" },
      { id: "utstyr", heading: "Hva trenger du?", body: "<p>Én nøytral midrange kan være nok for å prøve sporten. Skal du kjøpe et lite oppsett, er putter + midrange + rolig fairway-driver et bedre valg enn raske distance-drivere.</p><div class=\"product-box\"><h3>Første handleliste</h3><ul><li>1 putter med godt grep</li><li>1 nøytral midrange</li><li>1 fairway-driver hvis du vil prøve litt mer lengde</li></ul><p>Annonselenke kan bli lagt til senere.</p><a class=\"button button-dark\" href=\"#\">Produktlenke kommer</a></div>" },
      { id: "forste-runde", heading: "Slik spiller du første runde", body: "<p>Velg en kort eller middels enkel bane, kast rolig, og slipp raskere grupper forbi. Bruk UDisc eller baneskilt til å finne neste hull, men ikke stress med score hvis du er helt ny.</p>" },
      { id: "vanlige-misforstaelser", heading: "Vanlige misforståelser", body: "<p>Den vanligste feilen er å tro at en rask driver gir mest lengde. For mange nybegynnere gir den bare mer fade, mer frustrasjon og flere disker i skogen.</p>" }
    ]
  },
  {
    path: "guider/hvordan-begynne-med-discgolf.html",
    category: "Nybegynner",
    seoTitle: "Hvordan begynne med discgolf | Første runde steg for steg",
    title: "Hvordan begynne med discgolf",
    h1: "Hvordan begynne med discgolf",
    description: "En praktisk steg-for-steg-guide til første discgolfrunde: banevalg, utstyr, regler og vanlige feil.",
    ingress: "Du trenger ikke mye for å begynne med discgolf. Det viktigste er å velge en passende bane, bruke få disker og forstå grunnreglene før du jakter lengde.",
    internalLinks: [links.start, links.discs, links.rules, links.courses],
    sources: [commonSources.pdgaBeginner, commonSources.udiscNorway, commonSources.pdgaRules],
    sections: [
      { id: "steg-1", heading: "1. Finn en egnet bane", body: "<p>Start på en bane som ikke er for lang eller trang. Baneguider og UDisc kan hjelpe, men lokale klubber gir ofte den beste vurderingen av hva som passer ferske spillere.</p>" },
      { id: "steg-2", heading: "2. Bruk få disker", body: "<p>Ta med én putter og én midrange, eventuelt en fairway-driver. Flere disker gir ikke automatisk bedre valg når du ikke vet hvordan de flyr ennå.</p>" },
      { id: "steg-3", heading: "3. Spill rolig", body: "<p>Kast heller kontrollert 40 meter i fairway enn 70 meter i kratt. Første runde handler om retning, trygghet og å lære banen.</p>" },
      { id: "steg-4", heading: "4. Lær etikette", body: "<p>Stå stille når andre kaster, rop tydelig hvis en disk kan treffe noen, og slipp raskere grupper forbi. God baneskikk gjør sporten bedre for alle.</p>" }
    ]
  },
  {
    path: "guider/hvilke-disker-trenger-en-nybegynner.html",
    category: "Nybegynner / Utstyr",
    seoTitle: "Hvilke disker trenger en nybegynner? | Diskgolfguiden",
    title: "Hvilke disker trenger en nybegynner?",
    h1: "Hvilke disker trenger en nybegynner?",
    description: "Se hvilke discgolfdisker nybegynnere faktisk trenger, hvorfor få disker er best i starten og når du bør legge til driver.",
    ingress: "De fleste nybegynnere trenger færre disker enn de tror. Start med roller du forstår: putter, midrange og eventuelt en rolig fairway-driver.",
    researchNotice: "Dette er en research-basert guide. Den inneholder ikke fysisk test av konkrete produkter.",
    internalLinks: [links.choose, links.types, links.flight, links.starter],
    sources: [commonSources.pdgaBeginner, commonSources.latitudeBeginner, commonSources.innovaStarter],
    sections: [
      { id: "kort-svar", heading: "Kort svar", body: "<p>Start med en putter og en midrange. Legg til fairway-driver når du klarer å kaste midrange relativt rett og kontrollert.</p>" },
      { id: "putter", heading: "Putter", body: "<p>Putteren brukes til korte kast og putting. Velg en som føles trygg i hånden. For nye spillere er grep og komfort viktigere enn små forskjeller i flight numbers.</p>" },
      { id: "midrange", heading: "Midrange", body: "<p>Midrange er ofte den beste læringsdisken. Den krever mindre fart enn en driver og viser tydelig om du slipper disken med riktig vinkel.</p>" },
      { id: "driver", heading: "Fairway-driver", body: "<p>En fairway-driver kan gi mer lengde, men bør være lettkastet og kontrollerbar. Unngå raske distance-drivere som første driver.</p>" },
      { id: "produktboks", heading: "Produktboks-mal", body: "<div class=\"product-box\"><h3>Nybegynneroppsett</h3><p><strong>Diskkategori:</strong> putter + midrange + fairway-driver</p><p><strong>Passer for:</strong> første sesong og rolige baner.</p><ul><li>Fordel: lett å forstå rollene.</li><li>Ulempe: dekker ikke alle vind- og konkurransesituasjoner.</li></ul><p>Annonselenke kan bli lagt til senere.</p><a class=\"button button-dark\" href=\"#\">Se alternativer</a></div>" }
    ]
  },
  {
    path: "guider/hvilken-discgolfdisk-skal-jeg-velge.html",
    category: "Utstyr",
    seoTitle: "Hvilken discgolfdisk skal jeg velge? | Norsk guide",
    title: "Hvilken discgolfdisk skal jeg velge?",
    h1: "Hvilken discgolfdisk skal jeg velge?",
    description: "Praktisk guide til valg av discgolfdisk basert på nivå, kastelengde, bane, vind og diskrolle.",
    ingress: "Riktig disk handler ikke om mest mulig speed. Det handler om hvilken rolle disken skal ha, hvor fort du kaster og hvilke hull du faktisk spiller.",
    researchNotice: "Dette er en research-basert kjøpsguide. Produktforslag må merkes separat som research eller fysisk test.",
    internalLinks: [links.discs, links.types, links.flight, links.equipment],
    sources: [commonSources.pdgaBeginner, commonSources.innovaComparison, commonSources.latitudeBeginner],
    sections: [
      { id: "rolle", heading: "Velg rolle før merke", body: "<p>Spør først: skal disken puttes med, kastes rett, brukes i vind eller gi mer lengde? Når rollen er tydelig, blir produktvalget enklere.</p>" },
      { id: "niva", heading: "Tilpass til nivå", body: "<p>Nye spillere bør se etter lavere speed, nøytral stabilitet og gjerne litt lavere vekt. Erfarne spillere kan trenge mer overstabile disker og raskere drivere.</p>" },
      { id: "bane", heading: "Tenk på banen du spiller", body: "<p>På korte norske skogsbaner er kontroll ofte viktigere enn maks lengde. Midrange og fairway-driver kan være mer nyttig enn distance-driver.</p>" },
      { id: "vind", heading: "Vind og stabilitet", body: "<p>Motvind gjør at disker lettere vender over. Da kan en mer stabil eller overstabil disk være nyttig, men den kan være for krevende på rolige kast.</p>" }
    ]
  },
  {
    path: "guider/putter-midrange-og-driver-forklart.html",
    category: "Disktyper",
    seoTitle: "Putter, midrange og driver forklart | Diskgolfguiden",
    title: "Putter, midrange og driver forklart",
    h1: "Putter, midrange og driver forklart",
    description: "Forstå forskjellen på putter, midrange, fairway-driver og distance-driver, og når du bør bruke hver disktype.",
    ingress: "Disktyper er enklere enn de virker: puttere gir kontroll kort, midrange gir kontroll middels langt, og drivere gir mer lengde når du har nok fart.",
    internalLinks: [links.discs, links.choose, links.flight, links.comparison],
    sources: [commonSources.pdgaBeginner, commonSources.latitudeBeginner, commonSources.innovaComparison],
    sections: [
      { id: "putter", heading: "Putter", body: "<p>Puttere har lav speed, mye kontroll og brukes både til putting og korte innspill. Mange nye spillere bør også lære å kaste putter fra tee på korte hull.</p>" },
      { id: "midrange", heading: "Midrange", body: "<p>Midrange er arbeidshesten for læring. Den er raskere enn putter, men mye mer tilgivende enn driver.</p>" },
      { id: "fairway", heading: "Fairway-driver", body: "<p>Fairway-drivere er ofte første driver nye spillere bør prøve. De kan gi mer lengde uten å kreve samme armhastighet som distance-drivere.</p>" },
      { id: "distance", heading: "Distance-driver", body: "<p>Distance-drivere er laget for høy fart. Hvis du ikke får dem opp i riktig hastighet, vil de ofte fade tidlig og gi mindre praktisk lengde enn en fairway-driver.</p>" }
    ]
  },
  {
    path: "guider/flight-numbers.html",
    category: "Disktyper",
    seoTitle: "Flight numbers forklart | Speed, glide, turn og fade",
    title: "Flight numbers forklart",
    h1: "Hva betyr speed, glide, turn og fade?",
    description: "Flight numbers forklart på norsk: speed, glide, turn og fade, med praktiske råd for nybegynnere.",
    ingress: "Flight numbers er nyttige, men de er ikke fasit. De beskriver omtrent hvordan en disk flyr når den kastes med nok fart og god teknikk.",
    internalLinks: [links.choose, links.types, links.discs, links.glossary],
    sources: [commonSources.innovaComparison, commonSources.latitudeBeginner, commonSources.pdgaBeginner],
    sections: [
      { id: "speed", heading: "Speed", body: "<p>Speed handler om hvor rask disken er laget for å fly. Høy speed krever mer armhastighet. For nye spillere er lavere speed ofte bedre.</p>" },
      { id: "glide", heading: "Glide", body: "<p>Glide beskriver hvor godt disken holder seg i lufta. Mye glide kan hjelpe nye spillere med lengde, men kan også bli vanskeligere i vind.</p>" },
      { id: "turn", heading: "Turn", body: "<p>Turn beskriver hvor mye disken vil vende i høy fart. Negative turn-tall betyr ofte at disken lettere kan gå mot høyre for en høyrehendt backhand.</p>" },
      { id: "fade", heading: "Fade", body: "<p>Fade beskriver avslutningen når disken mister fart. Høy fade gir en kraftigere avslutning mot venstre for høyrehendt backhand.</p>" }
    ]
  },
  {
    path: "guider/backhand-for-nybegynnere.html",
    category: "Kasteteknikk",
    seoTitle: "Backhand for nybegynnere | Discgolf teknikk",
    title: "Backhand for nybegynnere",
    h1: "Backhand for nybegynnere",
    description: "Lær grunnprinsippene i backhand for discgolf: grep, retning, balanse, release og vanlige feil.",
    ingress: "Backhand er kastet de fleste starter med. Fokuser på balanse, retning og ren release før du prøver å kaste hardt.",
    internalLinks: [links.mistakes, links.flight, links.putting, links.forehand],
    sources: [commonSources.pdgaBeginner, commonSources.latitudeBeginner],
    sections: [
      { id: "grep", heading: "Grep", body: "<p>Hold disken fast nok til at den ikke glipper, men ikke så hardt at håndleddet låser seg. Start gjerne med et kontrollgrep før du trener power grip.</p>" },
      { id: "retning", heading: "Retning før kraft", body: "<p>Still kroppen slik at kastet kan gå mot målet. Mange bommer fordi de prøver å dra disken rundt kroppen i stedet for langs en tydelig linje.</p>" },
      { id: "release", heading: "Release", body: "<p>En ren release føles ofte roligere enn du tror. Hvis disken vingler mye, er det bedre å roe ned og finne riktig vinkel.</p>" },
      { id: "feil", heading: "Vanlige feil", body: "<p>For mye arm, dårlig balanse og nesa opp er vanlige problemer. Tren med putter eller midrange før du bruker raske drivere.</p>" }
    ]
  },
  {
    path: "guider/forehand-for-nybegynnere.html",
    category: "Kasteteknikk",
    seoTitle: "Forehand for nybegynnere | Discgolf teknikk",
    title: "Forehand for nybegynnere",
    h1: "Forehand for nybegynnere",
    description: "En praktisk norsk guide til forehand i discgolf: grep, håndledd, vinkel, diskvalg og vanlige feil.",
    ingress: "Forehand er nyttig når backhand-linjen ikke passer, men nye spillere bør lære kontroll før de prøver å kaste veldig hardt.",
    internalLinks: [links.backhand, links.mistakes, links.choose, links.rules],
    sources: [commonSources.pdgaBeginner, commonSources.latitudeBeginner],
    sections: [
      { id: "grep", heading: "Grep og håndledd", body: "<p>Et forehandgrep bør gi støtte under kanten av disken. Håndleddet skal bidra med spinn, men kastet bør ikke bare være en håndleddsflikk.</p>" },
      { id: "vinkel", heading: "Vinkelkontroll", body: "<p>Forehand avslører vinkel raskt. Start med korte kast og nøytral disk før du går til overstabile approach-disker.</p>" },
      { id: "diskvalg", heading: "Diskvalg", body: "<p>Mange velger for overstabile disker for tidlig. Det kan skjule teknikkfeil, men gjør det vanskeligere å lære rette kast.</p>" },
      { id: "praktisk-bruk", heading: "Når forehand er nyttig", body: "<p>Forehand er særlig nyttig rundt hindringer, på hull som avslutter motsatt vei av backhand, og på korte innspill der du vil se målet.</p>" }
    ]
  },
  {
    path: "guider/putting-for-nybegynnere.html",
    category: "Putting",
    seoTitle: "Putting for nybegynnere | Discgolfguiden",
    title: "Putting for nybegynnere",
    h1: "Putting for nybegynnere",
    description: "Lær hvordan du trener putting i discgolf: rutine, avstand, grep, fokus og enkle øvelser for nye spillere.",
    ingress: "Putting er den delen av discgolf du bruker mest. Små forbedringer her kan gi lavere score raskere enn mer maks-lengde.",
    internalLinks: [links.discs, links.starter, links.rules, links.mistakes],
    sources: [commonSources.pdgaBeginner, commonSources.pdgaRules],
    sections: [
      { id: "rutine", heading: "Lag en enkel rutine", body: "<p>Still deg likt, pust rolig, velg ett siktepunkt og gjennomfør. En enkel rutine gjør putting mer repeterbar.</p>" },
      { id: "avstand", heading: "Start nærme nok", body: "<p>Tren mye fra avstander der du treffer ofte. Det bygger selvtillit og gir bedre teknikk enn å bomme hundre putter fra for langt hold.</p>" },
      { id: "grep", heading: "Grep og slipp", body: "<p>Disken bør slippe rent uten å vingle mye. Hvis du klemmer for hardt eller skyver ujevnt, mister du både retning og fart.</p>" },
      { id: "ovelse", heading: "En enkel øvelse", body: "<p>Sett 10 putter fra fem meter. Flytt deg først lenger unna når du treffer minst 7 av 10 flere runder på rad.</p>" }
    ]
  },
  {
    path: "guider/vanlige-feil-for-nybegynnere.html",
    category: "Vanlige feil",
    seoTitle: "Vanlige feil for nybegynnere i discgolf | Diskgolfguiden",
    title: "Vanlige feil for nybegynnere",
    h1: "Vanlige feil for nybegynnere i discgolf",
    description: "Unngå de vanligste feilene nye discgolfspillere gjør: for raske drivere, for mye kraft, dårlig banevalg og uklare regler.",
    ingress: "De fleste nybegynnerfeil handler ikke om talent. De handler om feil disk, for mye kraft og for lite kontroll.",
    internalLinks: [links.discs, links.backhand, links.flight, links.rules],
    sources: [commonSources.pdgaBeginner, commonSources.latitudeBeginner],
    sections: [
      { id: "rask-driver", heading: "1. For rask driver", body: "<p>En rask driver krever fart og spinn. Hvis du ikke får den opp i hastighet, kan den fade tidlig og gi kortere kast enn en midrange.</p>" },
      { id: "for-mye-kraft", heading: "2. For mye kraft", body: "<p>Kraft uten kontroll gir ofte nesa opp, wobble og kast ut av fairway. Tren rolige kast før du øker tempo.</p>" },
      { id: "for-mange-disker", heading: "3. For mange disker", body: "<p>Hvis du bytter disk hele tiden, vet du ikke om feilen ligger i disken eller kastet. Bruk få disker i starten.</p>" },
      { id: "glemme-etikette", heading: "4. Glemme baneskikk", body: "<p>Rop hvis disken kan treffe noen, stå stille når andre kaster, og slipp raskere grupper forbi.</p>" }
    ]
  },
  {
    path: "guider/discgolf-ord-og-uttrykk.html",
    category: "Begreper",
    seoTitle: "Disc golf ord og uttrykk | Norsk ordliste",
    title: "Disc golf ord og uttrykk",
    h1: "Disc golf ord og uttrykk",
    description: "Norsk ordliste for discgolf: hyzer, anhyzer, OB, mando, birdie, bogey, fade, turn, lie og andre begreper.",
    ingress: "Discgolf har mange engelske uttrykk. Her er de viktigste begrepene forklart enkelt på norsk.",
    internalLinks: [links.flight, links.rules, links.types, links.start],
    sources: [commonSources.pdgaRules, commonSources.pdgaBeginner, commonSources.innovaComparison],
    sections: [
      { id: "kast", heading: "Kast og vinkler", body: "<p><strong>Hyzer</strong> betyr at ytterkanten av disken peker ned ved release. <strong>Anhyzer</strong> betyr at ytterkanten peker opp. <strong>Nose angle</strong> handler om om fronten av disken peker opp eller ned.</p>" },
      { id: "score", heading: "Score", body: "<p><strong>Par</strong> er forventet antall kast. <strong>Birdie</strong> er ett kast under par, <strong>bogey</strong> er ett kast over par.</p>" },
      { id: "regler", heading: "Regelord", body: "<p><strong>OB</strong> betyr out-of-bounds. <strong>Mando</strong> betyr mandatory, altså en pålagt rute rundt et hinder. <strong>Lie</strong> er stedet du skal kaste neste kast fra.</p>" },
      { id: "disk", heading: "Diskord", body: "<p><strong>Turn</strong> beskriver vending i høy fart. <strong>Fade</strong> beskriver avslutningen når disken mister fart. <strong>Stabilitet</strong> beskriver hvordan disken oppfører seg i lufta.</p>" }
    ]
  },
  {
    path: "tester/beste-discgolf-startsett.html",
    category: "Utstyr / research",
    seoTitle: "Beste discgolf-startsett for nybegynnere | Research-basert guide",
    title: "Beste discgolf-startsett for nybegynnere",
    h1: "Beste valg for discgolf-startsett",
    description: "Research-basert guide til discgolf-startsett for nybegynnere, med tydelig merking av at produktene ikke er fysisk testet av Diskgolfguiden.",
    ingress: "Et godt startsett bør gjøre sporten enklere, ikke gi deg en for rask driver og tre disker du ikke forstår. Her er hva du bør se etter før du kjøper.",
    evidence: "Research-basert sammenligning",
    researchNotice: "Dette er en research-basert sammenligning basert på produsentdata, offentlige spesifikasjoner og spillererfaringer. Produktene er ikke fysisk testet av Diskgolfguiden.",
    internalLinks: [links.discs, links.choose, links.types, links.flight],
    sources: [commonSources.innovaStarter, commonSources.pdgaBeginner, commonSources.latitudeBeginner],
    sections: [
      { id: "kriterier", heading: "Kriterier for et godt startsett", body: "<p>Se etter lav terskel, tydelige roller og disker du kan bruke videre. Et godt sett har gjerne putter, midrange og en rolig fairway-driver.</p>" },
      { id: "unngaa", heading: "Dette bør du unngå", body: "<p>Unngå sett der driveren er for rask eller for tung for en ny spiller. Høy speed på papiret betyr ikke mer praktisk lengde.</p>" },
      { id: "produktboks", heading: "Produktboks-mal", body: "<div class=\"product-box\"><h3>Typisk 3-disk startsett</h3><p><strong>Diskkategori:</strong> startsett</p><p><strong>Passer for:</strong> første runde, gave og lav terskel.</p><ul><li>Fordel: enkelt og rimelig.</li><li>Ulempe: diskene er ikke alltid optimale for alle spillere.</li></ul><p>Annonselenke kan bli lagt til senere.</p><a class=\"button button-dark\" href=\"#\">Se butikk senere</a></div>" },
      { id: "alternativ", heading: "Alternativ: bygg eget sett", body: "<p>Hvis du har en lokal butikk eller klubb, kan det være enda bedre å velge én putter, én midrange og én fairway-driver separat.</p>" }
    ]
  },
  {
    path: "sammenligninger/fairway-driver-vs-distance-driver.html",
    category: "Sammenligning",
    seoTitle: "Fairway-driver vs distance-driver | Hva bør nybegynnere velge?",
    title: "Fairway-driver vs distance-driver",
    h1: "Fairway-driver vs distance-driver",
    description: "Research-basert sammenligning av fairway-drivere og distance-drivere for nybegynnere og hobbyspillere.",
    ingress: "Mange nye spillere kjøper distance-driver for tidlig. For de fleste gir en fairway-driver mer kontroll, mindre frustrasjon og ofte bedre faktisk resultat.",
    evidence: "Research-basert sammenligning",
    researchNotice: "Dette er en research-basert sammenligning basert på produsentdata, offentlige spesifikasjoner og spillererfaringer. Produktene er ikke fysisk testet av Diskgolfguiden.",
    internalLinks: [links.discs, links.flight, links.choose, links.mistakes],
    sources: [commonSources.pdgaBeginner, commonSources.latitudeBeginner, commonSources.innovaComparison],
    sections: [
      { id: "forskjell", heading: "Forskjellen kort forklart", body: "<p>Fairway-drivere har lavere speed og er lettere å kontrollere. Distance-drivere er laget for høyere fart og krever mer teknikk for å fly slik tallene antyder.</p>" },
      { id: "nybegynner", heading: "Hva bør nybegynnere velge?", body: "<p>Velg fairway-driver først. Hvis du ikke kaster langt nok til å få opp farten, vil en distance-driver ofte fade tidlig.</p>" },
      { id: "norsk-bane", heading: "Norske baner", body: "<p>På mange norske skogsbaner er smale linjer og kontroll viktigere enn maksimal distanse. Det gjør fairway-driveren ekstra relevant.</p>" },
      { id: "nar-distance", heading: "Når gir distance-driver mening?", body: "<p>Når du har stabil release, nok fart og faktisk trenger lengde på åpne hull. Da kan distance-driveren få en rolle, men den bør ikke være første driver.</p>" }
    ]
  },
  {
    path: "guider/norske-discgolfbaner.html",
    category: "Baner",
    seoTitle: "Norske discgolfbaner | Slik finner du riktig bane",
    title: "Norske discgolfbaner",
    h1: "Norske discgolfbaner",
    description: "Guide til hvordan du finner norske discgolfbaner, vurderer vanskelighetsgrad og bruker UDisc, klubbinfo og banekart riktig.",
    ingress: "Norge har mange forskjellige banetyper: korte parkbaner, tekniske skogsbaner og krevende turneringsbaner. Velg bane etter nivå, ikke bare rangering.",
    internalLinks: [links.courses, links.start, links.equipment, links.rules],
    sources: [commonSources.udiscNorway, commonSources.discGolfSceneNorway, commonSources.naif],
    sections: [
      { id: "finn-bane", heading: "Slik finner du bane", body: "<p>Bruk UDisc for oversikt, men sjekk også klubb- eller arrangørside hvis du skal spille turnering, reise langt eller trenger oppdatert info om stenging.</p>" },
      { id: "vanskelighet", heading: "Vanskelighetsgrad", body: "<p>En høyt rangert bane er ikke alltid best som første bane. Se etter lengde, OB, terreng, skilting og hvor lett det er å finne neste hull.</p>" },
      { id: "norsk-terreng", heading: "Norsk terreng", body: "<p>Skog, vått gress og kupert terreng påvirker både diskvalg og sko. På tekniske baner er fairway-driver og midrange ofte mer nyttig enn distance-driver.</p>" },
      { id: "baneprofil", heading: "Hva en god baneprofil bør inneholde", body: "<p>En nyttig baneprofil bør vise sted, hull, terreng, vanskelighetsgrad, anbefalt nivå, kilde og sist verifisert dato.</p>" }
    ]
  }
];

const hubPages = [
  {
    path: "tester.html",
    category: "Tester",
    seoTitle: "Tester av discgolfutstyr | Diskgolfguiden",
    title: "Tester",
    h1: "Tester og testplaner",
    description: "Oversikt over testinnhold på Diskgolfguiden, med tydelig skille mellom fysisk test og researchbasert innhold.",
    ingress: "Her samles testinnhold. Første versjon inneholder researchbaserte sider og testplaner, ikke falske best-i-test-påstander.",
    researchNotice: "Ingen test omtales som fysisk test før den faktisk er gjennomført av Diskgolfguiden.",
    internalLinks: [links.starter, links.equipment, links.discs],
    sources: [commonSources.pdgaBeginner, commonSources.innovaStarter],
    sections: [
      { id: "publisert", heading: "Publisert nå", body: "<div class=\"grid\"><article class=\"card\"><h3>Beste discgolf-startsett</h3><p>Research-basert guide til hva et godt startsett bør inneholde.</p><a href=\"/tester/beste-discgolf-startsett.html\">Les guiden</a></article></div>" },
      { id: "testmerking", heading: "Slik merkes tester", body: "<p>Fysiske tester merkes med: “Dette er en fysisk test utført av Diskgolfguiden.” Researchbaserte sammenligninger merkes tydelig med at produktene ikke er fysisk testet.</p>" },
      { id: "neste", heading: "Neste tester som bør gjennomføres", body: "<ul><li>3-disk starterbag</li><li>Puttere på korte putter</li><li>Midrange for rette kast</li><li>Fairway-driver for nybegynnere</li></ul>" }
    ]
  },
  {
    path: "sammenligninger.html",
    category: "Sammenligninger",
    seoTitle: "Sammenligninger av disker og utstyr | Diskgolfguiden",
    title: "Sammenligninger",
    h1: "Sammenligninger",
    description: "Researchbaserte sammenligninger av disker, disktyper og discgolfutstyr, tydelig merket når det ikke er fysisk test.",
    ingress: "Sammenligninger hjelper deg å forstå forskjeller før du kjøper. De skal ikke late som fysisk test når de bygger på research.",
    researchNotice: "Sammenligningene er researchbaserte med mindre noe annet er tydelig merket.",
    internalLinks: [links.comparison, links.types, links.flight],
    sources: [commonSources.pdgaBeginner, commonSources.innovaComparison, commonSources.latitudeBeginner],
    sections: [
      { id: "publisert", heading: "Publisert nå", body: "<div class=\"grid\"><article class=\"card\"><h3>Fairway-driver vs distance-driver</h3><p>Hvorfor fairway-driver ofte er smartere for nybegynnere.</p><a href=\"/sammenligninger/fairway-driver-vs-distance-driver.html\">Les sammenligningen</a></article></div>" },
      { id: "kommende", heading: "Kommende sammenligninger", body: "<ul><li>Putter vs midrange for nybegynnere</li><li>Baseplast vs premiumplast</li><li>Startsett vs enkeltdisker</li><li>Buzzz vs Mako3</li></ul>" }
    ]
  }
];

mkdirSync("guider", { recursive: true });
mkdirSync("tester", { recursive: true });
mkdirSync("sammenligninger", { recursive: true });

for (const page of [...pages, ...hubPages]) {
  writeFileSync(page.path, htmlPage(page), "utf8");
}

const sitemapUrls = [
  "",
  "nybegynnerguide.html",
  "utstyrsguide.html",
  "baneguide.html",
  "turneringer-ranking.html",
  "regler.html",
  "artikler.html",
  "tester.html",
  "sammenligninger.html",
  "om.html",
  ...pages.map((page) => page.path)
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map((url) => `  <url><loc>${baseUrl}/${url}</loc></url>`).join("\n")}
</urlset>
`;

writeFileSync("sitemap.xml", sitemap, "utf8");

console.log(JSON.stringify({ pages: pages.length, hubs: hubPages.length }, null, 2));
