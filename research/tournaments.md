# Tournaments

## Turneringskilder

- DGPT: Elite Series, Playoffs og Tour Championship.
- PDGA: Majors, event search, live scoring og ratings.
- NAIF: norsk terminliste, NC, NM, NFO.
- Disc Golf Metrix: mange norske/europeiske påmeldinger og resultater.
- HyzerList: norsk oversikt over PDGA-turneringer, lokale serier og ukesgolfer.

## Turneringsstruktur

Datafil: `data/tournaments.json`

Felter:
- id
- name
- slug
- startDate
- endDate
- country
- location
- courseIds
- tier
- series
- divisions
- registrationUrl
- resultsUrl
- sourceUrl
- status: upcoming/live/final
- norwegianRelevance

## Sider

- `/turneringer/` - kalender.
- `/turneringer/dgpt-2026/` - sesongoversikt.
- `/turneringer/norgescup-2026/` - norsk NC-hub.
- `/turneringer/nm-diskgolf-2026/` - NM-side.
- `/turneringer/europeiske-turneringer/` - europeisk oversikt.
- `/turneringer/ukesgolf/` - lavterskel og klubbspill.

## Kommende arrangementer som bør inn i første database

- NFO 2026: Hestehagen 29.-31. mai.
- NC Open 2026: Øverås, Hestehagen, Valdres, Glåmos, Kodal.
- NC Junior/Master 2026: Ålgård, Sandnes, Lersbrygga, Jervskogen, Furutangen.
- NM 2026: Krokhol/Klemetsrud 23.-26. juli.
- NM i pargolf 2026: Sula 28.-30. august.
- DGPT 2026: European Open Tallinn, Swedish Open, Ale Open, Heinola Open.

## Resultatsider

Første versjon:
- Manuell resultatoppsummering med lenke til offisiell resultatside.
- Ikke scrape live scoring.
- Oppdater "sist oppdatert".

Senere:
- Statisk import fra CSV eller manuell JSON.
- Spillere og baner kobles til resultater.
