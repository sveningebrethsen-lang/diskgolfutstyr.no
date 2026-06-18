# Search Console launch checklist for Diskgolfutstyr.no

Bruk denne sjekklisten etter at GitHub Pages og HTTPS er aktive for `diskgolfutstyr.no`.

## 1. Legg til property

- Gå til Google Search Console.
- Velg `Add property`.
- Velg `Domain property`.
- Skriv inn:
  `diskgolfutstyr.no`

## 2. Verifiser med DNS

- Kopier TXT-recorden Google gir deg.
- Legg TXT-recorden inn hos domeneleverandoren.
- Ikke slett eksisterende `A`, `CNAME`, `MX`, `TXT`, `SPF`, `DKIM` eller `DMARC` uten at du vet hva de brukes til.
- Vent til Google godkjenner verifiseringen.

## 3. Send inn sitemap

Send inn:

`https://diskgolfutstyr.no/sitemap.xml`

Kontroller etter innsending:

- At sitemap kan hentes.
- At URL-er bruker `https://diskgolfutstyr.no/`.
- At gamle `diskgolfguiden.no`-URL-er ikke ligger i sitemap.

## 4. Sjekk Page indexing

Gå til `Indexing` -> `Pages` og se etter:

- Sider som er indeksert.
- Sider som er oppdaget, men ikke indeksert ennå.
- 404-feil.
- Redirect-feil.
- Sider blokkert av robots.txt.

## 5. Sjekk HTTPS

Gå til HTTPS-rapporten når data finnes.

Kontroller:

- At `https://diskgolfutstyr.no/` fungerer.
- At `https://www.diskgolfutstyr.no/` fungerer eller videresender riktig.
- At GitHub Pages `Enforce HTTPS` er aktivert når tilgjengelig.

## 6. Sjekk robots.txt

Kontroller live:

`https://diskgolfutstyr.no/robots.txt`

Robots.txt skal ikke blokkere viktige sider, guider, utstyrssider, banesider eller sitemap.

## 7. Sjekk Core Web Vitals

Når Google har nok data:

- Sjekk mobil først.
- Prioriter sider med svake Core Web Vitals.
- Se spesielt på forside, nybegynnerguide, utstyr og baner.

## 8. Sjekk manuelle tiltak og sikkerhet

Gå gjennom:

- `Security issues`
- `Manual actions`

Det skal normalt ikke være funn.

## 9. Månedlig lanseringsoppfølging

De første månedene:

- Se hvilke sider som får impressions.
- Finn søk med høy impressions og lav CTR.
- Finn sider med posisjon 8-20.
- Forbedre internlenking til sider som nesten rangerer.
- Lag nytt innhold basert på faktiske Search Console-data, ikke antakelser.
