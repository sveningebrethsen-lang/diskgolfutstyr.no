# Fase 24C: P0-hardening av Diskvelger og Flight Visualizer

Dato: 2026-09-29. Baseline: `fd882af6e68f409498cd43e98eb932bb710e7905`. Lokal arbeidskopi er detached HEAD. Ingen commit, push, deploy eller staging utført. Banegrunnlag, URL-struktur, sitemap, globalt designsystem og `assets/Brand/Bilder/` er urørt.

## Implementert

| P0 | Endring |
|---|---|
| Feil turn-retning | Felles retningsfunksjon for begge verktøy; RHBH/LHFH turn høyre, fade venstre; LHBH/RHFH motsatt |
| Tvetydige problemer | Tidlig sving og hard avslutning er separate valg. Hånd spørres kun ved retningsproblem, ikke ved putting |
| Begge kastestiler | Et betinget spørsmål avklarer hvilket kast problemet gjelder; ellers ingen sidebestemt diagnose |
| Ukjent kastelengde | «Vet ikke ennå» med konservativt utgangspunkt uten antatt meterverdi |
| Dominerende midrange-gren | Mål bestemmer rollen, erfaring/lengde bestemmer fart, kjent problem og kastestil nyanserer stabilitet |
| Generisk resultattekst | Separate begrunnelser for putting, innspill, ukjent distanse, forehand, begge og relevante problemer |
| Feil modelleksempler | Alle 16 gamle navn kontrollert; ett dokumentert eksempel per selectorprofil. Visualizer viser modell bare ved eksakt presetprofil |
| Ufullstendig speiling | Alle kontrollpunkter og sluttpunkt speiles rundt samme akse |
| Turn uten slutteffekt | Turn bidrar til både kontrollpunkter og sluttpunkt |
| Sammendrag bare fra speed | Tekst fra alle fire tall med tydelig forbehold om passende kastfart |
| Mistet kastestil | Lenken overfører kastestil, kjent hånd og eksplisitt opprinnelsesmarkør |
| URL-validering | Per-felt-validering; tomt, desimal, duplikat, ugyldig og utenfor grense faller tilbake bare for feltet |
| Keyboard-fokus på body | Valg oppdateres uten DOM-utskifting. Neste/Tilbake/Restart flytter tastaturfokus til heading; pekere får ikke tvungen headingfokus |
| Små sliders | Effektiv inputhøyde 44 px, med native piltaster og touch |
| Statisk SVG-navn | Dynamisk title/desc med profil, kastestil, hånd og pedagogiske begrensninger |
| Små grafetiketter | Større SVG-etiketter, over kurven og innenfor viewBox |

## Regelmodell og fordeling

Se [beslutningstreet](disk-selector-decision-tree.md) for alle prioriteringer, intervaller og før/etter-tabeller.

Før: 2700 kombinasjoner, 53 % understabil midrange, bare 9 treff i forehand-grenen. Etter: 7320 fullstendige svarløp; approach 2024, putter 720, easyMid 1629, neutralMid 2209, easyFairway 243, neutralFairway 495. Ingen kategori er utilgjengelig. Forehand inngår i stabilitetsvalg og forklaring, ikke som en nesten død siste regel.

Dette er kombinasjonstelling, ikke brukerdata. Flere svaralternativer og betingede spørsmål endrer nevneren. At fairway er mindre vanlig er tilsiktet: den krever kjent distanse, erfaring og mål som faktisk peker mot fairway. Reglene er ikke justert for å oppnå jevne prosentandeler.

## Modell og URL-kontrakt

Grafen sees ovenfra med kastelinjen mot skjermens høyre. Kasterens høyre er derfor nedover på skjermen, venstre oppover. Dette forklares både synlig og i SVG-beskrivelsen. Bézier-kurvens fire punkter bruker samme fortegn; likhet for de fire punktene innebærer speiling av hele kurven.

Speed og glide påvirker illustrert utstrekning ved antatt passende kastfart. Turn påvirker sving og sluttoffset; fade trekker i motsatt retning mot slutten. Ingen høyde, meter, kraft eller vind simuleres. Det finnes ingen fysisk prediksjonsnøyaktighet å oppgi.

Eksempel på overføring:

`/verktoy/flysimulator/?speed=7&glide=5&turn=-2&fade=1&throwStyle=forehand&handedness=left&origin=selector`

Bare heltall godtas. Gyldige felt beholdes selv om andre er ugyldige. Ugyldige felt bruker 7/5/-2/1 som respektive standard, uten avrunding eller skjult clamping. Manglende felt bruker samme standard. Dette samsvarer med sliders med heltallssteg. Både positiv og negativ turn innen -5 til 1 er gyldig, inkludert eksplisitt null.

Opprinnelsesboksen krever `origin=selector` og minst ett gyldig flight-felt. Bare flight-tall eller bare origin viser ikke boksen. Dette er en UI-opprinnelsesmarkør, ikke autentisering. Ved delvis ugyldig input opplyses det om standardverdier. Ukjent hånd eller kastestil beskrives som illustrasjonsstandard; brukerens kjente forehand blir aldri erstattet med backhand.

## Produsentkontroll

