# Sikkerhet og private data

Sist oppdatert: 2026-06-03

Dette er et statisk GitHub Pages-prosjekt. Alt som committes kan bli offentlig.

## Skal aldri committes

- Ingen private API-nøkler
- Ingen hemmelige tokens
- Ingen passord
- Ingen persondata
- Ingen falske testpåstander
- Ingen bilder uten rettigheter
- Ingen falske priser, rabatter eller lagerstatus
- Ingen kommende turneringer uten verifisert dato

## Hvis en nøkkel committes ved feil

1. Regn nøkkelen som kompromittert.
2. Roter/slett nøkkelen hos leverandøren.
3. Fjern den fra repoet.
4. Skriv en nøktern intern logg uten å gjengi hemmeligheten.
5. Vurder historikkrydding bare med tydelig prosess og kontroll.

## Før publisering

Søk etter `api_key`, `token`, `secret`, `password`, `client_secret` og uventede private filer.
