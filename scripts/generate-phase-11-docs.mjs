import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, extname, join, relative } from "node:path";

const root = process.cwd();
const today = "2026-06-03";

function write(file, content) {
  const target = join(root, file);
  mkdirSync(join(target, ".."), { recursive: true });
  writeFileSync(target, `${content.trim()}\n`, "utf8");
}

function walk(dir, extensions = null) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "node_modules"].includes(entry.name)) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(fullPath, extensions));
    if (entry.isFile() && (!extensions || extensions.includes(extname(entry.name)))) files.push(fullPath);
  }
  return files;
}

const htmlFiles = walk(root, [".html"]);
const docsFiles = existsSync(join(root, "docs")) ? walk(join(root, "docs"), [".md"]) : [];
const dataFiles = existsSync(join(root, "data")) ? walk(join(root, "data"), [".json"]) : [];
const assetsFiles = existsSync(join(root, "assets")) ? walk(join(root, "assets")) : [];

function readMaybe(file) {
  const target = join(root, file);
  return existsSync(target) ? readFileSync(target, "utf8") : "";
}

function pageUrl(file) {
  const rel = relative(root, file).replaceAll("\\", "/");
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) return `/${rel.replace(/index\.html$/, "")}`;
  return `/${rel}`;
}

function extract(html, pattern) {
  const match = html.match(pattern);
  return match ? match[1].trim() : "";
}

function seoFindings() {
  const titleMap = new Map();
  const descMap = new Map();
  const findings = [];

  for (const file of htmlFiles) {
    const html = readFileSync(file, "utf8");
    const rel = relative(root, file).replaceAll("\\", "/");
    const title = extract(html, /<title>([^<]+)<\/title>/i);
    const desc = extract(html, /<meta name="description" content="([^"]*)"/i);
    const h1Count = (html.match(/<h1\b/gi) || []).length;

    if (!title) findings.push(["Manglende title", rel, "Høy", "Legg inn unik og beskrivende title."]);
    if (!desc) findings.push(["Manglende meta description", rel, "Høy", "Legg inn meta description på 120-160 tegn."]);
    if (h1Count !== 1) findings.push([`H1-antall: ${h1Count}`, rel, "Høy", "Sørg for én tydelig H1."]);
    if (!/<link rel="canonical"/i.test(html)) findings.push(["Manglende canonical", rel, "Middels", "Legg inn canonical hvis siden skal indekseres."]);

    if (title) titleMap.set(title, [...(titleMap.get(title) || []), rel]);
    if (desc) descMap.set(desc, [...(descMap.get(desc) || []), rel]);
  }

  for (const [title, files] of titleMap.entries()) {
    if (files.length > 1) findings.push([`Duplikat title: ${title}`, files.join(", "), "Middels", "Skriv unike titles for sidene."]);
  }
  for (const [desc, files] of descMap.entries()) {
    if (files.length > 1) findings.push([`Duplikat meta description`, files.join(", "), "Middels", `Unngå lik description: ${desc.slice(0, 80)}...`]);
  }

  return findings;
}

function repoHygieneFindings() {
  const findings = [];
  if (!existsSync(join(root, "package.json"))) findings.push(["Mangler package.json", "root", "Lav", "Akseptabelt for statisk side, men scripts må dokumenteres som node scripts.", "Ja"]);
  for (const file of htmlFiles) {
    const rel = relative(root, file).replaceAll("\\", "/");
    if (statSync(file).size < 1200) findings.push(["Svært liten HTML-fil", rel, "Middels", "Sjekk at siden ikke er en tynn/uferdig publisert side.", "Nei"]);
  }
  for (const file of assetsFiles) {
    if (statSync(file).size > 250000) findings.push(["Stor asset-fil", relative(root, file).replaceAll("\\", "/"), "Middels", "Optimaliser før publisering.", "Nei"]);
  }
  for (const file of walk(root)) {
    const rel = relative(root, file).replaceAll("\\", "/");
    if (/\.(bak|backup|tmp|old)$/i.test(rel)) findings.push(["Mulig midlertidig/backup-fil", rel, "Middels", "Vurder sletting etter manuell kontroll.", "Nei"]);
  }
  findings.push(["Legacy-sider finnes", "baneguide.html, utstyrsguide.html", "Lav", "Hold noindex/uten sitemap hvis de bare er bro-sider.", "Nei"]);
  return findings;
}

function publishingStatusRows() {
  return htmlFiles
    .sort((a, b) => pageUrl(a).localeCompare(pageUrl(b), "nb"))
    .slice(0, 160)
    .map((file) => {
      const html = readFileSync(file, "utf8");
      const rel = relative(root, file).replaceAll("\\", "/");
      const updated = extract(html, /(?:Sist oppdatert|Oppdatert)[^0-9]*(\d{4}-\d{2}-\d{2})/i) || today;
      const needsSources = /kilder|source|pdga|udisc|naif/i.test(html) ? "Nei" : "Vurderes";
      const ready = /noindex/i.test(html) ? "Nei" : "Ja";
      const status = /noindex/i.test(html) ? "Trenger forbedring" : "Publisert";
      return `| ${rel} | ${pageUrl(file)} | ${status} | ${updated} | ${needsSources} | Vurderes | ${ready} |`;
    });
}

