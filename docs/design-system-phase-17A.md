# Designsystem og IA-plan for Diskgolfutstyr.no

Fase: 17A
Oppdatert: 2026-06-18

Dette dokumentet er en plan for videre design, navigasjon og informasjonsarkitektur. Det beskriver hva som bør bygges i senere faser, men gjør ingen endringer i HTML, CSS, JavaScript, URL-er eller sitemap.

## 1. Brand-retning

Diskgolfutstyr.no skal føles som en norsk kunnskapsportal for discgolf, ikke som en nettbutikk. Domenenavnet peker naturlig mot utstyr, men merkevaren bør eie hele brukerreisen: starte med sporten, forstå disker, finne bane, lære regler og utvikle teknikk.

Anbefalt undertittel:

`Norges guide til diskgolf`

Tone:

- profesjonell
- norsk
- praktisk
- trygg
- moderne
- utendørs
- redaksjonell og ærlig

Merkevaren skal ikke virke som en aggressiv affiliate-side. Produktinnhold skal være tydelig merket som fysisk test, research-basert anbefaling eller fremtidig testidé.

## 2. Fargepalett

Eksisterende side bruker marine, grønn, hvit og lys grå. Fase 17 bør gradvis flytte uttrykket mot en mer nordisk, jordnær og premium utendørsprofil.

Foreslått palett:

| Rolle | Farge | Bruk |
|---|---|---|
| Primær | `#1A3D2B` Deep forest green | Header, hovedknapper, sterke seksjonsflater, footer |
| Sekundær | `#2D6A4F` Pine green | Hover, sekundære knapper, aktive nav-elementer, badges |
| Aksent | `#C9922A` Warm gold | Viktige CTA-er, små markører, utvalgte merkelapper |
| Bakgrunn | `#F4F1EB` Off-white | Sidebakgrunn, rolige seksjoner, artikkelbakgrunn |
| Tekst | `#1C1C1C` Charcoal | Hovedtekst, overskrifter på lys bakgrunn |
| Muted tekst | `#4B5563` | Forklaringer, metadata, hjelpetekst |
| Flater | `#FFFFFF` | Kort, tabeller, faktabokser |
| Linjer | `rgba(28, 28, 28, 0.12)` | Borders, separators |

Kontrastkrav:

- Brødtekst skal ha minst WCAG AA-kontrast.
- Primærknapper med `#1A3D2B` skal ha hvit tekst.
- Warm gold bør ikke brukes som liten tekst på hvit bakgrunn uten kontrastsjekk.
- Linker må kunne skilles fra tekst med både farge og understrek/tydelig hover.

Border og shadow:

- Kort bør ha 1px border og lav shadow.
- Bruk shadow sparsomt for dybde, ikke som dekor.
- Radius bør ligge på 8-12px for kort, 6-8px for knapper og tags.
- Unngå tunge gradienter og dekorative bakgrunnseffekter på mobil.

## 3. Typografi

Ikke legg inn ny font-avhengighet i 17A. Bruk websafe/systemfont først:

`system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

Typografisystem:

| Element | Desktop | Mobil | Prinsipp |
|---|---:|---:|---|
| H1 | 44-56px | 32-38px | Kort, direkte, maks 2 linjer hvis mulig |
| H2 | 30-38px | 24-30px | Seksjonsoverskrifter, tydelig hierarki |
| H3 | 20-24px | 18-21px | Korttitler og underseksjoner |
| Brødtekst | 17-18px | 16-17px | Lesbar, maks 70 tegn linjelengde i artikler |
| Ingress | 19-22px | 17-19px | Kort oppsummering, ikke lang intro |
| Knapper | 15-16px | 16px | Minst 44px høyde på mobil |
| Merkelapper | 12-13px | 12px | Store bokstaver kun sparsomt |
| Tabeller/fakta | 14-16px | 14-15px | På mobil bør tabeller bli kort eller horisontal scroll med tydelig ramme |

Tekstlinjer:

- Artikler: maks 720-760px.
- Hub-sider: kortere avsnitt og flere kort.
- Mobil: korte blokker før første handling.

## 4. Logo- og headerkrav

Ikke lag eller bytt logo i denne fasen. Planen bør likevel reservere riktige logoformater:

| Logoformat | Bruk |
|---|---|
| Hovedlogo | Desktop header og footer |
| Horisontal logo | Header på desktop/tablet |
| Ikon | Mobil header, app-lignende snarvei, små komponenter |
| Favicon | Nettleserfane og deling |
| Monokrom variant | Mørk/lys bakgrunn, print og enkel bruk |

Headerkrav:

- Header skal være kompakt og sticky.
- Mobilheader skal prioritere logo/ikon, menyknapp og eventuelt én primærhandling.
- Logo må ikke presse menyen slik at nav blir trang.
- Header bør tåle senere søkefelt uten redesign.

## 5. Navigasjon

Foreslått hovednavigasjon:

1. Start her
2. Utstyr
3. Teknikk
4. Regler
5. Baner
6. Tester
7. Artikler

Vurdering av "Nybegynner":

`Nybegynner` bør fortsatt være en primærsti, men kan presenteres som `Start her` i nav. Dette er mer handlingsorientert og bedre for nye brukere. URL-en kan fortsatt være `nybegynnerguide.html`; ikke endre URL.

Desktop:

- Horisontal nav.
- Maks 7 primærpunkter.
- Aktiv side markeres tydelig.
- "Start her" bør være første nav-lenke.
- Sekundære lenker som Klubber, Turneringer og Om kan ligge i footer eller Artikler/ressursområde.

Tablet:

- Horisontal nav hvis plass.
- Hvis nav bryter, bruk menyknapp tidligere.
- Kortene bør ligge i 2 kolonner.

Mobil:

- Enkel meny med store trykkflater.
- Trykkflate minst 44px høy.
- Meny skal være lett å lukke.
- Første skjerm bør ha snarveier før lang intro.
- Hurtigvalg bør være:
  - Start her
  - Velg disk
  - Regler
  - Teknikk
  - Finn bane
  - Utstyr
  - Tester

Søk/guideinngang:

- Uten backend kan første versjon være en "Hva trenger du?"-seksjon med statiske valg.
- Senere kan et lett klientbasert søk/filter bygges med eksisterende data/HTML, uten tung avhengighet.

## 6. Forside-wireframe

### Desktop

1. Sticky header
   - logo
   - hovednavigasjon
   - diskret CTA: Start her

2. Kompakt hero
   - H1: Norges guide til diskgolf
   - Kort ingress: utstyr, regler, teknikk og baner forklart praktisk
   - Primærknapp: Start her
   - Sekundærknapp: Velg riktig disk
   - Lett premium natur-/banevisuelt, ikke dominerende

3. Quick start
   - fire til seks kort:
     - Ny i diskgolf
     - Velg disk
     - Regler
     - Finn bane
     - Lær teknikk
     - Se tester

4. Nybegynnerkort
   - Første runde
   - Driver vs midrange vs putter
   - Vanlige feil

5. Utstyrskort
   - Beste disker for nybegynnere
   - Startsett
   - Puttere/midrange/fairway

6. Teknikkkort
   - Backhand
   - Forehand
   - Putting
   - Kastelengde

7. Banekort
   - Discgolfbaner i Norge
   - Nybegynnervennlige baner
   - Oslo/Bergen/Trondheim

8. Reglerkort
   - Praktiske regler
   - Etikette
   - PDGA-lenke

9. Tester/research-kort
   - Forklar testmerking
   - Vis research-basert status
   - Lenke til testmetodikk

10. Tillit/redaksjonell seksjon
    - Hva er testet?
    - Hva er research?
    - Hvordan brukes kilder?
    - Affiliate-disclaimer

### Mobil

1. Kompakt header
   - ikon/logo
   - menyknapp

2. Superkompakt hero
   - kort H1
   - maks 1-2 linjer ingress
   - primærknapp

3. "Hva trenger du nå?"-panel
   - store kort/knapper:
     - Start her
     - Velg disk
     - Regler
     - Teknikk
     - Finn bane
     - Utstyr
     - Tester

4. Start her
   - 3 steg for nybegynnere

5. Velg disk
   - raske innganger til putter/midrange/fairway

6. Regler
   - OB, mando, rekkefølge, sikkerhet

7. Teknikk
   - backhand, forehand, putting

8. Finn bane
   - nybegynnervennlige, Oslo, Bergen, Trondheim

9. Utstyr
   - startsett, disker, bagger

10. Tester
    - test vs research forklart

### Nettbrett

Hybrid:

- Header kan være desktop-aktig hvis plass.
- Hero bør være kompakt.
- Quick start i 2-3 kolonner.
- Hubkort i 2 kolonner.
- Artikkelinnhold kan ha smalere innholdsbredde og eventuell sticky innholdsfortegnelse.

## 7. Komponentsystem

| Komponent | Formål | Brukes når | Mobil | Desktop |
|---|---|---|---|---|
| Guidekort | Lede til guider og støtteartikler | Hub-sider, forside, artikkelrelaterte lenker | Full bredde eller 1 kolonne | 2-3 kolonner |
| Produktkort | Vise produkt/produkttype med teststatus | Utstyrsguider og produktlister | Kort info først, detaljer under | Fakta, fordeler/ulemper, CTA |
| Banekort | Vise bane, sted, vanskelighet og kilde | Baner, bysider, regionhuber | Skjul tomme felt, tydelig CTA | Flere faktafelt og tags |
| Regelkort | Forklare praktiske regler raskt | Regler, nybegynner, mobiloppslag | Korte svar, store trykkflater | Kan ha mer forklaring |
| CTA-knapper | Neste handling | Hero, seksjoner, artikler | Minst 44px høyde, fullbredde ved behov | Inline eller grupper |
| Quick-action cards | Rask veiviser på mobil | Forside og huber | Prioritert, høyt oppe på siden | 4-6 kort i grid |
| Faktabokser | Oppsummere regler, diskvalg, baneinfo | Artikler og guider | Kort, tydelig bakgrunn | Kan ligge ved siden av tekst |
| Research/test-merker | Bygge tillit | Produkt, tester, sammenligninger | Alltid synlig før anbefaling | Synlig i korttoppen |
| Breadcrumbs | Orientering og internlenking | Dype artikler, baner, produkter | Kan være kompakt | Vis full sti |
| Artikkelheader | Tittel, ingress, meta, status | Alle artikler | Kort intro før innhold | Mer rom, eventuell TOC |
| Hub-grid | Organisere klynger | Forside, guider, utstyr, baner | 1 kolonne først | 2-4 kolonner |

Komponentprinsipper:

- Ikke legg kort inne i kort.
- Ikke vis tomme faktafelt.
- Ikke overdriv badges.
- Alle kort bør ha tydelig tittel, kort forklaring og én primær lenke.
- Komponentene må fungere uten at JavaScript er kritisk for å lese hovedinnholdet.

## 8. Bildestrategi

Det kan senere brukes genererte premium Nordic disc golf-bilder, men bildebruk må ikke gjøre mobilopplevelsen treg.

Krav:

- Ingen tekst i bilder.
- Primært 16:9-format.
- Mobilvennlig crop.
- Norske skoger, parkbaner, vått gress, sti, kurv og realistisk discgolfutstyr.
- Konsekvent lyssetting og stil.
- Ikke stock-aktig, mørkt, uskarpt eller overdramatisert.
- Ikke bruk bilder fra UDisc, Google, klubber eller butikker uten tillatelse.

Bildebruk:

| Bildetype | Bruk |
|---|---|
| Hero-bilder | Kun på forside og utvalgte huber, komprimert og beskåret |
| Hub-bilder | Små, konsekvente bildepaneler eller CSS/SVG hvis bilde mangler |
| Artikkelbilder | Bruk der de forklarer noe, ikke som fyll |
| Utstyrsbilder | Egenprodusert eller tillatt bilde; ellers bruk nøytrale kort |
| Teknikkbilder | Bør vise grep, fotstilling eller kastfase hvis laget senere |
| Banebilder | Kun egne bilder eller tillatelse fra klubb/fotograf |

Mobil:

- Ikke bruk store hero-bilder på alle sider.
- Prioriter rask lesing og hurtigvalg.
- Lazy-load bilder når de legges inn.

## 9. SEO/UX-prinsipper

- Én tydelig H1 per side.
- Kort intro før første nyttige handling.
- Canonical skal ikke røres.
- URL-er skal ikke endres.
- Sitemap skal bare endres når publiserte URL-er faktisk endres/legges til.
- Huber skal lenke til støtteartikler.
- Støtteartikler skal lenke tilbake til hub.
- Produktinnhold skal lenke til forklarende guider.
- Banesider skal lenke til nybegynner, regler og utstyr.
- Tester skal alltid forklare teststatus.
- Tydelige CTA-er, men ikke kjøpspress.
- Mobil skal ha nytte før lange forklaringer.

## 10. Implementeringsplan

### 17B: Ny header og navigasjon

Mål:

- Implementere ny hovednavigasjon:
  - Start her
  - Utstyr
  - Teknikk
  - Regler
  - Baner
  - Tester
  - Artikler
- Beholde eksisterende URL-er.
- Gjøre mobilmeny mer robust og lettere å skanne.
- Ikke bytte logo.
- Ikke gjøre full redesign.

Kontroll:

- Alle hovedsider har fungerende nav.
- Mobilmeny åpner/lukker.
- Ingen horisontal scrolling.
- QA-script kjøres.

### 17C: Ny forside

Mål:

- Kompakt hero.
- Bedre "Hva trenger du nå?"-panel.
- Tydelig nybegynnersti.
- Kort til utstyr, regler, teknikk, baner og tester.
- Tillitsseksjon om test/research/affiliate.

### 17D: Hub-komponenter

Mål:

- Standardisere guidekort, hub-grid, faktabokser og quick-actions.
- Bruke samme mønster på artikler, utstyr, baner og tester.
- Rydde duplisert layout uten stor refaktor.

### 17E: Bildeintegrasjon og logo

Mål:

- Lage eller velge ny logo først når IA og header er stabile.
- Legge inn premium Nordic disc golf-bilder kontrollert.
- Optimalisere bildeformater og mobil-crop.

### 17F: Nybegynnerklynge

Mål:

- Forbedre eksisterende nybegynnersider.
- Bygge tydelig vei fra første runde til diskvalg, regler og teknikk.
- Ikke massepublisere tynt innhold.

## 11. Risikoer

| Risiko | Konsekvens | Tiltak |
|---|---|---|
| For mye bildebruk | Treg mobilside og mindre rask nytte | Bruk bilder selektivt og komprimert |
| For bred portal vs domenenavn | Brukere kan tro det bare er nettbutikk/utstyr | Bruk undertittel: Norges guide til diskgolf |
| For mange navpunkter | Uoversiktlig header | Maks 7 primærpunkter, resten i footer/huber |
| For lite nybegynnersti | Nye brukere faller av | `Start her` først i nav og forside |
| URL-endringer | SEO-tap og brutte lenker | Behold eksisterende URL-er |
| Falsk affiliate/test-opplevelse | Svekket tillit | Alltid synlig test-/researchmerking |
| Overstandardisering | Siden kan føles generisk | Behold norsk, praktisk og utendørs tone |

## 12. Git og QA

Fase 17A skal kun opprette dette dokumentet.

Ikke gjort:

- Ingen CSS-endringer.
- Ingen HTML-endringer.
- Ingen JavaScript-endringer.
- Ingen sitemap-endringer.
- Ingen URL-endringer.
- Ingen commit.
- Ingen push.

QA:

Full QA er ikke nødvendig for en ren docs-plan, men `git status` skal kontrolleres før leveranse.

## Anbefalt 17B-prompt

```text
Fase 17B: Implementer ny header og navigasjon for Diskgolfutstyr.no basert på docs/design-system-phase-17A.md.

Viktig:
- Ikke endre URL-struktur.
- Ikke endre sitemap med mindre internlenker krever det.
- Ikke redesign hele siden.
- Ikke bytt logo.
- Ikke legg til backend/database/API.
- Ikke React/Lovable.
- Ikke tunge avhengigheter.

Oppgave:
1. Oppdater felles header/nav på hovedsidene til:
   Start her, Utstyr, Teknikk, Regler, Baner, Tester, Artikler.
2. Behold eksisterende URL-er.
3. Gjør mobilmenyen tydeligere med store trykkflater.
4. Sørg for at aktiv/hover-state er tydelig.
5. Kjør lokal QA:
   node scripts/check-internal-links.js
   node scripts/check-sitemap.js
   node scripts/qa-static-site.mjs
   node scripts/check-content-quality.js
   node scripts/check-placeholders.js
6. Ikke commit før resultatet er rapportert.
```
