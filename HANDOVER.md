# Handover: Diskgolfutstyr.no

Sist oppdatert: 2026-06-18

## Kort status

Diskgolfutstyr.no er bygget som en statisk norsk discgolfportal for GitHub Pages. Prosjektet har ingen backend, database, API-nokler eller serverfunksjoner. Lokal forhåndsvisning kan kjøres med Docker/nginx, og siden er strukturert rundt guider, utstyr, baner, klubber, turneringer, trening, teknikk, tester og redaksjonell dokumentasjon.

Prosjektet er ikke en aktiv Lovable/React-app i repoet. Det finnes ingen `package.json`. Frontenden er ren statisk HTML/CSS/JS.

## Teknisk oppsett

- Hostingmål: GitHub Pages
- Domene: `diskgolfutstyr.no`
- Lokal server: Docker med nginx
- Docker image brukt sist: `discgolf-side`
- Lokal URL brukt sist: `http://127.0.0.1:8080/`
- Hoved-CSS: `assets/css/styles.css`
- Hoved-JS: `assets/js/site.js`
- Sitemap: `sitemap.xml`
- Robots: `robots.txt`
- CNAME: `CNAME`

Det finnes ca.:

- 155 HTML-filer
- 130 markdown-filer
- 16 JSON-filer
- Flere scripts for QA, sitemap, internlenker, innholdskvalitet og generering

## Hva som er bygget

### Innhold og struktur

Følgende hovedområder finnes eller er påbegynt:

- Forside
- Nybegynnerguide
- Guider
- Utstyr
- Tester
- Sammenligninger
- Baner
- Klubber
- Turneringer
- Teknikk
- Trening
- Kontakt
- Personvern
- Affiliate-info
- Redaksjonelle retningslinjer
- Om siden

Det er også laget mye dokumentasjon under `docs/`, blant annet:

- SEO-rutiner
- Innholdskvalitet
- Affiliate-retningslinjer
- Produktinnhold
- Banesider
- Search Console-plan
- Growth plan
- Editorial calendar
- Editorial production system
- Content pipeline
- Brief-maler
- Kildepolicy
- AI-policy
- Internlenkingsstandard
- Publishing packages
- Contributor guidelines
- Tone of voice

### Data og innholdsbank

Det finnes strukturerte data og innholdsbanker i:

- `data/`
- `data/products/`
- `data/courses/`
- `data/clubs/`
- `content-bank/`
- `research/`

Innholdet er laget med tydelig skille mellom:

- Faktisk test
- Research-basert anbefaling
- Ide til fremtidig test

Viktig prinsipp: Ikke publiser falske tester, falske erfaringer eller usikre fakta som sikre.

## Siste frontend/UI-status

Siste UI-runde forbedret felles frontend uten å endre produktlogikk.

Endrede filer:

- `assets/css/styles.css`
- `assets/js/site.js`

Forbedringer:

- Mer moderne og konsistent visuelt uttrykk
- Strammere fargebruk med marine/grønn/hvit/lys grå
- Bedre header og navigasjon
- Mer polert hero
- Tydeligere knapper
- Bedre kort, produktkort, banekort og faktabokser
- Mer lesbar artikkel-layout
- Bedre mobiltilpasning
- Bedre focus/reduced-motion-støtte
- Mobilmenyen får nå tydelig åpen/lukket status og kan lukkes med klikk utenfor eller Escape

## QA-status

Sist kjørte kontroller:

- `node scripts/check-internal-links.js` - OK
- `node scripts/check-sitemap.js` - OK
- `node scripts/qa-static-site.mjs` - OK
- `docker build -t discgolf-side .` - OK
- Lokal HTTP-sjekk mot forside, CSS og JS - OK

Kjent avvik:

- `node scripts/check-content-quality.js` feiler fortsatt med 14 eldre innholdskvalitetsfunn.
- Disse funnene handler hovedsakelig om manglende oppdatert-dato, research-/affiliate-merking og gamle `href="#"`-plassholdere.
- Rapport ligger i `docs/generated-content-quality-report.md`.