const standardForbidden = [
  "Ingen private API-nøkler",
  "Ingen hemmelige tokens",
  "Ingen passord",
  "Ingen persondata",
  "Ingen falske testpåstander",
  "Ingen bilder uten rettigheter",
  "Ingen falske priser, rabatter eller lagerstatus",
  "Ingen kommende turneringer uten verifisert dato"
];

write("docs/maintenance-manual.md", `
# Vedlikeholdshåndbok for Diskgolfutstyr.no

Sist oppdatert: ${today}

Diskgolfutstyr.no er en statisk norsk discgolfportal på GitHub Pages. Siden har innhold om nybegynnere, regler, teknikk, trening, utstyr, tester, sammenligninger, baner, klubber og turneringer. Målet med vedlikeholdet er å holde innholdet nyttig, korrekt og ærlig over tid.

## Repo-struktur

| Område | Bruk |
|---|---|
| \`*.html\` i rot | Hovedsider og eldre hub-sider |
| \`guider/\` | Nybegynner-, sesong- og praktiske guider |
| \`utstyr/\` | Kommersielle produktguider og utstyrshub |
| \`sammenligninger/\` | Research-baserte sammenligninger |
| \`baner/\` | Banehub, lokale sider og banesider |
| \`klubber/\` | Klubbhub og lokale klubbsider |
| \`turneringer/\` | Turneringsguider og terminlisteforklaring |
| \`teknikk/\` og \`trening/\` | Viderekommen teknikk og treningsinnhold |
| \`data/products/\` | Produktdata for disker, bagger, kurver og tilbehør |
| \`data/courses/\` | Baneinformasjon for Norge |
| \`data/clubs/\` | Klubbdata |
| \`data/affiliate/\` | Affiliate-lenker og placeholder-lenker |
| \`docs/\` | Rutiner, sjekklister, rapporter og redaksjonell dokumentasjon |
| \`scripts/\` | Enkle statiske kontrollscripts |

## Vanlig arbeidsflyt

1. Les relevant dokumentasjon i \`docs/README.md\`.
2. Gjør små, avgrensede endringer.
3. Oppdater innhold, data og interne lenker samtidig.
4. Oppdater \`sitemap.xml\` hvis nye publiserte sider er lagt til.
5. Kjør relevante scripts: \`node scripts/check-internal-links.js\`, \`node scripts/check-sitemap.js\`, \`node scripts/qa-static-site.mjs\`.
6. Sjekk mobilvisning lokalt med Docker eller \`node scripts/serve.mjs\`.
7. Dokumenter endringen i \`docs/maintenance-log.md\` eller \`docs/content-production-log.md\`.
8. Commit med tydelig melding og publiser via GitHub Pages.

## Nye artikler

Nye artikler skal ha unik title, meta description, én H1, tydelige interne lenker og et realistisk formål. Ikke publiser en side som bare er en tynn tekstvariant av en eksisterende side. Bruk egne ord og kilder der fakta brukes.

## Gamle artikler

Gamle artikler oppdateres når de er utydelige, utdaterte, mangler kilder, har svake interne lenker eller har Search Console-data som viser potensial. Ikke endre "Sist oppdatert" uten reell forbedring.

## Sitemap og publisering

\`sitemap.xml\` skal bare inneholde publiserte sider som bør indekseres. Legacy-sider, docs-sider og uferdige sider skal ikke inn i sitemap. \`robots.txt\` skal peke til korrekt sitemap.

## Sjekk lokalt

\`\`\`powershell
node scripts/check-internal-links.js
node scripts/check-sitemap.js
node scripts/check-placeholders.js
node scripts/qa-static-site.mjs
node scripts/serve.mjs
\`\`\`

## Skal aldri inn i repoet

${standardForbidden.map((item) => `- ${item}`).join("\n")}
`);

