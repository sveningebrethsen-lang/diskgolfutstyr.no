# Fase 24A: Content Sprint 1

Oppdatert: 2026-09-29
Baseline: `fd882af6e68f409498cd43e98eb932bb710e7905`

## Avgrensning og datagrunnlag

Sprinten forbedrer ti eksisterende legacy-poster. Det er ikke opprettet nye baner, HTML-sider, URL-er eller sitemap-oppføringer. Ni baner er klargjort for menneskelig review, mens Kvernhuset beholdes som en negativ kontroll fordi det mangler en kvalifisert primærkilde.

Det finnes ingen Search Console-eksport i `data/search-console/`. `docs/generated-search-console-report.md` bekrefter at repoet mangler side-, søkefrase- og posisjonsdata. Innholdsmulighetene nedenfor er derfor prioritert etter eksisterende sidestruktur, søkeintensjon, innholdsgap og risiko for kannibalisering. Ingen impressions, klikk eller posisjoner er antatt.

## A. Ti baner

| Bane | Sted | Plassering | Hull/layout | Terreng/type | Difficulty | Passer for | Kilder | Unknown | Validator | Review-anbefaling |
|---|---|---|---|---|---|---|---|---|---|---|
| Holmenkollen frisbeegolf | Oslo, Oslo | 59.9656882, 10.6658179; `approximate` | 18-hulls hovedbane + 8-hulls B-bane | Kupert park, skog og skianlegg | **Moderat**, medium. Kupert terreng og full runde gir høyere krav enn en kort lavterskelbane. | Hobbyspillere og viderekomne; nybegynnere på B-banen | Operatørside + operatørens banekart; kart som sekundærkilde | Par, familieegnethet og nøyaktig første tee | Bestått; review kreves | **VIDERE TIL REVIEW** |
| Ekebergsletta frisbeegolfbane | Oslo, Oslo | 59.8950717, 10.787095; `course_center` | 18 hull | Åpent park- og rekreasjonsområde | **Moderat**, low. Full runde i flerbruksområde krever kontroll og oppmerksomhet. | Hobbyspillere og trening; nybegynner/familie er ikke vurdert | Oslo kommune; kart som sekundærkilde | Par og suitability | Bestått; review kreves | **VIDERE TIL REVIEW** med særskilt kontroll av difficulty |
| Alvøen Frisbeegolfbane | Bergen, Vestland | 60.3658608, 5.1960182; `course_center` | 9 dokumenterte hull; klubbens 18-hullsmål er ikke registrert som ferdig | Park- og skogsbane ved idrettsanlegg | **Krevende**, high. Klubben beskriver banen som laget for å utfordre viderekomne. | Viderekomne, lokale spillere og teknisk trening | Loddefjord IL; eldre baneoversikt for nåværende hullantall; kart | Par, ferdigstilte alternative utkast og suitability for nybegynnere/familier | Bestått; review kreves | **VIDERE TIL REVIEW**, men hullantallet bør vurderes nøye |
| Søndre Hetlevik frisbeegolfbane | Bergen, Vestland | 60.3471786, 5.2243979; `course_center` | 5 kurver; 18-hulls hovedoppsett + 9-hulls alternativ | Kompakt, kystnært nærmiljø med vann og kryssende linjer | **Moderat**, medium. Korte avstander senker terskelen; vann og gjenbruk av linjer øker kravet til oppmerksomhet. | Nybegynnere på 9-hullsoppsettet, hobbyspillere og korte runder | To klubbkilder fra Stormkast; kart | Par og familieegnethet | Bestått; review kreves | **VIDERE TIL REVIEW** |
| Trolla Diskgolfpark | Trondheim, Trøndelag | 63.4502985, 10.2943328; `course_center` | 10 hull | Kupert skogsterreng rundt idrettsplass og lysløype | **Moderat**, medium. Kupert skogsterreng gir en moderat samlet utfordring. | Hobbyspillere, lokale spillere og skogsrunde | Trolla IL; kart | Par og suitability | Bestått; review kreves | **VIDERE TIL REVIEW** |
| Bølgane Frisbeegolfpark | Kristiansand, Agder | 58.1638304, 7.9872641; `course_center` | 18 hull | Åpne fairwayer, skog og jordekanter | **Moderat**, medium. Variasjonen mellom åpne hull og skog gir et middels krevende helhetsnivå. | Hobbyspillere, variert spill og 18-hullsrunde | Kristiansand Frisbeegolfklubb; kart | Par og suitability | Bestått; review kreves | **VIDERE TIL REVIEW** |
| Skimore Drammen | Drammen, Buskerud | 59.762644, 10.125132; `approximate` | 18-hulls sesongbane | Kupert naturterreng ved skianlegg | **Moderat**, low. Kupert terreng trekker opp, mens operatøren oppgir bred målgruppe. | Nybegynnere, hobbyspillere og familier | Skimore Drammen; kart | Par og nøyaktig første tee | Bestått; review kreves | **VIDERE TIL REVIEW** med kontroll av difficulty og koordinatpresisjon |
| Kvernhuset DiscGolfpark | Fredrikstad, Østfold | 59.2373218, 10.935689; `approximate` | 9 hull omtalt i sekundærkilde | Skole- og nærmiljøbane | **Ukjent**. Legacy-vurderingen er ikke videreført som ny redaksjonell konklusjon. | Kort runde og lokale spillere; øvrig suitability ukjent | Aktivitetsrådet 2020, UDisc-aktivitet 2026 og kart; ingen kvalifisert primærkilde | Aktiv status, operatør, oppdatert hull/layout, difficulty og suitability | **Stopp**: source quality feiler | **CHANGES REQUIRED**. Ikke send til review før klubb, kommune eller operatør kan bekrefte kjernefakta. |
| Skien Frisbeegolfbane | Skien, Telemark | 59.1866013, 9.5969181; `first_tee` via operatørens kartlenke | 18-hulls hovedbane + 6-hulls kortbane | Park, skog og idrettsanlegg | **Moderat**, medium. Hovedbanen er variert; kortbanen gir et enklere alternativ. | Hobbyspillere; nybegynnere på kortbanen | Skien fritidspark + Skien Frisbeeklubb | Par og familieegnethet | Bestått; review kreves | **VIDERE TIL REVIEW** |
| Heistad-banen | Porsgrunn, Telemark | 59.0883238, 9.6797079; `course_center` | 18 hull, par 58 | Åpne partier, skog, høydeforskjeller og flerbruksområde | **Krevende**, medium. Full runde, par 58 og variert terreng gir flere tekniske og fysiske krav. | Hobbyspillere og viderekomne | Porsgrunn Disksportklubb + kommunal aktivitetsportal; kart | Suitability for nybegynnere/familier | Bestått; review kreves | **VIDERE TIL REVIEW** |