Se [kildeføring for alle 16 navn](disc-tools-example-sources.md). Aviar Putt & Approach, Mako3, Fuse, S-Line FD og Neo Essence er igjen i Diskvelger. Aviar, Mako3, FD og Wraith illustrerer fire eksakte presets i Visualizer. Ingen produktdatabase eller generelt modellmatchingssystem er introdusert.

## Reproduserbare tester

`node scripts/test-disc-tools.mjs` krever bare Node og repoets baseline-commit:

- 7320 svarløp og intervallkontroll for alle viste eksempler og representative verdier.
- 12 navngitte profiler: ny/ukjent lengde, nybegynner BH/FH, kontroll 70–90, lengde 90–110, erfaren 110+, erfaren kortkastende og innspill, LHBH/RHFH med tidlig venstre/sen høyre.
- 4116 mulige heltalls-flightprofiler × fire orienteringer = 16 464 orienterte profiler. Alle punkter endelige og innenfor grafen; hele kurven speiles.
- 40 navngitte flight/orienteringskombinasjoner, inkludert de seks bestilte profilene og fire ytterpunkter.
- Ulikt sluttpunkt ved endret turn, sammendragssensitivitet for alle fire tall, URL-tomverdier/desimal/duplikat/ukjent tekst/grenser, eksplisitt opprinnelse og overføring fra alle selectorløp.

`node scripts/test-disc-tools-browser.mjs` bruker et allerede installert Playwright-miljø. Ingen pakke ble installert eller lagt til nettstedet. Sett `PLAYWRIGHT_MODULE` til tilgjengelig modulsti om den ikke finnes på vanlig Node-sti. `BROWSER_CHANNEL` standard er `msedge`, `TEST_BASE_URL` standard er lokal port 8124. Start server med `PORT=8124` i miljøet og `node scripts/serve.mjs`.

Nettlesertest kjørt i headless Microsoft Edge på 1366×768, 390×844 og 375×667:

- Fire komplette brukerprofiler på hver viewport, 72 valg-/nesteoverganger med klikk/touch, faktisk åpning av simulatorlenken og kontroll av tall/hånd/kastestil.
- Alle heltall på alle sliders, alle presets, fire hånd/kastkombinasjoner og syv URL-scenarier per viewport.
- Enter, Space, Tab, piltaster, Home, Tilbake, Restart og bytte bort fra et retningsproblem uten gamle skjulte svar.
- Native slider-tap på mobil, 44 px mål, synlig tastaturfokus, dynamisk tilgjengelig navn, redusert og normal bevegelse.
- Ingen sidefeil i JavaScript, lokale HTTP-feil eller horisontal overflow.

Skjermbilder ble gjennomgått for resultat og visualisering, også ekstremprofil 14/7/-5/5 på desktop og mobil. De ligger utenfor repoet i `%TEMP%/diskgolfutstyr-24c-qa/`. Fysisk mobil, VoiceOver/TalkBack og reell lesbarhet i sollys er ikke testet.

## Mobil og gjenstående P1

Bare radiovalg og presets er komprimert til to kolonner på mobil. Sliders er 44 px høye. Ingen rekkefølge, global hero eller panelstruktur er endret.

| Måling | 1366 px | 390 px | 375 px |
|---|---:|---:|---:|
| Grafens topp ved direkte åpning | 885 px | 1899 px | 1888 px |
| Grafens topp med kjent hånd/kast og opprinnelsesboks | 998 px | 2039 px | 2029 px |

I 24B startet direkte graf rundt 1961/1951 px på de to mobilbreddene. Forbedringen er liten og må ikke fremstilles som løst mobilprodukt. P1 bør prioritere kortere vei til grafen, mindre gjentakelse mellom sammendrag og forklaringer, kortere resultat, og feltprøve med nye spillere. Desktopheadingen i grafpanelet er fortsatt stor og bryter over flere linjer. Eksisterende deaktivert delingsknapp er ikke del av P0 og står uendret.

## QA og omfang

Begge nye testscript passerer. De fem eksisterende QA-script er kjørt med exit 0. Statisk QA teller 158 HTML-filer, 145 JSON-LD-blokker og 147 sitemap-URL-er. `node --check` passerer for alle åtte relevante JS/MJS-filer. `git diff --check` passerer; Git gir bare vanlige LF/CRLF-advarsler i dette Windows-oppsettet.

Placeholder-scriptets exit 0 betyr ikke null funn. Det leser også dokumentasjon og sine egne genererte rapporter. Dermed øker rapporterte treff ved gjentatte kjøringer. Lenkesjekken har samme selvreferanseproblem for rapporterte placeholder-lenker. Sammenligning av HTML-/verktøytreff mot baseline viser 99 før og 99 etter, uten endret fordeling per fil/kategori. Dette er dokumentert, ikke rettet i P0-runden. Den eksisterende deaktiverte delingsknappen er et reelt, uendret UI-treff.

Endrede produktfiler: `assets/css/styles.css`, de to Diskvelger-modulene, tre Flight Visualizer-moduler og dens `index.html`. Ny delt modul: `verktoy/flight-core.js`. Dokumentasjon: beslutningstre, roadmap, kildekontroll og denne rapporten. To nye testscript og oppdaterte genererte QA-rapporter inngår. Ingen øvrige frontendflater, banedata eller publiseringsinnstillinger er endret.

Avventer menneskelig godkjenning. Ingen commit/push/deploy.
