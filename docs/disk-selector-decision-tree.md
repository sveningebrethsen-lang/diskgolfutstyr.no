# Diskvelger: beslutningstre

Sist oppdatert: 15. juli 2026

Dette dokumentet beskriver logikken i Diskgolfutstyr sin diskvelger. Målet er at reglene skal være enkle å forstå, teste og endre senere.

## Inndata

Diskvelgeren bruker fem svar:

| Felt | Verdier | Brukes til |
|---|---|---|
| Erfaring | Aldri spilt, nybegynner, litt erfaring, viderekommen, erfaren | Hvor konservativ anbefalingen skal være |
| Kastelengde | Under 50 m, 50-70 m, 70-90 m, 90-110 m, 110 m+ | Om spilleren bør holde seg til putter/midrange eller kan få fairway-driver |
| Kastestil | Backhand, forehand, begge | Om forehand bør få litt mer stabilitet |
| Mål | Lengde, kontroll, rettere kast, enklere kast, putting, innspill | Hvilken diskrolle som prioriteres |
| Problem | Venstre, høyre, stall, kort, linje, vet ikke | Justerer stabilitet og konservativitet |

## Prioritert beslutningslogikk

Reglene kjøres i denne rekkefølgen. Første treff vinner.

| Prioritet | Regel | Resultat | Hvorfor |
|---|---|---|---|
| 1 | Målet er bedre putting | Nøytral putter | Putting bør ikke løses med driver eller midrange |
| 2 | Målet er bedre innspill | Putter eller lett midrange | Innspill handler mest om kontroll og lav fart |
| 3 | Ny spiller og kast under 70 m | Putter eller lett midrange | Nye spillere lærer mer av sakte disker |
| 4 | Ny spiller, kortkastende spiller, kontrollmål, rettere kast, enklere kast, stall, venstrefade eller for lite lengde | Understabil midrange | Trygg standardanbefaling for de fleste nye/hobbyspillere |
| 5 | Kaster 90 m+ og vil ha mer lengde | Kontrollert fairway-driver | Fairway-driver gir mer lengde uten å hoppe rett til distance driver |
| 6 | Forehand som ikke er fanget av tidligere regler | Stabil midrange eller fairway-driver | Forehand tåler ofte litt mer stabilitet |
| 7 | Fallback | Stabil midrange eller rolig fairway-driver | Trygt alternativ for viderekomne profiler uten tydelig spesialbehov |

## Resultatkategorier

| Resultat | Typisk flight-område | Eksempelbruk |
|---|---|---|
| Nøytral putter | Speed 2-3, glide 3-5, turn 0 til -1, fade 0-1 | Putting, korte innspill, rolig teknikktrening |
| Putter eller lett midrange | Speed 3-5, glide 4-5, turn -1 til 0, fade 0-1 | Første runder, innspill, korte hull |
| Understabil midrange | Speed 4-6, glide 5-6, turn -2 til -1, fade 0-2 | Rette kast, hyzerflip, skogshull, kontroll |
| Kontrollert fairway-driver | Speed 7-9, glide 5-6, turn -2 til -1, fade 1-2 | Lengde med kontroll for spillere som kaster ca. 90 m+ |
| Stabil midrange eller fairway-driver | Speed 5-8, glide 4-5, turn -1 til 0, fade 1-2 | Forehand og kontrollkast med mer stabilitet |
| Stabil midrange eller rolig fairway-driver | Speed 5-7, glide 5-6, turn -2 til -1, fade 1-2 | Fallback for viderekomne profiler |

## Kombinasjoner og regelvalg

| Kombinasjon | Regel som treffer | Kommentar |
|---|---|---|
| Aldri spilt + under 50 m | Regel 3 | Veldig konservativt med putter/lett midrange |
| Nybegynner + 50-70 m + rettere kast | Regel 3 | Kort kastelengde prioriteres før mål |
| Litt erfaring + 70-90 m + kontroll | Regel 4 | Understabil midrange er trygg kontrollanbefaling |
| Viderekommen + 90-110 m + lengde | Regel 5 hvis problemet ikke er stall/venstre/kort | Fairway-driver når spilleren allerede har nok fart |
| Viderekommen + 90-110 m + lengde + for lite lengde | Regel 4 | Konservativt valg fordi "for lite lengde" tolkes som mulig fart-/teknikkproblem |
| Erfaren + forehand | Regel 6 hvis tidligere regler ikke treffer | Gir mer stabilitet, men ikke ekstrem utility-disk |
| Putting som mål | Regel 1 | Overstyrer alle andre svar |

## Fallback

Fallback brukes bare når ingen tydelig nybegynner-, putting-, innspill-, kontroll-, lengde- eller forehandregel treffer. Den gir en stabil midrange eller rolig fairway-driver fordi dette er et trygt kompromiss.

## Reality check 18C

Testmotoren simulerte 60 konkrete profiler og gikk i tillegg gjennom alle 2700 mulige kombinasjoner.

| Resultat | Antall i alle kombinasjoner |
|---|---:|
| Putter eller lett midrange | 738 |
| Nøytral putter | 450 |
| Understabil midrange | 1431 |
| Stabil midrange eller rolig fairway-driver | 18 |
| Stabil midrange eller fairway-driver | 9 |
| Kontrollert fairway-driver | 54 |

## Kjente gule forbedringspunkter

| Funn | Status | Mulig senere justering |
|---|---|---|
| "For lite lengde" gjør anbefalingen konservativ og kan hindre fairway-driver for noen 90 m+ spillere | Gul | Skill mellom "for lite lengde fordi disken staller" og "jeg vil optimalisere lengde" |
| "Disken går til høyre" tolkes ikke separat i første MVP | Gul | Spør om spilleren er høyre-/venstrehendt og om kastet er backhand/forehand |
| Forehand-regelen kommer sent i treet | Gul | Vurder egen forehand-gren etter erfaring/kastelengde |
| Ingen vekt/plast/vind i modellen | Bevisst MVP-avgrensning | Legges i senere versjon |

Ingen røde logikkfeil ble funnet i 18C. MVP-en er bevisst konservativ for å unngå at nye spillere blir sendt til for raske disker.
