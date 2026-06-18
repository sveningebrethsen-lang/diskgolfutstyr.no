# Norwegian course database

## Mål

Lage en statisk database over norske disc golf-baner som er nyttig for:

- Nybegynnere som vil finne riktig første bane.
- Reisende som vil spille toppbaner.
- Spillere som vil vite hva slags utstyr en bane krever.
- SEO på lokale søk.

## Datamodell

```json
{
  "id": "krokhol",
  "name": "Krokhol Disc Golf Course",
  "slug": "krokhol",
  "location": "Siggerud",
  "county": "Akershus",
  "holes": 18,
  "difficulty": "Svært vanskelig",
  "beginnerFriendly": false,
  "terrain": ["skog", "åpent", "kupert"],
  "teeType": "",
  "basketType": "",
  "payToPlay": true,
  "udiscUrl": "",
  "metrixUrl": "",
  "officialUrl": "",
  "imageUrls": [],
  "description": "",
  "recommendedDiscs": ["kontrollerbar fairway", "overstable approach"],
  "lastVerified": ""
}
```

## 25 baneprofiler å prioritere

| Pri | Bane | Hvorfor |
| --- | --- | --- |
| 1 | Krokhol Disc Golf Course | Verdenskjent, NM 2026, høy søkeinteresse. |
| 2 | Øverås Diskgolfpark | Proff-/NC-relevant og høyt rangert. |
| 3 | Valdres Discgolfpark | NC 2026 og reisemål. |
| 4 | Hestehagen Diskgolfbane | NFO/NC 2026 og sterk klubbprofil. |
| 5 | Glåmos Diskgolfbane | NC 2026 og toppbane. |
| 6 | Klemetsrud Diskgolfbane | NM 2026 sammen med Krokhol. |
| 7 | Furutangen Diskgolfpark | NC Junior/Master 2026. |
| 8 | Kodal Diskgolfbane | NC Open 2026. |
| 9 | Ålgård Diskgolfpark | NC Junior/Master 2026. |
| 10 | Sandnes Diskgolfbane | NC Junior/Master 2026. |
| 11 | Lersbrygga | NC Junior/Master 2026. |
| 12 | Jervskogen | NC Junior/Master 2026. |
| 13 | Karidalen FrisbeeGolfPark | Høyt på UDisc Norge 2026. |
| 14 | Lille Leland | Høyt på UDisc Norge 2026. |
| 15 | Ørland Discgolfpark | Høyt på UDisc Norge 2026. |
| 16 | Løvbergsmoen Diskgolfpark | Høyt på UDisc Norge 2026. |
| 17 | Kaupanger Frisbeepark | Høyt rangert og familie-/aktivitetspreg. |
| 18 | Vasset Diskgolfpark | Kjent fra større arrangement. |
| 19 | Kopervik Diskgolfbane | Lokal aktivitet og klubbmiljø. |
| 20 | Vagle Diskgolfbane | Rogaland-interesse. |
| 21 | Blikshavn Diskgolfbane | Karmøy Cup/lavterskel. |
| 22 | Trehjørningen Disc Golf Park | Metrix-aktivitet og Trøndelag. |
| 23 | Buråsheia Frisbeegolfbane | Ukesgolf-/lavterskelinteresse. |
| 24 | Solliskogen | Treningsanlegg og klubbcase. |
| 25 | Svartisen Diskgolfbane | Ny bane med sterk historiefortelling. |

## Prioritering

Først: baner med turneringsrelevans, høy UDisc-rangering eller tydelig nybegynnerverdi.

Ikke publiser "beste bane"-påstander uten kilde. Bruk "ifølge UDisc", "arrangørside oppgir", eller egne notater etter besøk.
