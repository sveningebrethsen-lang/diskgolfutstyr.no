# Produksjonspipeline for banedata

Pipelinen er: `RESEARCH -> VALIDATE -> REVIEW -> PUBLISHABLE -> GENERATE`.

## RESEARCH

Research er komplett når kjerneprofilen har stabil identitet, kommune/fylke/land, kildebundne koordinater, hull eller layout, summary, difficulty og kontrolldato. Toalett, parkering, transport, tilgjengelighet, hunderegler, sesong, åpningstid og booking inngår ikke i publiseringsporten.

## VALIDATE

Validatoren kontrollerer schema, koordinater, source-ID-er, minst én kvalifisert kilde, kjernefakta, difficulty, layouts og objektive konflikter. Minimum tre verifiserte ekstragrupper er ikke lenger et krav.

## REVIEW

Teknisk klar post får `review_required`. Et menneske må kontrollere kjerneprofilen og den redaksjonelle difficulty-vurderingen, og sette reell reviewer og dato. Systemet fyller aldri disse feltene automatisk.

## PUBLISHABLE

`publication.state` kan bare settes til `publishable` etter godkjent review og bestått validering. Validatoren gir ERROR hvis denne rekkefølgen brytes.

## GENERATE

Generatoren tillater:

- ny side når posten er eksplisitt publishable
- eksisterende legacy-side når siden finnes fra før og posten er grandfathered

Fase 23D stopper før ny HTML-generering.

## Operatørkommandoer

```powershell
node scripts/migrate-course-data-v1.1.mjs
node scripts/test-course-data.mjs
node scripts/validate-course-data.mjs
node scripts/generate-course-production-report.mjs
```

Produksjonsrapporten viser TOTAL, LEGACY, RESEARCH COMPLETE, VALIDATION PASS, REVIEW REQUIRED, VERIFIED, PUBLISHABLE og WITHHELD, samt status per bane.
