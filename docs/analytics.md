# Besøksstatistikk og trafikkilder

Sist kontrollert: 6. september 2026.

Fase 21A, stopp A: repoet er kontrollert fra UI-commit `071c9efaad8328b6e77ae023d6c933e2e072a31d`. Søk i implementasjonen fant ingen Cloudflare Web Analytics, Google Analytics, Google Tag Manager, Plausible, Umami, analytics-script, beacon, tracking-ID eller gtag. Treff på analytics i personvernsiden og generatoren beskriver bare mulig fremtidig bruk. Ingen Google-verifiseringsfil eller verification-meta ble funnet. Kontrollen gjelder repoet; Cloudflare-/Google-konto og DNS-verifisering er ikke kontrollert.

## Status

**Cloudflare Web Analytics er installert og publisert med commit `fbe4a9b6ac0ba1406ba614e1f142381fe910f856`.** Snippetet finnes én gang før `</body>` på hver av de 158 statiske HTML-sidene. Tokenet er offentlig klientkonfigurasjon, ikke en hemmelig API-nøkkel. GA4, GTM, Plausible og Umami er ikke installert.

Live-kontrollen i fase 21A bekreftet beacon HTTP 200 og innsamlingskall HTTP 204 på fem sider, uten konsollfeil. Eieren bekrefter i fase 22A, stopp C at trafikk vises i Cloudflare-dashboardet, og at Google Search Console Domain property er verifisert via DNS. Kontostatusen nedenfor bygger på eierens bekreftelse; agenten har ikke gjort en ny selvstendig dashboardkontroll.

