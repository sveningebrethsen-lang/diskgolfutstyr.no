# Fase 23C: Manuell researchpilot for fem baner

Sist oppdatert: 2026-09-28

Denne piloten tester Course Schema V1, kildemodellen, `field_sources` og publiseringsporten på fem eksisterende baneprofiler. Ingen nye baner eller HTML-sider er opprettet.

## Pilotutvalg

| Område | Valgt bane | Hvorfor |
|---|---|---|
| Krokhol | Krokhol Disc Golf Course | Egen operatørside med booking- og tilgangsinformasjon |
| Oslo | Klemetsrud diskgolfbane | Klemetsrud IL har en detaljert baneside og oppdatert banekart |
| Trondheim | Dragvoll Diskgolfpark | Trondheim Frisbeeklubb beskriver hull, layout, sesong og drift |
| Kristiansand | Sukkevann Frisbeegolfpark | Eksisterende profil; god sekundær dokumentasjon, men utilgjengelig klubbside |
| Grenland | Kjølnes-banen | Porsgrunn Disksportklubb har en konkret operatørside med hull, par og parkering |

## Resultat

`Required coverage` måler de åtte etterspurte researchfeltene: navn, status, kommune, fylke, breddegrad, lengdegrad, koordinatpresisjon og kontrolldato. `Recommended coverage` måler åtte redaksjonelle grupper: hull, layout/status, terreng, sesong, pris/tilgang, operatør/klubb, offisiell URL og nybegynnervurdering.

`Unknown` teller mangler i en fast kontrolliste med åpningstid, booking, sesong, pris, parkering, toalett, treningskurv, vanskelighetsgrad, nybegynner-/familievurdering og offisielle/klubblenker. Tallet er et arbeidsmål, ikke en del av V1-porten.

| Bane | Primærkilder | Sekundærkilder | Required | Recommended | Unknown | Validator | Gate ready | Publishable |
|---|---:|---:|---:|---:|---:|---|---|---|
| Krokhol Disc Golf Course | 2 | 1 | 8/8 | 8/8 | 4 | 0 error / 0 warning / 1 info | Ja | Nei, legacy |
| Klemetsrud diskgolfbane | 1 | 1 | 8/8 | 8/8 | 5 | 0 error / 0 warning / 1 info | Ja | Nei, legacy |
| Dragvoll Diskgolfpark | 1 | 1 | 8/8 | 8/8 | 2 | 0 error / 0 warning / 1 info | Ja | Nei, legacy |
| Sukkevann Frisbeegolfpark | 0 | 3 | 8/8 | 4/8 | 6 | 0 error / 5 warning / 1 info | Nei | Nei |
| Kjølnes-banen | 1 | 1 | 8/8 | 7/8 | 4 | 0 error / 0 warning / 1 info | Ja | Nei, legacy |

Alle fem postene har fortsatt `editorial.legacy: true` og `publication_status: published_legacy`. Derfor rapporterer validatoren `publishable: false` selv for de fire postene som er `gate_ready`. Publisert innhold er ikke endret i denne fasen.

## Verifiserte fakta

### Krokhol Disc Golf Course

- Operatørens side bekrefter navn, adresse, dedikert anlegg, krevende layout, terreng og fasiliteter: <https://krokholdgc.no/>.
- Booking-siden bekrefter obligatorisk booking og gjeldende prismodell: <https://krokholdgc.no/booking-info>.
- UDisc ble brukt manuelt for 18 hull, baneplasspunkt, parkering og toalett: <https://udisc.com/courses/krokhol-disc-golf-course-TKtF>.
- Nybegynnervurderingen er `false` fordi operatøren selv beskriver vann, store høydeforskjeller, tette skogshull og lange åpne hull som en krevende layout.

### Klemetsrud diskgolfbane

- Klemetsrud IL bekrefter navn, plassering i Klemetsrud idrettspark, 18 hull, skogsbane, åpen tilgang og frivillig vedlikeholdsbidrag: <https://www.klemetsrudil.no/diskgolf/>.
- Klubbens side lenker til et banekart for 2026 og viser aktiv drift.
- UDisc ble brukt manuelt for baneplasspunkt, vinterstatus, toalettbegrensning og vanskelighetsgrad: <https://udisc.com/courses/klemetsrud-diskgolfbane-qVbT>.

### Dragvoll Diskgolfpark

- Trondheim Frisbeeklubb bekrefter offisielt navn, 18 hull, én layout, plassering rundt NTNU, flerbrukshensyn og normal vinteråpning: <https://www.trondheimfrisbeeklubb.no/discgolf/>.
- UDisc ble brukt manuelt for baneplasspunkt, gratis teetidsregistrering, kveldsbegrensning, parkering, toalett og vanskelighetsgrad: <https://udisc.com/courses/dragvoll-diskgolfpark-J0NI>.
- Navnet i datasettet er rettet fra «Dragvoll Diskgolfarena» til operatørens «Dragvoll Diskgolfpark». Stabil id og slug er beholdt.