Browser-screenshotverktøyet krasjet i Windows-sandbox sist, så siste visuelle QA ble gjort med lokal HTTP-kontroll, ikke screenshot.

## Kjente risikoer

1. Hele repoet ser ut til å være utrackede filer i git.
   - `git diff` viser derfor ikke vanlige endringer før filer er lagt til i git.
   - Ikke stage eller commit uten eksplisitt beskjed.

2. Det finnes fortsatt mange gamle/legacy HTML-filer.
   - Noen kan ha svakere innholdskvalitet enn nyere sider.
   - Unngå store URL-endringer før sitemap og internlenker er vurdert.

3. Innholdskvalitetsscriptet har kjente funn.
   - Dette bør ryddes før lansering eller før større designarbeid.

4. Siden er statisk.
   - Ikke legg inn backend, database, API-nøkler, skjema som later som det sender, eller avhengigheter som gjør GitHub Pages vanskeligere.

5. Bilder og eksterne data.
   - Ikke bruk bilder fra UDisc, klubber, Google eller butikker uten tillatelse.
   - Ikke scrape UDisc, PDGA, NAIF eller Disc Golf Scene.

## Viktige scripts

Nyttige scripts:

- `node scripts/check-internal-links.js`
- `node scripts/check-sitemap.js`
- `node scripts/qa-static-site.mjs`
- `node scripts/check-content-quality.js`
- `node scripts/check-placeholders.js`
- `node scripts/generate-site-audit.mjs`
- `node scripts/analyze-search-console.js`

Docker:

```bash
docker build -t discgolf-side .
docker run -d --name discgolf-side-local -p 8080:80 discgolf-side
```

Hvis containeren allerede kjører:

```bash
docker rm -f discgolf-side-local
docker run -d --name discgolf-side-local -p 8080:80 discgolf-side
```

## Anbefalt neste steg

### 1. Rydd kjente innholdskvalitetsfunn

Prioriter funnene i `docs/generated-content-quality-report.md`.

Typiske tiltak:

- Legg inn oppdatert-dato der det mangler
- Legg inn research-merking der innholdet er research-basert
- Fjern eller erstatt `href="#"`
- Sjekk affiliate-disclaimer på kommersielle sider

### 2. Visuell QA på mobil

Åpne lokalt:

- `http://127.0.0.1:8080/`
- `http://127.0.0.1:8080/utstyr/`
- `http://127.0.0.1:8080/baner/`
- `http://127.0.0.1:8080/nybegynnerguide.html`
- `http://127.0.0.1:8080/turneringer/`

Sjekk:

- Header og mobilmeny
- Kort/grid
- Tabeller
- CTA-knapper
- Lesbarhet
- Horisontal scrolling
- Om lange norske ord brekker pent

### 3. Gjør forsiden mer innholdsrik hvis ønsket

Bruk eksisterende innhold til å vise mer faktiske innganger:

- Mest nyttige nybegynnerguider
- Populære utstyrsguider
- Baneinnganger for Oslo/Bergen/Trondheim
- Turnering og klubb som egne seksjoner
- Redaksjonell troverdighet tydeligere

### 4. Velg neste produksjonsfase

Mulige fase 14-retninger:

- Rydde innholdskvalitetsfunn før lansering
- Mer profesjonell forside og hub-design
- Flere reelle banesider med kilder
- Første publiserbare produktguider med tydelig researchmerking
- Search Console-klargjøring og lanseringssjekk
- GitHub Pages deploy- og domeneoppsett

## Hovedregel videre

Diskgolfutstyr skal være nyttig og troverdig før den er stor.

Ikke masseproduser artikler bare for volum. Prioriter sider som:

- Svarer på reelle norske søk
- Hjelper nybegynnere praktisk
- Har tydelig kildegrunnlag
- Har god internlenking
- Ikke later som de er fysiske tester
- Ikke føles som tynn affiliate
