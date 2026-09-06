# Hero-korreksjon – stopp B

6. september 2026. Implementert lokalt; ikke committet eller pushet. Analytics-beacon er ikke aktivert fordi ekte Cloudflare-snippet mangler.

## Faktisk løsning

De 11 hovedheroene bruker nå feature-hero: et eget tekstfelt og en egen bildeflate. Fra 960 px er de side om side. Under 960 px kommer teksten før bildet. Bildehøyden følger source-forholdet med width: 100%, height: auto og object-fit: contain; det er ingen mørk overlay eller fast høyde som cropper bildet. Bildene deformeres ikke.

Komposisjonen begrenses til 1760 px på store skjermer, med en bildeflate på omtrent 984 × 554 px. Dette er en bevisst sentrert sidelayout med ytre sidemarger, ikke et heldekkende ultrabredt bakgrunnsbilde. Den hindrer både ekstrem hero-høyde og gigantiske personer. Bildets 16:9-forhold matches av bildeflaten, uten synlig letterboxing. Avrundede hjørner maskerer bare hjørnepikslene.

De tidligere home-hero/hub-hero-reglene med cover, posisjonsprosenter, overlegg, tvungne minstehøyder og felles bakgrunnsbilde er fjernet. Generiske page-hero-regler for øvrige artikler er beholdt.

## Bildevalg og breakpoints

Desktop/QHD/4K er 1920 × 1080, 2560 × 1440 og 3840 × 2160 (16:9). Tabletfilene er 1536 × 2048 (3:4). Mobilfilene er normalt 900 × 1400 (9:14), men home/hero-mobile.webp er faktisk 900 × 608. Alle 55 variantdimensjoner er kontrollert direkte i bildefilene og lagret i asset-dimensions.json utenfor repoet.

Portrettfilene brukes ikke i den nye, liggende bildeflaten. Særlig Utstyr og Teknikk hadde også uønsket beskjæring allerede i disse filene. Ingen rasterfiler er endret eller nye bilder generert. Verktøy gjenbruker equipment, Flight Visualizer gjenbruker home, og de andre sidene beholder egne bildeserier.

| Side | 768 px og oppover | Under 768 px |
|---|---|---|
| Forside | home/hero-desktop, hero-qhd, hero-4k | home/hero-mobile (900 × 608) |
| Nybegynner | beginner/hero-desktop, hero-qhd, hero-4k | beginner/hero-desktop, hero-qhd, hero-4k |
| Utstyr | equipment/hero-desktop, hero-qhd, hero-4k | equipment/hero-desktop, hero-qhd, hero-4k |
| Tester | tests/hero-desktop, hero-qhd, hero-4k | tests/hero-desktop, hero-qhd, hero-4k |
| Artikler | articles/hero-desktop, hero-qhd, hero-4k | articles/hero-desktop, hero-qhd, hero-4k |
| Teknikk | technique/hero-desktop, hero-qhd, hero-4k | technique/hero-desktop, hero-qhd, hero-4k |
| Regler | rules/hero-desktop, hero-qhd, hero-4k | rules/hero-desktop, hero-qhd, hero-4k |
| Baner | courses/hero-desktop, hero-qhd, hero-4k | courses/hero-desktop, hero-qhd, hero-4k |
| Verktøy | equipment/hero-desktop, hero-qhd, hero-4k | equipment/hero-desktop, hero-qhd, hero-4k |
| Diskvelger | selector/hero-desktop, hero-qhd, hero-4k | selector/hero-desktop, hero-qhd, hero-4k |
| Flight Visualizer | home/hero-desktop, hero-qhd, hero-4k | home/hero-mobile (900 × 608) |

Alle filnavn har .webp og ligger under assets/images/heroes/. Srcset bruker breddebeskrivelser og sizes for faktisk bildebredde, ikke skjermbredde alene. Ved DPR 1 valgte nettleseren hero-desktop for alle de liggende bildene i matrisen. Forside og Flight Visualizer valgte home/hero-mobile under 768 px. Ekstrakontroll på Utstyr ved 1920 px valgte hero-qhd på DPR 2 og hero-4k på DPR 3; ved 390 px/DPR 2 valgte den hero-desktop. De større variantene er fortsatt oppskalerte fra tidligere mastere, og skal ikke beskrives som nye native 4K-fotografier.

