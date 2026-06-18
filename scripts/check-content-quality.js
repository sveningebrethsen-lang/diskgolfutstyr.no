const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const issues = [];

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "node_modules"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    if (entry.isFile() && entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

function rel(file) {
  return path.relative(root, file).replaceAll("\\", "/");
}

for (const file of walk(root)) {
  const html = fs.readFileSync(file, "utf8");
  const fileRel = rel(file);
  const isLegacy = /noindex/i.test(html) || ["baneguide.html", "utstyrsguide.html"].includes(fileRel);
  const internalLinks = [...html.matchAll(/href="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((href) => href && !/^(https?:|mailto:|tel:|#|data:|javascript:)/i.test(href));

  if (!/<title>[^<]{10,}<\/title>/i.test(html)) issues.push([fileRel, "Mangler god title"]);
  if (!/<meta name="description" content="[^"]{40,}"/i.test(html)) issues.push([fileRel, "Mangler meta description"]);
  if ((html.match(/<h1\b/gi) || []).length !== 1) issues.push([fileRel, "Må ha nøyaktig én H1"]);
  if (!isLegacy && !/(Sist oppdatert|Oppdatert)/i.test(html)) issues.push([fileRel, "Mangler oppdatert-dato/oppdatert-merking"]);
  if (!isLegacy && internalLinks.length < 3) issues.push([fileRel, `Få interne lenker: ${internalLinks.length}`]);
  if (/\b(TODO|FIXME|lorem ipsum)\b/i.test(html)) issues.push([fileRel, "Har TODO/FIXME/lorem ipsum"]);
  if (/href="#"/i.test(html) && !/(affiliate-placeholder|Butikklenke kommer|Annonselenke kan bli lagt til senere)/i.test(html)) issues.push([fileRel, "Har href=\"#\" uten tydelig placeholder-kontekst"]);
  const requiresCommercialDisclaimer =
    fileRel.startsWith("utstyr/") ||
    /affiliate|sponsored nofollow|annonselenke/i.test(html);
  if (requiresCommercialDisclaimer) {
    if (!/(disclaimer|annonselenke|affiliate|provisjon)/i.test(html)) issues.push([fileRel, "Produkt/affiliate-nær side mangler disclaimer"]);
  }
  if (/Research-basert|research-basert/i.test(html) && !/(ikke fysisk testet|Produktene er ikke fysisk testet|research-basert sammenligning)/i.test(html)) {
    issues.push([fileRel, "Research-basert side mangler tydelig ikke-testet merking"]);
  }
}

const report = [
  "# Generert innholdskvalitetsrapport",
  "",
  `Generert: ${new Date().toISOString().slice(0, 10)}`,
  "",
  "| Fil | Funn |",
  "|---|---|",
  ...(issues.length ? issues.map(([file, issue]) => `| ${file} | ${issue} |`) : ["| Ingen funn | - |"])
].join("\n");

fs.writeFileSync(path.join(root, "docs", "generated-content-quality-report.md"), `${report}\n`, "utf8");

if (issues.length) {
  console.error(`Fant ${issues.length} innholdskvalitetsfunn. Se docs/generated-content-quality-report.md`);
  process.exit(1);
}

console.log("Content quality OK. Rapport: docs/generated-content-quality-report.md");
