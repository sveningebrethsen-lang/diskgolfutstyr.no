# Content production log

## 2026-06-03 - Fase 5

### Innholdsklynge

Klynge: **Nybegynner i discgolf**

Mål: bygge en første SEO- og brukerflytsterk innholdsklynge for nye spillere, med praktiske guider, tydelig internlenking og research-basert merking på produktnære sider.

### Artikler laget eller forbedret

Følgende 20 guider ble publisert eller forbedret under `guider/`:

1. `hva-er-discgolf.html`
2. `hvordan-begynne-med-discgolf.html`
3. `discgolf-regler-for-nybegynnere.html`
4. `hvilken-discgolfdisk-skal-jeg-velge.html`
5. `putter-midrange-og-driver-forklart.html`
6. `flight-numbers.html`
7. `beste-disker-for-nybegynnere.html`
8. `discgolf-startsett.html`
9. `vanlige-feil-for-nybegynnere.html`
10. `backhand-for-nybegynnere.html`
11. `forehand-for-nybegynnere.html`
12. `putting-for-nybegynnere.html`
13. `discgolf-ord-og-uttrykk.html`
14. `hva-trenger-du-av-discgolfutstyr.html`
15. `slik-spiller-du-forste-runde.html`
16. `hvordan-velge-riktig-putter.html`
17. `hvordan-velge-riktig-midrange.html`
18. `hvordan-velge-riktig-driver.html`
19. `discgolf-etikette.html`
20. `ofte-stilte-sporsmal-om-discgolf.html`

### Hubs og oversikter

Oppdatert:

- `nybegynnerguide.html` som SEO-vennlig hub for hele klyngen.
- `artikler.html` som oversikt over publiserte guider.
- `index.html` med tydeligere lenker inn i nybegynnerklyngen.
- `sitemap.xml` med alle publiserte klyngesider.

### Internlenking

Klyngen er koblet slik:

- `Hva er discgolf?` lenker til hvordan begynne, regler, diskvalg og første runde.
- Diskvalg lenker til disktyper, flight numbers, anbefalte disker og startsett.
- Flight numbers lenker til disktyper, putter, midrange og driver.
- Produktnære sider lenker til startsett, diskvalg og utstyrshub.
- Teknikkartikler lenker mellom backhand, forehand, putting og vanlige feil.
- Regler og etikette lenker til første runde og regelhubb.

### Merking og kilder

Produktnære sider er merket som research-basert når de omtaler konkrete produktvalg eller produktkategorier. Ingen sider påstår fysisk test.

Brukte kildepeker:

- PDGA beginner guide
- PDGA Official Rules
- UDisc
- UDisc Norway courses
- NAIF Amerikanske Idretter
- Latitude 64 beginner guide
- Innova starter set
- Innova disc comparison

### Mangler og usikkerheter

- Produktkort har placeholder-CTA med `#`; ekte affiliate-lenker må legges inn senere med `rel="sponsored nofollow"`.
- Ingen produkter er fysisk testet ennå.
- FAQPage structured data brukes på sider med faktiske FAQ-seksjoner.
- Noen råd er generelle og bør revideres med egne testnotater når Diskgolfutstyr begynner å samle erfaringer.

### Neste fase

Prioriter i fase 6:

1. Research-basert side for `baseplast vs premiumplast`.
2. Research-basert side for `lett disk vs tung disk`.
3. Første fysiske testmal for puttere eller 3-disk starterbag.
4. Første 5 norske baneprofiler med kilde og sist verifisert dato.
5. Search Console-verifisering etter publisering for å se hvilke guider som får visninger.

## 2026-06-03 - Fase 6

### Innholdsklynge

Klynge: **Produkt og utstyr**

Mål: bygge en research-basert produktklynge som hjelper norske spillere å velge disker, startsett, bag, kurv og basisutstyr uten falske tester eller aggressiv affiliate.

### Produktsider laget

Følgende 14 sider ble laget under `utstyr/`:

1. `beste-discgolfdisker-for-nybegynnere.html`
2. `discgolf-startsett.html`
3. `beste-putter-for-nybegynnere.html`
4. `beste-midrange-for-nybegynnere.html`
5. `beste-fairway-driver-for-nybegynnere.html`
6. `beste-distance-driver-for-viderekomne.html`
7. `understable-stable-overstable-disker.html`
8. `beste-discgolfbag-for-nybegynnere.html`
9. `beste-discgolfkurv-til-hagen.html`
10. `discgolf-utstyrsliste.html`
11. `hva-koster-det-a-begynne-med-discgolf.html`
12. `billig-discgolfutstyr.html`
13. `gave-til-discgolfspiller.html`
14. `hvordan-velge-riktig-vekt-pa-discgolfdisk.html`

### Sider forbedret

- `utstyrsguide.html` ble bygget om til en ren utstyrshub.
- `index.html` fikk lenker til de viktigste utstyrssidene.
- `sitemap.xml` ble oppdatert med produktklyngen.

### Produktdata

Opprettet statiske produktdata:

- `data/products/discs.json`
- `data/products/bags.json`
- `data/products/baskets.json`
- `data/products/accessories.json`

Produktdata har `affiliate_url: "#"` og ingen priser, ratings eller falske anmeldelser.

### Internlenking

Produktklyngen lenker til:

- nybegynnerhub
- flight numbers
- driver/midrange/putter-forklaring
- hvordan velge disk
- putting for nybegynnere
- affiliate-info

### Merking

Alle produktsidene er merket med:

> Dette er en research-basert sammenligning basert på produsentdata, offentlige spesifikasjoner og spillererfaringer. Produktene er ikke fysisk testet av Diskgolfutstyr.

Ingen sider bruker fysisk test-merking.

### Neste fase

Prioriter i fase 7:

1. Research-basert sammenligning: `baseplast vs premiumplast`.
2. Research-basert sammenligning: `lett disk vs tung disk`.
3. Første fysiske testmal for 3-disk starterbag.
4. Første fysiske testmal for puttere på korte putter.
5. Første norske baneprofiler med kilde og sist verifisert dato.

## 2026-06-03 - Fase 7

### Innholdsklynge

Klynge: **Norske discgolfbaner og lokal SEO**

Mål: bygge en første troverdig, statisk baneseksjon for norske discgolfbaner med bysider, temasider, baneprofiler, kilder og internlenking til nybegynner- og utstyrsguider.

### Sider laget

Ny baneseksjon under `baner/`:

- `baner/index.html`
- `baner/oslo/index.html`
- `baner/bergen/index.html`
- `baner/trondheim/index.html`
- `baner/stavanger/index.html`
- `baner/kristiansand/index.html`
- `baner/tromso/index.html`
- `baner/drammen/index.html`
- `baner/fredrikstad/index.html`
- `baner/skien/index.html`
- `baner/sandnes/index.html`
- `baner/alesund/index.html`
- `baner/bodo/index.html`
- `baner/nybegynnervennlige/index.html`
- `baner/18-hull/index.html`
- `baner/familievennlige/index.html`

 I tillegg ble det laget 27 individuelle baneprofiler under `baner/{bane-slug}/`.

### Datafiler

Opprettet:

- `data/courses/norway.json`

Filen inneholder 27 baner i første datapakke. Usikre felt er satt til `null`, tom streng eller "Ukjent" der det ikke finnes nok kildegrunnlag.

### Sider forbedret

- `index.html` fikk egen baneseksjon med lenker til baner, nybegynnervennlige baner, Oslo, Bergen og Trondheim.
- `baneguide.html` ble gjort om til en bro/alias til den nye baneseksjonen.
- `sitemap.xml` ble oppdatert med nye banesider.
- `assets/js/site.js` fikk progressiv klientfiltrering for banekort.
- `assets/css/styles.css` fikk enkel mobilvennlig styling for banefiltre og banekort.

### Internlenking

Alle nye lokale sider lenker til:

- `baner/`
- `guider/hvordan-begynne-med-discgolf.html`
- `guider/slik-spiller-du-forste-runde.html`
- `guider/discgolf-regler-for-nybegynnere.html`
- `guider/discgolf-etikette.html`
- `guider/hva-trenger-du-av-discgolfutstyr.html`
- `utstyr/beste-discgolfdisker-for-nybegynnere.html`

Eksisterende navigasjonslenker til `baneguide.html` ble byttet til `baner/`.

### Kilder brukt

- UDisc Norge, bysider og åpne banesider.
- PDGA Course Directory for Krokhol.
- Lokale klubb-/banepeker der de var oppgitt i åpne kilder.

### Mangler og usikkerheter

- Ingen bilder er lagt inn, fordi det ikke finnes egne rettighetsklarerte banebilder ennå.
- Flere baner bør verifiseres mot klubb/kommune før mer detaljerte fasiliteter, åpningstider eller lokale regler publiseres.
- Noen bysider er bevisst korte fordi første datapakke bare inkluderer baner med nok kildegrunnlag.

### Neste fase

Prioriter i fase 8:

1. Verifiser flere klubbkilder for Oslo, Bergen, Trondheim, Stavanger/Sandnes og Grenland.
2. Legg til egne baneprofiler for flere 18-hullsbaner med sikre kilder.
3. Lag en redaksjonell testmal for "første runde på ny bane".
4. Samle egne bilder med tillatelse og alt-tekst.
5. Utvid banedata med region/fylkes-huber når flere baner er kvalitetssikret.

## 2026-06-03 - Fase 8

### Innholdsklynge

Klynge: **Autoritet, klubber, turneringer, trening og redaksjonell troverdighet**

Mål: gjøre Diskgolfutstyr mer komplett som norsk portal, uten backend, falske samarbeid, falske turneringer eller kopiert innhold.

### Autoritetssider laget

- `redaksjonelle-retningslinjer/`
- `kontakt/`
- `personvern/`

### Klubbsider og klubbdata

Opprettet:

- `data/clubs/norway.json`
- `klubber/`
- `klubber/oslo/`
- `klubber/bergen/`
- `klubber/trondheim/`
- `klubber/stavanger/`

Første datapakke har 7 klubber med kilder og `last_checked`. Bergen og Stavanger/Sandnes er bevisst forsiktige der klubbdata ikke er godt nok verifisert.

### Turneringssider laget

- `turneringer/`
- `turneringer/hvordan-bli-med/`
- `turneringer/forste-turnering/`
- `turneringer/pdga-rating/`
- `turneringer/klasser/`
- `turneringer/terminliste/`

Turneringsseksjonen publiserer ikke falsk kalender. Den peker til offisielle kilder som PDGA, Disc Golf Scene, Disc Golf Metrix og NAIF.

### Sesongartikler laget

- `guider/discgolf-om-varen/`
- `guider/discgolf-om-sommeren/`
- `guider/discgolf-om-hosten/`
- `guider/discgolf-om-vinteren/`
- `guider/vinterdiscgolf/`
- `guider/discgolf-i-regn/`
- `guider/discgolf-i-vind/`
- `guider/hvordan-unnga-a-miste-disker/`

### Teknikk og trening

Opprettet:

- `teknikk/`
- `teknikk/hyzer-og-anhyzer/`
- `teknikk/nose-angle/`
- `teknikk/brace-i-backhand/`
- `teknikk/forehand-vanlige-feil/`
- `teknikk/putting-rutine/`
- `teknikk/kast-i-vind/`
- `trening/`
- `trening/discgolf-treningsprogram/`
- `trening/putting-trening/`
- `trening/backhand-drills/`
- `trening/forehand-drills/`

### Dokumentasjon laget

- `docs/search-console-plan.md`
- `docs/growth-plan.md`
- `docs/editorial-calendar.md`
- `docs/outreach-plan.md`
- `docs/site-map-content-status.md`

### Sider og teknikk forbedret

