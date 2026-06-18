# Analytics-oppsett

Diskgolfutstyr.no har ikke aktiv analytics med privat tracking-ID i repoet. Det er bevisst: private nøkler, tokens og konto-ID-er skal ikke committes.

## Google Search Console

1. Legg domenet `diskgolfutstyr.no` til i Google Search Console.
2. Verifiser domenet via DNS hos domeneleverandør.
3. Send inn sitemap:
   `https://diskgolfutstyr.no/sitemap.xml`
4. Følg med på indeksering, søkeord, klikk og eventuelle tekniske feil.

## Google Analytics

Hvis Google Analytics brukes senere:

1. Opprett GA4-property.
2. Legg tracking-script inn i felles `<head>` på HTML-sidene.
3. Bruk aldri private nøkler i repoet.
4. Dokumenter tracking-ID i en lokal, privat driftsnotis, ikke i offentlig kode hvis det ikke er ønskelig.

## Plausible

Plausible er et lett alternativ som kan passe en statisk side.

Eksempel med placeholder:

```html
<script defer data-domain="diskgolfutstyr.no" src="https://plausible.io/js/script.js"></script>
```

Legg kun inn scriptet når domenet er satt opp i Plausible.

## Hva bør måles?

- Organisk trafikk fra Google.
- Mest besøkte guider.
- Klikk til utstyrsguider, tester og sammenligninger.
- Interne brukerflyter fra forside til nybegynnerguide.
- Eventuelle affiliate-klikk når annonselenker legges inn.

## Personvern

Velg lavest mulig datainnsamling. Ikke legg inn tung tracking eller remarketing før siden faktisk trenger det.