## Utstyr før/etter

Prosenten gjelder geometrisk synlig andel av den valgte source-filen etter CSS, ikke andelen av masterbildet som en tidligere eksport eventuelt beholdt. Før var det hovedsakelig bildehøyden som ble kuttet. Etter er hele source-rektangelet synlig.

| Viewport | Før: source | Før: bildeflate | Før: synlig | Etter: source | Etter: bildeflate | Etter: hero-container | Etter: synlig |
|---|---|---|---|---|---|---|---|
| 5120 × 1440 | 3840 × 2160 | 5120 × 639 | 22.19 % | 1920 × 1080 | 984.41 × 553.72 | 1760 × 665.72 | 100 % |
| 3840 × 2160 | 3840 × 2160 | 3840 × 639 | 29.58 % | 1920 × 1080 | 984.41 × 553.72 | 1760 × 665.72 | 100 % |
| 3440 × 1440 | 3840 × 2160 | 3440 × 639 | 33.02 % | 1920 × 1080 | 984.41 × 553.72 | 1760 × 665.72 | 100 % |
| 2560 × 1440 | 2560 × 1440 | 2560 × 559 | 38.82 % | 1920 × 1080 | 984.41 × 553.72 | 1760 × 665.72 | 100 % |
| 1920 × 1080 | 2560 × 1440 | 1920 × 540.25 | 50.02 % | 1920 × 1080 | 984.41 × 553.72 | 1760 × 665.72 | 100 % |
| 1600 × 900 | 1920 × 1080 | 1600 × 540.25 | 60.03 % | 1920 × 1080 | 855.61 × 481.27 | 1536 × 577.27 | 100 % |
| 1440 × 900 | 1920 × 1080 | 1440 × 539.25 | 66.57 % | 1920 × 1080 | 766.38 × 431.08 | 1376 × 517.45 | 100 % |
| 1366 × 768 | 1920 × 1080 | 1366 × 531.84 | 69.22 % | 1920 × 1080 | 725.09 × 407.86 | 1302 × 489.8 | 100 % |
| 1280 × 800 | 1920 × 1080 | 1280 × 523.28 | 72.68 % | 1920 × 1080 | 677.14 × 380.89 | 1216 × 457.67 | 100 % |
| 1024 × 768 | 1920 × 1080 | 1024 × 497.72 | 86.41 % | 1920 × 1080 | 534.34 × 300.56 | 960 × 389.63 | 100 % |
| 820 × 1180 | 1536 × 2048 | 820 × 483.69 | 44.24 % | 1920 × 1080 | 720 × 405 | 720 × 757.98 | 100 % |
| 768 × 1024 | 1536 × 2048 | 768 × 483.69 | 47.24 % | 1920 × 1080 | 720 × 405 | 720 × 755 | 100 % |
| 430 × 932 | 900 × 1400 | 430 × 464.42 | 69.43 % | 1920 × 1080 | 398 × 223.88 | 398 × 558.2 | 100 % |
| 390 × 844 | 900 × 1400 | 390 × 489.22 | 80.64 % | 1920 × 1080 | 358 × 201.38 | 358 × 571.31 | 100 % |
| 360 × 800 | 900 × 1400 | 360 × 489.22 | 87.36 % | 1920 × 1080 | 328 × 184.5 | 328 × 554.44 | 100 % |
| 320 × 568 | 900 × 1400 | 320 × 514.02 | 96.84 % | 1920 × 1080 | 288 × 162 | 288 × 531.94 | 100 % |

## Logo

Den eksisterende logoens symbol og ordmerke er beholdt. SVG-canvas er strammet inn fra 340 × 72 til viewBox 244 × 60, og eksisterende tagline er økt til 9,5 SVG-enheter med mørkere gullfarge for lesbarhet. Headeren bruker clamp-bredde; ingen ny logo er tegnet.

