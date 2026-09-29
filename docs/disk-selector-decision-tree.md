# Diskvelger: beslutningstre

Sist oppdatert: 29. september 2026 (24C). Erstatter first-match-modellen fra 18C. Reglene er redaksjonelle startpunkter, ikke en vitenskapelig kalibrert produktanbefaling.

## Inndata og betingelser

Fem faste spørsmål: erfaring, vanlig kastelengde, kastestil, mål og problem. Kastelengde har nå «Vet ikke ennå». Problemer skiller tidlig venstre/høyre fra hard avslutning venstre/høyre, samt stall, kort, linje og ukjent.

Hånd spørres kun ved et av de fire retningsproblemene og når målet ikke er putting. Ved «begge» spørres først hvilket kast problemet gjelder. Det gir fem, seks eller syv spørsmål. Endring av kastestil, mål eller problem sletter gamle betingede svar. Ingen sidebestemt diagnose uten kjent hånd og aktuell kastestil.

## Regelrekkefølge

| Prioritet | Betingelse | Valg |
|---|---|---|
| 1 | Mål putting | Nøytral putter; ignorér driveproblem i vurderingen |
| 2 | Mål innspill | Putter til kast/innspill, også for erfarne langtkastere |
| 3 | Aldri spilt/nybegynner + under 50 eller ukjent lengde | Putter til kast/innspill som konservativ start |
| 4 | Har spilt mer enn nybegynnernivå + minst 70 m + mål lengde/kontroll + ikke stall | Fairway-familien |
| 5 | Ellers | Midrange-familien |
| 6 | Innen familien: tidlig sving i turn-retningen | Nøytral, ikke ekstra understabilitet |
| 7 | Ellers: hard avslutning i fade-retningen, mål enklere kast, eller lengdemål med backhand | Lett understabil |
| 8 | Ellers | Nøytral |

Forehand velger ikke automatisk en overstabil disk. Lengdemål med forehand får nøytral profil med råd om grep/slipp, mens backhand normalt får litt turn. Ved kjent hard fade kan begge få mindre fade/litt turn. «Begge» uten retningsproblem får et nøytralt kompromiss og råd om å prøve begge kast.

Stall holder anbefalingen i midrange-familien etter spesialmål/nybegynnerstart og forklares med mulig høy forkant. Kort kast alene blokkerer ikke en erfaren langtkasters fairway. Linjebom gir råd om sikte/slipp, ikke automatisk mer understabilitet. Alle problemforklaringer har teknikkforbehold.

Ukjent lengde blir aldri tolket som et målt antall meter. Ny spiller får putter; andre får midrange dersom ikke putting/innspill allerede bestemmer rollen.

## Profiler

| ID | Kategori | Speed | Glide | Turn | Fade | Eksempel |
|---|---|---|---|---|---|---|
| putter | Nøytral putter | 2–3 | 3–5 | -1–0 | 0–1 | Aviar Putt & Approach |
| approach | Putter til kast/innspill | 2–4 | 3–5 | -1–0 | 0–1 | Aviar Putt & Approach |
| neutralMid | Nøytral midrange | 4–5 | 4–5 | -1–0 | 0–1 | Mako3 |
| easyMid | Lett understabil midrange | 4–5 | 5–6 | -2–-1 | 0–1 | Fuse |
| neutralFairway | Nøytral fairway | 6–9 | 4–7 | -1–0 | 1–2 | S-Line FD |
| easyFairway | Lett understabil fairway | 6–9 | 5–6 | -2–-1 | 1–2 | Neo Essence |

Tallgrenser er anbefalingsregler, ikke produsentfakta om alle disker i kategorien. Se [kildekontrollen](disc-tools-example-sources.md) for produsenttall og endringene i alle 16 tidligere eksempler.

## Retning, overføring og evidens

Felles `verktoy/flight-core.js` definerer RHBH/LHFH: turn høyre, fade venstre; LHBH/RHFH: turn venstre, fade høyre. Sett fra kasteren langs kastelinjen. Diskvelger bruker bare sidepiler når konteksten er kjent, ellers nøytral indikator og forklaring om hånd/kastestil.

Simulatorlenken sender fire representative heltall, eksplisitt `origin=selector`, kastestil når kjent og hånd når kjent. «Begge» bruker problemmets kastestil dersom den ble avklart; ellers beskrives backhand som illustrasjonsstandard. Ukjent hånd merkes som høyrehendt illustrasjonsstandard, ikke som et innhentet svar.

Resultatets interne `evidence` skiller produsenteksempler (FACT), redaksjonell regelanbefaling (RULE-BASED RECOMMENDATION) og pedagogisk flight (PEDAGOGICAL EXPLANATION). UI hevder aldri fysisk test.

## Testfordeling

Før: 2700 faste kombinasjoner. Etter: 4320 grunnkombinasjoner, som med relevante hånd-/kastavklaringer gir 7320 fullstendige svarløp. Dette er uttømmende kombinasjonstesting, ikke faktisk brukerfordeling eller trafikkdata. Prosentene er ikke direkte sammenlignbare fordi svarrommet er endret.

| Før | Antall | Andel |
|---|---:|---:|
| Putter/lett midrange | 738 | 27,3 % |
| Nøytral putter | 450 | 16,7 % |
| Understabil midrange | 1431 | 53,0 % |
| Stabil midrange/rolig fairway | 18 | 0,7 % |
| Forehand-gren | 9 | 0,3 % |
| Kontrollert fairway | 54 | 2,0 % |

| Etter | Antall | Andel |
|---|---:|---:|
| Putter til kast/innspill | 2024 | 27,7 % |
| Nøytral putter | 720 | 9,8 % |
| Lett understabil midrange | 1629 | 22,3 % |
| Nøytral midrange | 2209 | 30,2 % |
| Lett understabil fairway | 243 | 3,3 % |
| Nøytral fairway | 495 | 6,8 % |

Alle seks profiler er nå reelt tilgjengelige. Fairway forblir begrenset med hensikt: bare mål lengde/kontroll, kjent distanse, tilstrekkelig erfaring og ingen stall. Ingen terskel er justert for å oppnå en ønsket prosentfordeling.

## Vedlikehold

Kjør `node scripts/test-disc-tools.mjs` ved endringer. Testen sjekker alle svarløp, 12 navngitte profiler, intervallparitet for eksempler, speiling, URL-validering og 4116 flight-profiler i fire orienteringer.

Se [24C-rapporten](disc-tools-p0-hardening-24c.md) for nettleser-QA og gjenstående P1. Ingen power, vind, release angle, slitasjemodell, sammenligning, produktmatching eller affiliate er lagt til.