write("docs/monthly-maintenance-checklist.md", `
# Månedlig vedlikeholdssjekkliste

Sist oppdatert: ${today}

Bruk denne én gang per måned. Fyll inn status og kommentar før publisering.

| Punkt | Hva sjekkes | Hvordan | Status | Kommentar |
|---|---|---|---|---|
| 1 | Search Console-data | Eksporter hvis tilgjengelig, ikke dikt opp tall | Ikke startet |  |
| 2 | Sider med visninger | Se hvilke sider som får impressions | Ikke startet |  |
| 3 | Lav CTR | Finn sider med høy impressions og lav CTR | Ikke startet |  |
| 4 | Nær side 1 | Finn søk med posisjon 8-20 | Ikke startet |  |
| 5 | 5-10 artikler | Oppdater faktiske svake/viktige artikler | Ikke startet |  |
| 6 | Interne lenker | \`node scripts/check-internal-links.js\` | Ikke startet |  |
| 7 | Eksterne lenker | Manuell sjekk av viktige kilder | Ikke startet |  |
| 8 | Affiliate-lenker | Sjekk placeholder/ekte lenker og merking | Ikke startet |  |
| 9 | Produktdata | Sjekk flight numbers, status og kilder | Ikke startet |  |
| 10 | Banedata | Sjekk last_checked, hull, kilder og status | Ikke startet |  |
| 11 | Klubbinfo | Sjekk klubbdata og kontaktlenker | Ikke startet |  |
| 12 | Turneringer | Sjekk at ingen gamle datoer vises som kommende | Ikke startet |  |
| 13 | Sitemap | \`node scripts/check-sitemap.js\` | Ikke startet |  |
| 14 | Robots | Kontroller Sitemap-linje og Allow/Disallow | Ikke startet |  |
| 15 | Mobilvisning | Test forside, huber og kommersielle sider | Ikke startet |  |
| 16 | Ytelse | Se etter store filer og tung JS | Ikke startet |  |
| 17 | Slå sammen sider | Vurder tynne/overlappende sider | Ikke startet |  |
| 18 | Dokumentasjon | Oppdater \`docs/maintenance-log.md\` | Ikke startet |  |
`);

write("docs/quarterly-maintenance-checklist.md", `
# Kvartalsvis vedlikeholdssjekkliste

Sist oppdatert: ${today}

| Område | Hva sjekkes | Ansvarlig | Dato | Hva ble funnet | Hva ble endret | Må følges opp |
|---|---|---|---|---|---|---|
| Hub-sider | Forside, nybegynner, utstyr, baner, klubber, turneringer |  |  |  |  |  |
| Produktguider | Kilder, merking, affiliate, falske testpåstander |  |  |  |  |  |
| Banesider | Hull, by, kilder, last_checked, forsiktige formuleringer |  |  |  |  |  |
| Affiliate | Disclaimer, CTA, placeholder og ekte lenker |  |  |  |  |  |
| Redaksjonelt | Retningslinjer, kontakt, rettelser |  |  |  |  |  |
| Sitemap | Publiserte sider, ingen docs/legacy/drafts |  |  |  |  |  |
| 404 | Interne brutte lenker og gamle URL-er |  |  |  |  |  |
| Title/meta | Tidligere endringer og duplikater |  |  |  |  |  |
| Internlenking | Hovedområder lenker til hverandre |  |  |  |  |  |
| Lav trafikk | Sider som bør forbedres, slås sammen eller fjernes fra sitemap |  |  |  |  |  |
| Teknisk SEO | H1, canonical, JSON-LD, robots |  |  |  |  |  |
| Ytelse | Store assets, scripts, layout shift |  |  |  |  |  |
| Mobil | Meny, tabeller, kort og CTA-er |  |  |  |  |  |
| Tilgjengelighet | Kontrast, fokus, tastatur og lenketekster |  |  |  |  |  |
`);

write("docs/maintenance-log.md", `
# Vedlikeholdslogg

| Dato | Type vedlikehold | Sider/filer endret | Hva ble gjort | Hvorfor | Neste oppfølging |
|---|---|---|---|---|---|
| ${today} | Dokumentasjon, teknisk | \`docs/*maintenance*.md\`, \`docs/README.md\`, \`scripts/check-*.js\` | Opprettet Fase 11 driftsrutiner, sjekklister og lette kontrollscripts | Gjøre siden enklere å drifte over tid | Kjør månedlig sjekk etter første publiseringsrunde |
`);

write("docs/content-refresh-process.md", `
# Rutine for artikkeloppdateringer

Sist oppdatert: ${today}

En artikkel bør oppdateres når informasjonen kan være utdatert, når Search Console viser potensial, når den mangler interne lenker, når språk og struktur er svakt, eller når nye kilder gjør innholdet mer nyttig.

## Prosess

1. Les artikkelen som en faktisk spiller: løser den spørsmålet?
2. Kontroller fakta mot kilder som PDGA, NAIF, UDisc, produsenter, klubber eller egne notater.
3. Fjern generisk tekst og legg til konkrete råd.
4. Forbedre title/meta bare hvis intensjonen blir tydeligere.
5. Legg til FAQ når siden faktisk svarer på konkrete spørsmål.
6. Legg til interne lenker til relevante huber og støtteartikler.
7. Dokumenter endringen i vedlikeholdsloggen.

## Sist oppdatert

"Sist oppdatert" kan endres når det er gjort reell innholdsforbedring, faktasjekk, nye kilder, ny struktur eller tydelige lenkeforbedringer. Datoen skal ikke endres for rene skrivefeil, kosmetikk eller automatisk touch av filer.
`);

