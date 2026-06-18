# Affiliate link management

Affiliate-lenker ligger i:

`data/affiliate/links.json`

## Struktur

Hver lenke har:

- `id`
- `product_id`
- `merchant`
- `affiliate_url`
- `regular_url`
- `link_type`
- `last_checked`
- `notes`

## Placeholder-lenker

Når affiliate-lenke mangler:

- `affiliate_url` skal være `#`
- `link_type` skal være `placeholder`
- CTA skal si rolig tekst som `Se produkt`
- siden skal vise at annonselenke kan bli lagt til senere

## Når ekte affiliate-lenke legges inn

1. Sjekk at lenken ikke inneholder private tokens.
2. Oppdater kun `data/affiliate/links.json`.
3. Sett `merchant`.
4. Sett `link_type` til `affiliate`.
5. Oppdater `last_checked`.
6. Sørg for at lenken brukes med `rel="sponsored nofollow"`.
7. Dokumenter endringen i fase-/affiliate-logg.

## Ikke gjør dette

- Ikke legg inn priser uten vedlikeholdsplan.
- Ikke legg inn lagerstatus.
- Ikke legg inn falske rabatter.
- Ikke legg inn skjulte sporingskoder.
- Ikke bruk UTM-parametre som later som en kampanje er aktiv.

## Lenkesjekk

Kjør månedlig:

```powershell
node scripts\qa-static-site.mjs
```

For ekte affiliate-lenker bør man også manuelt sjekke at butikken fortsatt fører produktet.
