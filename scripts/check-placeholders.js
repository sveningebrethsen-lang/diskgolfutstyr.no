const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const reportPath = path.join(root, "docs", "placeholder-report.md");
const patterns = [
  { label: "href=\"#\"", regex: /href="#"/gi, publishBlocker: "Nei, hvis bevisst affiliate-placeholder" },
  { label: "TODO", regex: /\bTODO\b/gi, publishBlocker: "Ja" },
  { label: "FIXME", regex: /\bFIXME\b/gi, publishBlocker: "Ja" },
  { label: "KOMMER", regex: /\bKOMMER\b/gi, publishBlocker: "Vurderes" },
  { label: "TBD", regex: /\bTBD\b/gi, publishBlocker: "Ja" },
  { label: "Lorem ipsum", regex: /lorem ipsum/gi, publishBlocker: "Ja" },
  { label: "affiliate_url \"#\"", regex: /"affiliate_url"\s*:\s*"#"/gi, publishBlocker: "Nei, hvis dokumentert placeholder" },
  { label: "affiliateUrl \"#\"", regex: /"affiliateUrl"\s*:\s*"#"/gi, publishBlocker: "Nei, hvis dokumentert placeholder" },
  { label: "kilde mangler", regex: /kilde mangler/gi, publishBlocker: "Ja" },
  { label: "bilde mangler", regex: /bilde mangler/gi, publishBlocker: "Vurderes" }
];

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "node_modules"].includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(fullPath));
    if (entry.isFile() && [".html", ".md", ".json", ".js", ".mjs"].includes(path.extname(entry.name))) files.push(fullPath);
  }
  return files;
}

const findings = [];
for (const file of walk(root)) {
  const text = fs.readFileSync(file, "utf8");
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern.regex)) {
      findings.push({
        placeholder: pattern.label,
        file: path.relative(root, file).replaceAll("\\", "/"),
        line: text.slice(0, match.index).split(/\r?\n/).length,
        blocker: pattern.publishBlocker
      });
    }
  }
}

const rows = findings.map((item) => `| ${item.placeholder} | ${item.file}:${item.line} | Placeholder/kontrollpunkt | ${item.blocker} | Kontroller manuelt før publisering. |`);
const report = [
  "# Placeholder-rapport",
  "",
  `Generert: ${new Date().toISOString().slice(0, 10)}`,
  "",
  "Noen placeholders er bevisste, særlig affiliate-lenker som ikke er aktivert ennå. De skal ikke fjernes automatisk.",
  "",
  "| Placeholder | Fil | Type | Må fikses før publisering | Kommentar |",
  "|---|---|---|---|---|",
  rows.length ? rows.join("\n") : "| Ingen funn | - | - | - | - |"
].join("\n");

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${report}\n`, "utf8");
console.log(`Placeholder-funn: ${findings.length}. Rapport: docs/placeholder-report.md`);
