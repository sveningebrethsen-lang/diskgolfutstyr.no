# News system

## Hva skjer nå i miljøet

Per 2026-06-01 er nyttige nyhetsspor:

- 2026 DGPT-sesongen er aktiv, med 18 Elite Series-turneringer og 5 PDGA Pro Majors annonsert av DGPT.
- European Open 2026 spilles i Tallinn 18.-21. juni ifølge DGPT-planen.
- NAIF har publisert norsk terminliste for 2026 med NFO, NC, NM og NM i pargolf.
- NM i diskgolf 2026 er planlagt på Krokhol/Klemetsrud 23.-26. juli.
- PDGA approved discs-listen oppdateres løpende med nye molds og gir stoff til "nye disker"-notiser.
- Sponsorendringer, særlig norske profiler som Ida Emilie Nesse, er interessante for norsk publikum.
- UDisc 2026-lister viser fortsatt stor interesse for norske baner som Krokhol og Øverås.

## Nyhetstyper

| Type | Eksempel | Kilde | Oppdateringsfrekvens |
| --- | --- | --- | --- |
| Turneringsnyhet | NM, NC, DGPT, Majors | NAIF, DGPT, PDGA, Metrix | Ukentlig i sesong |
| Produktnyhet | Nye PDGA-godkjente disker | PDGA approved discs, produsenter | Ukentlig/månedlig |
| Sponsoravtale | Norsk spiller bytter sponsor | Ultiworld, spiller, produsent | Ved behov |
| Regel/rating | PDGA-regel eller ratingendring | PDGA | Ved behov |
| Baneutvikling | Ny bane eller oppgradering | Klubb, UDisc, lokalmedia | Månedlig |
| Resultat | Norske resultater og internasjonale finaler | PDGA Live, Metrix, DGPT | Ukentlig i sesong |

## Nyhetsstruktur

Datafil: `data/news.json`

Felter:
- id
- title
- slug
- date
- category
- summary
- sourceName
- sourceUrl
- norwegianAngle
- status: draft/published/archived
- updateNeeded: true/false
- relatedPlayerIds
- relatedCourseIds
- relatedTournamentIds
- relatedProductIds

## 25 nyhetstemaer

1. NM i diskgolf 2026: baner, datoer og hva nye spillere bør vite.
2. Norgescup Open 2026: kalender og baner.
3. Norgescup Junior/Master 2026: kalender og baner.
4. NFO 2026 på Hestehagen.
5. NM i pargolf 2026 på Sula.
6. DGPT 2026: slik følger du sesongen fra Norge.
7. European Open 2026 i Tallinn.
8. Presidents Cup 2026 og europeiske spillere.
9. Nye PDGA-godkjente disker denne måneden.
10. Nye plasttyper som er aktuelle i norsk klima.
11. Norske spillere på internasjonale turneringer.
12. Sponsorendringer blant norske spillere.
13. UDisc topplister: norske baner i verdenstoppen.
14. Nye norske baner åpner i 2026.
15. Lokale ukesgolfer og lavterskelturneringer.
16. Regelendringer fra PDGA.
17. Ratingoppdateringer: norske spillere med størst fremgang.
18. DGPT-resultater med norsk relevans.
19. Store produsentlanseringer: MVP, Innova, Discraft, Discmania.
20. Prisendringer eller tilgjengelighet i norske butikker.
21. Glow-sesongen starter: arrangementer og utstyr.
22. Vintergolf: baner som holder åpent.
23. Klubber som bygger treningsanlegg.
24. Norske medier/YouTube-kanaler å følge.
25. Sikkerhet og baneskikk ved økt banetrafikk.
