import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const today = "2026-06-03";

function write(file, content) {
  const target = join(root, file);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, `${content.trim()}\n`, "utf8");
}

function readMaybe(file) {
  const target = join(root, file);
  return existsSync(target) ? readFileSync(target, "utf8") : "";
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/æ/g, "ae").replace(/ø/g, "o").replace(/å/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const planned = [
  ["Hvor langt bør en nybegynner kaste?", "hvor-langt-bor-en-nybegynner-kaste", "Nybegynner", "Høy", "Informasjon"],
  ["Hvorfor nybegynnere bør vente med distance drivers", "hvorfor-nybegynnere-bor-vente-med-distance-drivers", "Nybegynner/Utstyr", "Høy", "Informasjon"],
  ["Hvorfor går disken alltid til venstre?", "hvorfor-gar-disken-alltid-til-venstre", "Vanlige feil", "Høy", "Problemløsning"],
  ["Hvorfor går disken rett i bakken?", "hvorfor-gar-disken-rett-i-bakken", "Vanlige feil", "Høy", "Problemløsning"],
  ["Hvorfor vender disken over?", "hvorfor-vender-disken-over", "Vanlige feil", "Middels", "Problemløsning"],
  ["Baseplast vs premiumplast forklart", "baseplast-vs-premiumplast", "Utstyr", "Høy", "Kommersiell/research"],
  ["Lett disk vs tung disk", "lett-disk-vs-tung-disk", "Utstyr", "Høy", "Kommersiell/research"],
  ["Sko til discgolf: hva bør du se etter?", "sko-til-discgolf", "Utstyr", "Middels", "Kommersiell/research"],
  ["Disc retriever: verdt det?", "disc-retriever-verdt-det", "Utstyr", "Middels", "Kommersiell/research"],
  ["Brukt eller nytt discgolfutstyr?", "brukt-eller-nytt-discgolfutstyr", "Utstyr", "Middels", "Kommersiell/research"],
  ["Discgolfbaner nær Oslo", "discgolfbaner-naer-oslo", "Lokal SEO", "Høy", "Lokal informasjon"],
  ["Nybegynnervennlige baner i Oslo", "nybegynnervennlige-baner-i-oslo", "Lokal SEO", "Høy", "Lokal informasjon"],
  ["Discgolfbaner nær Bergen", "discgolfbaner-naer-bergen", "Lokal SEO", "Middels", "Lokal informasjon"],
  ["Discgolfbaner i Vestfold", "discgolfbaner-i-vestfold", "Lokal SEO", "Middels", "Lokal informasjon"],
  ["Hvordan velge bane som nybegynner", "hvordan-velge-discgolfbane-som-nybegynner", "Baner/Nybegynner", "Høy", "Informasjon"],
  ["Approach-kast forklart", "approach-kast-forklart", "Teknikk", "Middels", "Informasjon"],
  ["Slik får du renere backhand-release", "renere-backhand-release", "Teknikk", "Middels", "Problemløsning"],
  ["Puttingøvelser hjemme", "puttingovelser-hjemme", "Trening", "Høy", "Informasjon"],
  ["Hvordan måle kastelengde", "hvordan-male-kastelengde", "Trening", "Middels", "Informasjon"],
  ["Hvordan finne ukesgolf", "hvordan-finne-ukesgolf", "Klubber", "Høy", "Lokal/turnering"],
  ["Hva bør du ha med på turnering?", "hva-bor-du-ha-med-pa-turnering", "Turneringer", "Høy", "Informasjon"],
  ["Hvordan velge riktig klasse i turnering", "hvordan-velge-riktig-klasse-i-turnering", "Turneringer", "Høy", "Informasjon"],
  ["Discgolf om våren", "discgolf-om-varen-oppdatert", "Sesong", "Middels", "Sesonginformasjon"],
  ["Glow discgolf: utstyr og regler", "glow-discgolf-utstyr-og-regler", "Sesong/Utstyr", "Middels", "Kommersiell/research"],
  ["Hvordan unngå å miste disker i høyt gress", "hvordan-unnga-a-miste-disker-i-hoyt-gress", "Sesong/Evergreen", "Middels", "Problemløsning"]
];

const clusters = [
  ["Nybegynner", "/nybegynnerguide.html", "hva-er-discgolf, hvordan-begynne, første runde, vanlige feil", "kastelengde, hvorfor disken går til venstre, distance-driver-forbehold", "Høy", "Sterk klynge, bør få flere problemløsningssider."],
  ["Regler", "/regler.html", "regler for nybegynnere, etikette, turneringer", "PDGA-regler forklart mer komplett, OB/mandos forklart", "Høy", "Må holdes mot offisielle PDGA-kilder."],
  ["Teknikk", "/teknikk/", "hyzer, nose angle, brace, forehand-feil, vind", "approach, release, scramble, roller", "Middels", "Trenger praktiske eksempler og øvelser."],
  ["Trening", "/trening/", "treningsprogram, putting, backhand drills, forehand drills", "måle kastelengde, 30 min felttrening, hjemmeøvelser", "Høy", "God støtte til teknikk og turnering."],
  ["Utstyr", "/utstyr/", "startsett, putter, midrange, fairway, bag, kurv", "plast, sko, retriever, brukt vs nytt", "Høy", "Sterk affiliate-klynge, men må beholdes redaksjonell."],
  ["Tester og sammenligninger", "/tester.html og /sammenligninger.html", "startsett, putter vs midrange, bag vs sekk", "faktiske testnotater, testmetode per produktkategori", "Høy", "Må ikke love fysisk test uten data."],
  ["Baner", "/baner/", "bysider, 27 banesider, nybegynnervennlige, 18-hull", "fylkeshuber, baner nær byer, metode for populære baner", "Høy", "Lokal SEO er viktig, men kilder må verifiseres."],
  ["Klubber", "/klubber/", "Oslo, Bergen, Trondheim, Stavanger", "flere klubber, ukesgolf, sende rettelser", "Middels", "Krever manuell verifisering."],
  ["Turneringer", "/turneringer/", "første turnering, PDGA-rating, klasser, terminliste", "utstyr til turnering, velge klasse, ukesgolf", "Høy", "Ikke publiser falske datoer."],
  ["Sesong", "/artikler.html", "vår, sommer, høst, vinter, regn, vind", "høyt gress, glow, vått føre", "Middels", "Norsk vær gir nyttig nisje."],
  ["Lokal SEO", "/baner/", "Oslo, Bergen, Trondheim, Stavanger, Tromsø m.fl.", "Vestfold, Akershus, baner nær Oslo/Bergen", "Høy", "Skal bygges med sikre kilder."],
  ["Affiliate", "/affiliate-info.html", "produktguider, sammenligninger, kommersiell disclosure", "ekte lenker, partnerpolicy, konvertering uten press", "Middels", "Sekundær inntekt, ikke styrende."],
  ["Ordliste/begreper", "/guider/discgolf-ord-og-uttrykk.html", "flight numbers, stabilitet, hyzer/anhyzer", "OB, mando, C1/C2, ratingbegreper", "Middels", "Viktig internlenkingsknutepunkt."]
];

function brief(index, [title, slug, cluster, priority, intent]) {
  const type = cluster.includes("Utstyr") ? "Produktguide/research-basert sammenligning" :
    cluster.includes("Lokal") || cluster.includes("Baner") ? "Lokal SEO/baneguide" :
    cluster.includes("Turnering") ? "Turneringsguide" :
    cluster.includes("Teknikk") || cluster.includes("Trening") ? "Teknikk-/treningsartikkel" :
    "Guide";
  const affiliate = type.includes("Produkt") ? "Ja, men kun tydelig merket og uten falske priser/testpåstander." : "Nei/lav.";
  const research = type.includes("Produkt") ? "Research-basert. Må merkes hvis konkrete produkter sammenlignes." : "Guide/research. Faktapåstander må kildebelegges.";
  return `
# Artikkelbrief ${String(index).padStart(3, "0")}: ${title}

| Felt | Innhold |
|---|---|
| Arbeidstittel | ${title} |
| Endelig SEO-title | ${title} | Diskgolfguiden |
| Meta description | Praktisk norsk guide til ${title.toLowerCase()} med konkrete råd, interne lenker og tydelig kildebruk. |
| URL/slug | /guider/${slug}.html |
| Hovedsøkeord | ${title.toLowerCase()} |
| Sekundære søkeord | discgolf norsk, frisbeegolf, discgolf guide |
| Søkeintensjon | ${intent} |
| Målgruppe | Nybegynnere, hobbyspillere og norske discgolfspillere som trenger praktiske råd |
| Artikkeltype | ${type} |
| Innholdsklynge | ${cluster} |
| Brukerreise | Fra spørsmål/problem til trygg neste handling |
| Foreslått H1 | ${title} |
| CTA/neste steg | Lenke til relevant hub, utstyrsguide, baner eller trening |
| Affiliate-merking | ${affiliate} |
| Research-merking | ${research} |
| Publiseringsstatus | Brief klar |
| Ansvarlig | Diskgolfguiden |
| Dato | ${today} |

## Hovedspørsmål

- Hva prøver leseren å finne ut?
- Hvilke valg eller feil bør artikkelen hjelpe leseren med?
- Hva bør leseren gjøre etter å ha lest?

## Foreslått struktur

- Kort ingress med praktisk svar.
- Kort oppsummert.
- Hovedforklaring.
- Praktiske eksempler fra norske baner eller typiske spillere.
- Vanlige feil.
- FAQ hvis spørsmålet egner seg.
- Relaterte guider.
- Kilder.
- Sist oppdatert.

## Kilder som må sjekkes

- PDGA der regler/rating er relevant.
- NAIF/klubb/arrangør for norsk organisering.
- UDisc/klubb/kommune for baneinformasjon, uten kopiering.
- Produsentens egne sider for produktspesifikasjoner.

## Interne lenker inn

- Forside eller relevant hub.
- Nærmeste klyngeside.
- Minst én eksisterende støtteartikkel.

## Interne lenker ut

- /nybegynnerguide.html
- /artikler.html
- /utstyr/ eller /baner/ der relevant.
`;
}

write("docs/editorial-production-system.md", `
# Redaksjonelt produksjonssystem

Sist oppdatert: ${today}

Kvalitet går foran volum. Ingen artikler skal publiseres bare for å fylle siden.

## Arbeidsflyt

1. Ideer oppstår fra Search Console, content-bank, brukerbehov, banedata, produktdata, klubbtips og egne erfaringer.
2. Ideer prioriteres med poengmodellen i \`content-prioritization-framework.md\`.
3. En artikkelbrief lages før skriving.
4. Research gjøres med primærkilder der det er mulig.
5. Utkast skrives med konkrete råd og egne formuleringer.
6. Kilder legges nederst når fakta brukes.
7. Internlenker planlegges både inn og ut.
8. SEO-title/meta skrives for intensjon, ikke søkeordspam.
9. Siden kvalitetssjekkes med \`pre-publish-checklist.md\`.
10. Artikkelen publiseres som statisk HTML.
11. \`sitemap.xml\` oppdateres hvis siden skal indekseres.
12. Endringen dokumenteres i \`content-production-log.md\`.
13. Artikkelen følges opp etter Search Console-data.
14. Artikkelen oppdateres når den er utdatert, svak eller har trafikkpotensial.
15. Artikler slås sammen når de dekker samme intensjon og ingen av dem står sterkt alene.
`);

write("docs/content-pipeline.md", `
# Innholdspipeline

Sist oppdatert: ${today}

Statuser: Idé, Brief klar, Research pågår, Klar til skriving, Utkast, Trenger faktasjekk, Trenger kilder, Trenger internlenker, Trenger SEO, Klar til publisering, Publisert, Trenger oppdatering, Arkiveres.

| Tittel | URL/slug | Klynge | Status | Prioritet | Søkeintensjon | Neste steg |
|---|---|---|---|---|---|---|
${planned.map((item, i) => `| ${item[0]} | /guider/${item[1]}.html | ${item[2]} | ${i < 25 ? "Brief klar" : "Idé"} | ${item[3]} | ${item[4]} | Research og kildekontroll |`).join("\n")}
| Tester | /tester.html | Tester | Trenger forbedring | Middels | Kommersiell/test | Krever faktiske testnotater før sterke konklusjoner |
| Klubber Bergen | /klubber/bergen/ | Klubber | Trenger kilder | Høy | Lokal informasjon | Finn verifiserbar klubbkilde |
| Klubber Stavanger | /klubber/stavanger/ | Klubber | Trenger kilder | Høy | Lokal informasjon | Finn verifiserbar klubbkilde |
`);

write("docs/content-prioritization-framework.md", `
# Prioriteringsmodell for innhold

Sist oppdatert: ${today}

Gi hvert forslag 1-5 poeng per faktor. Bruk poengene som støtte, ikke som fasit.

| Faktor | Poeng 1 | Poeng 3 | Poeng 5 |
|---|---|---|---|
| Søkeintensjon | Uklar | Tydelig | Sterk og konkret |
| Trafikkpotensial | Lavt | Middels | Høyt |
| Konkurransenivå | Høy konkurranse | Middels | Lav/moderat |
| Lesernytte | Lav | Nyttig | Svært viktig |
| Internlenkingsverdi | Svak | Støtter én klynge | Binder flere viktige klynger |
| Affiliate-potensial | Ingen | Mulig | Sterkt, men naturlig |
| Autoritetsverdi | Lav | Middels | Bygger tydelig tillit |
| Lokal SEO-verdi | Ingen | Lokal støtte | Sterk lokal inngang |
| Produksjonsinnsats | Høy/vanskelig | Middels | Lett å lage godt |
| Klyngestøtte | Isolert | Støtter klynge | Kritisk støtteside/hub |
| Search Console-behov | Ingen data | Mulig behov | Data viser tydelig mulighet |

## Prioritering

- 20+ poeng = høy prioritet.
- 14-19 poeng = middels prioritet.
- Under 14 poeng = lav prioritet.

Redaksjonell vurdering overstyrer poeng når et tema er viktig for troverdighet, sikkerhet, regler eller brukeropplevelse.
`);

write("docs/templates/article-brief-template.md", `
# Artikkelbrief-mal

| Felt | Innhold |
|---|---|
| Arbeidstittel |  |
| Endelig SEO-title |  |
| Meta description |  |
| URL/slug |  |
| Hovedsøkeord |  |
| Sekundære søkeord |  |
| Søkeintensjon |  |
| Målgruppe |  |
| Artikkeltype |  |
| Innholdsklynge |  |
| Brukerreise |  |
| Hovedspørsmål |  |
| Foreslått H1 |  |
| Foreslåtte H2/H3 |  |
| Praktiske eksempler |  |
| Vanlige feil |  |
| FAQ-spørsmål |  |
| Kilder som må sjekkes |  |
| Interne lenker inn |  |
| Interne lenker ut |  |
| CTA/neste steg |  |
| Affiliate-merking |  |
| Research-merking |  |
| Publiseringsstatus |  |
| Ansvarlig |  |
| Dato |  |
`);

write("docs/templates/beginner-guide-template.md", `
# Mal: Nybegynnerguide

- SEO-title:
- Meta description:
- H1:
- Kort ingress:
- Hvem guiden passer for:
- Kort oppsummert:
- Hovedforklaring:
- Steg-for-steg:
- Vanlige feil:
- Praktiske tips:
- Hva du bør gjøre videre:
- FAQ:
- Relaterte guider:
- Kilder:
- Sist oppdatert:

Regler: Skriv enkelt, forklar begreper, unngå unødvendig fagspråk, og lenk til ordliste, regler, utstyr og første runde der det passer.
`);

write("docs/templates/product-guide-template.md", `
# Mal: Produktguide

- SEO-title:
- Meta description:
- H1:
- Affiliate-disclaimer:
- Research-/testmerking:
- Kort ingress:
- Kort oppsummert:
- Anbefalingstabell:
- Hva du bør se etter:
- Produktkort:
- Fordeler og ulemper:
- Hvem produktet passer for:
- Hvem produktet ikke passer for:
- Vanlige kjøpsfeil:
- FAQ:
- Relaterte guider:
- Kilder:
- Sist oppdatert:

Obligatorisk ved research-basert innhold:

> Dette er en research-basert sammenligning basert på produsentdata, offentlige spesifikasjoner og spillererfaringer. Produktene er ikke fysisk testet av Diskgolfguiden.

Ikke bruk "best i test", "testvinner" eller "vi har testet" uten fysisk test.
`);

write("docs/templates/course-page-template.md", `
# Mal: Baneside

- SEO-title:
- Meta description:
- H1 med banenavn:
- Sted/by/fylke:
- Antall hull hvis verifisert:
- Vanskelighetsgrad hvis trygt vurdert:
- Passer for nybegynnere hvis det kan vurderes forsiktig:
- Kort egenformulert beskrivelse:
- Praktisk info:
- Tips før du spiller:
- Hva du bør ha med:
- Eksterne lenker:
- Kilder:
- Sist sjekket:
- Relaterte baner:
- Relaterte guider:

Regler: Ikke kopier fra UDisc, klubber eller kommuner. Ikke bruk bilder uten tillatelse. Ikke dikt opp antall hull, fasiliteter eller banestatus. Bruk forsiktig språk ved usikkerhet.

Standardtekst:

> Banestatus kan endre seg. Sjekk alltid oppdatert informasjon fra klubb, arrangør eller banetjeneste før du drar.
`);

write("docs/templates/local-seo-page-template.md", `
# Mal: Lokal SEO-side

- SEO-title:
- Meta description:
- H1:
- Kort lokal ingress:
- Baner i området:
- Hvem banene passer for:
- Tips for nybegynnere i området:
- Lenker til klubber:
- Lenker til relevante guider:
- FAQ:
- Kilder:
- Sist oppdatert:

Regler: Ikke spam bynavn. Ikke påstå "beste bane" uten vurderingsgrunnlag. Ikke dikt opp lokale fakta. Bruk konkrete, verifiserbare opplysninger.
`);

write("docs/templates/tournament-guide-template.md", `
# Mal: Turneringsguide

- SEO-title:
- Meta description:
- H1:
- Kort ingress:
- Hvem guiden passer for:
- Forklaring av tema:
- Steg-for-steg:
- Begreper:
- Hva du bør forberede:
- Vanlige feil:
- FAQ:
- Offisielle kilder:
- Relaterte guider:
- Sist oppdatert:

Regler: Ikke publiser falske turneringer. Ikke oppgi gamle datoer som kommende. Ikke scrape terminlister. Lenke til offisielle kilder for oppdaterte datoer.
`);

write("docs/templates/technique-training-template.md", `
# Mal: Teknikk- og treningsartikkel

- SEO-title:
- Meta description:
- H1:
- Kort ingress:
- Hvem artikkelen passer for:
- Kort oppsummert:
- Teknisk forklaring:
- Vanlige feil:
- Øvelser:
- Treningsopplegg:
- Hvordan måle fremgang:
- Når du bør justere:
- Relaterte guider:
- Kilder hvis fakta brukes:
- Sist oppdatert:

Regler: Ikke lov raske resultater. Ikke gjør teknikk mer komplisert enn nødvendig. Bruk praktiske norske eksempler. Skill mellom nybegynnerråd og råd for viderekomne.
`);

write("docs/topic-cluster-map.md", `
# Klyngekart

Sist oppdatert: ${today}

| Klynge | Hubside | Støttesider | Manglende sider | Prioritet | Kommentar |
|---|---|---|---|---|---|
${clusters.map((row) => `| ${row.join(" | ")} |`).join("\n")}
`);

const gaps = [
  ["Kastelengde for nybegynnere mangler som egen side", "Typisk spørsmål og god støtte til nybegynnerklyngen", "Hvor langt bør en nybegynner kaste?", "Nybegynner", "Høy", "Lag guidebrief og publiser etter faktasjekk."],
  ["Distance-driver-forbehold mangler som egen side", "Forebygger feilkjøp og støtter utstyrsklyngen", "Hvorfor nybegynnere bør vente med distance drivers", "Nybegynner/Utstyr", "Høy", "Lag guide uten produktpress."],
  ["Plasttyper mangler full forklaring", "Høy affiliate-/produktnytte uten falske tester", "Baseplast vs premiumplast forklart", "Utstyr", "Høy", "Research med produsentkilder."],
  ["Sko/retriever/tilbehør er svakt dekket", "Nyttig norsk terrenginnhold", "Sko til discgolf / Disc retriever verdt det", "Utstyr", "Middels", "Lag research-basert guide."],
  ["Fylkes- og nærområde-huber mangler", "Sterk lokal SEO", "Discgolfbaner i Vestfold / nær Oslo", "Lokal SEO", "Høy", "Verifiser baner før publisering."],
  ["Ukesgolf mangler", "Binder klubber og turneringer", "Hvordan finne ukesgolf", "Klubber/Turneringer", "Høy", "Bruk klubber som kilder."],
  ["Fysiske tester mangler", "Viktig for kommersiell troverdighet", "3-disk starterbag test", "Tester", "Høy", "Vent til faktisk test er gjort."],
  ["Ordliste bør utvides", "Støtter nybegynnere og interne lenker", "OB, mando, C1/C2 forklart", "Ordliste", "Middels", "Legg til begreper når relaterte sider oppdateres."],
  ["Teknikk mangler approach/scramble", "Praktisk for norske skogsbaner", "Approach-kast forklart", "Teknikk", "Middels", "Lag øvelser og vanlige feil."],
  ["Turneringsforberedelse mangler", "Gjør konkurranse mindre skummelt", "Hva bør du ha med på turnering?", "Turneringer", "Høy", "Lenk til regler og trening."]
];

write("docs/content-gap-analysis.md", `
# Innholdsgap-analyse

Sist oppdatert: ${today}

| Gap | Hvorfor viktig | Foreslått side | Klynge | Prioritet | Neste steg |
|---|---|---|---|---|---|
${gaps.map((row) => `| ${row.join(" | ")} |`).join("\n")}
`);

const weeks = [
  ["1", "2026-06-08", "Hvor langt bør en nybegynner kaste?", "Hvorfor går disken alltid til venstre?", "Hva er discgolf?", "Nybegynner", "Forside, nybegynnerhub, vanlige feil", "PDGA/L64 beginner", "Høy", "Brief klar"],
  ["2", "2026-06-15", "Hvorfor nybegynnere bør vente med distance drivers", "Lett disk vs tung disk", "Beste disker for nybegynnere", "Utstyr", "Utstyr, flight numbers, diskvalg", "Produsentdata", "Høy", "Brief klar"],
  ["3", "2026-06-22", "Baseplast vs premiumplast forklart", "Brukt eller nytt discgolfutstyr?", "Utstyrshub", "Utstyr", "Produktguider, affiliate-info", "Produsenter/butikker", "Høy", "Brief klar"],
  ["4", "2026-06-29", "Discgolfbaner nær Oslo", "Nybegynnervennlige baner i Oslo", "Oslo-baneside", "Lokal SEO", "Baner, nybegynner, utstyr", "UDisc/klubb", "Høy", "Brief klar"],
  ["5", "2026-07-06", "Approach-kast forklart", "Slik får du renere backhand-release", "Backhand for nybegynnere", "Teknikk", "Teknikkhub, trening", "Egne notater", "Middels", "Brief klar"],
  ["6", "2026-07-13", "Puttingøvelser hjemme", "Hvordan måle kastelengde", "Putting for nybegynnere", "Trening", "Trening, putterguide", "Egne notater", "Høy", "Brief klar"],
  ["7", "2026-07-20", "Hvordan finne ukesgolf", "Hva bør du ha med på turnering?", "Turneringer", "Klubber/Turneringer", "Klubber, regler, PDGA-rating", "Klubber/NAIF", "Høy", "Brief klar"],
  ["8", "2026-07-27", "Discgolfbaner nær Bergen", "Discgolf i regn oppdatert", "Bergen-baneside", "Lokal SEO/Sesong", "Baner, sesong", "UDisc/klubb", "Middels", "Brief klar"],
  ["9", "2026-08-03", "Sko til discgolf", "Disc retriever: verdt det?", "Billig discgolfutstyr", "Utstyr", "Utstyr, baner", "Produsenter/butikker", "Middels", "Brief klar"],
  ["10", "2026-08-10", "Hvordan velge riktig klasse i turnering", "Ukesgolf for nybegynnere", "PDGA-rating", "Turneringer", "Turneringer, regler, klubber", "PDGA/NAIF", "Høy", "Brief klar"],
  ["11", "2026-08-17", "Discgolfbaner i Vestfold", "Hvordan velge bane som nybegynner", "Nybegynnervennlige baner", "Lokal SEO/Baner", "Baner, nybegynner", "UDisc/klubb/kommune", "Middels", "Brief klar"],
  ["12", "2026-08-24", "Glow discgolf: utstyr og regler", "Hvordan unngå å miste disker i høyt gress", "Vinterdiscgolf", "Sesong/Utstyr", "Sesong, utstyr, regler", "PDGA/produsenter", "Middels", "Brief klar"]
];

write("docs/90-day-content-production-plan.md", `
# 90-dagers produksjonsplan

Sist oppdatert: ${today}

Planen prioriterer to gode publiseringer per uke og én oppdatering, ikke massepublisering.

| Uke | Publiseringsdato | Hovedartikkel | Støtteartikkel | Gammel artikkel som oppdateres | Klynge | Internlenker | Kilder som må sjekkes | Prioritet | Estimert innsats |
|---|---|---|---|---|---|---|---|---|---|
${weeks.map((w) => `| ${w[0]} | ${w[1]} | ${w[2]} | ${w[3]} | ${w[4]} | ${w[5]} | ${w[6]} | ${w[7]} | ${w[8]} | 4-8 timer |`).join("\n")}
`);

write("docs/weekly-publishing-routine.md", `
# Ukentlig publiseringsrutine

Sist oppdatert: ${today}

| Dag | Arbeid |
|---|---|
| Mandag | Velg artikkel fra pipeline, sjekk brief og kilder. |
| Tirsdag | Skriv utkast og legg inn struktur. |
| Onsdag | Legg inn interne lenker, title/meta og FAQ hvis relevant. |
| Torsdag | Kvalitetssjekk, faktasjekk og mobilvisning. |
| Fredag | Publiser, oppdater sitemap, produksjonslogg og neste forbedringspunkt. |

## Minimum før publisering

- Title, meta og én H1.
- Minst 3 relevante interne lenker ut.
- Kilder der fakta brukes.
- Sist oppdatert.
- Mobilvennlig.
- Ingen falske påstander.
- Ingen AI-fyll.
- Ingen brutte lenker.
`);

write("docs/pre-publish-checklist.md", `
# Sjekkliste før publisering

## Innhold

- [ ] Har siden tydelig målgruppe?
- [ ] Svarer siden på søkeintensjonen?
- [ ] Er teksten praktisk nyttig?
- [ ] Er språket naturlig norsk?
- [ ] Er generiske avsnitt fjernet?
- [ ] Har siden konkrete eksempler?
- [ ] Har siden vanlige feil der det passer?
- [ ] Har siden neste steg for leseren?

## SEO

- [ ] Unik title.
- [ ] Meta description.
- [ ] Én H1.
- [ ] Ryddig H2/H3.
- [ ] Interne lenker.
- [ ] God URL.
- [ ] Riktig klynge.
- [ ] Avklart om siden skal inn i sitemap.

## Troverdighet

- [ ] Kilder der fakta brukes.
- [ ] Usikker informasjon merket.
- [ ] Research-basert produktinnhold merket.
- [ ] Affiliate-disclaimer der det trengs.
- [ ] Fysisk test brukes bare der det stemmer.
- [ ] Bilder er lovlige.

## Teknisk

- [ ] Interne lenker fungerer.
- [ ] Mobilvisning fungerer.
- [ ] Tabeller er lesbare.
- [ ] Bilder er optimalisert.
- [ ] Ingen private data.
`);

write("docs/content-quality-levels.md", `
# Kvalitetsnivå for artikler

Sist oppdatert: ${today}

## Nivå 1: Minimum publiserbar

God struktur, tydelig søkeintensjon, grunnleggende kilder, internlenker og ingen falske påstander.

## Nivå 2: Sterk artikkel

Praktiske eksempler, FAQ, god internlenking, oppdatert-dato, god meta, relaterte artikler og bedre forklaringer.

## Nivå 3: Autoritetsartikkel

Grundig og komplett, sterke kilder, sammenligninger, tabeller/oversikter, flere praktiske eksempler, god E-E-A-T og klar rolle i klyngen.

Nye artikler bør minst være nivå 1. Viktige hub-sider bør jobbes mot nivå 3.
`);

write("docs/internal-linking-standard.md", `
# Standard for internlenking

Sist oppdatert: ${today}

- Alle nye artikler skal ha minst 3 relevante interne lenker ut.
- Alle viktige nye artikler skal få minst 2 interne lenker inn fra eksisterende sider.
- Hub-sider skal lenke til støttesider.
- Støttesider skal lenke tilbake til hub.
- Produktguider skal lenke til forklarende guider.
- Banesider skal lenke til nybegynner, regler og utstyr.
- Turneringssider skal lenke til regler, PDGA/rating og trening.
- Ikke bruk unaturlige ankertekster.
- Ikke lenk bare for SEO. Lenken skal hjelpe leseren.

Gode ankertekster: "flight numbers forklart", "beste discgolfdisker for nybegynnere", "discgolf regler for nybegynnere", "slik spiller du din første runde", "hva trenger du av discgolfutstyr".
`);

write("docs/source-policy.md", `
# Kildestandard

Sist oppdatert: ${today}

| Kilde | Bruk |
|---|---|
| PDGA | Regler, Competition Manual, rating og offisiell discgolfkontekst |
| NAIF Disksport | Norsk organisering, terminliste og nasjonal konkurransekontekst |
| UDisc | Generell baneinformasjon, uten kopiering av tekst/anmeldelser |
| Disc Golf Scene | Turneringsrelatert informasjon der arrangører bruker det |
| Produsenter | Produktspesifikasjoner, flight numbers og plast |
| Norske klubber | Lokal informasjon, baner, ukesgolf og rettelser |
| Kommuner | Offentlig baneinformasjon |
| Nettbutikker | Støtte for produkttilgjengelighet, ikke eneste fagkilde |

Regler: Ikke kopier tekst, ikke bruk én usikker kilde som fasit, oppgi kilder nederst, bruk egne formuleringer, merk usikker informasjon og ikke bruk bilder uten tillatelse.
`);

write("docs/ai-content-policy.md", `
# AI-policy for innhold

Sist oppdatert: ${today}

AI kan brukes til struktur, utkast, briefs, sjekklister, internlenkingsforslag, meta descriptions, ideer og språkvask.

AI skal ikke brukes til å finne på erfaringer, tester, kilder, trafikkdata, kopiere tekst, lage generisk fyllinnhold eller publisere uten menneskelig kontroll.

Alle AI-assisterte artikler må faktasjekkes og redigeres før publisering.
`);

write("docs/editorial-dashboard.md", `
# Redaksjonelt dashboard

Sist oppdatert: ${today}

## Neste 10 artikler

| Prioritet | Artikkel | Klynge | Neste steg |
|---|---|---|---|
${planned.slice(0, 10).map((p, i) => `| ${i + 1} | ${p[0]} | ${p[2]} | Research og utkast |`).join("\n")}

## Neste 10 oppdateringer

| Side | Hvorfor | Prioritet |
|---|---|---|
| /tester.html | Trenger faktiske testnotater | Høy |
| /klubber/bergen/ | Trenger bedre kilder | Høy |
| /klubber/stavanger/ | Trenger bedre kilder | Høy |
| /utstyr/ | Ekte affiliate-lenker når avtaler finnes | Middels |
| /baner/oslo/ | Flere klubb-/kommunekilder | Middels |
| /guider/hva-er-discgolf.html | Revider etter Search Console-data | Middels |
| /guider/flight-numbers.html | Legg inn flere eksempler | Middels |
| /turneringer/pdga-rating/ | Sjekk mot PDGA | Høy |
| /affiliate-info.html | Revider ved partner | Middels |
| /redaksjonelle-retningslinjer/ | Oppdater når fysisk test starter | Høy |

## Neste arbeidsøkt

Lag første nye artikkel fra brief 001 eller oppdater \`tester.html\` med tydeligere teststatus og metode.
`);

write("docs/publishing-packages.md", `
# Publiseringspakker

## Pakke A: Nybegynner

1 hubside, 4 støtteartikler, 1 FAQ-artikkel, internlenking og sitemap.

## Pakke B: Produkt

1 kjøpsguide, 2 sammenligninger, 1 forklaringsartikkel, produktkort og affiliate-disclaimer.

## Pakke C: Lokal SEO

1 byside, 3 banesider, 1 klubbseksjon og internlenker til nybegynner og utstyr.

## Pakke D: Teknikk

1 hovedguide, 3 øvelsesartikler og 1 vanlige feil-artikkel.

## Pakke E: Oppdatering

5 gamle artikler, title/meta, internlenker, kilder, FAQ og sitemap-sjekk.
`);

write("docs/contributor-guidelines.md", `
# Bidragsrutiner

Sist oppdatert: ${today}

Bidragsytere kan foreslå artikler, sende rettelser, banetips, klubbinfo, produktforslag og bilder med dokumentert tillatelse.

## Krav

- Oppgi kilder.
- Skriv med egne ord.
- Merk interessekonflikter.
- Ikke send kopiert tekst.
- Ikke send bilder uten tillatelse.
- Ikke skjult reklame.
- Ikke falske tester.
- Ikke påstander uten kilde.

Tonen skal være praktisk, norsk, tydelig og hjelpsom.
`);

write("docs/tone-of-voice.md", `
# Tone of voice

Sist oppdatert: ${today}

Diskgolfguiden skal skrive norsk, praktisk, tydelig og hjelpsomt. Tonen skal ikke være ovenfra-og-ned, for teknisk for nybegynnere, for selgende eller AI-aktig.

## Eksempler

Dårlig: "Optimaliser din discgolfreise med den ultimate guiden."

Bedre: "Her får du en enkel forklaring på hva du trenger for å komme i gang med discgolf."

Dårlig: "Denne disken er fantastisk for alle."

Bedre: "Denne typen disk kan passe godt for nye spillere som vil ha en lettkastet midrange."
`);

write("docs/editorial-calendar.md", `
# Redaksjonell kalender

Sist oppdatert: ${today}

| Uke | Publiseringsdato | Hovedartikkel | Støtteartikkel | Gammel artikkel som skal oppdateres | Klynge | Internlenker | Kilder som må sjekkes | Prioritet | Status |
|---|---|---|---|---|---|---|---|---|---|
${weeks.map((w) => `| ${w[0]} | ${w[1]} | ${w[2]} | ${w[3]} | ${w[4]} | ${w[5]} | ${w[6]} | ${w[7]} | ${w[8]} | ${w[9]} |`).join("\n")}
`);

for (let i = 0; i < planned.length; i += 1) {
  write(`docs/briefs/${String(i + 1).padStart(3, "0")}-${planned[i][1]}.md`, brief(i + 1, planned[i]));
}

const docsReadme = readMaybe("docs/README.md");
if (!docsReadme.includes("## Redaksjonell produksjon")) {
  write("docs/README.md", `${docsReadme}

## Redaksjonell produksjon

| Fil | Bruk |
|---|---|
| \`editorial-production-system.md\` | Hovedsystem for produksjon av nytt innhold |
| \`content-pipeline.md\` | Status og kø for planlagte artikler |
| \`content-prioritization-framework.md\` | Poengmodell for prioritering |
| \`topic-cluster-map.md\` | Oversikt over innholdsklynger |
| \`content-gap-analysis.md\` | Hull som bør tettes |
| \`90-day-content-production-plan.md\` | 12-ukers produksjonsplan |
| \`weekly-publishing-routine.md\` | Ukentlig arbeidsflyt |
| \`pre-publish-checklist.md\` | Sjekkliste før publisering |
| \`editorial-dashboard.md\` | Rask oversikt over neste arbeid |
| \`publishing-packages.md\` | Standardpakker for fremtidige innholdsøkter |
| \`source-policy.md\` | Kildestandard |
| \`ai-content-policy.md\` | Regler for AI-assistert innhold |
| \`contributor-guidelines.md\` | Rutine for bidragsytere |
| \`tone-of-voice.md\` | Skrivestil og eksempler |

## Maler og briefs

| Fil/mappe | Bruk |
|---|---|
| \`templates/article-brief-template.md\` | Standard artikkelbrief |
| \`templates/beginner-guide-template.md\` | Nybegynnerguide |
| \`templates/product-guide-template.md\` | Produktguide |
| \`templates/course-page-template.md\` | Baneside |
| \`templates/local-seo-page-template.md\` | Lokal SEO-side |
| \`templates/tournament-guide-template.md\` | Turneringsguide |
| \`templates/technique-training-template.md\` | Teknikk/trening |
| \`briefs/\` | 25 produksjonsklare briefs |
`);
}

const scriptsDoc = readMaybe("docs/scripts.md");
if (!scriptsDoc.includes("check-content-quality.js")) {
  write("docs/scripts.md", `${scriptsDoc}

| Innholdskvalitet | \`node scripts/check-content-quality.js\` | Sjekker title, meta, H1, oppdatert-dato, interne lenker, disclaimere, research-merking og placeholders | Rett siden eller dokumenter hvorfor avviket er bevisst |
`);
}

const log = readMaybe("docs/content-production-log.md");
if (!log.includes("Fase 12 redaksjonell produksjonsmaskin")) {
  write("docs/content-production-log.md", `${log}

## ${today} - Fase 12 redaksjonell produksjonsmaskin

| Dato | Tittel | URL | Klynge | Status | Neste steg | Kommentar |
|---|---|---|---|---|---|---|
| ${today} | Redaksjonelt produksjonssystem | /docs/editorial-production-system.md | Drift/Innhold | Opprettet | Bruk ved nye artikler | System og rutiner, ikke publisert artikkel |
| ${today} | 25 artikkelbriefs | /docs/briefs/ | Innhold | Brief klar | Velg første artikkel fra pipeline | Ingen artikler masseprodusert |
| ${today} | Klyngekart og gap-analyse | /docs/topic-cluster-map.md | Innholdsstrategi | Opprettet | Bruk i 90-dagers plan | Basert på eksisterende content-bank og publiserte sider |
`);
}

write("docs/phase-12-editorial-system-log.md", `
# Fase 12: Redaksjonell produksjonsmaskin

Dato: ${today}

## Levert

- Produksjonsmodell, pipeline og prioriteringssystem.
- 7 innholdsmaler.
- 25 konkrete briefs.
- Klyngekart, gap-analyse, 90-dagers plan og ukentlig publiseringsrutine.
- Standarder for kvalitet, internlenking, kilder, AI-bruk, bidrag og tone.
- Redaksjonelt dashboard og publiseringspakker.

## Ikke gjort

- Ingen nye artikler ble publisert.
- Ingen URL-er ble endret.
- Ingen backend, database, API-nøkler eller private data ble lagt inn.
`);

console.log(JSON.stringify({ docs: "phase-12", briefs: planned.length, clusters: clusters.length, gaps: gaps.length }, null, 2));
