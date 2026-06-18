import { mkdirSync, writeFileSync } from "node:fs";

const sourceMap = {
  beginner: ["PDGA beginner guide", "Latitude 64 beginner guide", "Reddit r/discgolf beginner threads"],
  technique: ["PDGA beginner guide", "Overthrow Disc Golf / technique trend signal", "Reddit form-check discussions"],
  rules: ["PDGA Official Rules", "PDGA Competition Manual"],
  tournament: ["NAIF Disksport terminliste", "PDGA event search", "Disc Golf Scene Norway", "Disc Golf Metrix"],
  course: ["UDisc Norway course pages", "Norwegian clubs", "Disc Golf Metrix"],
  product: ["Producer product pages", "PDGA approved discs", "Norwegian retailers", "Reddit player experience threads"],
  ranking: ["PDGA ratings", "PDGA World Rankings", "StatMando"],
  club: ["Norwegian disc golf clubs", "NAIF Disksport", "Disc Golf Scene"],
  news: ["PDGA approved discs", "DGPT news", "Producer news", "Norwegian retailers"],
  evergreen: ["PDGA", "UDisc", "NAIF Disksport", "Norwegian club pages"]
};

const baseLinks = {
  beginner: ["nybegynnerguide.html", "utstyrsguide.html", "regler.html"],
  technique: ["nybegynnerguide.html", "artikler.html", "utstyrsguide.html"],
  rules: ["regler.html", "turneringer-ranking.html", "nybegynnerguide.html"],
  tournament: ["turneringer-ranking.html", "regler.html", "baneguide.html"],
  course: ["baneguide.html", "utstyrsguide.html", "turneringer-ranking.html"],
  product: ["utstyrsguide.html", "nybegynnerguide.html", "artikler.html"],
  ranking: ["turneringer-ranking.html", "regler.html", "artikler.html"],
  club: ["baneguide.html", "turneringer-ranking.html", "artikler.html"],
  news: ["artikler.html", "turneringer-ranking.html", "utstyrsguide.html"],
  evergreen: ["nybegynnerguide.html", "regler.html", "utstyrsguide.html"]
};

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function potentialByPriority(priority) {
  if (priority <= 30) return "Høy";
  if (priority <= 75) return "Middels";
  return "Lav";
}

function competitionByCategory(category, priority) {
  if (["Norske baner", "Norske klubber", "Norgesranking"].includes(category)) return "Lav/Middels";
  if (["Utstyr", "Produkttest", "Sammenligning"].includes(category)) return priority < 35 ? "Middels" : "Middels/Høy";
  return priority < 55 ? "Lav/Middels" : "Lav";
}

function intentByCategory(category) {
  if (["Utstyr", "Utstyrsnyheter", "Produkttest"].includes(category)) return "Kommersiell/research";
  if (["Turneringer", "Norgesranking", "PDGA"].includes(category)) return "Informasjon/navigasjon";
  if (["Norske baner", "Norske klubber"].includes(category)) return "Lokal informasjon";
  return "Informasjon";
}

function keyFromCategory(category) {
  if (["Nybegynnerguider", "Vanlige feil"].includes(category)) return "beginner";
  if (["Kasteteknikk", "Backhand", "Forehand", "Putting", "Trening"].includes(category)) return "technique";
  if (["Regler"].includes(category)) return "rules";
  if (["Turneringer"].includes(category)) return "tournament";
  if (["Norske baner"].includes(category)) return "course";
  if (["Utstyr", "Ulike disktyper", "Bag-oppsett", "Utstyrsnyheter"].includes(category)) return "product";
  if (["PDGA", "Norgesranking"].includes(category)) return "ranking";
  if (["Norske klubber"].includes(category)) return "club";
  return "evergreen";
}

