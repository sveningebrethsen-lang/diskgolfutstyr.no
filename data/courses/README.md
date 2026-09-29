# Norske banedata

`norway.json` er eneste autoritative publiseringskilde for norske baner. Filen følger Course Schema V1.1 i `course-schema-v1.1.schema.json`.

`../courses.json` er en historisk research- og backlogfil. Den skal ikke brukes til publisering, sidegenerering eller som dokumentasjon for faktapåstander.

Kjør følgende før banedata vurderes for publisering:

```powershell
node scripts/test-course-data.mjs
node scripts/validate-course-data.mjs
node scripts/generate-course-production-report.mjs
```

P1-køen i `p1-research-queue.json` er en arbeidsliste over manglende eller uavklarte felt. Den inneholder ikke nye banefakta.

`course-schema-v1.schema.json` beholdes som historisk migreringskontrakt. Nye endringer skal følge V1.1 og den eksplisitte review-porten.

Publiseringsporten krever bare kjerneprofil: stabil identitet, navn, kommune/fylke/land, kildebundne koordinater, hull eller layout, minst én kvalifisert kilde, kontrolldato, egenformulert summary, kontrollert difficulty-verdi og menneskelig review. Praktiske fasilitets- og tilgangsfelt er valgfrie.
