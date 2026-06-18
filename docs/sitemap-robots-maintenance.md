# Vedlikehold av sitemap og robots

Sist oppdatert: 2026-06-03

`sitemap.xml` skal inneholde publiserte, indekserbare sider. `robots.txt` skal peke til `https://diskgolfguiden.no/sitemap.xml`.

## Skal være i sitemap

- Forside og viktige huber
- Publiserte guider
- Publiserte utstyrssider
- Publiserte baner, klubber, turneringer, teknikk og trening

## Skal ikke være i sitemap

- `docs/`
- Uferdige drafts
- Legacy/noindex-sider
- Testsider og midlertidige filer

Kjør `node scripts/check-sitemap.js` etter sitemap-endringer. Send inn sitemap i Google Search Console etter større publiseringer.