- `index.html` fikk innganger til klubber, turneringer og trening.
- Header på eksisterende HTML-sider ble harmonisert med nye hovedområder.
- `assets/js/site.js` fikk `aria-current`-støtte for klubber og turneringer.
- `sitemap.xml` ble oppdatert til fase 8.

### Mangler og usikkerheter

- Kontakt-e-post må aktiveres/verifiseres før lansering.
- Bergen og Stavanger/Sandnes trenger bedre verifiserte klubbkilder.
- Ingen turneringsdatoer publiseres som kommende i denne fasen.
- Ingen bilder er lagt inn uten rettigheter.

### Neste fase

Prioriter i fase 9:

1. Verifiser flere klubbkilder og legg inn flere klubber.
2. Utvid turneringsklyngen med egne erfaringer fra første turnering.
3. Bygg flere lokale bane-/klubbkoblinger.
4. Start første faktiske testnotater for utstyr.
5. Bruk Search Console-data til å justere title/meta og internlenking.

## 2026-06-03 - Fase 10

### Fokus

Klynge: **Konvertering, affiliate-klargjøring og kommersiell tillit**

Mål: gjøre kommersielle sider mer hjelpsomme fra informasjon til handling uten falske tester, priser, rabatter, anmeldelser eller aggressiv salgstekst.

### Sider forbedret

- `utstyr/beste-discgolfdisker-for-nybegynnere.html`
- `utstyr/discgolf-startsett.html`
- `utstyr/beste-putter-for-nybegynnere.html`
- `utstyr/beste-midrange-for-nybegynnere.html`
- `utstyr/beste-fairway-driver-for-nybegynnere.html`
- `utstyr/beste-discgolfbag-for-nybegynnere.html`
- `utstyr/beste-discgolfkurv-til-hagen.html`

### Nye sider

- `utstyr/index.html`
- 8 nye research-baserte sammenligningssider under `sammenligninger/`.

### Data

Opprettet:

- `data/affiliate/links.json`

Alle affiliate-lenker er placeholders (`#`) og inneholder ikke private sporingskoder.

### Komponenter og CTA

- Produktkort ble standardisert med fordeler, ulemper, passer-for, sist sjekket og CTA.
- CTA-er bruker rolige tekster som `Se produkt`.
- CTA-er har data-attributter for fremtidig måling.
- Ingen priser, rabatter eller lagerstatus ble lagt inn.

### Dokumentasjon

Opprettet:

- `docs/conversion-audit.md`
- `docs/affiliate-link-management.md`
- `docs/physical-test-methodology.md`
- `docs/affiliate-product-policy.md`
- `docs/conversion-tracking-plan.md`
- `docs/revenue-plan.md`
- `docs/affiliate-outreach-plan.md`
- `docs/affiliate-priority-map.md`
- `docs/commercial-internal-linking-map.md`
- `docs/phase-10-conversion-log.md`

### Neste fase

Prioriter i fase 11:

1. Oppgrader `gave-til-discgolfspiller.html`.
2. Oppgrader `billig-discgolfutstyr.html`.
3. Oppgrader `discgolf-utstyrsliste.html`.
4. Legg inn ekte affiliate-lenker først når avtaler finnes.
5. Start første faktiske fysiske test med metode.

## 2026-06-03 - Fase 11 drift og vedlikehold

- Opprettet driftsmanual, månedlige/kvartalsvise/årlige vedlikeholdsrutiner og driftstavle.
- Opprettet rutiner for produktdata, affiliate-lenker, banedata, klubbdata og turneringsinnhold.
- Opprettet scripts for interne lenker, sitemap og placeholders.
- Oppdatert README og dokumentasjonsindeks.
- Neste steg: Kjør månedlig vedlikehold etter første Search Console-data og kontroller eksterne lenker manuelt.


## 2026-06-03 - Fase 12 redaksjonell produksjonsmaskin

