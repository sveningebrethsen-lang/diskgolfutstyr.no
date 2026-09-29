# Kildestrategi for norske banedata

Sist oppdatert: 2026-09-28

## Prioritet

1. Klubb eller dokumentert baneoperatør
2. Kommune eller annen offentlig primærkilde
3. Tillatt åpen datakilde med kjent lisens
4. Manuell sekundærkontroll

UDisc skal bare brukes til manuell kontroll og ekstern lenke uten særskilt tillatelse. Det skal ikke bygges automatisert innhenting, lokal speiling eller masseimport fra UDisc.

PDGA Course Directory kan brukes manuelt som sekundærkilde. Automatisert PDGA-bruk krever medlemskap, signert API-avtale, gjennomgang før lansering og korrekt attribusjon. Kommersiell bruk må avklares eksplisitt.

## OpenStreetMap

### Kandidatsøk

OSM kan senere brukes til å finne kandidater med `leisure=disc_golf_course`. `sport=disc_golf` alene skal ikke brukes som hovedfilter fordi taggen også kan forekomme på klubber, butikker og feilmerkede baneelementer.

En avgrenset Overpass-strategi kan være:

```text
1. Velg Norge som søkeområde med ISO3166-1=NO og admin_level=2.
2. Finn node/way/relation med leisure=disc_golf_course innenfor området.
3. Returner center og tags som JSON.
```

Den konkrete Overpass QL-spørringen skal bygges og prøves mot den offisielle syntaksdokumentasjonen før en eventuell pilot. Dette er dokumentasjon, ikke en importjobb. Offentlige Overpass-endepunkter skal ikke belastes med parallelle masseforespørsler. Ved senere produksjonsbruk bør vi vurdere et kontrollert uttrekk, lokal cache eller egnet tjeneste fremfor hyppige full-land-spørringer.

### Aktuelle OSM-felt

- navn
- koordinater eller sentrumskoordinat
- operatør og nettsted når registrert
- `disc_golf:course` eller andre dokumenterte hull-/layouttagger
- `fee`, `opening_hours` og kontaktdata når registrert

OSM-data er kandidater, ikke automatisk sannhet. Felt må kontrolleres for aktualitet og presisjon før publisering.

### Lisens og attribusjon

OpenStreetMap-data er lisensiert under ODbL. Synlig bruk krever kreditering av OpenStreetMap-bidragsytere og lenke til lisensen. En publisert database som er avledet fra OSM kan utløse ODbL-krav om at den avledede databasen tilbys under samme lisens.

Før en masseimport skal prosjektet derfor avklare om `data/courses/norway.json` blir en avledet database eller en kollektiv database med separat, feltvis proveniens. Den tryggeste første modellen er manuell kandidatoppdagelse, feltvis attribusjon og separat lagring av OSM-identifikator/kilde fremfor å gjøre OSM til eneste masterdatasett.

Offisielle referanser:

- https://www.openstreetmap.org/copyright
- https://wiki.openstreetmap.org/wiki/Tag:leisure=disc_golf_course
- https://wiki.openstreetmap.org/wiki/Overpass_API
- https://www.pdga.com/dev
- https://udisc.com/terms

## Kildebruk i V1

Hver kilde skal registrere navn, URL, utgiver, type, lisens, kontrolldato og om automatisert bruk er tillatt. `field_sources` skal vise hvilke faktagrupper kilden støtter.

Manglende lisens betyr ikke at automatisert bruk er tillatt. Standard er `automation_allowed: false` frem til dokumentasjon eller eksplisitt tillatelse finnes.