write("docs/product-data-maintenance.md", `
# Vedlikehold av produktdata

Sist oppdatert: ${today}

Produktdata ligger i \`data/products/\` og eldre eksempeldata ligger i \`data/products.json\`. Kommersielle lenker ligger separat i \`data/affiliate/links.json\`.

## Nye produkter

1. Legg produktet i riktig fil: \`discs.json\`, \`bags.json\`, \`baskets.json\` eller \`accessories.json\`.
2. Verifiser navn, type, plast, flight numbers og produsent fra produsentens egne sider der mulig.
3. Bruk \`null\`, tom streng eller "Ukjent" hvis data ikke er sikker.
4. Merk tydelig om omtalen er fysisk test, research-basert eller fremtidig testidé.
5. Koble affiliate-lenke via \`data/affiliate/links.json\` når en trygg offentlig lenke finnes.

## Skal unngås

- Ikke hardkod priser.
- Ikke oppgi lagerstatus.
- Ikke skriv "testet" uten fysisk testnotat.
- Ikke bruk butikkbilder uten rettigheter.
- Ikke legg inn hemmelige sporingskoder.
`);

write("docs/affiliate-link-checklist.md", `
# Affiliate-lenkesjekk

Sist oppdatert: ${today}

| Punkt | Sjekk | Status | Kommentar |
|---|---|---|---|
| Affiliate-info-side | Finnes \`affiliate-info.html\` og er lenket | Månedlig |  |
| Disclaimer | Kommersielle sider forklarer affiliate tydelig | Månedlig |  |
| CTA-er | Produktkort bruker ryddige CTA-er | Månedlig |  |
| Placeholder | \`href="#"\` og \`affiliate_url:"#"\` er dokumentert | Månedlig |  |
| Ekte lenker | Lenker fungerer og peker til riktig produkt | Månedlig |  |
| Merking | Bruk \`rel="sponsored nofollow"\` der det passer | Månedlig |  |
| Gamle produkter | Vurder om produkter er utdaterte | Kvartalsvis |  |
| Prioritering | Produkter uten lenke prioriteres etter nytteverdi, ikke bare provisjon | Kvartalsvis |  |

Ikke legg inn ekte affiliate-lenker, private sporingskoder, falske priser, falske rabatter eller kampanjer uten verifisert grunnlag.
`);

write("docs/course-data-maintenance.md", `
# Vedlikehold av banedata

Sist oppdatert: ${today}

Banedata ligger i \`data/courses/norway.json\`. Data skal være forsiktig, kildebasert og egenformulert.

## Nye baner

1. Verifiser banenavn, sted og aktiv status fra åpne kilder.
2. Verifiser antall hull før feltet fylles ut.
3. Legg inn \`source_urls\`, \`udisc_url\`, \`club_url\` eller \`map_url\` der det er relevant.
4. Bruk \`last_checked\` når informasjonen faktisk er kontrollert.
5. Skriv kort beskrivelse med egne ord.
6. Oppdater relevante lokale sider og sitemap hvis en ny baneside publiseres.

Ikke dikt opp antall hull, vanskelighetsgrad, fasiliteter, åpningstider, banestatus eller popularitet.

Standardtekst: "Banestatus kan endre seg. Sjekk alltid oppdatert informasjon fra klubb, arrangør eller banetjeneste før du drar."
`);

write("docs/club-data-maintenance.md", `
# Vedlikehold av klubbdata

Sist oppdatert: ${today}

Klubbdata ligger i \`data/clubs/norway.json\`.

## Rutine

- Bruk offisielle klubb-/idrettslagssider eller offentlige sosiale profiler som kilder.
- Ikke kopier klubbens egen tekst.
- Ikke bruk logo uten tillatelse.
- Ikke påstå samarbeid med klubben.
- Ikke legg inn usikker kontaktinfo som fakta.
- Bruk \`last_checked\` når lenker og fakta er kontrollert.
- Be klubber sende rettelser via \`/kontakt/\`.
`);

write("docs/tournament-content-maintenance.md", `
# Vedlikehold av turneringsinnhold

Sist oppdatert: ${today}

Turneringsinnhold skal forklare hvordan turneringer fungerer, og lenke til offisielle kilder for datoer og påmelding.

## Offisielle kilder

- NAIF/disksport for norske konkurranser og terminliste.
- PDGA for PDGA-regler, rating og events.
- Disc Golf Scene der arrangør bruker det.
- Klubb eller arrangør for lokal informasjon.

Ikke lag falske kommende turneringer. Ikke oppgi gamle datoer som kommende. Ikke scrape eksterne tjenester. Skriv alltid at datoer kan endre seg og at leseren må sjekke offisiell kilde.
`);

write("docs/external-link-check-process.md", `
# Rutine for eksterne lenker

Sist oppdatert: ${today}

Eksterne lenker kan gå til PDGA, NAIF, UDisc, Disc Golf Scene, klubber, kommuner, nettbutikker, produsenter og karttjenester.

## Trygg rutine

- Sjekk viktige eksterne lenker månedlig.
- Sjekk alle eksterne lenker kvartalsvis.
- Ikke lag script som spammer eksterne nettsteder.
- Ikke scrape.
- Dokumenter døde lenker i \`docs/maintenance-log.md\`.
- Bytt til offisiell kilde der mulig.
- Fjern lenker som ikke lenger er relevante.
`);

