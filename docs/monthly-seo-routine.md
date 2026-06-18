# Monthly SEO routine

## Fast arbeidsflyt

1. Eksporter Search Console-data.
2. Legg CSV-filer i `data/search-console/`.
3. Kjør:

```powershell
node scripts\analyze-search-console.js
```

4. Les `docs/generated-search-console-report.md`.
5. Finn CTR-muligheter.
6. Finn sider nær side 1.
7. Finn nye søkefraser.
8. Finn svake sider i `docs/site-audit.md`.
9. Oppdater 5-10 sider med bedre title/meta, intro, FAQ, kilder eller internlenker.
10. Legg til interne lenker fra huber.
11. Oppdater sitemap hvis nye sider lages.
12. Dokumenter endringer i `docs/content-refresh-log.md`.
13. Mål effekt neste måned.

## Månedlig prioritering

- Først tekniske feil og 404.
- Deretter høy impressions/lav CTR.
- Deretter posisjon 8-20.
- Deretter innholdshull.
- Til slutt nye artikler.

Ikke lag nye artikler før eksisterende sider er utnyttet.
