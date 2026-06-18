# Search Console-status for Diskgolfutstyr.no

Oppdatert: 2026-06-18

## Status

Diskgolfutstyr.no er teknisk klargjort for Google Search Console, men Domain Property-verifisering og innsending av sitemap må gjøres i Google Search Console-kontoen til eier.

Dette kan ikke fullføres automatisk fra repoet uten tilgang til Google-konto og DNS-verifisering.

## Domene og DNS

Forventet domene:

`diskgolfutstyr.no`

DNS ble kontrollert lokalt og peker til GitHub Pages:

- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

`www.diskgolfutstyr.no` peker til:

`sveningebrethsen-lang.github.io`

## Search Console-oppsett

Anbefalt property:

- Type: Domain property
- Domene: `diskgolfutstyr.no`

Verifisering:

- Bruk DNS TXT-recorden Google gir i Search Console.
- Legg TXT-recorden inn hos Webhuset.
- Ikke fjern eksisterende GitHub Pages A-records.
- Ikke fjern e-postrelaterte records som `MX`, `TXT`, `SPF`, `DKIM` eller `DMARC`.

## Sitemap

Send inn:

`https://diskgolfutstyr.no/sitemap.xml`

Lokal QA viser at `sitemap.xml` bruker `https://diskgolfutstyr.no/` og inneholder 144 URL-er.

## Robots.txt

Lokal QA viser at `robots.txt` peker til:

`https://diskgolfutstyr.no/sitemap.xml`

Robots.txt blokkerer ikke viktige sider i lokal kontroll.

## HTTPS

HTTPS må kontrolleres i GitHub Pages og Search Console etter at GitHub har fullført sertifikatprovisjonering.

Sjekkpunkter:

- `https://diskgolfutstyr.no/` åpner uten sertifikatvarsel.
- `https://www.diskgolfutstyr.no/` åpner eller videresender riktig.
- `Enforce HTTPS` er aktivert i GitHub Pages når tilgjengelig.
- Search Console viser ingen HTTPS-feil når rapporten får data.

## Page indexing

Når sitemap er sendt inn:

- Sjekk `Page indexing`.
- Se etter 404-feil.
- Se etter sider som er oppdaget, men ikke indeksert.
- Se etter canonical-avvik.
- Se etter URL-er blokkert av robots.txt.

## Security og manual actions

Kontroller i Search Console:

- `Security issues`
- `Manual actions`

Forventet status: ingen funn.

## Neste manuelle steg

1. Legg til Domain Property for `diskgolfutstyr.no`.
2. Verifiser med DNS TXT-record hos Webhuset.
3. Send inn `https://diskgolfutstyr.no/sitemap.xml`.
4. Sjekk at `Page indexing` begynner å plukke opp URL-er.
5. Sjekk HTTPS-rapporten når data finnes.
6. Følg opp ukentlig de første fire ukene etter lansering.
