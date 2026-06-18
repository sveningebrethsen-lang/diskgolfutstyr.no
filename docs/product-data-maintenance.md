# Vedlikehold av produktdata

Sist oppdatert: 2026-06-03

Produktdata ligger i `data/products/` og eldre eksempeldata ligger i `data/products.json`. Kommersielle lenker ligger separat i `data/affiliate/links.json`.

## Nye produkter

1. Legg produktet i riktig fil: `discs.json`, `bags.json`, `baskets.json` eller `accessories.json`.
2. Verifiser navn, type, plast, flight numbers og produsent fra produsentens egne sider der mulig.
3. Bruk `null`, tom streng eller "Ukjent" hvis data ikke er sikker.
4. Merk tydelig om omtalen er fysisk test, research-basert eller fremtidig testidé.
5. Koble affiliate-lenke via `data/affiliate/links.json` når en trygg offentlig lenke finnes.

## Skal unngås

- Ikke hardkod priser.
- Ikke oppgi lagerstatus.
- Ikke skriv "testet" uten fysisk testnotat.
- Ikke bruk butikkbilder uten rettigheter.
- Ikke legg inn hemmelige sporingskoder.
