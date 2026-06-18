import { readFileSync, writeFileSync } from "node:fs";
import { basename } from "node:path";

const baseUrl = "https://diskgolfutstyr.no";
const updated = "2026-06-03";

const publishedPages = [
  "",
  "nybegynnerguide.html",
  "artikler.html",
  "regler.html",
  "utstyrsguide.html",
  "tester.html",
  "sammenligninger.html",
  "baneguide.html",
  "turneringer-ranking.html",
  "om.html",
  "affiliate-info.html",
  "guider/hva-er-discgolf.html",
  "guider/hvordan-begynne-med-discgolf.html",
  "guider/discgolf-regler-for-nybegynnere.html",
  "guider/hvilken-discgolfdisk-skal-jeg-velge.html",
  "guider/putter-midrange-og-driver-forklart.html",
  "guider/flight-numbers.html",
  "guider/beste-disker-for-nybegynnere.html",
  "guider/discgolf-startsett.html",
  "guider/vanlige-feil-for-nybegynnere.html",
  "guider/backhand-for-nybegynnere.html",
  "guider/forehand-for-nybegynnere.html",
  "guider/putting-for-nybegynnere.html",
  "guider/discgolf-ord-og-uttrykk.html",
  "guider/hva-trenger-du-av-discgolfutstyr.html",
  "guider/slik-spiller-du-forste-runde.html",
  "guider/hvordan-velge-riktig-putter.html",
  "guider/hvordan-velge-riktig-midrange.html",
  "guider/hvordan-velge-riktig-driver.html",
  "guider/discgolf-etikette.html",
  "guider/ofte-stilte-sporsmal-om-discgolf.html",
  "tester/beste-discgolf-startsett.html",
  "sammenligninger/fairway-driver-vs-distance-driver.html",
  "guider/norske-discgolfbaner.html",
  "utstyr/beste-discgolfdisker-for-nybegynnere.html",
  "utstyr/discgolf-startsett.html",
  "utstyr/beste-putter-for-nybegynnere.html",
  "utstyr/beste-midrange-for-nybegynnere.html",
  "utstyr/beste-fairway-driver-for-nybegynnere.html",
  "utstyr/beste-distance-driver-for-viderekomne.html",
  "utstyr/understable-stable-overstable-disker.html",
  "utstyr/beste-discgolfbag-for-nybegynnere.html",
  "utstyr/beste-discgolfkurv-til-hagen.html",
  "utstyr/discgolf-utstyrsliste.html",
  "utstyr/hva-koster-det-a-begynne-med-discgolf.html",
  "utstyr/billig-discgolfutstyr.html",
  "utstyr/gave-til-discgolfspiller.html",
  "utstyr/hvordan-velge-riktig-vekt-pa-discgolfdisk.html"
];

const legacyPages = [
  "beste-disc-golf-startsett.html",
  "beste-fairway-drivere.html",
  "beste-midrange-disker.html",
  "beste-puttere-nybegynnere.html",
  "beste-sekker-bagger.html",
  "guide-hvilke-disker-trenger-nybegynner.html",
  "guide-understable-stable-overstable.html",
  "guider.html"
];

function pathToFile(pagePath) {
  return pagePath === "" ? "index.html" : pagePath;
}

function pageUrl(pagePath) {
  return `${baseUrl}/${pagePath}`;
}

function titleOf(html) {
  return (html.match(/<title>(.*?)<\/title>/s) || [])[1] || "Diskgolfutstyr";
}

function descriptionOf(html) {
  return (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "Uavhengig norsk discgolfportal.";
}

function h1Of(html) {
  return ((html.match(/<h1[^>]*>(.*?)<\/h1>/s) || [])[1] || titleOf(html)).replace(/<[^>]+>/g, "");
}

function stripManagedSeo(html) {
  return html
    .replace(/\n  <meta name="twitter:[^>]+>/g, "")
    .replace(/\n  <script type="application\/ld\+json" data-managed-seo>[\s\S]*?<\/script>/g, "");
}

function ensureMeta(html, name, content) {
  const tag = `<meta name="${name}" content="${content}">`;
  const re = new RegExp(`<meta name="${name}" content="[^"]*">`);
  if (re.test(html)) return html.replace(re, tag);
  return html.replace("</head>", `  ${tag}\n</head>`);
}

function ensureProperty(html, property, content) {
  const tag = `<meta property="${property}" content="${content}">`;
  const re = new RegExp(`<meta property="${property}" content="[^"]*">`);
  if (re.test(html)) return html.replace(re, tag);
  return html.replace("</head>", `  ${tag}\n</head>`);
}

function ensureHeader(html, file) {
  const sub = file.includes("/");
  const prefix = sub ? "/" : "";
  const nav = `<header class="site-header"><div class="nav-wrap"><a class="brand" href="${prefix}index.html"><img src="${prefix}assets/logo-full.svg" alt="Diskgolfutstyr"></a><button class="menu-button" type="button" aria-label="Åpne meny" aria-expanded="false" data-menu-button>☰</button><nav class="nav" aria-label="Hovedmeny" data-nav><a href="${prefix}nybegynnerguide.html">Nybegynner</a><a href="${prefix}artikler.html">Guider</a><a href="${prefix}regler.html">Regler</a><a href="${prefix}utstyr/">Utstyr</a><a href="${prefix}tester.html">Tester</a><a href="${prefix}baneguide.html">Baner</a></nav></div></header>`;
  return html.replace(/<header class="site-header">[\s\S]*?<\/header>/, nav);
}

function breadcrumbs(pagePath, html) {
  const items = [
    { name: "Diskgolfutstyr", item: `${baseUrl}/` }
  ];
  if (pagePath.startsWith("guider/")) items.push({ name: "Guider", item: `${baseUrl}/artikler.html` });
  if (pagePath.startsWith("tester/")) items.push({ name: "Tester", item: `${baseUrl}/tester.html` });
  if (pagePath.startsWith("sammenligninger/")) items.push({ name: "Sammenligninger", item: `${baseUrl}/sammenligninger.html` });
  if (pagePath) items.push({ name: h1Of(html), item: pageUrl(pagePath) });
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item
    }))
  };
}