### Primærkilder

- Holmenkollen: <https://holmenkollen.com/aktiviteter/frisbeegolf/> og <https://www.skiforeningen.no/globalassets/tidligere-ars-innhold/bilder/holmenkollen/aktiviteter/frisbeegolf/banekart.pdf>
- Ekeberg: <https://www.oslo.kommune.no/natur-kultur-og-fritid/idrett/idrettsanlegg/ekeberg-idrettspark/>
- Alvøen: <https://www.loddefjordil.no/grupper/frisbeegolf/>
- Søndre Hetlevik: <https://stormkast.no/Hetlevik/> og <https://www.stormkast.no/index.php?artikkelId=26259414&r=site%2FshowArtikkel>
- Trolla: <https://trollail.spond.club/diskgolf>
- Bølgane: <https://kfgk.no/?page_id=40>
- Skimore Drammen: <https://drammen.skimore.no/frisbeegolf>
- Skien: <https://skienfritidspark.no/aktiviteter/aktivitetsparken/frisbeegolf> og <https://skienfrisbee.com/?page_id=11>
- Heistad: <https://www.pdsk.no/next/p/78404/heistad> og <https://aktivitetsportalenporsgrunn.no/aktivitetstilbyder/porsgrunn-disksportklubb/>
- Kvernhuset har foreløpig bare sekundærgrunnlag: <https://aktivitetsrad.no/2020/07/hva-er-frisbee-golf/> og <https://udisc.com/leagues/flobergseter-ligaen-2026-FUzrIn>

### Validatornotat

- Ni baner har `research_complete=true`, kvalifisert kilde, bestått validering og `review_status=required`.
- Kvernhuset har nok utfylte kjernefelt til at research-komplett slår inn, men `source_quality_passed=false` og `validation_passed=false` fordi kvalifisert primærkilde mangler.
- Ingen av de ti er godkjent, verifisert eller gjort publishable i denne fasen.
- Varsler gjelder hovedsakelig ukjent par, anbefalte men valgfrie felt og at freshness-rapporten tar med eldre, bevarte sekundærkilder. Det er ingen validatorfeil.

## B. Fem guide- og innholdsmuligheter

### 1. Samle startsett-intensjonen

**Anbefaling:** `MERGE`
**Foreslått hoved-URL:** `/utstyr/discgolf-startsett.html`
**Overlapp:** `/guider/discgolf-startsett.html` og `/tester/beste-discgolf-startsett.html`

