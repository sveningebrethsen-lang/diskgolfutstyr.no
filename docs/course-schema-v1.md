# Course Schema V1

Sist oppdatert: 2026-09-28

Course Schema V1 er datakontrakten for norske baneprofiler på Diskgolfutstyr. `data/courses/norway.json` er eneste autoritative publiseringskilde. `data/courses.json` er historisk research/backlog og skal ikke drive publiserte sider.

Det maskinlesbare schemaet ligger i `data/courses/course-schema-v1.schema.json`.

## Hovedstruktur

| Gruppe | Formål |
|---|---|
| `schema_version`, `id`, `slug`, `name`, `status` | Stabil identitet og kjent banestatus |
| `location` | Sted, kommune, fylke, koordinater og koordinatpresisjon |
| `summary`, `holes`, `course_type`, `terrain` | Egenformulert oversikt og baneegenskaper |
| `access` | Pris, sesong, åpning, booking og tilgangsnotater |
| `facilities` | Parkering, toalett, treningskurv og øvrige dokumenterte fasiliteter |
| `suitability` | Vanskelighetsgrad, nybegynner-/familievurdering og målgrupper |
| `links` | Offisiell side, klubb, kart og ekstern baneoversikt |
| `sources` | Standardiserte kilder med dato, lisens og automatiseringsstatus |
| `field_sources` | Kobling fra faktagrupper til source-id-er |
| `editorial` | Legacy-status, publiseringsstatus, kvalitetsstatus og kontrolltidspunkt |

## Publiseringsport

En ny post kan bare bli `publishable` når den har:

- stabil id og gyldig slug
- verifisert navn og status
- kommune, fylke og land
- gyldige koordinater og presisjonsnivå
- egenformulert sammendrag
- minst én kvalifisert primær- eller åpen kilde
- kildedato
- minst tre kildekoblede faktagrupper utover navn og plassering

Navn, plassering og status må være koblet til en kvalifisert kilde i `field_sources`. Kvalifiserte kildetyper er klubb, operatør, kommune, offentlig myndighet, tillatt åpen data, offisiell banekilde eller autorisert PDGA API.

UDisc og vanlige PDGA-katalogsider kan brukes som manuell sekundærkontroll og ekstern lenke, men teller ikke alene som kvalifisert publiseringskilde i V1.

## Legacy-policy

De 27 eksisterende postene er merket `editorial.legacy: true` og `published_legacy`. Mangler gir `WARNING`, ikke automatisk avpublisering. Før en legacy-post republiseres fra data eller får vesentlige faktiske endringer, bør den bringes gjennom V1-porten.

## Kildealder

| Status | Alder |
|---|---:|
| `fresh` | 0–90 dager |
| `aging` | 91–180 dager |
| `stale` | over 180 dager eller manglende gyldig dato |

Status beregnes konservativt fra eldste registrerte kildekontroll. Alder alene avpubliserer aldri en side.

## Kommandoer

```powershell
node scripts/test-course-data.mjs
node scripts/validate-course-data.mjs
node scripts/generate-course-research-queue.mjs
```

Migreringsscriptet `scripts/migrate-course-data-v1.mjs` er idempotent og skal normalt ikke kjøres igjen etter at alle poster har `schema_version: 1`.

## Redaksjonell kontroll

Validering er en teknisk minimumsport, ikke en automatisk publiseringsbeslutning. En redaktør skal fortsatt kontrollere kilder, formuleringer, lokal nytteverdi, internlenker og om siden tilfører nok unik verdi før HTML og sitemap oppdateres.