function schemaFor(pagePath, html) {
  const schemas = [];
  if (pagePath === "") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Diskgolfutstyr",
      url: `${baseUrl}/`,
      inLanguage: "nb-NO",
      description: descriptionOf(html),
      publisher: {
        "@type": "Organization",
        name: "Diskgolfutstyr",
        url: `${baseUrl}/`,
        logo: `${baseUrl}/assets/logo-icon.svg`
      }
    });
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Diskgolfutstyr",
      url: `${baseUrl}/`,
      logo: `${baseUrl}/assets/logo-icon.svg`
    });
  }

  if (pagePath.startsWith("guider/") || pagePath.startsWith("tester/") || pagePath.startsWith("sammenligninger/")) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: h1Of(html),
      description: descriptionOf(html),
      image: `${baseUrl}/assets/hero-banner.svg`,
      dateModified: updated,
      datePublished: updated,
      inLanguage: "nb-NO",
      mainEntityOfPage: pageUrl(pagePath),
      author: {
        "@type": "Organization",
        name: "Diskgolfutstyr"
      },
      publisher: {
        "@type": "Organization",
        name: "Diskgolfutstyr",
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/assets/logo-icon.svg`
        }
      }
    });
  }

  if (pagePath) schemas.push(breadcrumbs(pagePath, html));
  return schemas;
}

function addSeo(pagePath) {
  const file = pathToFile(pagePath);
  let html = readFileSync(file, "utf8");
  html = stripManagedSeo(html);
  html = ensureHeader(html, file);

  const title = titleOf(html);
  const description = descriptionOf(html);
  const url = pageUrl(pagePath);
  const type = pagePath.startsWith("guider/") || pagePath.startsWith("tester/") || pagePath.startsWith("sammenligninger/") ? "article" : "website";

  html = ensureMeta(html, "robots", "index, follow");
  html = ensureProperty(html, "og:title", title);
  html = ensureProperty(html, "og:description", description);
  html = ensureProperty(html, "og:type", type);
  html = ensureProperty(html, "og:url", url);
  html = ensureProperty(html, "og:image", `${baseUrl}/assets/hero-banner.svg`);
  html = html.replace("</head>", `  <meta name="twitter:card" content="summary_large_image">\n  <meta name="twitter:title" content="${title.replaceAll('"', "&quot;")}">\n  <meta name="twitter:description" content="${description.replaceAll('"', "&quot;")}">\n  <meta name="twitter:image" content="${baseUrl}/assets/hero-banner.svg">\n</head>`);

  const schemas = schemaFor(pagePath, html);
  if (schemas.length) {
    html = html.replace("</head>", `  <script type="application/ld+json" data-managed-seo>${JSON.stringify(schemas.length === 1 ? schemas[0] : schemas)}</script>\n</head>`);
  }

  writeFileSync(file, html, "utf8");
}

function noindexLegacy(file) {
  let html = readFileSync(file, "utf8");
  html = ensureHeader(html, file);
  if (/<meta name="robots"/.test(html)) {
    html = html.replace(/<meta name="robots" content="[^"]*">/, '<meta name="robots" content="noindex, follow">');
  } else {
    html = html.replace("</head>", '  <meta name="robots" content="noindex, follow">\n</head>');
  }
  writeFileSync(file, html, "utf8");
}

for (const page of publishedPages) addSeo(page);
for (const file of legacyPages) noindexLegacy(file);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${publishedPages.map((page) => `  <url><loc>${pageUrl(page)}</loc><lastmod>${updated}</lastmod></url>`).join("\n")}\n</urlset>\n`;
writeFileSync("sitemap.xml", sitemap, "utf8");

console.log(JSON.stringify({ published: publishedPages.length, legacyNoindex: legacyPages.length }, null, 2));
