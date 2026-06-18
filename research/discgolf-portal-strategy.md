# Diskgolfutstyr.no as a Norwegian disc golf portal

Mål: utvikle siden fra utstyrsguide til den mest nyttige norske ressursen for disc golf, uten backend i første versjon.

## Portalområder

1. Guider: nybegynner, teknikk, regler, rating, bag-bygging.
2. Produkttester: disker, sekker, sko, kurver, plast og tilbehør.
3. Utstyrsanbefalinger: researchbasert først, testbasert etter hvert.
4. Nyheter: turneringer, nye disker, sponsoravtaler, regelendringer, norske baner.
5. Ranking: forklaringer, lenker til PDGA/StatMando, norske ratingoversikter manuelt.
6. Turneringer: DGPT, Majors, Europa, Norge, ukesgolf og lokale serier.
7. Norske baner: database med manuelle profiler, UDisc/Metrix-lenker og egne notater.
8. Spillere: profiler med rating, sponsorer, resultater og bag når verifisert.
9. Statistikk: enkle statiske snapshots, ikke live-data i MVP.

## Redaksjonell modell

- "Guide": kan publiseres med research og tydelige kilder.
- "Research-basert anbefaling": produktkort uten testpåstand.
- "Faktisk test": krever metode, dato, forhold, testere og resultater.
- "Nyhet": må ha dato, kilde og oppdatert-status.
- "Profil": må ha kildelenker og sist verifisert dato.

## Teknisk prinsipp

GitHub Pages + statisk HTML/CSS/JS. All data ligger i JSON:

- `data/contentIdeas.json`
- `data/products.json`
- `data/courses.json`
- `data/players.json`
- `data/tournaments.json`
- `data/news.json`
- `data/rankings.json`

I første versjon oppdateres alt manuelt. Senere kan man generere statiske sider fra JSON med en build-prosess, men det trengs ikke for MVP.

## URL-struktur

- `/guider/`
- `/guider/hvilke-disker-trenger-nybegynner/`
- `/tester/`
- `/tester/beste-puttere-nybegynnere/`
- `/utstyr/puttere/`
- `/utstyr/midrange/`
- `/utstyr/fairway-drivere/`
- `/nyheter/`
- `/ranking/`
- `/turneringer/`
- `/turneringer/norgescup-2026/`
- `/baner/`
- `/baner/krokhol/`
- `/spillere/`
- `/spillere/ida-emilie-nesse/`

For dagens enkle HTML kan sidene fortsatt ligge flatt, men URL-planen bør styre fremtidig struktur.

## Navigasjon

Primær:
- Start
- Nybegynner
- Utstyr
- Tester
- Baner
- Turneringer
- Ranking
- Nyheter

Sekundær:
- Spillere
- Statistikk
- Om/metode

## Hvor portalen kan vinne

- Norsk språk og norsk klima.
- Tydelig merking av hva som er testet og hva som bare er research.
- Baner og turneringer samlet med utstyrsråd.
- Forklaringer av PDGA, Metrix, ranking og konkurranse for folk som ikke er inne i miljøet.
- Lokale sider som større internasjonale sider ikke prioriterer.