GitHub Pages kan fortsatt brukes. Cloudflare Web Analytics støtter manuell installasjon uten Cloudflare-proxy eller flytting av domenets DNS. [Offisiell oppsettveiledning](https://developers.cloudflare.com/web-analytics/get-started/).

## Offisielt snippet og vedlikehold

1. Logg inn i [Cloudflare-dashboardet](https://dash.cloudflare.com/), og velg riktig konto.
2. Gå til **Web Analytics**. Kontroller først om `diskgolfutstyr.no` allerede er registrert, for å unngå en duplikat.
3. Hvis nettstedet mangler: velg **Add a site**, skriv `diskgolfutstyr.no`, velg vertsnavnet og fullfør.
4. Åpne **Manage site**, og kopier hele den offisielle JS-snippeten for manuell installasjon.
5. Ved fremtidig utskifting: bruk hele den offisielle snippeten. Eieren har allerede levert snippetet som nå er installert. Den offentlige verdien i `data-cf-beacon` er nødvendig klientkonfigurasjon og blir synlig i HTML. Et privat Cloudflare API-token, passord eller en kontonøkkel skal ikke deles eller legges i repoet.

Det leverte snippetet er lagt inn direkte før avsluttende `</body>` på alle offentlige HTML-sider. Ingen felles runtime-/footer-injeksjon er funnet. `type='module'`, script-URL og token er beholdt som levert. Modulscript lastes uten å blokkere HTML-parsingen og kjøres utsatt; det er ikke lagt til et eget `async`-attributt eller en ekstra scriptlaster. Se [MDN om script-elementet](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script).

Ved nye eller regenererte sider må samme snippet beholdes nøyaktig én gang. Eksisterende innholdsgeneratorer er engangsverktøy, ikke en felles publiseringsmal, og er ikke kjørt eller endret i denne fasen. Kontroller alltid hele HTML-omfanget etter regenerering. Ikke kombiner manuell innlegging med automatisk Cloudflare-injeksjon.

## Hvor statistikken finnes etter aktivering

Åpne **Cloudflare → Web Analytics → diskgolfutstyr.no** og velg perioden du vil undersøke. Bruk samme periode ved sammenligninger.

| Spørsmål | Visning / filter |
|---|---|
| Hvor stor er trafikken? | Page views og Visits, med utvikling over tid |
| Hvilke sider er mest besøkt? | Path, sortert på sidevisninger |
| Hvor kommer besøkene fra? | Referer / henvisende domene |
| Hvilke land kommer trafikken fra? | Country |
| Bruker besøkende mobil eller datamaskin? | Device type |
| Hvilke nettlesere brukes? | Browser og eventuelt Operating system |

**Page views** er sidevisninger. **Visits** teller ankomster fra et annet nettsted eller en direkte lenke, basert på referrer. Ett besøk kan omfatte flere sidevisninger. Visits skal ikke omtales som et deduplisert antall unike personer. Se [Cloudflares metrikker](https://developers.cloudflare.com/web-analytics/data-metrics/high-level-metrics/) og [tilgjengelige dimensjoner](https://developers.cloudflare.com/web-analytics/data-metrics/dimensions/).

En manglende referrer betyr ikke nødvendigvis at noen skrev inn adressen. Apper, personverninnstillinger og andre mellomledd kan fjerne henvisningsinformasjonen. Referrers gir heller ikke søkeordene fra Google; bruk Search Console til det.

## Begrensninger

Cloudflare Web Analytics støtter ikke rapportering av UTM-parametere eller egendefinerte events. Grunnløsningen gir dermed ikke affiliate-klikk, konverteringer, salg, trinn i Diskvelger eller kampanjefunnels. Query strings logges ikke for UTM-analyse. Historikk er tilgjengelig for de siste seks månedene. Nettleserblokkering, nettverksfeil og sampling kan påvirke tallene. Rapporterte besøk er ikke en fullstendig fasit på alle besøkende. [Cloudflare FAQ](https://developers.cloudflare.com/web-analytics/faq/).

Hvis vi senere trenger detaljert UTM-attribusjon, events eller funnels, skal GA4, Plausible og Umami vurderes som en separat beslutning. Sammenlign nødvendig funksjonalitet, kostnad/drift, datalagring og personvern-/samtykkebehov. GA4 er ikke automatisk neste steg, og det er ikke installert nå. Unngå to parallelle måleløsninger uten et konkret behov.

## Google Search Console

**Domain property `diskgolfutstyr.no` er verifisert via DNS.** Eieren bekrefter i fase 22A, stopp C at DNS-verifisering er utført, `sitemap.xml` er sendt inn, og viktige URL-er er kontrollert og OK. Search Console behandler fortsatt data; ytelsesdata kan bruke tid på å bli tilgjengelige. Dette bekrefter ikke at alle nettstedets sider er indeksert. DNS-verifisering krever ingen verification-meta eller verifiseringsfil i repoet.

Repoet inneholder `robots.txt` med `Allow: /` og `Sitemap: https://diskgolfutstyr.no/sitemap.xml`. Sitemapet skal valideres med prosjektets QA-script. Gyldige filer innebærer ikke at Google har indeksert sidene.

Ved stopp A ble sitemap.xml lest som XML med 147 URL-er. Robots og sitemap er ikke endret. DNS-verifisering kan eksistere uten en fil eller meta-tag i repoet.

Ved senere manuell kontroll eller oppsett av en ny property:

1. Åpne [Google Search Console](https://search.google.com/search-console/), og velg riktig property hvis den finnes.
2. Kontroller **Innstillinger → Eierskapsbekreftelse**. Hvis property mangler, opprett en domene-property for `diskgolfutstyr.no`, og legg Googles eksakte TXT-post hos DNS-leverandøren. Ikke gjett verifiseringsverdien.
3. Under **Sitemaps**, send inn eller kontroller `https://diskgolfutstyr.no/sitemap.xml`.
4. Under **Ytelse → Søkeresultater**, velg periode og aktiver klikk, visninger (impressions), CTR og gjennomsnittlig plassering.
5. Bruk **Søk** for søkefraser og **Sider** for landingssider. Kombiner filtrene for å se hvilke Google-søk som leder til en bestemt guide. Bruk også land- og enhetsfiltrene ved behov.
6. Bruk **URL-inspeksjon** og indekseringsrapporten til å kontrollere viktige sider. Nye sider og nye properties kan mangle data i starten.
7. Kontroller **Page Indexing / Sideindeksering** for ekskluderte sider og feil, og **HTTPS** for problemer med sikre sideadresser.
8. Kontroller **Core Web Vitals** for mobil og desktop når rapporten har nok feltdata. Manglende data er ikke det samme som en bestått måling. Se [Googles rapportveiledning](https://support.google.com/webmasters/answer/9205520?hl=en).
9. Kontroller **Manual Actions / Manuelle tiltak** og **Security Issues / Sikkerhetsproblemer**. Noter dato og faktisk resultat; disse rapportene er ikke kontrollert i denne fasen.

CTR er andelen visninger som gir klikk; gjennomsnittlig plassering er et aggregat og ikke en fast rangering. Search Console dekker Googles søkeresultater, ikke all trafikk fra sosiale medier, direkte lenker eller andre nettsteder. Enkelte søk anonymiseres, så søketabellen gir ikke nødvendigvis alle søk. [Googles veiledning til ytelsesrapporten](https://support.google.com/webmasters/answer/7576553?hl=en-GB).

## Fase 21B – teknisk kontroll og oppdatert kontostatus

Kontrollert 6. september 2026: forsiden, robots.txt og sitemap.xml svarer HTTP 200 over HTTPS og samsvarer med lokale filer. Forsidens canonical er `https://diskgolfutstyr.no/`. Robots tillater crawling og oppgir riktig sitemap. Sitemapet har 147 unike URL-er, alle under `https://diskgolfutstyr.no/`, med tilhørende lokale sider. Ingen gamle diskgolfguiden.no-adresser ble funnet i HTML, robots eller sitemap.

Alle 11 hoved-/hero-sider ble kontrollert live: HTTP 200, riktig canonical, `index, follow` og ingen X-Robots-Tag som blokkerer indeksering. Ti eldre HTML-sider har eksisterende `noindex, follow`; dette gjelder ikke hovedsidene. Ingen indekseringsdirektiver er endret. Teknisk tilgjengelighet er ikke bevis på at Google har indeksert sidene.

Ved agentens opprinnelige kontroll åpnet Search Console kun den offentlige innloggingsinngangen. Domain property og innsendt sitemap kunne da ikke bekreftes. Det tidligere DNS-oppslaget var heller ikke en bekreftelse på kontostatus.

Oppdatert etter eierens bekreftelse i fase 22A, stopp C:

- Domain property `diskgolfutstyr.no` er verifisert.
- DNS-verifisering er utført.
- `https://diskgolfutstyr.no/sitemap.xml` er sendt inn.
- Viktige URL-er er kontrollert og OK.
- Search Console behandler fortsatt data; ytelsesrapportene kan mangle data i starten.

Videre oppfølging er å kontrollere behandlingsstatus og tilgjengelige rapporter når data foreligger. Ingen ny DNS- eller kontoendring er utført av agenten i denne sluttkontrollen.

I URL Inspection kontrolleres først `/`, `/verktoy/`, `/verktoy/diskvelger/`, `/verktoy/flysimulator/`, `/utstyr/` og `/nybegynnerguide.html`. Noter for hver URL om den er kjent for Google og indeksert, brukerangitt og Google-valgt canonical, crawling tillatt og siste crawl når tilgjengelig. Be om indeksering bare for viktige nye/endrede sider ved konkret behov.

## Ukentlig trafikkrutine

Gjør én samlet gjennomgang hver uke. Bruk siste 7 dager mot foregående 7 dager når datagrunnlaget er tilstrekkelig; bruk 28-dagersperioder ved liten trafikk og for å vurdere retning. Unngå daglige endringer basert på små svingninger.

| Verktøy | Kontroller og noter |
|---|---|
| Cloudflare Web Analytics | Visits, page views, utvikling over tid, mest besøkte sider og referrers |
| Search Console | Total impressions, total clicks, CTR og average position for samme periode og søketype |
| Search Console → Queries | Søk som gir visninger, søk som gir klikk, og endringer fra sammenligningsperioden |
| Search Console → Pages | Landingssider med Google-trafikk og sider med økende visninger |

Se etter muligheter med mange visninger og lav CTR, gjennomsnittlig posisjon 4–15, økende visninger og relevante søk der siden allerede vises, men ikke besvarer behovet godt nok. Vurder søkeintensjon og tilstrekkelig datamengde før tiltak; gjennomsnittsposisjon er ikke en fast rangering. Bruk land/enhet som filtre ved behov. Noter periode, observasjon og eventuelt ett prioritert tiltak, og vurder resultatet over flere uker.

## UTM-standard for eksterne kampanjelenker

Dette er en navnestandard for fremtidig kampanjemåling. **Cloudflare-dashboardet vil ikke vise disse UTM-feltene.**

Bruk små bokstaver, ASCII, ingen mellomrom og bindestrek ved behov. Kampanjenavn skal være korte og tydelige. Bruk samme skrivemåte hver gang. Unngå personnavn, e-postadresser, identifikatorer og andre personopplysninger.

| Parameter | Bruk | Eksempler |
|---|---|---|
| `utm_source` | Plattform eller avsender | `facebook`, `instagram`, `reddit`, `discgolf-forum`, `newsletter`, `partnernavn` |
| `utm_medium` | Kanaltype | `social`, `email`, `referral`, `paid-social` |
| `utm_campaign` | Stabilt kampanjenavn | `hostguide`, `nybegynnerguide`, `diskvelger` |
| `utm_content` | Valgfri innholdsvariant | `innlegg-1`, `story`, `knapp-topp` |

Faste eksempler for organisk trafikk:

| Kanal | Query som legges til landingssiden |
|---|---|
| Facebook organisk | `?utm_source=facebook&utm_medium=social&utm_campaign=nybegynnerguide` |
| Instagram | `?utm_source=instagram&utm_medium=social&utm_campaign=diskvelger` |
| Nyhetsbrev | `?utm_source=newsletter&utm_medium=email&utm_campaign=hostguide` |
| Samarbeidspartner | `?utm_source=partnernavn&utm_medium=referral&utm_campaign=diskvelger` |

Bruk alltid `newsletter` for nyhetsbrev. Erstatt `partnernavn` med partnerens avtalte, faste navn. Behold kampanjenavnet når samme kampanje deles i flere kanaler; bruk `utm_content` for innlegg eller knappvarianter. En ny kampanje får et nytt avtalt navn, ikke tilfeldige varianter av det gamle.

Komplett eksempel med innholdsvariant:

```text
https://diskgolfutstyr.no/guider/discgolf-om-hosten/?utm_source=newsletter&utm_medium=email&utm_campaign=hostguide&utm_content=knapp-topp
```

Bruk `?` før første parameter og `&` mellom feltene. Har lenken allerede query-parametere, legg UTM til med `&`. UTM brukes på eksterne kampanjelenker, ikke interne navigasjonslenker. La canonical peke til den rene sideadressen. Dokumenter kampanjenavnene i en enkel kampanjeliste før publisering.

## Fremtidig event-sporing – ikke implementert

Ved en senere beslutning kan det være nyttig å måle om brukeren:

- starter Diskvelger
- fullfører Diskvelger
- åpner Flight Visualizer
- bruker et preset
- klikker videre til en guide
- klikker en affiliate-lenke

Dette krever en separat vurdering av GA4, Plausible, Umami eller annen event analytics. Avklar formål, eventdefinisjoner, nødvendig attribusjon og personvern før valg. Ingen eventlyttere, eventkall eller ekstra måleverktøy er lagt inn nå.

## Personvern og cookies

Cloudflare opplyser at Web Analytics ikke bruker cookies eller localStorage for målingen og ikke lager individuelle fingeravtrykk fra IP-adresse, User-Agent eller andre data. Dette er leverandørens tekniske beskrivelse; den er ikke en generell garanti om GDPR-etterlevelse eller fritak fra samtykkekrav. [Cloudflare om personvern](https://developers.cloudflare.com/web-analytics/about/).

Ved aktivering sendes måledata til Cloudflare som ekstern mottaker. Før publisering må eieren dokumentere formål, hvilke opplysninger den faktiske beaconen sender, rollefordeling/vilkår, lagring, eventuell overføring og behandlingsgrunnlag. `/personvern/` er oppdatert nøkternt med tjeneste, formål og leverandørlenke; dette er ikke en full juridisk vurdering.

Norske regler om cookies og lignende teknologier omfatter mer enn bare cookies. Vurder den konkrete installasjonen opp mot ekomloven og personvernregelverket. Dersom installasjonen krever samtykke, må beaconen vente til gyldig samtykke er gitt, med mulighet til å trekke det tilbake. Cookie-banner eller samtykkestyring er ikke implementert; behovet må vurderes separat før publisering. [Datatilsynets veiledning](https://www.datatilsynet.no/personvern-pa-ulike-omrader/internett-og-apper/bruk-av-informasjonskapsler-og-andre-sporingsteknologier/).

## QA ved installasjon og senere publisering

Stopp B, lokal kontroll 6. september 2026:

- Alle 158 HTML-sider har nøyaktig én beacon og det uendrede site-tokenet. Ingen duplikater eller andre analytics-providers ble funnet.
- Sammenligning mot forrige commit viser at den eneste HTML-endringen utover snippetet er analytics-avsnittet på personvernsiden. CSS, URL-struktur, robots og sitemap er uendret.
- Alle fem pålagte Node-kontroller og `git diff --check` bestod. Placeholder-rapporten er en inventarliste, ikke et bevis på at nettstedet er uten eksisterende placeholders.
- Edge/Chromium på localhost: Forside, Utstyr og Diskvelger testet ved 390 og 1920 px. Beacon-scriptet lastet én gang per side med HTTP 200, uten script-404 eller JavaScript-unntak. Skjermbilder med og uten beacon var identiske i alle seks sammenligninger; ingen layoutskift ble registrert i disse prøvene.
- Med beacon-nedlastingen holdt tilbake ble innhold og hovedoverskrift rendret før scriptresponsen kom. Dette bekrefter ikke-blokkerende rendering med den leverte modulvarianten.
- **Nettverksforbehold:** Innsamlingskallet til `https://cloudflareinsights.com/cdn-cgi/rum` ble avvist av CORS fra `http://127.0.0.1:8000`. Konsollen viser derfor CORS-/nettverksfeil i lokaltesten. Dette er ikke en bekreftelse på vellykket datainnsamling; domenematching og mottatt trafikk må prøves på det publiserte domenet. Ingen lokal omgåelse eller simulert produksjonstrafikk er brukt.

Etter senere godkjent publisering:

- Søk etter eksisterende beacon før innlegging. Kontroller nøyaktig én script-instans og én lasting per dokument, også på mobil.
- Kontroller at scriptet ikke blokkerer rendering og at ingen JavaScript-, CORS- eller CSP-feil oppstår. Flere måle-POST-er gjennom én sidevisning er ikke i seg selv tegn på dobbel scriptlasting.
- Ved manuell installasjon må en eventuell CSP tillate script fra `static.cloudflareinsights.com` og tilkobling til `cloudflareinsights.com`; ikke svekk øvrige regler. Ingen CSP ble funnet i det nåværende oppsettet.
- Test fra det konfigurerte domenet. Localhost er ikke bevis på at domenematchingen fungerer i produksjon.
- La den offisielle beaconen sende data; ikke simuler registrerte besøk med egendefinerte API-kall.
- Sammenlign lastetid/layoutskift før og etter under like testforhold. Kontroller at canonical, sitemap og JSON-LD er uendret.
- Åpne noen kjente sider, noter tidspunkt og kontroller at trafikken dukker opp i riktig dashboard etter behandlingstiden. Rapporter dette som uverifisert til en faktisk registrering er sett.

CSP, lokal domenematching og beaconens rapportering er beskrevet i [Cloudflare FAQ](https://developers.cloudflare.com/web-analytics/faq/).
