# Ytelsesrutine

Sist oppdatert: 2026-06-03

Diskgolfguiden.no skal være rask på mobil og GitHub Pages. Prosjektet bruker små SVG-er, én CSS-fil og lett JavaScript.

## Sjekkpunkter

- Unngå store bilder og ukomprimerte assets.
- Ikke legg til tunge eksterne scripts uten klar nytte.
- Hold filtrering og kortvisning som progressiv forbedring.
- Sjekk at tabeller fungerer på mobil.
- Unngå layout shift fra elementer uten størrelse.
- Kjør lokal mobiltest før publisering.

## Nåværende funn

Største asset er `assets/css/styles.css` på omtrent 15 KB. Ingen store bildefiler ble funnet i `assets/`.