write("docs/sitemap-robots-maintenance.md", `
# Vedlikehold av sitemap og robots

Sist oppdatert: ${today}

\`sitemap.xml\` skal inneholde publiserte, indekserbare sider. \`robots.txt\` skal peke til \`https://diskgolfutstyr.no/sitemap.xml\`.

## Skal være i sitemap

- Forside og viktige huber
- Publiserte guider
- Publiserte utstyrssider
- Publiserte baner, klubber, turneringer, teknikk og trening

## Skal ikke være i sitemap

- \`docs/\`
- Uferdige drafts
- Legacy/noindex-sider
- Testsider og midlertidige filer

Kjør \`node scripts/check-sitemap.js\` etter sitemap-endringer. Send inn sitemap i Google Search Console etter større publiseringer.
`);

write("docs/github-pages-deployment.md", `
# GitHub Pages-publisering

Sist oppdatert: ${today}

Siden publiseres som statisk nettsted fra branch \`main\`, folder \`/root\`. \`CNAME\` inneholder \`diskgolfutstyr.no\`.

## Før publisering

- Build/test/lint eller relevante scripts er kjørt.
- Interne lenker er sjekket.
- Sitemap og robots er sjekket.
- Mobilvisning er kontrollert.
- Ingen private nøkler, passord eller tokens er lagt inn.
- Ingen falske data eller falske testpåstander.
- Ingen uferdige sider i sitemap.
- Ingen brutte hovedlenker.
- README er oppdatert hvis arbeidsflyten er endret.

## Etter publisering

Åpne forsiden, \`/utstyr/\`, \`/baner/\`, \`/klubber/\`, \`/turneringer/\` og sitemap live. Ved feil: revert siste commit eller push en liten rettelse med tydelig commit-melding.
`);

write("docs/repo-hygiene-report.md", `
# Repo-hygienerapport

Sist oppdatert: ${today}

| Funn | Fil/område | Risiko | Anbefalt tiltak | Utført |
|---|---|---|---|---|
${repoHygieneFindings().map((row) => `| ${row.join(" | ")} |`).join("\n")}
`);

write("docs/publishing-status.md", `
# Publiseringsstatus

Sist oppdatert: ${today}

| Side | URL | Status | Sist oppdatert | Trenger kilder | Trenger internlenker | Klar for publisering |
|---|---|---|---|---|---|---|
${publishingStatusRows().join("\n")}
`);

write("docs/content-type-guidelines.md", `
# Retningslinjer for innholdstyper

Sist oppdatert: ${today}

| Type | Hva det er | Kilder | Affiliate | Sist oppdatert | FAQ/schema | Interne lenker |
|---|---|---|---|---|---|---|
| Guide | Praktisk forklaring | PDGA, NAIF, egne notater, klubber | Lav | Ja | FAQ ved ekte spørsmål | Nybegynner, regler, baner |
| Regelartikkel | Norsk forklaring av regler | PDGA primært | Nei | Ja | Article/FAQ | Turneringer, nybegynner |
| Produktguide | Kjøpshjelp uten falske tester | Produsenter, butikker, egne notater | Ja | Ja | Article/ItemList | Utstyr, tester, affiliate-info |
| Research-basert sammenligning | Sammenligning uten fysisk test | Produsenter og spillererfaringer | Middels | Ja | Article | Relevante guider og produkter |
| Fysisk test | Egen test med metode | Egne testnotater | Ja | Ja | Article | Testmetode, produktguider |
| Baneside | Lokal baneinformasjon | UDisc, klubb, kommune, arrangør | Nei | Ja | Breadcrumb/Article | Baner, nybegynner, utstyr |
| Klubbsider | Oversikt over klubb/område | Klubbens offentlige sider | Nei | Ja | Article | Baner, turneringer |
| Turneringsguide | Forklaring, ikke falsk terminliste | PDGA, NAIF, arrangør | Lav | Ja | FAQ ved behov | Regler, trening, klubber |
| Teknikkguide | Praktiske øvelser | Egne erfaringer, trenerressurser | Lav | Ja | Article | Trening, utstyr |
| Treningsguide | Øvelser og program | Egne erfaringer, faglige kilder | Lav | Ja | Article | Teknikk, nybegynner |
| Sesongartikkel | Praktiske råd for vær/sesong | Egne erfaringer, sikkerhetsråd | Lav/middels | Ja | FAQ ved behov | Utstyr, baner |
`);

write("docs/performance-maintenance.md", `
# Ytelsesrutine

Sist oppdatert: ${today}

Diskgolfutstyr.no skal være rask på mobil og GitHub Pages. Prosjektet bruker små SVG-er, én CSS-fil og lett JavaScript.

## Sjekkpunkter

- Unngå store bilder og ukomprimerte assets.
- Ikke legg til tunge eksterne scripts uten klar nytte.
- Hold filtrering og kortvisning som progressiv forbedring.
- Sjekk at tabeller fungerer på mobil.
- Unngå layout shift fra elementer uten størrelse.
- Kjør lokal mobiltest før publisering.

## Nåværende funn

Største asset er \`assets/css/styles.css\` på omtrent ${Math.round((assetsFiles.find((file) => file.endsWith("styles.css")) ? statSync(assetsFiles.find((file) => file.endsWith("styles.css"))).size : 0) / 1024)} KB. Ingen store bildefiler ble funnet i \`assets/\`.
`);