- **Search Console-signal:** Ikke tilgjengelig i repoet; må valideres etter eksport.
- **Search intent:** Velge første startsett og forstå hva det bør inneholde.
- **Svarer godt i dag:** Utstyrssiden har konkret anbefalingstabell, diskroller, tydelig researchmerking og produktkilder.
- **Mangler:** Klar skillelinje mellom ferdig startsett og å bygge eget sett, vurderingskriterier, vekt/plast og et beslutningstre for hvem som bør velge hva.
- **Kannibaliseringsrisiko:** Høy. Tre sider har svært like titler, metadata og innhold.

**Kort brief**

- Hovedspørsmål: Hvilket discgolf-startsett passer en ny spiller?
- Sekundære spørsmål: Tre eller flere disker? Ferdig sett eller enkeltdisker? Hvilken speed, vekt og plast? Hva bør unngås?
- Struktur: Kort svar; kjøpskriterier; ferdig sett vs eget sett; anbefalte diskroller; vanlige feil; FAQ; metode/kilder.
- Internlenker: Nybegynnerguide, disktyper forklart, flight numbers, nybegynnerdisker og første runde.
- Verktøy-CTA: **Diskvelger** etter avsnittet om ferdig sett kontra enkeltdisker.

### 2. Gjør diskvalg-guiden til hovedinngang for Diskvelger

**Anbefaling:** `EXPAND`
**URL:** `/guider/hvilken-discgolfdisk-skal-jeg-velge.html`

- **Search Console-signal:** Ikke tilgjengelig i repoet.
- **Search intent:** Få hjelp til å velge disktype ut fra nivå, kastelengde og problem.
- **Svarer godt i dag:** Forklarer rolle, nivå, bane og et enkelt tre-diskoppsett på en ryddig måte.
- **Mangler:** En konkret beslutningsrekkefølge, eksempler basert på kastelengde, stabilitet og vanlige symptomer som tidlig fade eller manglende kontroll.
- **Kannibaliseringsrisiko:** Middels mot nybegynnerdisk-guidene. Siden bør eie *valgprosessen*, mens utstyrssiden eier konkrete produktalternativer.

**Kort brief**

- Hovedspørsmål: Hvilken type discgolfdisk passer kastet mitt nå?
- Sekundære spørsmål: Hvilken speed mestrer jeg? Hva betyr stabilitet? Når trenger jeg putter, midrange eller fairway-driver? Hva forteller flyvefeilen?
- Struktur: Kort beslutning; velg etter rolle; velg etter lengde; tolke vanlige problemer; tre eksempelprofiler; hva du bør vente med; FAQ.
- Internlenker: Flight numbers, disktyper forklart, nybegynnerdisker, startsett og backhand.
- Verktøy-CTA: **Start Diskvelgeren** som primær neste handling.

### 3. Koble flight numbers direkte til visualisering

**Anbefaling:** `EXPAND`
**URL:** `/guider/flight-numbers.html`

- **Search Console-signal:** Ikke tilgjengelig i repoet.
- **Search intent:** Forstå speed, glide, turn og fade praktisk.
- **Svarer godt i dag:** Gir korte, korrekte grunnforklaringer av alle fire tall og viktige forbehold.
- **Mangler:** Visuelle eksempler, samspillet mellom tallene, forskjellen på tall og faktisk flyvning, og konkrete profiler for putter, midrange og fairway-driver.
- **Kannibaliseringsrisiko:** Lav hvis siden forblir forklaringsguiden og simulatoren forblir verktøyet.

**Kort brief**

- Hovedspørsmål: Hva betyr flight numbers i praksis?
- Sekundære spørsmål: Hvorfor flyr samme tall ulikt? Hvordan påvirker armfart, vind, plast og slitasje? Hvilke tall passer nye spillere?
- Struktur: Tallene kort forklart; samspill; fire sammenlignede eksempelprofiler; vanlige misforståelser; slik bruker du tallene ved kjøp; FAQ.
- Internlenker: Diskvelger, disktyper forklart, velg driver, velg midrange og nybegynnerdisker.
- Verktøy-CTA: **Prøv Flight Visualizer** rett etter forklaringen av samspillet.

### 4. Konsolider nybegynnerdisk-intensjonen

**Anbefaling:** `MERGE`
**Foreslått hoved-URL:** `/utstyr/beste-discgolfdisker-for-nybegynnere.html`
**Overlapp:** `/guider/beste-disker-for-nybegynnere.html`

- **Search Console-signal:** Ikke tilgjengelig i repoet.
- **Search intent:** Finne konkrete disktyper eller modeller som er egnet for nybegynnere.
- **Svarer godt i dag:** Utstyrssiden har flere konkrete eksempler, flight numbers, roller, produktkilder og tydelig researchmerking.
- **Mangler:** Tydelig metode for hva “nybegynnervennlig” betyr, segmentering etter kastelengde og en forklaring på når konkrete modeller ikke passer.
- **Kannibaliseringsrisiko:** Høy. To sider dekker samme modeller og samme hovedspørsmål.