### Sukkevann Frisbeegolfpark

- PDGA-katalogen ble kontrollert manuelt for adresse, terreng og presist førstetee-koordinat: <https://www.pdga.com/course-directory/course/sukkevann-frisbeegolfpark-27-holes>.
- UDisc ble kontrollert manuelt for 27 installerte hull, flere layouter, tilgang, fasiliteter og layoutavhengig vanskelighetsgrad: <https://udisc.com/courses/sukkevann-frisbeegolfpark-HxwG>.
- Vårslippen 2026 dokumenterer aktiv turneringsbruk og Sukkevann Frisbeeklubb som arrangør: <https://www.discgolfscene.com/tournament/Varslippen_2026>.
- Den tidligere feilaktige UDisc-lenken til Lillesand er erstattet med korrekt baneprofil.
- Klubbens eget domene var ikke tilgjengelig under kontrollen. Ingen sekundærkilde er oppgradert til primærkilde for å omgå porten.

### Kjølnes-banen

- Porsgrunn Disksportklubb bekrefter offisielt navn, Porsgrunn-adresse, aktiv bane, 18 hull, par 54, parkering ved hull 1 og flerbrukshensyn: <https://www.pdsk.no/next/p/78405/kjolnes>.
- UDisc ble brukt manuelt for baneplasspunkt, gratis tilgang/frivillig greenfee, terreng, toalett og vanskelighetsgrad: <https://udisc.com/courses/porsgrunn-kjolnes-XKUD>.
- Navnet i datasettet er rettet til klubbens «Kjølnes-banen». Stabil id og slug er beholdt.

## Kildekonflikter

| Bane | Konflikt | Behandling |
|---|---|---|
| Sukkevann | PDGA og UDisc viser 27 installerte hull, mens navngitte standard-/konkurranselayouter har 18 hull | `holes: 27` beskriver anlegget. Konflikten og 18-hullsoppsettene er dokumentert i `editorial.notes`; ingen layout er fremstilt som hele anlegget |
| Kjølnes | Legacy-data kalte banen «lett», mens nåværende UDisc-side klassifiserer den som «moderat» | Oppdatert til «Moderat» med fersk sekundærkilde; nybegynnervurderingen har eget grunnlag |
| Dragvoll | Legacy-navnet var «Dragvoll Diskgolfarena», mens klubb og UDisc bruker «Dragvoll Diskgolfpark» | Navnet er korrigert; id, slug og publisert URL er ikke endret |

## Koordinater

| Bane | Latitude | Longitude | Presisjon | Kilde og begrunnelse |
|---|---:|---:|---|---|
| Krokhol | 59.80289655805656 | 10.926047017006706 | `course_center` | UDisc sitt baneplasspunkt; ikke dokumentert som første tee |
| Klemetsrud | 59.83211054150041 | 10.858167457214478 | `course_center` | UDisc sitt baneplasspunkt; ikke dokumentert som første tee |
| Dragvoll | 63.406616008423484 | 10.47384286943275 | `course_center` | UDisc sitt baneplasspunkt; ikke dokumentert som første tee |
| Sukkevann | 58.152508520794 | 8.090799927715 | `first_tee` | PDGA-katalogen merker koordinatet eksplisitt som «First Tee» |
| Kjølnes | 59.14265198173794 | 9.6636972219261 | `course_center` | UDisc sitt baneplasspunkt; ikke dokumentert som første tee |

Ingen OSM-data er importert eller brukt som autoritativ kilde.

## Researchtid

Tidene er omtrentlige aktive arbeidstider for kildefunn, manuell kontroll, feltkobling og vurdering. Felles script- og QA-kjøring er ikke fordelt på enkeltbaner.

| Bane | Tid | Kilder | Verifiserte researchgrupper | Ukjente kontrollfelt |
|---|---:|---:|---:|---:|
| Krokhol | 18 min | 3 | 16 | 4 |
| Klemetsrud | 16 min | 2 | 16 | 5 |
| Dragvoll | 15 min | 2 | 16 | 2 |
| Sukkevann | 24 min | 3 | 12 | 6 |
| Kjølnes | 17 min | 2 | 15 | 4 |
| **Gjennomsnitt** | **18 min** | **2,4** | **15** | **4,2** |

Direkte research for 100 baner vil med dette snittet kreve omtrent 30 timer. Med redaksjonell kontroll, konflikthåndtering, QA og oppfølging av utilgjengelige primærkilder er et mer realistisk arbeidsestimat 40–55 timer. Baner uten operatørside vil kreve mest tid og kan fortsatt ende uten publiseringsklar status.

## Evaluering av Schema V1

### Det som fungerte

