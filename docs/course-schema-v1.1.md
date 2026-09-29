# Course Schema V1.1

Course Schema V1.1 er datakontrakten for `data/courses/norway.json`. Den skiller dokumenterte banefakta fra redaksjonell godkjenning og offentlig publisering.

## Hovedmodell

- `status` beskriver banen: `active`, `seasonal`, `temporarily_closed`, `closed` eller `unknown`.
- `publication.state` beskriver publiseringsløpet: `legacy`, `draft`, `verified`, `publishable` eller `withheld`.
- `installed_holes` beskriver installerte hull/kurver når dette er dokumentert.
- `layouts[]` beskriver konkrete spilleoppsett. Et layout-hulltall trenger ikke være lik `installed_holes`.
- `legacy_reported_holes` bevarer tidligere verdi for adapter og migreringskontroll.

## Layouts

Hver layout har egen ID, navn, hull, par, status, sesongstatus, notat og kilde-ID-er. Manglende par gir warning, ikke oppdiktet verdi. Sukkevann viser hvorfor skillet er nødvendig: 27 installerte hull kan eksistere samtidig med et 18-hulls spilleoppsett.

## Egnethet

`suitability.beginner` og `suitability.family` inneholder:

- `value`: `true`, `false` eller `null`
- `scope`: `course`, `layout` eller `unknown`
- `layout_id` når vurderingen bare gjelder ett layout
- `rationale[]`
- `confidence`
- `source_ids[]`
- `migration_status`

En migrert boolsk legacy-verdi får ikke automatisk begrunnelse. Den merkes `legacy_value` og gir warning dersom rationale mangler.

## Difficulty

Difficulty er en redaksjonell vurdering, ikke et absolutt kildefaktum. Objektet bruker kontrollert skala: `Lett`, `Moderat`, `Krevende`, `Svært krevende` eller `Ukjent`, med `rationale`, `confidence`, `reviewed_at` og kilde-ID-er. Eldre etiketter beholdes i `legacy_value`.

Uenighet mellom eldre og nyere vanskelighetsvurderinger er ikke automatisk en kritisk kildekonflikt. Objektive konflikter om navn, plassering, hull eller aktiv status skal fortsatt registreres i `source_conflicts`.

## Kilder og konflikter

Koordinater krever `coordinate_source_id` og `coordinate_checked_at`. Source-ID må finnes i postens `sources[]`.

`source_conflicts[]` beholder begge kildeverdier, status og eventuell dokumentert løsning. En kritisk uløst konflikt blokkerer validering og publisering.

## Operator, tilgang og fasiliteter

`operator` er et eget objekt og er ikke en kilde i seg selv. Tilgang og fasiliteter bruker kontrollerte statusverdier. `unknown` er forskjellig fra `no` og skal aldri konverteres til `false`.

## Review og publisering

Minimal publiseringsport for en ny bane krever:

1. stabil ID og slug
2. verifisert navn, kommune, fylke og land
3. kildebundet plassering/koordinater
4. hullantall eller tydelig layoutinformasjon
5. minst én kvalifisert kilde
6. kontrolldato og egenformulert summary
7. redaksjonell difficulty eller `Ukjent`
8. håndterte kritiske faktakonflikter
9. eksplisitt godkjent review med reell reviewer og dato

Terreng, banetype, operator, offisiell URL, suitability, alternative layouts og ekstra kilder er anbefalt. Fasiliteter, transport, tilgjengelighet, hunderegler, sesong, åpningstid og booking er valgfrie og blokkerer ikke publisering.

Systemet setter aldri review-godkjenning automatisk. Eksisterende sider kan bygges som `legacy` når `grandfathered_existing_page` er `true`, men dette gjør dem ikke publishable for nye sider.

Maskinlesbart schema: `data/courses/course-schema-v1.1.schema.json`.