| Viewportbredde | Rendered logo | Headerhøyde | Tagline, omregnet skriftstørrelse |
|---|---|---|---|
| 1366 | 289.86 × 71.27 | 85 px | 11.29 px |
| 1920 | 321.44 × 79.03 | 87.39 px | 12.51 px |
| 2560 | 357.91 × 88 | 109 px | 13.93 px |
| 3840 | 390 × 95.89 | 109 px | 15.18 px |
| 5120 | 390 × 95.89 | 109 px | 15.18 px |

Mobil er kompakt: logo 198 × 48,69 px og header 67 px ved 320–430. Desktopverdiene er visuelt kontrollert i skjermbildene.

## Infobokser

Før: 143 bokselementer i statisk HTML på 123 sider. Etter: 5. **138 store bokser er fjernet fra utformingen: 58 tekster er fjernet, 80 er omgjort til korte kilde-/statuslinjer eller vanlig veiledning.** Dette er ikke en blind sletting av innhold.

De fem beholdte er:

- Affiliateforklaringen på affiliate-info.html.
- Ett konkret startråd i guider/hva-er-discgolf.html.
- Diskvelgerens JavaScript-fallback, bare synlig uten JavaScript.
- Flight Visualizers beskjed om importerte URL-verdier, bare ved gyldig forhåndsutfylling.
- Flight Visualizers korte avklaring om forenklet flyvebane.

Normal browser-DOM har fire slike elementer fordi noscript-innholdet ikke parses som vanlige elementer med JavaScript på. Kun tre av dem er ordinært synlige uten forhåndsutfylling. Rule-/banestatus og vurderingsgrunnlag er bevart som relevant kort tekst. Urelatert klubb-/turneringsprosessinfo på teknikk-, trenings- og policy-sider er fjernet.

Utstyr har ikke lenger den grønne provisjonsboksen, den separate metodeboksen eller affiliateprat i ingressen. Tester leder til guider og sammenligninger fremfor en metodepanel. Intern e-post-/vedlikeholdsprosess på Om/Kontakt og feil beskjed om at simulatoren ikke er klar er fjernet. Alle 158 sider har nå footerlenke til åpenhet eller retningslinjer. Ingen faktisk affiliate-URL er aktivert, og kilde-/ikke fysisk testet-merking ved relevante vurderinger er bevart.

## Visuell vurdering

11 heroer × 16 viewports = 176 etterbilder og målinger. Alle 11 matriser er gjennomgått visuelt, i tillegg til store enkeltbilder av Utstyr og tablet/mobil. Nettleser: Edge/Chromium, DPR 1, lokal server på 127.0.0.1:8000.

| Hero | Vurdering etter korreksjon |
|---|---|
| Forside | Spiller, kast og kurv er synlige. Mobil bruker den eksisterende, liggende mobilkomposisjonen med nærmere spiller. Teksten ligger utenfor motivet. |
| Nybegynner | Hodet og disken er innenfor bildet på alle størrelser; ingen stor torso fra portrett-crop på tablet. |
| Utstyr | Helt hode, disk og begge hender synlige. Kastebevegelsen beholder plass rundt motivet, også på tablet og mobil. |
| Tester | Hele hodet, hendene og begge diskene er synlige. H1 og CTA dekker ikke testaktiviteten. |
| Artikler | Rolig landskap med synlig spiller og hel kurv. Ingen tekst ligger over kurven. |
| Teknikk | Hode, kastearm, disk og den andre hånden er synlige. Landskapsvarianten erstatter portrettfilene som allerede kuttet kastearmen. |
| Regler | Spiller og kurv beholdes sammen, uten avkappet hode eller kurvtopp. |
| Baner | Kurvtoppen, kjettingene og fangkurven er hele. Landskap og sekundær person beholdes. |
| Verktøy | Bruker den eksisterende Utstyr-komposisjonen med komplett hode, hender og disk; den gamle filens halve kropp er valgt bort. |
| Diskvelger | Bevisst detaljmotiv med hånd og hel disk. Bildet er ikke ment som et helfigurportrett. Ingen ny beskjæring nederst. |
| Flight Visualizer | Bruker eksisterende Forside-komposisjon med kast og flyvende disk. Den tidligere avskårne personen langs høyrekanten er valgt bort. |

