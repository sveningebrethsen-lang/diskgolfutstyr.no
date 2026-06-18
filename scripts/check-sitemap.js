const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const sitemapPath = path.join(root, "sitemap.xml");
const reportPath = path.join(root, "docs", "generated-sitemap-check-report.md");
const issues = [];

if (!fs.existsSync(sitemapPath)) {
  issues.push("sitemap.xml finnes ikke.");
} else {
  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  const urls = [...sitemap.matchAll(/<loc>https:\/\/diskgolfguiden\.no\/([^<]*)<\/loc>/g)].map((match) => match[1]);
  const duplicates = urls.filter((url, index) => urls.indexOf(url) !== index);

  if (!urls.length) issues.push("Sitemap har ingen URL-er med https://diskgolfguiden.no/.");
  for (const duplicate of [...new Set(duplicates)]) issues.push(`Duplikat i sitemap: /${duplicate}`);

  for (const urlPath of urls) {
    const localPath = urlPath === "" ? "index.html" : urlPath.endsWith("/") ? path.join(urlPath, "index.html") : urlPath;
    if (!fs.existsSync(path.join(root, localPath))) issues.push(`Sitemap peker til manglende fil: /${urlPath} -> ${localPath}`);
    if (urlPath.startsWith("docs/")) issues.push(`Docs-side ligger i sitemap: /${urlPath}`);
    if (urlPath.includes("utstyrsguide.html") || urlPath.includes("baneguide.html")) issues.push(`Legacy-side ligger i sitemap: /${urlPath}`);
  }
}

const robotsPath = path.join(root, "robots.txt");
if (!fs.existsSync(robotsPath)) {
  issues.push("robots.txt finnes ikke.");
} else {
  const robots = fs.readFileSync(robotsPath, "utf8");
  if (!robots.includes("Sitemap: https://diskgolfguiden.no/sitemap.xml")) issues.push("robots.txt mangler korrekt Sitemap-linje.");
}

const report = [
  "# Generert sitemap-sjekk",
  "",
  `Generert: ${new Date().toISOString().slice(0, 10)}`,
  "",
  issues.length ? "## Funn\n\n" + issues.map((issue) => `- ${issue}`).join("\n") : "Ingen åpenbare sitemap- eller robots-feil funnet."
].join("\n");

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${report}\n`, "utf8");

if (issues.length) {
  console.error(`Fant ${issues.length} sitemap/robots-funn. Se docs/generated-sitemap-check-report.md`);
  process.exit(1);
}

console.log("Sitemap/robots OK. Rapport: docs/generated-sitemap-check-report.md");