function article(title, category, priority, plan) {
  const key = keyFromCategory(category);
  return {
    title,
    primaryKeyword: title.toLowerCase(),
    secondaryKeywords: [
      `${title.toLowerCase()} norsk`,
      `discgolf ${category.toLowerCase()}`,
      "frisbeegolf"
    ],
    searchIntent: intentByCategory(category),
    estimatedTrafficPotential: potentialByPriority(priority),
    competitionLevel: competitionByCategory(category, priority),
    priority: potentialByPriority(priority),
    contentPlan: plan || `Forklar problemet, gi norsk kontekst, vis praktiske valg, legg inn kildepeker og avslutt med neste steg for leseren.`,
    internalLinks: baseLinks[key],
    suggestedSources: sourceMap[key],
    category,
    slug: slugify(title),
    evidenceStatus: "Guide/research. Ikke produkt- eller testpåstand."
  };
}

function testIdea(title, category, priority, physical = true) {
  const key = category.includes("Sekk") || category.includes("Kurv") || category.includes("Sko") ? "product" : "product";
  return {
    title,
    primaryKeyword: title.toLowerCase(),
    secondaryKeywords: [`${title.toLowerCase()} test`, "discgolf utstyr", "frisbeegolf utstyr"],
    searchIntent: physical ? "Kommersiell/test" : "Kommersiell/research",
    estimatedTrafficPotential: potentialByPriority(priority),
    competitionLevel: competitionByCategory("Produkttest", priority),
    priority: potentialByPriority(priority),
    testCategory: physical ? "Kategori A - Reell fysisk test" : "Kategori B - Research-basert sammenligning",
    evidenceLabel: physical
      ? "Må gjennomføres fysisk før konklusjon publiseres."
      : "Basert på research og spillererfaringer, ikke egen test.",
    contentPlan: physical
      ? "Definer testere, dato, vær, bane, metode, målepunkter og resultatlogg før rangering."
      : "Sammenlign spesifikasjoner, produsentdata, åpne kilder, tilgjengelighet og spillererfaringer med tydelig forbehold.",
    internalLinks: ["utstyrsguide.html", "artikler.html", "nybegynnerguide.html"],
    suggestedSources: sourceMap[key],
    productArea: category,
    slug: slugify(title)
  };
}

function comparison(title, priority, productArea = "Utstyr") {
  return {
    title,
    primaryKeyword: title.toLowerCase(),
    secondaryKeywords: [`${title.toLowerCase()} forskjell`, "disc golf sammenligning", "frisbeegolf utstyr"],
    searchIntent: "Kommersiell/research",
    estimatedTrafficPotential: potentialByPriority(priority),
    competitionLevel: competitionByCategory("Sammenligning", priority),
    priority: potentialByPriority(priority),
    contentPlan: "Forklar hvem hvert alternativ passer for, sammenlign spesifikasjoner, typisk bruk og forbehold. Merk tydelig om siden ikke bygger på egen test.",
    internalLinks: ["utstyrsguide.html", "nybegynnerguide.html", "artikler.html"],
    suggestedSources: ["Producer product pages", "PDGA approved discs", "Norwegian retailers", "Reddit player experience threads"],
    evidenceLabel: "Basert på research og spillererfaringer, ikke egen test.",
    productArea,
    slug: slugify(title)
  };
}

function evergreenIdea(title, category, priority) {
  const key = keyFromCategory(category);
  return {
    title,
    primaryKeyword: title.toLowerCase(),
    secondaryKeywords: [`${title.toLowerCase()} guide`, "discgolf norge", "frisbeegolf"],
    searchIntent: "Evergreen informasjon",
    estimatedTrafficPotential: potentialByPriority(priority),
    competitionLevel: competitionByCategory(category, priority),
    priority: potentialByPriority(priority),
    contentPlan: "Lag en tidløs forklaring med definisjoner, norsk kontekst, eksempler og kildepeker. Oppdater bare når regler/data endres.",
    internalLinks: baseLinks[key],
    suggestedSources: sourceMap[key],
    category,
    slug: slugify(title)
  };
}

