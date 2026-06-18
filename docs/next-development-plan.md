# Neste videreutviklingsplan for Diskgolfutstyr.no

Sist oppdatert: 2026-06-18

## Nåværende styrker

- Nettstedet er statisk, raskt og egnet for GitHub Pages.
- Hovedområdene dekker allerede nybegynner, guider, utstyr, tester, sammenligninger, baner, klubber, turneringer, teknikk og trening.
- Det finnes mye redaksjonell dokumentasjon i `docs/`, inkludert retningslinjer for kilder, affiliate, baner, produktinnhold, AI-bruk og publisering.
- Produkt- og testinnhold har en etablert modell for å skille mellom fysisk test, research-basert anbefaling og fremtidig testidé.
- Baner, klubber og produkter har egne datafiler som kan utvides uten backend.
- Felles CSS og JS er samlet i få filer, som gjør trygge designforbedringer mulig på tvers av nettstedet.
- Sitemap, robots, CNAME og QA-scripts finnes allerede.

## Svakheter

- Forsiden har mange innganger, men bør forklare tydeligere hvem siden er for og hvorfor den er troverdig.
- Noen eldre sider mangler oppdatert-dato, tydelig researchmerking eller har `href="#"`-plassholdere.
- Flere hub-sider og lokale sider trenger bedre neste-steg-seksjoner og flere relevante interne lenker.
- Det finnes mye generert struktur, men ikke alle sider er like modne redaksjonelt.
- Git-status ser ut til å være utrackede filer i repoet, så endringer bør håndteres forsiktig før staging/commit.
- Browser-screenshotverktøy har tidligere feilet i Windows-sandbox, så visuell QA må også gjøres manuelt i nettleser.

## Risikoer

- Store URL-endringer kan ødelegge sitemap, interne lenker og fremtidig SEO.
- Masseproduksjon av artikler kan svekke troverdigheten hvis innholdet ikke faktasjekkes.
- Affiliate-lenker uten tydelig merking kan svekke tillit.
- Uverifiserte banedata, turneringsdatoer eller produkttester kan gjøre siden mindre seriøs.
- Bruk av eksterne bilder uten tillatelse kan gi rettighetsproblemer.

## Beste vekstmuligheter

1. Styrke nybegynnerreisen: fra "hva er discgolf" til første runde, diskvalg, regler og banevalg.
2. Bygge lokal SEO rundt baner og byer, men bare med verifiserbare fakta.
3. Forbedre produktguidene med tydelig research-/testmerking, fordeler/ulemper og naturlige affiliate-plasseringer.
4. Lage mer praktisk teknikk- og treningsinnhold for viderekomne spillere.
5. Bruke Search Console-data etter lansering til å forbedre titler, internlenker og nye artikkelvalg.
6. Rydde gamle kvalitetsfunn før større publisering eller designarbeid.

## Anbefalt innholdsstruktur

Forsiden bør fungere som portal og sende brukeren til riktig klynge:

- Ny i discgolf
  - Hva er discgolf?
  - Hvordan begynne med discgolf
  - Slik spiller du første runde
  - Regler for nybegynnere
- Velg riktig utstyr
  - Hvilke disker trenger en nybegynner?
  - Beste discgolfdisker for nybegynnere
  - Flight numbers forklart
  - Startsett, putter, midrange og fairway-driver
- Finn baner
  - Discgolfbaner i Norge
  - Nybegynnervennlige baner
  - Oslo, Bergen, Trondheim og andre lokale sider
- Lær teknikk
  - Backhand
  - Forehand
  - Putting
  - Hyzer/anhyzer
  - Kast i vind
- Tren smartere
  - Puttingtrening
  - Backhand-drills
  - Forehand-drills
  - Treningsprogram
- Spill turnering
  - Første turnering
  - PDGA-rating
  - Klasser
  - Hva du bør ha med

## Anbefalt designretning

- Behold marine, grønn, hvit og lys grå som hoveduttrykk.
- Prioriter tydelige hub-kort, korte forklaringer og klare CTA-er.
- Bruk færre, sterkere seksjoner fremfor mange like kort uten hierarki.
- Gi redaksjonell troverdighet en synlig plass på forsiden.
- Gjør mobilvisning først: tydelige trykkflater, kortere tekster og god luft.
- Ikke innfør tungt rammeverk eller ny designavhengighet.

## Prioritert 30/60/90-dagers plan

### Første 30 dager

- Rydd kjente funn fra `docs/generated-content-quality-report.md`.
- Forbedre forsiden med tydeligere innganger, troverdighetsblokk og lesestier.
- Sjekk og forbedre `artikler.html`, `om.html`, `regler.html`, `tester.html` og `affiliate-info.html`.
- Gjør manuell mobil-QA av forside, nybegynnerguide, utstyr og baner.
- Klargjør Google Search Console og send inn sitemap etter lansering.

### 31-60 dager

- Forbedre hub-sider for utstyr, baner, teknikk og trening.
- Bygg 5-8 sterke internlenkede nybegynnerartikler videre mot nivå 2/3.
- Forbedre lokale banesider med neste steg, kilder og interne lenker.
- Prioriter produktguider med tydelig researchmerking og bedre kjøpshjelp.
- Start månedlig Search Console-rutine når data finnes.

### 61-90 dager

- Lag første reelle testplaner som kan gjennomføres fysisk.
- Utvid klubb- og turneringsseksjoner forsiktig med kilder og offisielle lenker.
- Forbedre teknikk-/treningsklyngen for viderekomne.
- Oppdater gamle artikler basert på Search Console-data.
- Lag en første sponsor-/affiliate-klargjøring uten å gjøre siden salgsdominert.

## AI-verktøy og agenter som kan brukes

- Codex kan brukes til repoanalyse, HTML/CSS-endringer, QA-scripts, internlenkingsforslag og dokumentasjon.
- AI kan brukes til briefs, struktur, sjekklister, meta descriptions og språkvask.
- AI skal ikke brukes til å finne på tester, kilder, erfaringer, banedata, turneringsdatoer eller Search Console-data.
- For større innholdspakker bør AI først lage brief og kvalitetssjekkliste, ikke ferdig artikkel.
- For visuell QA bør lokal nettleser eller manuell testing brukes i tillegg til scripts.

## Fase 14A-anbefaling

Denne runden bør være liten og trygg:

1. Forbedre forsiden som portal.
2. Legg inn tydelig redaksjonell/merking-seksjon.
3. Gi nybegynnere og viderekomne klare lesestier.
4. Gjør små CSS-forbedringer for nye blokker.
5. Kjør QA og dokumenter kjente legacy-funn uten å skjule dem.