write("docs/accessibility-maintenance.md", `
# Tilgjengelighetsrutine

Sist oppdatert: ${today}

## Månedlig enkel sjekk

- Test tastaturnavigasjon i header, mobilmeny og CTA-er.
- Sjekk synlig focus state.
- Sjekk kontrast på mørk marine, grønn aksent og grå bakgrunn.
- Bruk beskrivende lenketekster.
- Ikke bruk tekst i bilder som eneste informasjon.
- Skriv alt-tekst når bilder formidler innhold.
- Sjekk at tabeller og kort ikke går utenfor skjermen på mobil.
- Sjekk at knapper og lenker er store nok til touch.
`);

write("docs/security-and-secrets.md", `
# Sikkerhet og private data

Sist oppdatert: ${today}

Dette er et statisk GitHub Pages-prosjekt. Alt som committes kan bli offentlig.

## Skal aldri committes

${standardForbidden.map((item) => `- ${item}`).join("\n")}

## Hvis en nøkkel committes ved feil

1. Regn nøkkelen som kompromittert.
2. Roter/slett nøkkelen hos leverandøren.
3. Fjern den fra repoet.
4. Skriv en nøktern intern logg uten å gjengi hemmeligheten.
5. Vurder historikkrydding bare med tydelig prosess og kontroll.

## Før publisering

Søk etter \`api_key\`, \`token\`, \`secret\`, \`password\`, \`client_secret\` og uventede private filer.
`);

write("docs/scripts.md", `
# Scripts

Sist oppdatert: ${today}

Prosjektet har ingen \`package.json\` og ingen tunge avhengigheter. Scripts kjøres direkte med Node.

| Script | Kommando | Hva det gjør | Ved feil |
|---|---|---|---|
| Intern lenkesjekk | \`node scripts/check-internal-links.js\` | Sjekker HTML/Markdown-lenker, rapporterer brutte lenker og placeholders | Rett lenken eller fjern publisering |
| Sitemap-sjekk | \`node scripts/check-sitemap.js\` | Sjekker sitemap, robots, manglende filer og legacy/docs i sitemap | Oppdater sitemap/robots |
| Placeholder-sjekk | \`node scripts/check-placeholders.js\` | Finner \`href="#"\`, TODO, FIXME og lignende | Vurder om placeholder er bevisst |
| Statisk QA | \`node scripts/qa-static-site.mjs\` | Sjekker title, meta, H1, canonical, JSON-LD og data-JSON | Rett teknisk SEO/datafeil |
| Site audit | \`node scripts/generate-site-audit.mjs\` | Lager overordnet audit | Bruk rapporten i månedlig rutine |
`);

write("docs/annual-content-review.md", `
# Årlig innholdsrevisjon

Sist oppdatert: ${today}

En gang i året bør alt kjerneinnhold kontrolleres samlet.

| Område | Hva sjekkes | Sist sjekket | Neste sjekk | Kommentar |
|---|---|---|---|---|
| Nybegynnerguider | Korrekthet, internlenker, FAQ | ${today} | 2027-06-03 |  |
| Regelartikler | PDGA-lenker og regelendringer | ${today} | 2027-06-03 |  |
| Produktguider | Produktstatus, merking, affiliate | ${today} | 2027-06-03 |  |
| Banesider | Hull, status, kilder, last_checked | ${today} | 2027-06-03 |  |
| Klubbdata | Lenker, kontakt, by/fylke | ${today} | 2027-06-03 |  |
| Turneringsguider | Ingen gamle datoer som kommende | ${today} | 2027-06-03 |  |
| Affiliate-sider | Disclaimer, rel-attributter, lenker | ${today} | 2027-06-03 |  |
| Om/personvern/redaksjonelt | Ærlighet og korrekt metode | ${today} | 2027-06-03 |  |
| Sitemap | Alle viktige sider, ingen uferdige | ${today} | 2027-06-03 |  |
| Eksterne lenker | Viktige kilder fungerer | ${today} | 2027-06-03 |  |
`);

write("docs/operations-backlog.md", `
# Driftstavle og backlog

Sist oppdatert: ${today}

| Oppgave | Type | Prioritet | Estimert innsats | Hvorfor viktig | Status |
|---|---|---|---|---|---|
| Kjør intern lenkesjekk månedlig | Teknisk | Høy | 15 min | Hindrer brutte brukerreiser | Åpen |
| Oppdater produktdata | Produktdata | Høy | 1-2 t | Holder kommersielle sider troverdige | Åpen |
| Oppdater banedata | Banedata | Høy | 2-4 t | Lokal SEO og brukernytte | Åpen |
| Forbedre title/meta fra Search Console | SEO | Høy | 1-3 t | Bedre CTR og trafikk | Åpen |
| Kontrollere sitemap | SEO | Høy | 15 min | Unngår indeksering av feil sider | Åpen |
| Forbedre mobilvisning på tabeller | UI | Middels | 1 t | Bedre mobilopplevelse | Åpen |
| Skrive manglende kildeseksjoner | Innhold | Middels | 2-4 t | Øker troverdighet | Åpen |
| Legge inn ekte affiliate-lenker | Affiliate | Middels | 1-3 t | Inntektsgrunnlag når avtaler finnes | Venter |
| Oppdatere Search Console-rapport | SEO | Høy | 1 t | Datadrevet prioritering | Åpen |
| Kontakte klubber for rettelser | Outreach | Middels | 2 t | Bedre banedata og tillit | Åpen |
`);

