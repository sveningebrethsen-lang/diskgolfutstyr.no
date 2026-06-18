# Diskgolfguiden.no

Diskgolfguiden.no er en statisk norsk discgolfportal for nybegynnere, hobbyspillere og turneringsspillere. Siden dekker guider, regler, teknikk, trening, utstyr, research-baserte sammenligninger, baner, klubber og turneringer.

Prosjektet er laget for GitHub Pages uten backend, database, serverfunksjoner eller API-nøkler.

## Kjøre lokalt

```powershell
node scripts/serve.mjs
```

Åpne `http://127.0.0.1:8000/`.

Med Docker:

```powershell
docker build -t discgolf-side .
docker run --rm -p 0.0.0.0:8080:80 discgolf-side
```

## Kontrollscripts

```powershell
node scripts/check-internal-links.js
node scripts/check-sitemap.js
node scripts/check-placeholders.js
node scripts/qa-static-site.mjs
```

Det finnes ingen `package.json`; scripts kjøres direkte med Node.

## Innholdsstruktur

| Område | Mappe/fil |
|---|---|
| Forside og hovedhuber | `index.html`, `artikler.html`, `nybegynnerguide.html` |
| Guider | `guider/` |
| Utstyr og produktguider | `utstyr/` |
| Sammenligninger | `sammenligninger/` |
| Baner | `baner/`, `data/courses/norway.json` |
| Klubber | `klubber/`, `data/clubs/norway.json` |
| Turneringer | `turneringer/` |
| Teknikk og trening | `teknikk/`, `trening/` |
| Produktdata | `data/products/` |
| Affiliate-lenker | `data/affiliate/links.json` |
| Dokumentasjon | `docs/` |

## Legge til innhold

1. Lag en statisk HTML-side eller oppdater riktig datafil.
2. Sørg for unik title, meta description, én H1 og canonical.
3. Legg til interne lenker til relevante huber.
4. Oppdater `sitemap.xml` hvis siden skal indekseres.
5. Kjør kontrollscripts.
6. Dokumenter større endringer i `docs/maintenance-log.md`.

## Publisering til GitHub Pages

GitHub Pages brukes fra branch `main` og folder `/root`. `CNAME` peker til `diskgolfguiden.no`.

Se `docs/github-pages-deployment.md` for publiseringssjekk.

## Skal ikke committes

- API-nøkler, tokens, passord eller persondata
- Hemmelige affiliate-ID-er
- Falske produktpriser, lagerstatus eller rabatter
- Falske testpåstander
- Bilder uten rettigheter
- Uferdige sider i sitemap

Se `docs/README.md` for komplett dokumentasjonsindeks.