| Viewportgruppe | Visuell vurdering |
|---|---|
| 5120 × 1440, 3840 × 2160, 3440 × 1440, 2560 × 1440 | Sentrert komposisjon med full bildehøyde; ingen overzoom eller beskårne primærmotiver. |
| 1920 × 1080, 1600 × 900, 1440 × 900, 1366 × 768, 1280 × 800, 1024 × 768 | Tekst og foto side om side. Ingen motiv under tekst. Naturlig skalering uten cover-crop. |
| 820 × 1180, 768 × 1024 | Tekst over foto; landskapsvarianten beholder hode, hender, disk og kurv. Ingen portrett-zoom. |
| 430 × 932, 390 × 844, 360 × 800, 320 × 568 | Separat motivflate uten mørkt tekstoverlegg. Knapper får bryte til ny rad ved behov. På 320 px kan hele heroen kreve litt scrolling; bildet er ikke kuttet for å tvinge alt over bretten. |

## Teknisk QA og begrensninger

- Ingen hero-bilde-404 eller konsollfeil i 176 kombinasjoner; ingen tekst/bilde-overlapp eller hero/header-overflow. Naturlig bildeaspekt innenfor 0,03 CSS-piksels avrunding.
- Alle 158 HTML-sider er lastet i nettleser ved 390 px: ingen konsollfeil, 404, utilsiktet overflow eller tomme seksjoner. Tabeller som tidligere utvidet hele artikkelgridet ruller nå internt.
- Diskvelger fullført og startet på nytt ved 390 og 1366, med overgang til simulator og kontroll av alle fire flight-parametere. Preset, mobilmeny/Escape og noscript-fallback er prøvd.
- Diskvelgerens første spørsmål finnes nå i HTML og erstattes med interaktive kontroller ved modulstart. Dette fjernet målt oppstarts-CLS (tidligere opptil ca. 0,201). Ved endring av første spørsmål i disk-selector-data.js må den statiske førstevisningen oppdateres samtidig.
- Etter retesting: ingen registrerte oppstartsskift på de ti hero-sidene utenom Flight Visualizer. Simulatoren har fortsatt små skift fra dynamisk verktøyinnhold, høyeste måling 0,01031. Dette er labmålinger ved første lasting, ikke feltdata for Core Web Vitals.
- Canonical, sitemap og eksisterende JSON-LD er bevart. Native Safari/Firefox og langvarig feltmåling inngår ikke i denne lokale QA-en.

## Analytics og Search Console

Se [analytics.md](analytics.md). Cloudflare-snippet mangler; ingen analytics-script er installert, og ingen testtrafikk er bekreftet. Dokumentasjonen dekker dashboard, sidevisninger/besøk, referrers, populære sider, land/enhet, begrensninger, personvern og aktiverings-QA. UTM er en navnestandard for senere kampanjemåling, ikke en funksjon som påstås aktiv i Cloudflare.

Search Console-kontostatus er uverifisert. Repoet har ingen verification-meta/-fil; robots og sitemap er kontrollert. Eier må kontrollere eksisterende property eller hente Googles eksakte DNS-verifisering, sende inn sitemap og åpne Ytelse → Søkeresultater. Ingen konto eller DNS er endret.

## Bevisfiler

Skjermbilder, før/etter-viser, måledata, interaksjonskontroll og full filliste ligger lokalt i:

`C:/Users/sven_/.codex/visualizations/2026/09/06/01a07587-0b6d-79b2-b8a0-d81d350e9d8a/hero-b/`

Åpne index.html for sammenligning med stopp A. metrics.json har eksakte dimensjoner per side/viewport, page-qa.json har alle 158 sidekontrollene, interaction-qa.json har verktøytestene, og technical-qa.json har sluttkommandoenes utdata. Disse QA-filene er ikke en del av nettstedet.