- Kildeprioritet og eksplisitt `automation_allowed` hindret at UDisc ble behandlet som automatisk eller autoritativ datakilde.
- `field_sources` gjorde det mulig å se hvilke fakta som hadde operatørstøtte, og hvilke som bare hadde sekundærkontroll.
- Koordinatpresisjon hindret at fire generelle baneplasspunkt ble fremstilt som første tee.
- Gate-regelen stoppet Sukkevann på riktig grunnlag da primærkilden ikke kunne kontrolleres.
- Legacy-beskyttelsen hindret utilsiktet avpublisering mens data ble forbedret.

### Friksjon og mangler

- `holes` er ett tall og kan ikke skille installerte kurver fra 18-hulls layouter. Sukkevann viser behovet tydelig.
- `beginner_friendly` og `family_friendly` er globale boolske felt. Sukkevann er nybegynnervennlig på kortsløyfen, men ikke nødvendigvis på hovedlayouten.
- `assessment_basis` er én fritekststreng. Modellen kan ikke lagre vurderingsverdi, begrunnelse, scope, kilde og sikkerhetsnivå separat.
- Kildekonflikter kan bare legges i `editorial.notes`; de mangler strukturert status, berørte felt og beslutning.
- `field_sources` har ingen kontrollert liste over feltnøkler. Det gir fleksibilitet, men også risiko for ulik navngiving.
- Koordinatkilden kobles i dag til den brede gruppen `location`; kilden til selve koordinatet burde kunne identifiseres separat.
- Operatør/klubb er ikke et eget datafelt. Det utledes indirekte fra lenker og kildenes publisher.
- Offisiell idrettsorganisasjon og offisiell arrangørside er ikke egne kvalifiserte kildetyper. Det er konservativt, men gir friksjon når klubbside mangler.
- `practice_basket` ligger i validatorens recommended coverage, mens researchbriefen klassifiserer feltet som optional.
- `content_last_updated_at` er nødvendig redaksjonelt, men lett å forveksle med datakontroll. I denne piloten er datoen bevisst ikke oppdatert fordi HTML ikke ble endret.
- En ferdig researchpilot forblir `publishable: false` så lenge `legacy` er true. `gate_ready` fungerer, men V1 mangler en eksplisitt, kontrollert overgang fra legacy til ny status.

### Er porten for streng eller svak?

- **Passe streng for nye sider:** Sukkevann blir korrekt stoppet uten kontrollerbar primær-/åpen kilde.
- **For uklar for legacy-overgang:** Fire poster passerer alle gatekrav, men kan ikke bli `publishable` uten at `legacy` manuelt endres. En eksplisitt review-overgang mangler.
- **Potensielt for svak på enkelte fakta:** Porten krever ikke at hull, koordinater eller nybegynnervurdering hver for seg har kvalifisert kilde. Tre andre kvalifiserte faktagrupper kan være nok.
- **Potensielt for svak på vurderinger:** Validatoren kontrollerer ikke at en boolsk egnethetsvurdering har strukturert begrunnelse eller riktig scope.

## Forslag til V1.1

Forslagene er ikke implementert i denne fasen.

1. Legg til `layouts[]` med `name`, `holes`, `status`, `difficulty`, `beginner_friendly` og egne `field_sources`.
2. Bytt egnethetsbooler til objekter med `value`, `rationale[]`, `scope`, `confidence` og `checked_at`.
3. Legg til `source_conflicts[]` med felt, kildeverdier, beslutning, begrunnelse og dato.
4. Legg til egne felt for `operator`, `public_transport`, `accessibility` og `dog_policy`.
5. Tillat presise kildekoblinger som `location.coordinates` og `location.coordinate_precision`.
6. Innfør kontrollert overgang `published_legacy -> review -> publishable/published` når `gate_ready` er true og redaktør har godkjent posten.
7. Skill `gate_ready` tydelig fra `publishable` i rapporter og køer.
8. Avklar om offisiell idrettsorganisasjon eller arrangørside kan kvalifisere med en streng `qualification`-regel.
9. Flytt `practice_basket` fra recommended til optional, eller oppdater researchpolicyen så nivåene samsvarer.
10. Legg til researchstatus per post i P1-køen, slik at ferdig kontrollerte baner ikke ser ut som ubehandlet arbeid.

## Anbefaling for Fase 23D

Ikke skaler til 100 baner før V1.1-beslutningene om layouter, egnethetsvurdering, konflikter og legacy-overgang er tatt. Neste fase bør:

1. vedta et minimalt V1.1-schema for disse fire problemene;
2. migrere bare de fem pilotpostene til V1.1;
3. kjøre samme validator og redaksjonelle kontroll på nytt;
4. teste en ny pakke på 10 baner med både gode og svake primærkilder;
5. først deretter anslå full nasjonal utrulling.
