# Diskvelger: roadmap

Sist oppdatert: 29. september 2026

## Status etter 24C

Betinget hånd/kastavklaring, skille mellom tidlig sving og sen avslutning, ukjent kastelengde, revidert regelmodell og parameteroverføring til Flight Visualizer er implementert. Se [gjeldende beslutningstre](disk-selector-decision-tree.md) og [24C-rapport](disc-tools-p0-hardening-24c.md). P1 er nå kortere vei til grafen, kortere resultatvisning og brukertest på fysisk mobil. Produktmodell, vind, vinkler, sammenligning og deling nedenfor er muligheter, ikke godkjent implementeringsplan.

Diskvelgeren er første interaktive verktøy på Diskgolfutstyr.no. Første versjon skal være enkel, forståelig og trygg for nybegynnere. Denne roadmapen beskriver mulige forbedringer uten å innføre backend, database eller API i nærmeste fase.

## Prinsipper

- Kvalitet før flere valg.
- Ikke gi falsk presisjon.
- Ikke anbefal konkrete produkter som "testet" uten fysisk test.
- Skill tydelig mellom eksempler, research og faktisk test.
- Hold verktøyet raskt på mobil.

## Fase 1: Bedre diskmodell

Legg inn et statisk datasett med faktiske diskmodeller.

Mulige felt:

| Felt | Eksempel |
|---|---|
| Navn | Innova Leopard |
| Type | Fairway-driver |
| Speed/glide/turn/fade | 6 / 5 / -2 / 1 |
| Stabilitet | Understabil |
| Anbefalt nivå | Nybegynner / hobby / viderekommen |
| Kastestil | Backhand, forehand, begge |
| Kommentar | Lettkastet kontroll-driver |
| Status | Eksempel, research-basert, fysisk testet |

Viktig: konkrete disker skal merkes som eksempler eller research-basert til de faktisk er testet.

## Fase 2: Kastelengde-optimalisering

Gjør anbefalingen mer presis basert på faktisk kastelengde.

Mulige forbedringer:

- Under 50 m: putter / lett midrange.
- 50-70 m: midrange, eventuelt veldig lett fairway.
- 70-90 m: midrange eller rolig fairway-driver.
- 90-110 m: fairway-driver, eventuelt kontrollert distance driver for erfarne.
- 110 m+: mer nyansert driveranbefaling.

Dette bør fortsatt presenteres enkelt, ikke som en avansert kalkulator.

## Fase 3: Flysimulator

Koble diskvelgeren mot `/verktoy/flysimulator/`.

Simulatoren kan bruke:

- Speed
- Glide
- Turn
- Fade
- Kastestil
- Vind
- Nose angle
- Hyzer
- Anhyzer

Første versjon bør være pedagogisk, ikke en fysisk nøyaktig simulator.

## Fase 4: Vind

Legg til et enkelt spørsmål:

"Spiller du ofte i vind?"

Mulige valg:

- Lite vind
- Motvind
- Medvind
- Sidevind
- Vet ikke

Effekt:

- Motvind kan gi litt mer stabil anbefaling.
- Medvind kan tillate mer understabil disk.
- Sidevind bør forklare risiko og kontroll.

## Fase 5: Hyzer og anhyzer

Mulig fremtidig vinkelveiledning etter resultatet. Eksemplene nedenfor gjelder kun høyrehendt backhand og må speiles for andre rotasjoner:

- Hvis disken går hardt venstre: prøv roligere disk eller mindre hyzer.
- Hvis disken brenner høyre: prøv mer hyzer, roligere kast eller mer stabil disk.
- Hvis disken staller: sjekk nose angle og diskens speed.

Dette bør kobles til teknikkartiklene.

## Fase 6: Høyre-/venstrehendt

Implementert betinget i 24C ved retningsavhengige problemer:

- Høyrehendt
- Venstrehendt

Felles retningsfunksjon brukes av begge verktøyene. Ingen hånd antas som et faktisk brukersvar.

## Fase 7: Delbare resultater

Mulige løsninger uten backend:

- URL-parametere med svarene.
- Kopier resultattekst.
- Del-knapp via Web Share API der nettleseren støtter det.

Krav:

- Ikke samle persondata.
- Ikke lagre svar eksternt.
- Funger uten innlogging.

## Fase 8: Favoritter

Mulig statisk løsning:

- Lagre favoritter i `localStorage`.
- Merk tydelig at data bare lagres i brukerens nettleser.
- Ikke send data til server.

Favoritter kan brukes til:

- Lagre anbefalt kategori.
- Lagre eksempeldisker.
- Sammenligne 2-3 disker senere.

## Prioritert neste arbeid

| Prioritet | Tiltak | Hvorfor |
|---|---|---|
| Utført 24C | Betinget høyre-/venstrehendt forklaring | Gjør venstre/høyre-problemer mer presise |
| Utført 24C | Skill "for lite lengde" fra "vil optimalisere lengde" | Unngår for konservative anbefalinger for viderekomne |
| Middels | Koble til statisk diskdatasett | Gir mer konkrete anbefalinger |
| Middels | Enkel URL-deling | Nyttig for forum, venner og klubbmiljø |
| Lav | Favoritter | Praktisk, men ikke nødvendig for MVP |

## Hva som ikke bør gjøres ennå

- Ikke legg inn produktpriser.
- Ikke legg inn affiliate-lenker i selve resultatet.
- Ikke påstå at eksempeldisker er testet.
- Ikke bygg konto/innlogging.
- Ikke bygg database.
- Ikke gjør simulatoren for kompleks før pedagogikken er tydelig.
