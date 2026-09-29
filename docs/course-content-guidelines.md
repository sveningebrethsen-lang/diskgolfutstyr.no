# Course content guidelines

Diskgolfutstyrs banesider skal være nyttige, kildebaserte og forsiktige. Målet er å hjelpe norske spillere å finne riktig bane uten å kopiere UDisc, klubber eller anmeldelser.

## Hvordan banesider skal skrives

En baneside bør ha:

- unik SEO-title og meta description
- én H1 med banenavn eller by
- oppdatert-dato
- kort egenformulert beskrivelse
- sted, kommune og fylke
- antall hull bare når dette er verifisert
- vanskelighetsgrad med forsiktig språk
- hvem banen kan passe for
- tips før runden
- lenke til oppdatert baneinfo
- kilder nederst

Ikke skriv at en bane er "best" uten metode og dokumentert grunnlag. Bruk heller "aktuell bane", "bane å vurdere" eller "populært alternativ".

## Kilder

Kilder som kan brukes:

- UDisc for baneoversikt, hull, status og byoversikter
- PDGA Course Directory der banen finnes
- lokale discgolfklubber
- idrettslag og kommunale sider
- Disc Golf Scene eller Disc Golf Metrix for turneringskontekst
- NAIF Amerikanske Idretter for norsk konkurranse- og disksportkontekst

Sjekk helst flere kilder for detaljer som kan endre seg. Hvis bare én kilde finnes, skriv tydelig at informasjonen er basert på tilgjengelig kilde.

## UDisc og klubbkilder

UDisc kan brukes som kilde, men tekst, anmeldelser og bilder skal ikke kopieres. Skriv egne beskrivelser basert på fakta som sted, hull, vanskelighetsgrad, banetype og status.

Klubbsider kan brukes for åpningstid, booking, dugnad, arrangementer og lokale forbehold. Ikke kopier klubbens banebeskrivelse ordrett.

## Usikre fakta

Hvis noe er usikkert:

- bruk `null`, tom streng eller "Ukjent" i datafilen
- skriv "virker", "kan passe" eller "basert på tilgjengelig informasjon"
- ikke oppgi fasiliteter, åpningstid, priser eller restriksjoner som sikre uten kilde

Bruk alltid forbeholdet:

> Informasjon om baner kan endre seg. Sjekk alltid oppdatert informasjon fra klubb, arrangør eller banetjeneste før du drar.

## Datastruktur

Baneinfo ligger i `data/courses/norway.json`, som er eneste autoritative publiseringskilde. `data/courses.json` er kun historisk research/backlog.

Nye baner skal følge Course Schema V1. Se `docs/course-schema-v1.md` og `data/courses/course-schema-v1.schema.json`.

- identitet og status
- strukturert sted og koordinater
- egenformulert sammendrag
- tilgang, fasiliteter og egnethet uten antakelser
- standardiserte kilder i `sources`
- kobling mellom fakta og kilder i `field_sources`
- redaksjonell status i `editorial`

## Slik legger du til ny bane

1. Finn minst én kvalifisert primær- eller åpen kilde.
2. Verifiser navn, status, sted og koordinater.
3. Dokumenter minst tre nyttige faktagrupper utover navn og plassering.
4. Skriv egen kort beskrivelse.
5. Sett usikre felt til `null`, tom liste eller eksplisitt `unknown`.
6. Oppdater kilde- og redaksjonsdato.
7. Kjør course-data-tester og validering.
8. Generer side først etter redaksjonell godkjenning.

## Lokale SEO-sider

By-/områdesider bør ha:

- bynavn i title og H1
- konkret liste over aktuelle baner
- tips til nye spillere i området
- FAQ med ekte lokale spørsmål
- interne lenker til nybegynnerguide, regler, etikette og utstyr
- eksterne kilder nederst

Ikke spam søkeord. Skriv naturlig norsk.

## Bilder

Ikke bruk bilder fra UDisc, Google, klubber eller sosiale medier uten tillatelse. Hvis egne bilder legges til senere, bruk god alt-tekst og optimaliser størrelse.
