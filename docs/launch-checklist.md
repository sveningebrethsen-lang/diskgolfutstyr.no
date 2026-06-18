# Launch-checklist

Bruk denne sjekklisten før Diskgolfguiden.no publiseres eller oppdateres.

## SEO

- Hver publiserte side har unik `title`.
- Hver publiserte side har relevant meta description.
- Hver publiserte side har én H1.
- Canonical peker til riktig URL på `https://diskgolfguiden.no/`.
- Sitemap inneholder bare publiserte sider.
- `robots.txt` peker til sitemap.
- Viktige sider har internlenker til neste naturlige steg.
- Kildeseksjoner finnes der regler, baner, produktdata eller endringsutsatt informasjon brukes.

## Mobil

- Forsiden kan brukes uten horisontal scrolling.
- Mobilmeny åpner og lukker korrekt.
- Klikkflater er store nok.
- Kort stables ryddig.
- Tabeller kan scrolles horisontalt ved behov.

## Innhold

- Norsk tekst er korrekt, uten ødelagte tegn.
- Ingen falske tester eller falske erfaringer.
- Research-basert innhold er merket tydelig.
- Oppdatert-dato finnes på artikler der det passer.
- Uferdige sider er ikke lagt i sitemap.

## Affiliate

- Annonselenker merkes tydelig.
- Affiliate-lenker bruker `rel="sponsored nofollow"`.
- Ingen utdaterbare priser hardkodes uten dato og forbehold.
- Produktkort viser fordeler og ulemper.

## GitHub Pages

- `CNAME` inneholder riktig domene.
- Siden fungerer fra repo-root.
- Ingen backend, serverfunksjoner eller database kreves.
- `sitemap.xml`, `robots.txt`, `assets/`, `data/` og HTML-filer ligger i repoet.

## Lokal kontroll

- Kjør JSON-parse.
- Kjør `node scripts/check-internal-links.mjs`.
- Kjør Docker lokalt eller åpne statisk via GitHub Pages etter deploy.
- Sjekk forsiden, guider, utstyr, tester, baner, regler og om-side.
