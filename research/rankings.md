# Rankings

## Hvordan ranking fungerer

Det finnes flere nivåer:

- PDGA player rating: beregnes fra turneringsrunder og brukes blant annet til divisjoner og påmelding.
- PDGA World Rankings: offisiell verdensranking for MPO/FPO, publisert som rangeringsoppdateringer.
- StatMando: statistikkplattform som presenterer offisielle rankings og mange filtrerte historikker.
- Lokale/norske ratings: PDGA-rating, Metrix-rating og resultater fra NC/NM/ukesgolf.

## Forslag til rankingseksjoner

### Verdensranking

Statisk side som forklarer:
- Hva MPO og FPO betyr.
- Forskjell på rating og ranking.
- Hvor offisiell ranking finnes.
- Lenker til PDGA og StatMando.

Ikke kopier hele tabeller uten datatillatelse. Lag heller forklaringer og manuelle "norske vinkler".

### Norske spillere

Mulige visninger:
- Norske MPO/FPO-spillere å følge.
- Norske spillere i internasjonale felt.
- Ratinghistorikk med manuell snapshot.
- Mest fremgang siste år, basert på manuelt oppdaterte rating-snapshots.

### Ratinghistorikk

Data kan lagres som:

```json
{
  "playerId": "ida-emilie-nesse",
  "snapshots": [
    {"date": "2026-06-01", "pdgaRating": null, "sourceUrl": ""}
  ]
}
```

## Presentasjon på siden

- Forklaringskort: "Rating er ikke det samme som ranking".
- Tabell: navn, klasse, rating, endring, sist verifisert, kilde.
- Graf senere: statisk SVG/Canvas generert fra JSON.
- Profilkobling: hver spiller får egen side når data er verifisert.

## Rankinginnhold

1. PDGA-rating forklart på norsk.
2. MPO og FPO forklart.
3. Verdensranking i disc golf forklart.
4. Hvordan lese en ratinghistorikk.
5. Norske spillere å følge i 2026.
6. Norske spillere med størst fremgang.
7. Hva betyr 900, 950 og 1000 rating?
8. Hvor god må du være for Norgescup?
9. Forskjellen på PDGA-rating og Metrix-rating.
10. Slik bruker du rating til å velge riktig klasse.
