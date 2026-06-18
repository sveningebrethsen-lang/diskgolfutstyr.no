# Conversion tracking plan

Fase 10 legger ikke inn aktiv tracking, cookies eller analytics-ID.

## Hva som bør måles senere

- klikk på produktkort
- klikk i sammenligningstabeller
- klikk fra utstyrshub til produktside
- klikk fra informasjonsguide til kommersiell guide
- klikk til affiliate-info

## Data-attributter

CTA-er bør merkes med:

- `data-affiliate-id`
- `data-product-id`
- `data-link-type`
- `data-placement`
- `data-page-type` ved behov

Eksempel:

```html
<a href="#" class="button" rel="sponsored nofollow" data-product-id="innova-leopard3" data-link-type="affiliate-placeholder" data-placement="product-card">Se produkt</a>
```

## Når tracking kan aktiveres

Før tracking aktiveres:

1. Velg verktøy, for eksempel Plausible eller Google Analytics.
2. Oppdater `personvern/`.
3. Vurder samtykkebehov.
4. Ikke legg inn private nøkler i repoet.
5. Test at siden ikke blir treg.

## Search Console + analytics

Search Console viser søk og sider. Analytics kan senere vise hvilke CTA-er brukere klikker. Bruk begge sammen for å se om en side både får trafikk og hjelper leseren videre.