const articleSpecs = [
  ["Hvilke disker trenger en nybegynner?", "Nybegynnerguider"],
  ["Hva er discgolf?", "Nybegynnerguider"],
  ["Putter, midrange og driver forklart enkelt", "Nybegynnerguider"],
  ["Hvorfor nybegynnere bør vente med distance drivers", "Nybegynnerguider"],
  ["Hvor langt bør en nybegynner kaste?", "Nybegynnerguider"],
  ["Hva betyr speed, glide, turn og fade?", "Ulike disktyper"],
  ["Hvilken vekt bør disker ha?", "Ulike disktyper"],
  ["Understable, stable og overstable forklart", "Ulike disktyper"],
  ["Slik spiller du første runde", "Nybegynnerguider"],
  ["Vanlige feil nye discgolfspillere gjør", "Vanlige feil"],
  ["Hvorfor går disken alltid til venstre?", "Vanlige feil"],
  ["Hvorfor går disken rett i bakken?", "Vanlige feil"],
  ["Hvorfor vender disken over?", "Vanlige feil"],
  ["Hyzer og anhyzer forklart", "Kasteteknikk"],
  ["Nose angle forklart på norsk", "Kasteteknikk"],
  ["Backhand for nybegynnere", "Backhand"],
  ["Slik får du renere backhand-release", "Backhand"],
  ["Forehand for nybegynnere", "Forehand"],
  ["Vanlige forehand-feil", "Forehand"],
  ["Putting for nybegynnere", "Putting"],
  ["Slik lager du puttingrutine", "Putting"],
  ["Puttingøvelser hjemme", "Putting"],
  ["Approach-kast forklart", "Kasteteknikk"],
  ["Scramble-kast på norske skogsbaner", "Kasteteknikk"],
  ["Slik trener du discgolf alene", "Trening"],
  ["30 minutter felttrening", "Trening"],
  ["Hvordan måle kastelengde", "Trening"],
  ["Slik bygger du en 3-disk starterbag", "Bag-oppsett"],
  ["Slik bygger du en 5-disk bag", "Bag-oppsett"],
  ["Minimalistisk discgolfbag", "Bag-oppsett"],
  ["Slik unngår du overlapp i bagen", "Bag-oppsett"],
  ["Beste puttertype for nybegynnere", "Utstyr"],
  ["Beste midrange-type for nybegynnere", "Utstyr"],
  ["Beste fairway driver-type for nybegynnere", "Utstyr"],
  ["Når trenger du distance driver?", "Utstyr"],
  ["Baseplast vs premiumplast forklart", "Utstyr"],
  ["Disc golf i regn", "Trening"],
  ["Disc golf om vinteren", "Trening"],
  ["Glow discgolf: utstyr og regler", "Utstyr"],
  ["Sko til discgolf: hva bør du se etter?", "Utstyr"],
  ["Hjemmekurv til hagebruk", "Utstyr"],
  ["Disc golf-sekk for nybegynnere", "Utstyr"],
  ["Disc retriever: verdt det?", "Utstyr"],
  ["Håndkle og chalk bag forklart", "Utstyr"],
  ["PDGA-regler nye spillere bør kunne", "Regler"],
  ["OB, mando og relief forklart", "Regler"],
  ["Hva er en lie i discgolf?", "Regler"],
  ["Rekkefølge og etikette på banen", "Regler"],
  ["Første ukesgolf: slik fungerer det", "Turneringer"],
  ["Første turnering uten stress", "Turneringer"],
  ["PDGA-rating forklart på norsk", "PDGA"],
  ["Metrix-rating forklart", "Turneringer"],
  ["PDGA Live og resultater forklart", "PDGA"],
  ["Hvordan fungerer Norgescup?", "Turneringer"],
  ["NM i diskgolf forklart", "Turneringer"],
  ["DGPT forklart for norske seere", "Turneringer"],
  ["Major-turneringer i discgolf", "Turneringer"],
  ["Norgesranking i discgolf forklart", "Norgesranking"],
  ["MPO og FPO forklart", "PDGA"],
  ["Hvordan velge riktig konkurranseklasse", "Turneringer"],
  ["Slik finner du discgolfbaner i Norge", "Norske baner"],
  ["Nybegynnervennlige baner i Norge", "Norske baner"],
  ["Beste skogsbaner i Norge", "Norske baner"],
  ["Beste baner for helgetur", "Norske baner"],
  ["Krokhol baneguide", "Norske baner"],
  ["Øverås baneguide", "Norske baner"],
  ["Valdres Discgolfpark guide", "Norske baner"],
  ["Hestehagen baneguide", "Norske baner"],
  ["Glåmos baneguide", "Norske baner"],
  ["Klemetsrud baneguide", "Norske baner"],
  ["Slik leser du UDisc-banedata", "Norske baner"],
  ["UDisc vs Disc Golf Metrix", "Turneringer"],
  ["Hvordan finne lokale discgolfklubber", "Norske klubber"],
  ["Hva gjør en discgolfklubb?", "Norske klubber"],
  ["Slik blir du med på dugnad", "Norske klubber"],
  ["Norske klubber å følge i 2026", "Norske klubber"],
  ["Hvordan starte discgolfklubb", "Norske klubber"],
  ["Nye disker 2026", "Utstyrsnyheter"],
  ["Nye plasttyper forklart", "Utstyrsnyheter"],
  ["PDGA approved discs forklart", "PDGA"],
  ["Produsentnyheter: Innova, Discraft, MVP og Discmania", "Utstyrsnyheter"],
  ["Norske nettbutikker for discgolf", "Utstyr"],
  ["Brukt eller nytt discgolfutstyr?", "Utstyr"],
  ["Discgolf med barn", "Nybegynnerguider"],
  ["Discgolf som familieaktivitet", "Nybegynnerguider"],
  ["Hva bør ligge i bagen første runde?", "Nybegynnerguider"],
  ["Hvordan unngå å miste disker", "Nybegynnerguider"],
  ["Hvordan markere disker riktig", "Regler"],
  ["Når trenger du mini marker?", "Regler"],
  ["Vind i discgolf forklart", "Kasteteknikk"],
  ["Sidevind, motvind og medvind", "Kasteteknikk"],
  ["Roller-kast forklart", "Kasteteknikk"],
  ["Tomahawk og thumber forklart", "Kasteteknikk"],
  ["Hva er en overstable approach-disk?", "Ulike disktyper"],
  ["Hva er en utility-disk?", "Ulike disktyper"],
  ["Hva er turn og fade i praksis?", "Ulike disktyper"],
  ["Lette disker for barn og nye spillere", "Ulike disktyper"],
  ["Hvordan velge plast til norsk klima", "Utstyr"],
  ["Vintergolf: grep, klær og plast", "Trening"],
  ["Sommergolf: varme, vann og lange dager", "Trening"],
  ["Julegaver til discgolfspillere", "Utstyr"],
  ["Sesongstart: sjekkliste for bagen", "Bag-oppsett"],
  ["Slik lager du testnotater for egne disker", "Trening"],
  ["Hvordan følge norske turneringer online", "Turneringer"],
  ["Hvordan lese en PDGA-turneringsside", "PDGA"],
  ["Hvordan lese Disc Golf Scene-påmelding", "Turneringer"],
  ["Hvordan lese caddybok", "Turneringer"],
  ["Sikkerhet og baneskikk", "Regler"]
];

