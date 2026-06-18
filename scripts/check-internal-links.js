const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const reportPath = path.join(root, "docs", "generated-link-check-report.md");
const scannedExtensions = new Set([".html", ".md"]);
const missing = [];
const placeholders = [];
let checked = 0;

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", "node_modules"].includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(fullPath));
    if (entry.isFile() && scannedExtensions.has(path.extname(entry.name))) files.push(fullPath);
  }
  return files;
}

function normalizeTarget(sourceFile, href) {
  const clean = href.split("#")[0].split("?")[0];
  if (!clean) return null;
  if (clean.startsWith("/")) return path.join(root, clean.slice(1));
  return path.join(path.dirname(sourceFile), clean);
}

function targetExists(absTarget) {
  if (fs.existsSync(absTarget)) return true;
  if (fs.existsSync(`${absTarget}.html`)) return true;
  if (fs.existsSync(path.join(absTarget, "index.html"))) return true;
  return false;
}

function addIssue(list, file, href, line) {
  list.push({
    file: path.relative(root, file).replaceAll("\\", "/"),
    href,
    line
  });
}

for (const file of walk(root)) {
  const text = fs.readFileSync(file, "utf8");
  const linkPatterns = [
    /(?:href|src)="([^"]+)"/g,
    /\[[^\]]+\]\(([^)]+)\)/g
  ];

  for (const pattern of linkPatterns) {
    for (const match of text.matchAll(pattern)) {
      const href = match[1].trim();
      if (!href || /^(https?:|mailto:|tel:|data:|javascript:)/i.test(href)) continue;
      const line = text.slice(0, match.index).split(/\r?\n/).length;
      if (href === "#") {
        addIssue(placeholders, file, href, line);
        continue;
      }
      if (href.startsWith("#")) continue;

      checked += 1;
      const absTarget = normalizeTarget(file, href);
      if (absTarget && !targetExists(absTarget)) addIssue(missing, file, href, line);
    }
  }
}

const lines = [
  "# Generert lenkesjekkrapport",
  "",
  `Generert: ${new Date().toISOString().slice(0, 10)}`,
  "",
  `Interne lenker kontrollert: ${checked}`,
  `Brutte interne lenker: ${missing.length}`,
  `Placeholder-lenker: ${placeholders.length}`,
  "",
  "## Brutte interne lenker",
  "",
  missing.length ? "| Fil | Linje | Lenke |\n|---|---:|---|\n" + missing.map((issue) => `| ${issue.file} | ${issue.line} | ${issue.href} |`).join("\n") : "Ingen brutte interne lenker funnet.",
  "",
  "## Placeholder-lenker",
  "",
  placeholders.length ? "| Fil | Linje | Lenke |\n|---|---:|---|\n" + placeholders.map((issue) => `| ${issue.file} | ${issue.line} | ${issue.href} |`).join("\n") : "Ingen placeholder-lenker funnet."
];

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${lines.join("\n")}\n`, "utf8");

if (missing.length) {
  console.error(`Fant ${missing.length} brutte interne lenker. Se docs/generated-link-check-report.md`);
  process.exit(1);
}

console.log(`Internal links OK. Placeholders: ${placeholders.length}. Rapport: docs/generated-link-check-report.md`);