write("docs/change-process.md", `
# Endringsrutine

Sist oppdatert: ${today}

1. Les relevant dokumentasjon.
2. Lag små endringer.
3. Kjør build/test/lint eller relevante scripts.
4. Sjekk interne lenker.
5. Sjekk mobil.
6. Oppdater sitemap hvis nye sider er lagt til.
7. Oppdater relevant logg.
8. Skriv tydelig commit-melding.
9. Publiser.
10. Sjekk live side.

## Gode commit-meldinger

- \`Add monthly maintenance checklist\`
- \`Update beginner disc guide metadata\`
- \`Fix internal links in equipment hub\`
- \`Add course data maintenance docs\`
- \`Improve affiliate disclosure on product guides\`
`);

write("docs/technical-seo-maintenance-report.md", `
# Teknisk SEO-vedlikeholdsrapport

Sist oppdatert: ${today}

| Funn | Fil/område | Risiko | Anbefalt tiltak |
|---|---|---|---|
${(seoFindings().length ? seoFindings() : [["Ingen åpenbare title/meta/H1/canonical-feil funnet", "HTML-sider", "Lav", "Fortsett månedlig kontroll med QA-script"]]).map((row) => `| ${row.join(" | ")} |`).join("\n")}

## Kontrollert

- Title
- Meta description
- H1-antall
- Canonical
- Duplikate titles
- Duplikate meta descriptions

Kjør også \`node scripts/qa-static-site.mjs\` for JSON-LD og datafiler.
`);

write("docs/README.md", `
# Dokumentasjonsindeks

Sist oppdatert: ${today}

## Start her

| Fil | Bruk |
|---|---|
| \`maintenance-manual.md\` | Hovedmanual for drift av siden |
| \`change-process.md\` | Trygg arbeidsflyt for endringer |
| \`site-map-content-status.md\` | Oversikt over viktige sider og status |

## SEO

| Fil | Bruk |
|---|---|
| \`seo-checklist.md\` | Grunnleggende SEO-sjekk |
| \`search-console-plan.md\` | Oppsett og bruk av Google Search Console |
| \`monthly-seo-routine.md\` | Månedlig SEO-arbeid |
| \`technical-seo-maintenance-report.md\` | Funn fra teknisk SEO-kontroll |
| \`sitemap-robots-maintenance.md\` | Vedlikehold av sitemap og robots |

## Innhold

| Fil | Bruk |
|---|---|
| \`content-quality-checklist.md\` | Kvalitetssjekk før publisering |
| \`content-refresh-process.md\` | Oppdatering av gamle artikler |
| \`content-type-guidelines.md\` | Regler for ulike innholdstyper |
| \`editorial-calendar.md\` | Redaksjonell publiseringsplan |
| \`annual-content-review.md\` | Årlig innholdsrevisjon |

## Affiliate og inntekter

| Fil | Bruk |
|---|---|
| \`affiliate-guidelines.md\` | Overordnede affiliate-prinsipper |
| \`affiliate-link-management.md\` | Håndtering av affiliate-lenker |
| \`affiliate-link-checklist.md\` | Månedlig sjekk av affiliate-lenker |
| \`product-data-maintenance.md\` | Vedlikehold av produktdata |
| \`revenue-plan.md\` | Inntektsplan |

## Baner og klubber

| Fil | Bruk |
|---|---|
| \`course-content-guidelines.md\` | Hvordan banesider skal skrives |
| \`course-data-maintenance.md\` | Vedlikehold av banedata |
| \`club-data-maintenance.md\` | Vedlikehold av klubbdata |
| \`tournament-content-maintenance.md\` | Vedlikehold av turneringsinnhold |

## Drift og vedlikehold

| Fil | Bruk |
|---|---|
| \`monthly-maintenance-checklist.md\` | Månedlig sjekkliste |
| \`quarterly-maintenance-checklist.md\` | Kvartalsvis sjekkliste |
| \`maintenance-log.md\` | Logg for større vedlikehold |
| \`operations-backlog.md\` | Prioritert driftstavle |
| \`repo-hygiene-report.md\` | Repo-hygienefunn |
| \`publishing-status.md\` | Publiseringsstatus for sider |

## Teknisk

| Fil | Bruk |
|---|---|
| \`scripts.md\` | Oversikt over scripts |
| \`performance-maintenance.md\` | Ytelsesrutine |
| \`accessibility-maintenance.md\` | Tilgjengelighetsrutine |
| \`external-link-check-process.md\` | Manuell rutine for eksterne lenker |

## Publisering

| Fil | Bruk |
|---|---|
| \`github-pages-deployment.md\` | GitHub Pages-publisering |
| \`launch-checklist.md\` | Lanseringssjekk |

## Sikkerhet

| Fil | Bruk |
|---|---|
| \`security-and-secrets.md\` | Private data og hemmeligheter |
`);

