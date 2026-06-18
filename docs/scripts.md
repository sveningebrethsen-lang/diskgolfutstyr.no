# Scripts

Sist oppdatert: 2026-06-03

Prosjektet har ingen `package.json` og ingen tunge avhengigheter. Scripts kjøres direkte med Node.

| Script | Kommando | Hva det gjør | Ved feil |
|---|---|---|---|
| Intern lenkesjekk | `node scripts/check-internal-links.js` | Sjekker HTML/Markdown-lenker, rapporterer brutte lenker og placeholders | Rett lenken eller fjern publisering |
| Sitemap-sjekk | `node scripts/check-sitemap.js` | Sjekker sitemap, robots, manglende filer og legacy/docs i sitemap | Oppdater sitemap/robots |
| Placeholder-sjekk | `node scripts/check-placeholders.js` | Finner `href="#"`, TODO, FIXME og lignende | Vurder om placeholder er bevisst |
| Statisk QA | `node scripts/qa-static-site.mjs` | Sjekker title, meta, H1, canonical, JSON-LD og data-JSON | Rett teknisk SEO/datafeil |
| Site audit | `node scripts/generate-site-audit.mjs` | Lager overordnet audit | Bruk rapporten i månedlig rutine |


| Innholdskvalitet | `node scripts/check-content-quality.js` | Sjekker title, meta, H1, oppdatert-dato, interne lenker, disclaimere, research-merking og placeholders | Rett siden eller dokumenter hvorfor avviket er bevisst |