const testSpecsA = [
  ["3-disk starterbag", "Starterbag"],
  ["Puttere testet på korte putter", "Puttere"],
  ["Midrange test for rette kast", "Midrange"],
  ["Fairway driver test for nybegynnere", "Fairway drivers"],
  ["Distance drivers for spillere under 90 meter", "Distance drivers"],
  ["Billig vs dyr discgolfsekk", "Discgolfbagger"],
  ["Beste sekk under 1000 kroner", "Discgolfbagger"],
  ["Hjemmekurver til hagebruk", "Kurver"],
  ["Kurv støytest i boligområde", "Kurver"],
  ["Sko til våt norsk skogsbane", "Tilbehør"],
  ["Vått føre og plastgrep", "Tilbehør"],
  ["Slitestyrke på baseplast", "Puttere"],
  ["Slitestyrke på premiumplast", "Midrange"],
  ["Disker for motvind", "Fairway drivers"],
  ["Disker for medvind", "Fairway drivers"],
  ["Lette vs tunge midrange-disker", "Midrange"],
  ["Putter som kastedisk", "Puttere"],
  ["Overstable approach-disker", "Midrange"],
  ["Understable midrange for hyzerflip", "Midrange"],
  ["Fairway på korte norske skogshull", "Fairway drivers"],
  ["Disc retriever i vann og kratt", "Tilbehør"],
  ["Håndkletyper i regn", "Tilbehør"],
  ["Chalk bag i norsk fukt", "Tilbehør"],
  ["Glow-plast i høstmørke", "Tilbehør"],
  ["LED-lys på disk vs glow-disk", "Tilbehør"],
  ["Regntrekk til sekk", "Discgolfbagger"],
  ["Barn og lette disker", "Starterbag"],
  ["Starter set vs selvvalgte enkeltdisker", "Starterbag"],
  ["Puttingøvelse med like vs ulike puttere", "Puttere"],
  ["Norske nettbutikker: levering og retur", "Tilbehør"]
];