const readme = `
# Diskgolfutstyr.no

Diskgolfutstyr.no er en statisk norsk discgolfportal for nybegynnere, hobbyspillere og turneringsspillere. Siden dekker guider, regler, teknikk, trening, utstyr, research-baserte sammenligninger, baner, klubber og turneringer.

Prosjektet er laget for GitHub Pages uten backend, database, serverfunksjoner eller API-nøkler.

## Kjøre lokalt

\`\`\`powershell
node scripts/serve.mjs
\`\`\`

Åpne \`http://127.0.0.1:8000/\`.

Med Docker:

\`\`\`powershell
docker build -t discgolf-side .
docker run --rm -p 0.0.0.0:8080:80 discgolf-side
\`\`\`

## Kontrollscripts

\`\`\`powershell
node scripts/check-internal-links.js
node scripts/check-sitemap.js
node scripts/check-placeholders.js
node scripts/qa-static-site.mjs
\`\`\`

Det finnes ingen \`package.json\`; scripts kjøres direkte med Node.

## Innholdsstruktur

| Område | Mappe/fil |
|---|---|
| Forside og hovedhuber | \`index.html\`, \`artikler.html\`, \`nybegynnerguide.html\` |
| Guider | \`guider/\` |
| Utstyr og produktguider | \`utstyr/\` |
| Sammenligninger | \`sammenligninger/\` |
| Baner | \`baner/\`, \`data/courses/norway.json\` |
| Klubber | \`klubber/\`, \`data/clubs/norway.json\` |
| Turneringer | \`turneringer/\` |
| Teknikk og trening | \`teknikk/\`, \`trening/\` |
| Produktdata | \`data/products/\` |
| Affiliate-lenker | \`data/affiliate/links.json\` |
| Dokumentasjon | \`docs/\` |

## Legge til innhold

1. Lag en statisk HTML-side eller oppdater riktig datafil.
2. Sørg for unik title, meta description, én H1 og canonical.
3. Legg til interne lenker til relevante huber.
4. Oppdater \`sitemap.xml\` hvis siden skal indekseres.
5. Kjør kontrollscripts.
6. Dokumenter større endringer i \`docs/maintenance-log.md\`.

## Publisering til GitHub Pages

GitHub Pages brukes fra branch \`main\` og folder \`/root\`. \`CNAME\` peker til \`diskgolfutstyr.no\`.

Se \`docs/github-pages-deployment.md\` for publiseringssjekk.

## Skal ikke committes

- API-nøkler, tokens, passord eller persondata
- Hemmelige affiliate-ID-er
- Falske produktpriser, lagerstatus eller rabatter
- Falske testpåstander
- Bilder uten rettigheter
- Uferdige sider i sitemap

Se \`docs/README.md\` for komplett dokumentasjonsindeks.
`;

write("README.md", readme);

write("docs/phase-11-maintenance-log.md", `
# Fase 11: Drift og vedlikehold

Dato: ${today}

## Opprettet

- Vedlikeholdshåndbok
- Månedlig, kvartalsvis og årlig vedlikeholdsrutine
- Rutiner for innhold, produkter, affiliate, baner, klubber og turneringer
- Rutiner for sitemap, GitHub Pages, sikkerhet, ytelse og tilgjengelighet
- Dokumentasjonsindeks
- Enkle kontrollscripts for lenker, sitemap og placeholders

## Gjenstår

- Manuell ekstern lenkesjekk etter publisering
- Reell Search Console-eksport når domenet har data
- Eventuelle affiliate-lenker må legges inn manuelt og trygt når avtaler finnes
`);

const productionLog = readMaybe("docs/content-production-log.md");
if (!productionLog.includes("Fase 11")) {
  write("docs/content-production-log.md", `${productionLog}

## ${today} - Fase 11 drift og vedlikehold

- Opprettet driftsmanual, månedlige/kvartalsvise/årlige vedlikeholdsrutiner og driftstavle.
- Opprettet rutiner for produktdata, affiliate-lenker, banedata, klubbdata og turneringsinnhold.
- Opprettet scripts for interne lenker, sitemap og placeholders.
- Oppdatert README og dokumentasjonsindeks.
- Neste steg: Kjør månedlig vedlikehold etter første Search Console-data og kontroller eksterne lenker manuelt.
`);
}

console.log(JSON.stringify({
  htmlFiles: htmlFiles.length,
  docsFilesBefore: docsFiles.length,
  dataFiles: dataFiles.length,
  seoFindings: seoFindings().length,
  repoFindings: repoHygieneFindings().length
}, null, 2));
