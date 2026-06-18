# Product content guidelines

Produktinnhold på Diskgolfguiden skal være nyttig, ærlig og tydelig merket. Affiliate kan komme senere, men skal ikke styre anbefalingene.

## Hvordan produktsider skal skrives

En produktside bør ha:

- SEO-title
- meta description
- tydelig H1
- kort ingress
- oppdatert-dato
- research-/testmerking nær toppen
- rask oppsummering
- sammenligningstabell
- produktkort
- hva leseren bør se etter før kjøp
- vanlige feil
- FAQ der det faktisk finnes nyttige spørsmål
- kilder
- relaterte guider

Skriv praktisk norsk. Ikke bruk aggressiv salgstekst.

## Research-basert sammenligning

Bruk denne teksten på research-baserte produktsider:

> Dette er en research-basert sammenligning basert på produsentdata, offentlige spesifikasjoner og spillererfaringer. Produktene er ikke fysisk testet av Diskgolfguiden.

Research-basert betyr at siden kan bruke produsentdata, offentlige spesifikasjoner og generell spillererfaring, men ikke egne testresultater.

## Fysisk test

Bruk fysisk test-merking kun når produktet faktisk er testet av Diskgolfguiden:

> Dette er en fysisk test utført av Diskgolfguiden.

En fysisk test bør dokumentere:

- dato
- sted/bane
- vær og føre
- hvem som testet
- metode
- resultater og begrensninger

## Ikke bruk “best i test” uten fysisk test

Ikke bruk:

- best i test
- testvinner
- vi har testet
- våre erfaringer etter mange runder
- etter grundig testing

Bruk heller:

- anbefalte valg
- populære alternativer
- produkter å vurdere
- research-basert sammenligning
- passer godt for

## Produktkort

Produktkort bør inneholde:

- produktnavn
- kategori/type
- flight numbers hvis relevant
- stabilitet hvis relevant
- hvem produktet passer for
- kort forklaring
- fordeler
- ulemper
- beste bruksområde
- CTA med `href="#"` hvis affiliate-lenke ikke finnes
- tekst om at annonselenke kan bli lagt til senere

## Fordeler og ulemper

Fordeler og ulemper skal være konkrete. Unngå tomme fraser som “god kvalitet” hvis det ikke forklares hva det betyr.

Eksempel:

- Bra: “Lavere speed gjør den enklere å kontrollere for nye spillere.”
- Svakt: “Veldig bra disk.”

## Affiliate-lenker

Affiliate-lenker skal:

- merkes som annonselenker
- bruke `rel="sponsored nofollow"`
- ikke inneholde private nøkler eller tokens i repoet
- ikke skjules som vanlige kildelenker

Bruk placeholder `#` når lenken ikke finnes ennå.

## Kilder

Bruk:

- produsentenes egne sider for produktdata
- PDGA der godkjenning/regler omtales
- UDisc eller klubber for bane- og spillkontekst
- norske nettbutikker kun som støtte for tilgjengelighet, ikke eneste fagkilde

Ikke kopier produkttekster fra produsenter eller butikker.

## Oppdatering av produktdata

Produktdata ligger statisk i `data/products/`.

Når data oppdateres:

1. Sjekk produsentkilde.
2. Oppdater `last_checked`.
3. Ikke legg inn priser uten tydelig dato og vedlikeholdsplan.
4. Ikke legg inn ratinger, reviews eller availability uten sikre kilder.
