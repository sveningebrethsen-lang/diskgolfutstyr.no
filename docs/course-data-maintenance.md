# Vedlikehold av banedata

Sist oppdatert: 2026-09-28

`data/courses/norway.json` er eneste autoritative publiseringskilde for norske baner. Data skal være forsiktig, kildebasert og egenformulert.

`data/courses.json` er historisk research/backlog. Den skal ikke brukes til publisering, sidegenerering eller som kilde til faktapåstander.

Banedata følger Course Schema V1.1, dokumentert i `docs/course-schema-v1.1.md` og maskinlesbart i `data/courses/course-schema-v1.1.schema.json`. V1 beholdes kun for migreringshistorikk.

## Nye baner

1. Verifiser banenavn, sted og aktiv status fra åpne kilder.
2. Verifiser koordinater og angi `coordinate_precision`, `coordinate_source_id` og `coordinate_checked_at`.
3. Verifiser antall hull eller legg inn tydelig layoutinformasjon.
4. Legg kilden i `sources` og koble faktagruppen i `field_sources`.
5. Bruk `editorial.source_checked_at` når informasjonen faktisk er kontrollert.
6. Legg inn en redaksjonell difficulty-vurdering på kontrollert skala, eller bruk `Ukjent`.
7. En ny bane må passere `node scripts/validate-course-data.mjs` og eksplisitt redaksjonell review.
8. Skriv kort beskrivelse med egne ord.
9. Sett aldri `publishable` automatisk. Oppdater relevante lokale sider og sitemap bare etter redaksjonell godkjenning.

Fasiliteter, kollektivtransport, tilgjengelighet, hunderegler, sesong, åpningstid og booking er valgfrie. Behold dokumenterte verdier, men ikke gjør systematisk research på disse feltene for å passere publiseringsporten.

Ikke dikt opp antall hull, vanskelighetsgrad, fasiliteter, åpningstider, banestatus eller popularitet.

Standardtekst: "Banestatus kan endre seg. Sjekk alltid oppdatert informasjon fra klubb, arrangør eller banetjeneste før du drar."

## Kildealder

- `fresh`: 0–90 dager
- `aging`: 91–180 dager
- `stale`: mer enn 180 dager eller manglende gyldig dato

Alder gir varsel, men avpubliserer aldri en eksisterende side automatisk.