**Kort brief**

- Hovedspørsmål: Hvilke disker er enklest å lykkes med som nybegynner?
- Sekundære spørsmål: Hvilken putter og midrange først? Når er fairway-driver riktig? Hvilken vekt? Hva bør unngås?
- Struktur: Metode; rask anbefaling etter rolle; valg etter kastelengde; konkrete researchbaserte eksempler; hvem modellene ikke passer for; FAQ.
- Internlenker: Diskvelger, flight numbers, startsett, disktyper forklart og første runde.
- Verktøy-CTA: **Få et personlig kategori-forslag i Diskvelgeren** før produktlisten.

### 5. Gjør backhand-guiden praktisk nok til å løse ett konkret problem

**Anbefaling:** `EXPAND`
**URL:** `/guider/backhand-for-nybegynnere.html`

- **Search Console-signal:** Ikke tilgjengelig i repoet.
- **Search intent:** Lære et trygt og repeterbart backhandkast.
- **Svarer godt i dag:** Har en enkel progresjon gjennom grep, balanse, release og en kort øvelse.
- **Mangler:** Stance, kastelinje, enkel fotarbeidsprogresjon, nose angle, konkrete feilsymptomer og et lite treningsopplegg som kan gjennomføres på felt.
- **Kannibaliseringsrisiko:** Middels mot teknikkhub og mer avanserte backhand-/nose-angle-sider. Denne siden bør eie nybegynnerprogresjonen, ikke maksimal lengde.

**Kort brief**

- Hovedspørsmål: Hvordan lærer jeg et kontrollert backhandkast?
- Sekundære spørsmål: Hvordan holder jeg disken? Hvor starter armen? Hvordan unngår jeg nose-up og rounding? Når bør jeg legge til tilløp?
- Struktur: Sikker start; grep; standstill; kastelinje; enkel ettstegsprogresjon; fem vanlige feil; 20-minutters feltøkt; neste steg.
- Internlenker: Vanlige nybegynnerfeil, nose angle, backhand-drills, flight numbers og disktyper.
- Verktøy-CTA: Diskret lenke til **Diskvelger** i delen om treningsdisk; ingen presset simulator-CTA.

## Prioritert beslutning

1. **Send ni baner til menneskelig review:** Holmenkollen, Ekeberg, Alvøen, Søndre Hetlevik, Trolla, Bølgane, Skimore Drammen, Skien og Heistad.
2. **Stopp Kvernhuset:** innhent kvalifisert bekreftelse fra klubb, kommune eller operatør før review.
3. **Forbedre innhold først:** konsolider startsett, utvid diskvalg-guiden og koble flight numbers til visualiseringen.
4. **Deretter:** konsolider nybegynnerdiskene og bygg ut backhand-guiden.

## Naturlige verktøy- og guidekoblinger

| Fra | Til | Begrunnelse |
|---|---|---|
| Startsett-guide | Diskvelger | Hjelper leseren velge kategori før konkrete produkter. |
| Hvilken disk skal jeg velge? | Diskvelger | Verktøyet utfører samme beslutningsoppgave interaktivt. |
| Flight numbers | Flight Visualizer | Gjør fire abstrakte tall synlige uten å love fysisk fasit. |
| Nybegynnerdisker | Diskvelger + Flight Visualizer | Kategori først, flyveprofil deretter. |
| Banesider | Første runde, regler og etikette | Relevant før et faktisk banebesøk; ikke press utstyrs-CTA. |

## Estimert arbeidsomfang

- Menneskelig review av ni baner: 2–4 timer, med ekstra kontroll av Alvøen-hullantall, Ekeberg/Skimore difficulty og koordinatpresisjon.
- Ny primærkilde for Kvernhuset: 1–2 timer eller direkte henvendelse til lokal klubb/kommune.
- Startsett-konsolidering: 4–6 timer inkludert redirect/canonical-plan og internlenker; gjennomføres i egen godkjent fase.
- Diskvalg + Flight numbers: 3–5 timer per side.
- Nybegynnerdisk-konsolidering: 4–6 timer.
- Backhand-utvidelse: 4–6 timer med faglig gjennomgang.

## Endringer i denne fasen

- `data/courses/norway.json`: kjernefakta, kilder, koordinater, layouts og redaksjonelle vurderinger for ti eksisterende baner.
- `docs/generated-course-data-report.md`: regenerert av validator.
- `docs/phase-24a-content-sprint-1.md`: denne research- og prioriteringsrapporten.

Ingen frontend, HTML, sitemap, URL eller offentlig side er endret.