const testSpecsB = [
  ["Innova starter set vs Latitude 64 starter set", "Starterbag"],
  ["Aviar vs Judge for nybegynnere", "Puttere"],
  ["Pure vs Reko for putting", "Puttere"],
  ["Buzzz vs Mako3 som første midrange", "Midrange"],
  ["Hex vs Buzzz for rette kast", "Midrange"],
  ["River vs Leopard3 som første fairway", "Fairway drivers"],
  ["FD vs Crave for kontroll", "Fairway drivers"],
  ["Destroyer vs Wraith for norske spillere", "Distance drivers"],
  ["Grace vs Wraith som distance driver", "Distance drivers"],
  ["Zone vs Järn vs Entropy", "Midrange"],
  ["MVP Shuttle vs Dynamic Discs Trooper", "Discgolfbagger"],
  ["Latitude 64 Core vs Discmania Fanatic", "Discgolfbagger"],
  ["MVP Black Hole vs Latitude 64 ProBasket", "Kurver"],
  ["Billig kurv vs premiumkurv", "Kurver"],
  ["Retriever med teleskop vs krok", "Tilbehør"],
  ["Chalk bag vs whale sac-type grep", "Tilbehør"],
  ["Baseplast-puttere for putting", "Puttere"],
  ["Premium putter som throwing putter", "Puttere"],
  ["Understable fairway for nybegynnere", "Fairway drivers"],
  ["Overstable fairway for vind", "Fairway drivers"]
];

const comparisonSpecs = [
  ["Putter vs midrange for nybegynnere", "Ulike disktyper"],
  ["Fairway driver vs distance driver", "Ulike disktyper"],
  ["Baseplast vs premiumplast", "Utstyr"],
  ["Lett disk vs tung disk", "Ulike disktyper"],
  ["Startsett vs enkeltdisker", "Bag-oppsett"],
  ["Aviar vs Judge", "Puttere"],
  ["Pure vs Reko", "Puttere"],
  ["Buzzz vs Mako3", "Midrange"],
  ["Hex vs Buzzz", "Midrange"],
  ["River vs Leopard3", "Fairway drivers"],
  ["FD vs Crave", "Fairway drivers"],
  ["Destroyer vs Wraith", "Distance drivers"],
  ["Grace vs Wraith", "Distance drivers"],
  ["Zone vs Järn vs Entropy", "Midrange"],
  ["Sekk vs skulderbag", "Discgolfbagger"],
  ["Billig sekk vs premiumsekk", "Discgolfbagger"],
  ["Hjemmekurv vs klubbkurv", "Kurver"],
  ["Glow-disc vs LED-lys", "Tilbehør"],
  ["Chalk bag vs håndkle", "Tilbehør"],
  ["UDisc vs Disc Golf Metrix", "Turneringer"],
  ["PDGA-rating vs Metrix-rating", "Norgesranking"],
  ["Norgescup vs ukesgolf", "Turneringer"],
  ["Krokhol vs Øverås for tilreisende", "Norske baner"],
  ["Skogsbane vs parkbane", "Norske baner"],
  ["Backhand vs forehand for nybegynnere", "Kasteteknikk"]
];

