import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

const baseUrl = "https://diskgolfguiden.no/";
const refs = /(?:href|src)="([^"]+)"/g;

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git") continue;
    const file = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(file));
    if (entry.isFile() && entry.name.endsWith(".html")) files.push(file);
  }
  return files;
}

function cleanPath(file) {
  const rel = relative(".", file).replaceAll("\\", "/");
  return rel.endsWith("/index.html") ? rel.replace(/index\.html$/, "") : rel;
}

function urlFromFile(file) {
  const rel = cleanPath(file);
  return rel === "index.html" ? "" : rel;
}

function titleOf(html) {
  return (html.match(/<title>(.*?)<\/title>/s) || [])[1]?.trim() || "";
}

function descriptionOf(html) {
  return (html.match(/<meta name="description" content="([^"]*)"/) || [])[1]?.trim() || "";
}

function h1Of(html) {
  return ((html.match(/<h1[^>]*>(.*?)<\/h1>/s) || [])[1] || "").replace(/<[^>]+>/g, "").trim();
}

function categoryOf(url) {
  if (url === "") return "Forside";
  if (url.startsWith("utstyr/") || url === "utstyrsguide.html") return "Utstyr";
  if (url.startsWith("baner/") || url === "baneguide.html") return "Baner";
  if (url.startsWith("klubber/")) return "Klubber";
  if (url.startsWith("turneringer/") || url === "turneringer-ranking.html") return "Turneringer";
  if (url.startsWith("teknikk/")) return "Teknikk";
  if (url.startsWith("trening/")) return "Trening";
  if (url.startsWith("guider/") || url === "nybegynnerguide.html" || url === "artikler.html") return "Guider";
  if (url.startsWith("tester/") || url === "tester.html") return "Tester";
  if (url.startsWith("sammenligninger/") || url === "sammenligninger.html") return "Sammenligninger";
  return "Om/annet";
}

function isInternal(target) {
  return !/^(https?:|mailto:|#|data:|javascript:)/.test(target);
}

function resolveTarget(file, target) {
  const cleanTarget = target.split("#")[0].split("?")[0];
  if (!cleanTarget) return "";
  const localPath = cleanTarget.startsWith("/")
    ? join(".", cleanTarget.slice(1))
    : join(dirname(file), cleanTarget);
  if (existsSync(localPath) && statSync(localPath).isDirectory() && readdirSync(localPath, { withFileTypes: true }).some((entry) => entry.name === "index.html")) {
    return cleanPath(join(localPath, "index.html"));
  }
  return cleanPath(localPath);
}

const htmlFiles = walk(".");
const sitemap = readFileSync("sitemap.xml", "utf8");
const sitemapUrls = new Set([...sitemap.matchAll(/<loc>https:\/\/diskgolfguiden\.no\/(.*?)<\/loc>/g)].map((match) => match[1]));

const pageByUrl = new Map();
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const url = urlFromFile(file);
  const outLinks = [];
  for (const match of html.matchAll(refs)) {
    if (!isInternal(match[1])) continue;
    const resolved = resolveTarget(file, match[1]);
    if (resolved && resolved.endsWith(".html") || resolved.endsWith("/")) outLinks.push(resolved);
  }

  pageByUrl.set(url, {
    file,
    url,
    title: titleOf(html),
    description: descriptionOf(html),
    h1: h1Of(html),
    category: categoryOf(url),
    outLinks: [...new Set(outLinks)],
    inLinks: [],
    inSitemap: sitemapUrls.has(url),
    hasSources: /<h2>Kilder<\/h2>|source-list|Kilder/.test(html),
    hasUpdated: /Oppdatert:|Sist oppdatert|last_checked|Sist kontrollert/.test(html),
    hasNextStep: /Les også|Neste steg|Gå videre|Start her|Se .*guide|Finn bane|Kontakt/.test(html)
  });
}

for (const page of pageByUrl.values()) {
  for (const target of page.outLinks) {
    const normalized = target === "index.html" ? "" : target;
    const targetPage = pageByUrl.get(normalized);
    if (targetPage) targetPage.inLinks.push(page.url || "/");
  }
}

function seoProblem(page) {
  const issues = [];
  if (!page.title) issues.push("Mangler title");
  if (page.title.length > 68) issues.push("Lang title");
  if (!page.description) issues.push("Mangler meta");
  if (page.description.length > 165) issues.push("Lang meta");
  if (!page.h1) issues.push("Mangler H1");
  if (!page.inSitemap && !page.url.startsWith("beste-") && !page.url.startsWith("guide-")) issues.push("Ikke i sitemap");
  if (page.inLinks.length < 2 && page.inSitemap) issues.push("Få interne innlenker");
  return issues.join(", ") || "OK";
}

function contentProblem(page) {
  const issues = [];
  if (!page.hasSources && ["Baner", "Klubber", "Turneringer", "Utstyr"].includes(page.category)) issues.push("Bør ha tydeligere kilder");
  if (!page.hasUpdated && page.inSitemap) issues.push("Mangler oppdatert-dato");
  if (!page.hasNextStep) issues.push("Mangler tydelig neste steg");
  return issues.join(", ") || "OK";
}

function priority(page) {
  if (["Forside", "Guider", "Utstyr", "Baner", "Klubber", "Turneringer"].includes(page.category)) return "Høy";
  if (seoProblem(page) !== "OK" || contentProblem(page) !== "OK") return "Middels";
  return "Lav";
}

const rows = [...pageByUrl.values()]
  .filter((page) => page.inSitemap)
  .sort((a, b) => priority(b).localeCompare(priority(a), "nb") || a.url.localeCompare(b.url, "nb"))
  .map((page) => {
    const seo = seoProblem(page);
    const content = contentProblem(page);
    const recommended = seo !== "OK" ? "Forbedre metadata/internlenker" : content !== "OK" ? "Legg til kilder, dato eller neste steg" : "Følg opp med Search Console-data";
    return `| /${page.url} | ${page.category} | ${seo === "OK" && content === "OK" ? "Publisert" : "Trenger forbedring"} | ${seo} | ${content} | ${priority(page)} | ${recommended} |`;
  });

const report = `# Site audit

Generert: 2026-06-03

Search Console-data var ikke tilgjengelig i repoet. Denne auditten er derfor basert på sitemap, HTML-metadata og internlenker.

| URL | Type | Status | SEO-problem | Innholdsproblem | Prioritet | Anbefalt tiltak |
|---|---|---|---|---|---|---|
${rows.join("\n")}
`;

writeFileSync("docs/site-audit.md", report, "utf8");
console.log(JSON.stringify({ pages: pageByUrl.size, sitemapPages: sitemapUrls.size }, null, 2));
