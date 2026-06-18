# UI-guide for Diskgolfutstyr.no

Diskgolfutstyr skal føles ryddig, norsk, utendørs og troverdig. Designet skal hjelpe brukeren raskt videre til riktig guide, ikke se ut som en generisk affiliate-side.

## Farger

CSS-variabler ligger i `assets/css/styles.css`.

- `--color-primary`: hovedgrønn for lenker, CTA-er og viktige UI-elementer.
- `--color-primary-dark`: mørkere grønn for hover og kontrast.
- `--color-accent`: frisk grønn aksent.
- `--color-bg`: lys naturinspirert bakgrunn.
- `--color-surface`: kort og hovedflater.
- `--color-text`: løpende tekst.
- `--color-muted`: sekundærtekst.
- `--color-line`: rammer, skillelinjer og tabeller.

Bruk grønt som signal, ikke som pynt overalt. Viktig tekst skal alltid ha høy kontrast.

## Typografi

Siden bruker systemfont med Inter/Manrope som førstevalg hvis tilgjengelig. Ikke legg inn eksterne fontbiblioteker uten en konkret ytelsesmessig grunn.

Artikkeltekst bør ha begrenset bredde. Bruk eksisterende `.article-layout` og `.article-body` for lange sider.

## Knapper

Bruk:

- `.button` for primær handling.
- `.button-secondary` på mørk hero eller kontrastflater.
- `.button-dark` når en mørk knapp passer bedre på lys bakgrunn.
- `.button-disabled` når en produktlenke eller butikklenke kommer senere.

Knapper skal være lenker når de navigerer, og ekte `button` når de åpner/lukker UI.

## Kort

Bruk eksisterende kortklasser:

- `.card` for generelle kort.
- `.guide-card` for artikkelkort.
- `.product-card` for produkter.
- `.course-card` for baner.
- `.roadmap-card` for innholdsplan/roadmap.

Et godt kort har kort kategori, tydelig tittel, én kort forklaring og en konkret lenke.

## Callout-bokser

Bruk:

- `.notice` eller `.callout` for tips og praktiske anbefalinger.
- `.update-note` for datostatus, kildeforbehold og manuell oppdatering.
- `.research-note` for research-basert innhold.
- `.callout-warning` for vanlige feil, advarsler og viktige forbehold.

Ikke bruk callouts som pynt. De skal fremheve noe brukeren bør stoppe ved.

## Produktkort

Produktkort skal vise:

- navn
- type
- stabilitet/plast hvis relevant
- hvem produktet passer for
- bruksområde
- fordeler
- ulemper
- tydelig merking av evidensstatus

Hvis produktet ikke er fysisk testet, skal kortet ikke bruke “best i test”. Bruk heller “Research-basert - ikke fysisk testet”.

## Tester og sammenligninger

Fysisk test skal merkes:

> Fysisk testet av Diskgolfutstyr

Research-basert sammenligning skal merkes:

> Research-basert sammenligning - ikke fysisk testet

Sider bør forklare metode, kilder, hvem innholdet passer for, fordeler, ulemper og relevante alternativer.

## Artikkellayout

Lange artikler bør bruke:

- én H1
- kort ingress
- oppdatert-dato
- kategori/evidensmerking
- innholdsfortegnelse når siden er lang
- tydelige H2/H3
- kildeoversikt nederst
- relaterte guider nederst

Ikke gjør tekstfeltet for bredt på desktop.

## Mobilprinsipper

- Navigasjonen skal være enkel å åpne og lukke.
- Klikkflater skal være minst rundt 44 px høye.
- Ingen horisontal scrolling, bortsett fra brede tabeller der `overflow-x` er nødvendig.
- Hero skal være praktisk og kort nok til at brukeren raskt ser neste valg.
- Kort skal stables i én kolonne på mobil.

## Nye sider

Når en ny side lages:

1. Bruk eksisterende header, footer og CSS.
2. Sett unik `title`, `description`, canonical og én H1.
3. Bruk semantisk HTML.
4. Merk test/research tydelig.
5. Legg inn interne lenker til relevante guider.
6. Legg inn kilder og dato når innholdet kan endre seg.
7. Ikke legg inn affiliate-lenker uten tydelig merking og `rel="sponsored nofollow"`.