const evergreenSpecs = [
  ["Hva er discgolf?", "Nybegynnerguider"],
  ["PDGA-regler forklart på norsk", "Regler"],
  ["Flight numbers forklart", "Ulike disktyper"],
  ["PDGA-rating forklart", "PDGA"],
  ["Hva er en mando?", "Regler"],
  ["Hva er OB?", "Regler"],
  ["Hva er par i discgolf?", "Nybegynnerguider"],
  ["Hva er hyzer?", "Kasteteknikk"],
  ["Hva er anhyzer?", "Kasteteknikk"],
  ["Hva er turn?", "Ulike disktyper"],
  ["Hva er fade?", "Ulike disktyper"],
  ["Hva er glide?", "Ulike disktyper"],
  ["Hva er speed?", "Ulike disktyper"],
  ["Hva er en putter?", "Ulike disktyper"],
  ["Hva er en midrange?", "Ulike disktyper"],
  ["Hva er en fairway driver?", "Ulike disktyper"],
  ["Hva er en distance driver?", "Ulike disktyper"],
  ["Hvordan fungerer en discgolfbane?", "Norske baner"],
  ["Hvordan finner du turneringer i Norge?", "Turneringer"],
  ["Hvordan melder du deg på turnering?", "Turneringer"],
  ["Hva er Disc Golf Scene?", "Turneringer"],
  ["Hva er UDisc?", "Norske baner"],
  ["Hva er Disc Golf Metrix?", "Turneringer"],
  ["Hva gjør en discgolfklubb?", "Norske klubber"],
  ["Hvordan velge riktig disk?", "Utstyr"]
];

const articles = articleSpecs.map(([title, category], index) => article(title, category, index + 1));
const tests = [
  ...testSpecsA.map(([title, category], index) => testIdea(title, category, index + 1, true)),
  ...testSpecsB.map(([title, category], index) => testIdea(title, category, testSpecsA.length + index + 1, false))
];
const comparisons = comparisonSpecs.map(([title, productArea], index) => comparison(title, index + 1, productArea));
const evergreen = evergreenSpecs.map(([title, category], index) => evergreenIdea(title, category, index + 1));

const publicationOrder = articles.slice(0, 30).map((item, index) => ({
  week: Math.floor(index / 5) + 1,
  order: index + 1,
  title: item.title,
  reason: index < 10 ? "Høy nytteverdi og lett å produsere uten falske tester." : "Bygger internlenking, portalbredde og norsk søkedekning."
}));

const contentPlan = `# Content plan for Diskgolfguiden.no

Generert: 2026-06-03

Dette er en researchbasert innholdsbank og publiseringsplan. Ingen av titlene er ferdige artikler, og ingen produkttester skal omtales som faktiske tester før testmetode og resultater er dokumentert.

## Hva bør publiseres først

1. Hvilke disker trenger en nybegynner?
2. Hva betyr speed, glide, turn og fade?
3. Understable, stable og overstable forklart
4. Hvorfor nybegynnere bør vente med distance drivers
5. Putter, midrange og driver forklart enkelt
6. Backhand for nybegynnere
7. Putting for nybegynnere
8. PDGA-regler nye spillere bør kunne
9. Slik finner du discgolfbaner i Norge
10. PDGA-rating forklart på norsk

Disse kan lages uten falske tester fordi de er guider, forklaringer og kildebasert research.

## Hva kan vente

- Rangeringer av beste sekk, sko og kurv bør vente til fysisk test er gjort.
- Spillerprofiler og Norgesranking bør vente til man har manuell verifisering av rating, sponsor og resultater.
- Banetopplister bør vente til hver bane har kilde, dato og metode.
- Utstyrsnyheter bør lages først når produsent- eller PDGA-kilde foreligger.

## Artikler som bør lenkes sammen

- Nybegynnerhub: disker for nybegynnere -> flight numbers -> putter/midrange/driver -> vanlige feil -> første runde.
- Utstyrshub: starterbag -> putter -> midrange -> fairway -> plast -> vekt -> bag-oppsett.
- Teknikqhub: backhand -> nose angle -> hyzer/anhyzer -> vind -> felttrening.
- Turneringshub: regler -> PDGA-rating -> Metrix -> Disc Golf Scene -> Norgescup/NM.
- Banehub: finne baner -> nybegynnervennlige baner -> Krokhol/Øverås/Valdres -> sko/utstyr for norsk terreng.

## Forslag til publiseringsrekkefølge

${publicationOrder.map((item) => `- Uke ${item.week}, #${item.order}: ${item.title} - ${item.reason}`).join("\n")}

