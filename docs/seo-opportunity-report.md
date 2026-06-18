# SEO opportunity report

Dato: 2026-06-03

## Sammendrag

Det finnes ingen ekte Search Console-eksporter i repoet per denne fasen. Rapporten inneholder derfor ingen tall for klikk, visninger, CTR eller posisjon. Tiltakene i fase 9 er basert på repo-audit, sitemap, metadata, internlenker og åpenbar søkeintensjon.

## Topp 10 CTR-muligheter

Kan ikke rangeres uten Search Console-data.

Når data legges inn, bruk:

```powershell
node scripts\analyze-search-console.js
```

## Topp 10 sider nær side 1

Kan ikke identifiseres uten Search Console-data. Første kandidater å sjekke når data finnes:

1. `/nybegynnerguide.html`
2. `/guider/hvordan-begynne-med-discgolf.html`
3. `/guider/hvilken-discgolfdisk-skal-jeg-velge.html`
4. `/utstyr/beste-discgolfdisker-for-nybegynnere.html`
5. `/utstyr/discgolf-startsett.html`
6. `/baner/`
7. `/baner/oslo/`
8. `/turneringer/`
9. `/klubber/`
10. `/teknikk/`

## Søkefraser som trenger bedre innhold

Ikke dataverifisert ennå. Mulige hull basert på eksisterende struktur:

- discgolf ukesgolf
- discgolf klubb Oslo
- discgolf klubb Bergen
- discgolf turnering nybegynner
- discgolf sko våt bane
- discgolf plasttyper
- discgolf baner nær meg
- discgolf lost disc / mistet disk
- PDGA-rating Norge
- discgolf vinter Norge

## Mulig kannibalisering

Se `docs/query-to-page-map.md`.

Størst risiko:

- diskvalg for nybegynnere
- startsett
- regler
- baner i Norge vs norske discgolfbaner

## Sider som bør oppdateres først

1. `/nybegynnerguide.html`
2. `/utstyrsguide.html`
3. `/baner/`
4. `/klubber/`
5. `/turneringer/`
6. `/regler.html`
7. `/guider/hvordan-begynne-med-discgolf.html`
8. `/utstyr/beste-discgolfdisker-for-nybegynnere.html`

## Tiltak utført i fase 9

- Opprettet Search Console-analyse-script.
- Opprettet site audit-script.
- Generert `docs/site-audit.md`.
- Forbedret title/meta på 13 prioriterte sider.
- Lagt til interne lenkeblokker på 5 hub-/prioritetssider.
- Opprettet query-to-page map og internlenkingskart.

## Tiltak som må vente

- CTR-optimalisering basert på faktiske tall.
- Posisjon 8-20-forbedringer basert på faktiske søk.
- Nye artikler basert på Search Console.
- Kannibaliseringsvurdering basert på reelle query/page-par.
