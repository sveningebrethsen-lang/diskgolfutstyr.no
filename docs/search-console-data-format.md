# Search Console data format

Legg Search Console-eksporter i:

`data/search-console/`

Scriptet leser disse filnavnene hvis de finnes:

- `queries.csv`
- `pages.csv`
- `page-query.csv`
- `search-console-export.csv`
- `last-28-days.csv`
- `previous-28-days.csv`
- `last-3-months.csv`

## Forventede kolonner

Bruk engelske kolonnenavn hvis mulig:

- `query`
- `page`
- `clicks`
- `impressions`
- `ctr`
- `position`

Scriptet tåler også noen norske varianter:

- `søkefrase` / `sokefrase`
- `side`
- `klikk`
- `visninger`
- `posisjon`

## Slik kjører du analysen

```powershell
node scripts\analyze-search-console.js
```

Rapporten skrives til:

`docs/generated-search-console-report.md`

## Tolkning

- Høy visning og lav CTR: forbedre title/meta først.
- Posisjon 8-20: styrk internlenking, intro, FAQ og kildegrunnlag.
- Relevante søk uten god side: legg i backlog før nye artikler lages.
- Flere sider på samme søk: velg én hovedside og gjør andre sider smalere.