## Kilder og researchretning

- PDGA: regler, rating, turneringer, approved discs og nybegynnerstoff.
- UDisc: baner, kurskatalog og norske/topplister som kilde med dato.
- NAIF Disksport: norsk terminliste, NM, NC og nasjonale rammer.
- Disc Golf Scene og Disc Golf Metrix: turneringer, påmelding og resultater.
- Produsentenes egne sider: flight numbers, plast, produktdata og lanseringer.
- Norske klubber: baneinfo, lokale arrangement og praktiske oppdateringer.
`;

const roadmap = `# Roadmap for Diskgolfguiden.no

Generert: 2026-06-03

## Rangert etter trafikkpotensial

${articles
  .filter((item) => item.estimatedTrafficPotential === "Høy")
  .slice(0, 35)
  .map((item, index) => `${index + 1}. ${item.title} (${item.category})`)
  .join("\n")}

## Rangert etter affiliate-potensial

${[...articles, ...tests, ...comparisons]
  .filter((item) => item.affiliatePotential === "Høy" || item.searchIntent.includes("Kommersiell"))
  .slice(0, 35)
  .map((item, index) => `${index + 1}. ${item.title}`)
  .join("\n")}

## Rangert etter hvor lett det er å produsere

${articles
  .filter((item) => item.evidenceStatus?.includes("Guide") || item.category === "Regler" || item.category === "PDGA")
  .slice(0, 35)
  .map((item, index) => `${index + 1}. ${item.title}`)
  .join("\n")}

## 30-dagers plan

- Publiser 10 grunnleggende guider fra nybegynnerhuben.
- Lag kilde-/metodeboks på alle guider.
- Ikke publiser produkt-"best i test" før testmetode finnes.
- Bygg internlenking mellom nybegynner, utstyr, regler og baner.

## 60-dagers plan

- Publiser 10 produkt-/utstyrsguider som researchbaserte sider.
- Gjennomfør første fysiske test: puttere, midrange eller 3-disk starterbag.
- Lag enkel klubb-/banedatabase med verifisert kilde og sist oppdatert.
- Legg til turneringshub med NAIF, PDGA, Disc Golf Scene og Metrix-lenker.

## 90-dagers plan

- Publiser første faktiske testartikkel med metode og resultater.
- Publiser 5 norske baneprofiler med kilde og dato.
- Start Norgesranking/spillerprofil-seksjon med manuell verifisering.
- Revider prioritering basert på Search Console og faktisk brukerdata.
`;

mkdirSync("content-bank", { recursive: true });
writeFileSync("content-plan.md", contentPlan, "utf8");
writeFileSync("roadmap.md", roadmap, "utf8");
writeFileSync("content-bank/discgolf-artikler.json", JSON.stringify(articles, null, 2), "utf8");
writeFileSync("content-bank/discgolf-tester.json", JSON.stringify(tests, null, 2), "utf8");
writeFileSync("content-bank/discgolf-sammenligninger.json", JSON.stringify(comparisons, null, 2), "utf8");
writeFileSync("content-bank/discgolf-evergreen.json", JSON.stringify(evergreen, null, 2), "utf8");

console.log(JSON.stringify({
  articles: articles.length,
  tests: tests.length,
  comparisons: comparisons.length,
  evergreen: evergreen.length
}, null, 2));