| Dato | Tittel | URL | Klynge | Status | Neste steg | Kommentar |
|---|---|---|---|---|---|---|
| 2026-06-03 | Redaksjonelt produksjonssystem | /docs/editorial-production-system.md | Drift/Innhold | Opprettet | Bruk ved nye artikler | System og rutiner, ikke publisert artikkel |
| 2026-06-03 | 25 artikkelbriefs | /docs/briefs/ | Innhold | Brief klar | Velg første artikkel fra pipeline | Ingen artikler masseprodusert |
| 2026-06-03 | Klyngekart og gap-analyse | /docs/topic-cluster-map.md | Innholdsstrategi | Opprettet | Bruk i 90-dagers plan | Basert på eksisterende content-bank og publiserte sider |


## 2026-06-03 - Fase 13 publiserbar innholdspakke

| Dato | Tittel | URL | Klynge | Status | Neste steg | Kommentar |
|---|---|---|---|---|---|---|
| 2026-06-03 | guider/hvor-langt-bor-en-nybegynner-kaste.html | /guider/hvor-langt-bor-en-nybegynner-kaste.html | Fase 13 | Publisert | Følg opp etter Search Console-data | Ny kontrollert innholdsside med kilder og internlenker |
| 2026-06-03 | guider/hvorfor-nybegynnere-bor-vente-med-distance-drivers.html | /guider/hvorfor-nybegynnere-bor-vente-med-distance-drivers.html | Fase 13 | Publisert | Følg opp etter Search Console-data | Ny kontrollert innholdsside med kilder og internlenker |
| 2026-06-03 | guider/hvorfor-gar-disken-alltid-til-venstre.html | /guider/hvorfor-gar-disken-alltid-til-venstre.html | Fase 13 | Publisert | Følg opp etter Search Console-data | Ny kontrollert innholdsside med kilder og internlenker |
| 2026-06-03 | utstyr/baseplast-vs-premiumplast.html | /utstyr/baseplast-vs-premiumplast.html | Fase 13 | Publisert | Følg opp etter Search Console-data | Ny kontrollert innholdsside med kilder og internlenker |
| 2026-06-03 | utstyr/lett-disk-vs-tung-disk.html | /utstyr/lett-disk-vs-tung-disk.html | Fase 13 | Publisert | Følg opp etter Search Console-data | Ny kontrollert innholdsside med kilder og internlenker |
| 2026-06-03 | utstyr/disc-retriever-verdt-det.html | /utstyr/disc-retriever-verdt-det.html | Fase 13 | Publisert | Følg opp etter Search Console-data | Ny kontrollert innholdsside med kilder og internlenker |
| 2026-06-03 | baner/discgolfbaner-naer-oslo/ | /baner/discgolfbaner-naer-oslo/ | Fase 13 | Publisert | Følg opp etter Search Console-data | Ny kontrollert innholdsside med kilder og internlenker |
| 2026-06-03 | baner/nybegynnervennlige-baner-i-oslo/ | /baner/nybegynnervennlige-baner-i-oslo/ | Fase 13 | Publisert | Følg opp etter Search Console-data | Ny kontrollert innholdsside med kilder og internlenker |
| 2026-06-03 | teknikk/approach-kast-forklart/ | /teknikk/approach-kast-forklart/ | Fase 13 | Publisert | Følg opp etter Search Console-data | Ny kontrollert innholdsside med kilder og internlenker |
| 2026-06-03 | trening/puttingovelser-hjemme/ | /trening/puttingovelser-hjemme/ | Fase 13 | Publisert | Følg opp etter Search Console-data | Ny kontrollert innholdsside med kilder og internlenker |
| 2026-06-03 | turneringer/hva-bor-du-ha-med-pa-turnering/ | /turneringer/hva-bor-du-ha-med-pa-turnering/ | Fase 13 | Publisert | Følg opp etter Search Console-data | Ny kontrollert innholdsside med kilder og internlenker |
| 2026-06-03 | guider/hvordan-unnga-a-miste-disker-i-hoyt-gress.html | /guider/hvordan-unnga-a-miste-disker-i-hoyt-gress.html | Fase 13 | Publisert | Følg opp etter Search Console-data | Ny kontrollert innholdsside med kilder og internlenker |
