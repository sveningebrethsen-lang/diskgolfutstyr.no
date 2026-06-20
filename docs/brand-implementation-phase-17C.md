# Brandimplementering fase 17C

Oppdatert: 20. juni 2026

Dette dokumentet beskriver hvordan valgt merkevare er implementert på Diskgolfutstyr.no i fase 17C. Fasen gjør ingen URL-endringer, sitemap-endringer, backend-endringer eller full redesign.

## Valgt logo

Valgt logo:

**06 - Zero (Precision Crosshair)**

Merkevare:

**Diskgolfutstyr**

Tagline:

**Norges guide til diskgolf**

Logoen skal ikke redesignes i denne fasen. Videre arbeid skal handle om korrekt bruk, filstruktur, kontrast og konsistent plassering.

## Logo-system

Logofilene ligger i:

| Bruk | Fil | Status |
|---|---|---|
| Hovedlogo / primærlogo | `/assets/Brand/zero-primary.svg` | Klar |
| Horisontal header-logo | `/assets/Brand/zero-horizontal.svg` | Implementert i header |
| Favicon / ikon | `/assets/Brand/zero-favicon.svg` | Implementert som favicon |
| Mobilheader-logo | `/assets/Brand/zero-horizontal.svg` | Brukes foreløpig, skaleres via CSS |

Eksisterende eldre logofiler i `/assets/` er ikke slettet. De kan beholdes som legacy/fallback til en senere oppryddingsfase.

## Fargepalett

Fase 17C har innført følgende design tokens i `assets/css/styles.css`:

| Rolle | Token | Farge |
|---|---|---|
| Primary | `--color-primary` | `#1A3D2B` Forest Green |
| Primary dark | `--color-primary-dark` | `#10261b` dyp grønn/sort |
| Secondary | `--color-secondary` | `#2D6A4F` Pine Green |
| Accent | `--color-accent` | `#C9922A` Warm Gold |
| Accent soft | `--color-accent-soft` | `#f4e6c7` lys gullflate |
| Background | `--color-bg` | `#F4F1EB` Off White |
| Surface | `--color-surface` | `#ffffff` |
| Warm surface | `--color-surface-warm` | `#faf8f3` |
| Text | `--color-text` | `#1C1C1C` Charcoal |
| Heading | `--color-heading` | `#1A3D2B` |
| Border | `--color-line` | `rgba(28, 28, 28, 0.14)` |

Warm Gold skal brukes som aksent, ikke som primær tekstfarge på lys bakgrunn uten kontrastsjekk.

## Typografi

Ingen ny font-avhengighet er lagt til.

Nettstedet bruker fortsatt systemfont-stack:

`Inter, Manrope, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

Zero-logoen bruker typografi inne i SVG-filen. Den skal ikke tvinge resten av nettstedet over på en ekstern font i denne fasen.

## Header-regler

Headeren skal være:

- kompakt
- sticky
- tydelig på desktop
- enkel å bruke på mobil
- forberedt for fremtidig logo-/ikonvariant

Implementert i fase 17C:

- Header-logo peker til `/assets/Brand/zero-horizontal.svg`.
- Menystrukturen fra fase 17B er beholdt.
- Headerfarger følger Forest Green / Off White / Warm Gold-retningen.
- Mobilmeny og trykkflater er ikke redesignet, bare videreført fra 17B.

Header skal ikke få flere primærpunkter uten ny IA-vurdering.

## Favicon-regler

Implementert favicon:

`/assets/Brand/zero-favicon.svg`

Anbefalte filer senere:

| Fil | Bruk |
|---|---|
| `/assets/Brand/zero-favicon.svg` | Moderne SVG favicon |
| `/favicon.ico` | Legacy fallback for eldre nettlesere |
| `/apple-touch-icon.png` | iOS-hjemskjerm |
| `/android-chrome-192x192.png` | Android/PWA fallback |
| `/android-chrome-512x512.png` | Stor app/icon fallback |

PNG/ICO-varianter bør eksporteres fra Zero-ikonet, ikke tegnes på nytt.

## Implementeringsstatus

Gjort i fase 17C:

- Zero-logoer i `/assets/Brand/` er tatt i bruk.
- Header-logo er byttet til Zero horizontal.
- Favicon-referanser er byttet til Zero favicon.
- JSON-LD publisher-logo er oppdatert til Zero favicon der den gamle logo-icon-referansen fantes.
- CSS design tokens er oppdatert til valgt palett.
- Headeren er brand-justert uten full redesign.

Ikke gjort:

- Ingen URL-er endret.
- Ingen sitemap-endringer.
- Ingen backend, database eller API.
- Ingen ny logo laget.
- Ingen full redesign.
- Ingen sletting av eldre logo-assets.
- Ingen commit eller push i denne fasen før egen godkjenning.

## Videre arbeid

Neste trygge steg:

1. Visuell QA av header på mobil, tablet og desktop.
2. Eksporter eventuelle PNG/ICO-favicons fra `zero-favicon.svg`.
3. Vurdere om footer-logo også skal over på Zero-systemet i en senere fase.
4. Lage enkel brand usage-side i docs hvis flere skal bidra.
