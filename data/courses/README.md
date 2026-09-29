# Norske banedata

`norway.json` er eneste autoritative publiseringskilde for norske baner. Filen følger Course Schema V1 i `course-schema-v1.schema.json`.

`../courses.json` er en historisk research- og backlogfil. Den skal ikke brukes til publisering, sidegenerering eller som dokumentasjon for faktapåstander.

Kjør følgende før banedata vurderes for publisering:

```powershell
node scripts/test-course-data.mjs
node scripts/validate-course-data.mjs
```

P1-køen i `p1-research-queue.json` er en arbeidsliste over manglende eller uavklarte felt. Den inneholder ikke nye banefakta.
