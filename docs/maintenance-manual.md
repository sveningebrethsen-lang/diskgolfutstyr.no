# Vedlikeholdshåndbok for Diskgolfguiden.no

Sist oppdatert: 2026-06-03

Diskgolfguiden.no er en statisk norsk discgolfportal på GitHub Pages. Siden har innhold om nybegynnere, regler, teknikk, trening, utstyr, tester, sammenligninger, baner, klubber og turneringer. Målet med vedlikeholdet er å holde innholdet nyttig, korrekt og ærlig over tid.

## Repo-struktur

| Område | Bruk |
|---|---|
| `*.html` i rot | Hovedsider og eldre hub-sider |
| `guider/` | Nybegynner-, sesong- og praktiske guider |
| `utstyr/` | Kommersielle produktguider og utstyrshub |
| `sammenligninger/` | Research-baserte sammenligninger |
| `baner/` | Banehub, lokale sider og banesider |
| `klubber/` | Klubbhub og lokale klubbsider |
| `turneringer/` | Turneringsguider og terminlisteforklaring |
| `teknikk/` og `trening/` | Viderekommen teknikk og treningsinnhold |
| `data/products/` | Produktdata for disker, bagger, kurver og tilbehør |
| `data/courses/` | Baneinformasjon for Norge |
| `data/clubs/` | Klubbdata |
| `data/affiliate/` | Affiliate-lenker og placeholder-lenker |
| `docs/` | Rutiner, sjekklister, rapporter og redaksjonell dokumentasjon |
| `scripts/` | Enkle statiske kontrollscripts |

## Vanlig arbeidsflyt

1. Les relevant dokumentasjon i `docs/README.md`.
2. Gjør små, avgrensede endringer.
3. Oppdater innhold, data og interne lenker samtidig.
4. Oppdater `sitemap.xml` hvis nye publiserte sider er lagt til.
5. Kjør relevante scripts: `node scripts/check-internal-links.js`, `node scripts/check-sitemap.js`, `node scripts/qa-static-site.mjs`.
6. Sjekk mobilvisning lokalt med Docker eller `node scripts/serve.mjs`.
7. Dokumenter endringen i `docs/maintenance-log.md` eller `docs/content-production-log.md`.
8. Commit med tydelig melding og publiser via GitHub Pages.

## Nye artikler

Nye artikler skal ha unik title, meta description, én H1, tydelige interne lenker og et realistisk formål. Ikke publiser en side som bare er en tynn tekstvariant av en eksisterende side. Bruk egne ord og kilder der fakta brukes.

## Gamle artikler

Gamle artikler oppdateres når de er utydelige, utdaterte, mangler kilder, har svake interne lenker eller har Search Console-data som viser potensial. Ikke endre "Sist oppdatert" uten reell forbedring.

## Sitemap og publisering

`sitemap.xml` skal bare inneholde publiserte sider som bør indekseres. Legacy-sider, docs-sider og uferdige sider skal ikke inn i sitemap. `robots.txt` skal peke til korrekt sitemap.

## Sjekk lokalt

```powershell
node scripts/check-internal-links.js
node scripts/check-sitemap.js
node scripts/check-placeholders.js
node scripts/qa-static-site.mjs
node scripts/serve.mjs
```

## Skal aldri inn i repoet

- Ingen private API-nøkler
- Ingen hemmelige tokens
- Ingen passord
- Ingen persondata
- Ingen falske testpåstander
- Ingen bilder uten rettigheter
- Ingen falske priser, rabatter eller lagerstatus
- Ingen kommende turneringer uten verifisert dato
