# Besøksstatistikk og trafikkilder

Sist kontrollert: 6. september 2026.

## Status

**Ingen analytics er aktiv. Cloudflare Web Analytics er valgt som planlagt grunnløsning, men domenets ekte site token / JS-snippet mangler.** Ingen beacon, GA4, GTM, Plausible eller Umami er lagt inn. Det finnes ingen dummy-token eller privat API-nøkkel i implementasjonen. Dagens nettsted samler derfor ikke besøksstatistikk gjennom en slik tjeneste.

GitHub Pages kan fortsatt brukes. Cloudflare Web Analytics støtter manuell installasjon uten Cloudflare-proxy eller flytting av domenets DNS. [Offisiell oppsettveiledning](https://developers.cloudflare.com/web-analytics/get-started/).

## Dette må eieren hente fra Cloudflare

1. Logg inn i [Cloudflare-dashboardet](https://dash.cloudflare.com/), og velg riktig konto.
2. Gå til **Web Analytics**. Kontroller først om `diskgolfutstyr.no` allerede er registrert, for å unngå en duplikat.
3. Hvis nettstedet mangler: velg **Add a site**, skriv `diskgolfutstyr.no`, velg vertsnavnet og fullfør.
4. Åpne **Manage site**, og kopier hele den offisielle JS-snippeten for manuell installasjon.
5. Gi utvikleren denne snippeten. Den offentlige verdien i `data-cf-beacon` er nødvendig klientkonfigurasjon og blir synlig i HTML. Et privat Cloudflare API-token, passord eller en kontonøkkel skal ikke deles eller legges i repoet.

Installatøren legger den ekte snippeten én gang før avsluttende `</body>` på alle offentlige HTML-sider. Behold den offisielle, ikke-renderblokkerende scriptvarianten. Kontroller at ingen automatisk injeksjon eller andre script allerede laster samme beacon. Ikke legg inn et separat analytics-bibliotek eller en egendefinert klient.

Denne delen venter på snippeten; dokumentasjonen er ikke bevis på at installasjon eller datainnsamling er ferdig.

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

**Kontostatus er ikke verifisert.** Repoet har ingen Google verification-meta eller verifiseringsfil. Eksisterende planer i `search-console-plan.md` og et gyldig sitemap dokumenterer forberedelse, ikke at en Google-property er aktiv. Denne kontrollen har ikke åpnet eierens Google-konto eller endret DNS.

Repoet inneholder `robots.txt` med `Allow: /` og `Sitemap: https://diskgolfutstyr.no/sitemap.xml`. Sitemapet skal valideres med prosjektets QA-script. Gyldige filer innebærer ikke at Google har indeksert sidene.

Eierens manuelle kontroll:

1. Åpne [Google Search Console](https://search.google.com/search-console/), og velg riktig property hvis den finnes.
2. Kontroller **Innstillinger → Eierskapsbekreftelse**. Hvis property mangler, opprett en domene-property for `diskgolfutstyr.no`, og legg Googles eksakte TXT-post hos DNS-leverandøren. Ikke gjett verifiseringsverdien.
3. Under **Sitemaps**, send inn eller kontroller `https://diskgolfutstyr.no/sitemap.xml`.
4. Under **Ytelse → Søkeresultater**, velg periode og aktiver klikk, visninger (impressions), CTR og gjennomsnittlig plassering.
5. Bruk **Søk** for søkefraser og **Sider** for landingssider. Kombiner filtrene for å se hvilke Google-søk som leder til en bestemt guide. Bruk også land- og enhetsfiltrene ved behov.
6. Bruk **URL-inspeksjon** og indekseringsrapporten til å kontrollere viktige sider. Nye sider og nye properties kan mangle data i starten.

CTR er andelen visninger som gir klikk; gjennomsnittlig plassering er et aggregat og ikke en fast rangering. Search Console dekker Googles søkeresultater, ikke all trafikk fra sosiale medier, direkte lenker eller andre nettsteder. Enkelte søk anonymiseres, så søketabellen gir ikke nødvendigvis alle søk. [Googles veiledning til ytelsesrapporten](https://support.google.com/webmasters/answer/7576553?hl=en-GB).

## UTM-standard for eksterne kampanjelenker

Dette er en navnestandard for fremtidig kampanjemåling. **Cloudflare-dashboardet vil ikke vise disse UTM-feltene.**

Bruk små bokstaver, ASCII og bindestrek mellom ord. Bruk samme skrivemåte hver gang. Unngå personnavn, e-postadresser, identifikatorer og andre personopplysninger.

| Parameter | Bruk | Eksempler |
|---|---|---|
| `utm_source` | Plattform eller avsender | `facebook`, `instagram`, `reddit`, `discgolf-forum`, `nyhetsbrev`, partnerens navn |
| `utm_medium` | Kanaltype | `social`, `email`, `referral`, `paid-social` |
| `utm_campaign` | Stabilt kampanjenavn | `hostguide-2026`, `nybegynner-start` |
| `utm_content` | Valgfri innholdsvariant | `innlegg-1`, `story`, `knapp-topp` |

Eksempel:

```text
https://diskgolfutstyr.no/guider/discgolf-om-hosten/?utm_source=facebook&utm_medium=social&utm_campaign=hostguide-2026&utm_content=innlegg-1
```

Bruk `?` før første parameter og `&` mellom feltene. Har lenken allerede query-parametere, legg UTM til med `&`. UTM brukes på eksterne kampanjelenker, ikke interne navigasjonslenker. La canonical peke til den rene sideadressen. Dokumenter kampanjenavnene i en enkel kampanjeliste før publisering.

## Personvern og cookies

Cloudflare opplyser at Web Analytics ikke bruker cookies eller localStorage for målingen og ikke lager individuelle fingeravtrykk fra IP-adresse, User-Agent eller andre data. Dette er leverandørens tekniske beskrivelse; den er ikke en generell garanti om GDPR-etterlevelse eller fritak fra samtykkekrav. [Cloudflare om personvern](https://developers.cloudflare.com/web-analytics/about/).

Ved aktivering sendes måledata til Cloudflare som ekstern mottaker. Før publisering må eieren dokumentere formål, hvilke opplysninger den faktiske beaconen sender, rollefordeling/vilkår, lagring, eventuell overføring og behandlingsgrunnlag. Oppdater `/personvern/` med løsningen som faktisk tas i bruk.

Norske regler om cookies og lignende teknologier omfatter mer enn bare cookies. Vurder den konkrete installasjonen opp mot ekomloven og personvernregelverket. Dersom installasjonen krever samtykke, må beaconen vente til gyldig samtykke er gitt, med mulighet til å trekke det tilbake. Det er ikke lagt inn et cookie-banner for en tjeneste som ennå ikke er installert. [Datatilsynets veiledning](https://www.datatilsynet.no/personvern-pa-ulike-omrader/internett-og-apper/bruk-av-informasjonskapsler-og-andre-sporingsteknologier/).

## QA når ekte snippet er tilgjengelig

- Søk etter eksisterende beacon før innlegging. Kontroller nøyaktig én script-instans og én lasting per dokument, også på mobil.
- Kontroller at scriptet ikke blokkerer rendering og at ingen JavaScript-, CORS- eller CSP-feil oppstår. Flere måle-POST-er gjennom én sidevisning er ikke i seg selv tegn på dobbel scriptlasting.
- Ved manuell installasjon må en eventuell CSP tillate script fra `static.cloudflareinsights.com` og tilkobling til `cloudflareinsights.com`; ikke svekk øvrige regler. Ingen CSP ble funnet i det nåværende oppsettet.
- Test fra det konfigurerte domenet. Localhost er ikke bevis på at domenematchingen fungerer i produksjon.
- La den offisielle beaconen sende data; ikke simuler registrerte besøk med egendefinerte API-kall.
- Sammenlign lastetid/layoutskift før og etter under like testforhold. Kontroller at canonical, sitemap og JSON-LD er uendret.
- Åpne noen kjente sider, noter tidspunkt og kontroller at trafikken dukker opp i riktig dashboard etter behandlingstiden. Rapporter dette som uverifisert til en faktisk registrering er sett.

CSP, lokal domenematching og beaconens rapportering er beskrevet i [Cloudflare FAQ](https://developers.cloudflare.com/web-analytics/faq/).
