const fs = require("fs");
const path = require("path");

const inputDir = path.join("data", "search-console");
const outputFile = path.join("docs", "generated-search-console-report.md");
const expectedFiles = [
  "queries.csv",
  "pages.csv",
  "page-query.csv",
  "search-console-export.csv",
  "last-28-days.csv",
  "previous-28-days.csv",
  "last-3-months.csv"
];

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && quoted && next === '"') {
      cell += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(cell);
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  if (cell || row.length) {
    row.push(cell);
    if (row.some((value) => value.trim() !== "")) rows.push(row);
  }

  return rows;
}

function numberValue(value) {
  if (value == null) return 0;
  const normalized = String(value).replace("%", "").replace(",", ".").trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeHeader(value) {
  return String(value || "").toLowerCase().trim().replaceAll(" ", "_");
}

function readRows(file) {
  const rows = parseCsv(fs.readFileSync(file, "utf8"));
  if (!rows.length) return [];
  const headers = rows[0].map(normalizeHeader);
  return rows.slice(1).map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] || ""])));
}

function rowQuery(row) {
  return row.query || row.søkefrase || row.sokefrase || row.keyword || "";
}

function rowPage(row) {
  return row.page || row.side || row.url || row.landing_page || "";
}

function metrics(row) {
  const clicks = numberValue(row.clicks || row.klikk);
  const impressions = numberValue(row.impressions || row.visninger);
  const ctr = row.ctr ? numberValue(row.ctr) : impressions ? (clicks / impressions) * 100 : 0;
  const position = numberValue(row.position || row.posisjon || row.average_position || row.gjennomsnittlig_posisjon);
  return { clicks, impressions, ctr, position };
}

function table(headers, rows) {
  if (!rows.length) return "_Ingen rader funnet._\n";
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`)
  ].join("\n") + "\n";
}

if (!fs.existsSync(inputDir)) {
  fs.mkdirSync(inputDir, { recursive: true });
}

const files = expectedFiles
  .map((name) => path.join(inputDir, name))
  .filter((file) => fs.existsSync(file));

if (!files.length) {
  const report = `# Generated Search Console report

Generert: ${new Date().toISOString().slice(0, 10)}

Ingen Search Console-CSV-filer ble funnet i \`${inputDir}\`.

Legg inn en eller flere av disse filene og kjør scriptet på nytt:

- \`queries.csv\`
- \`pages.csv\`
- \`page-query.csv\`
- \`search-console-export.csv\`
- \`last-28-days.csv\`
- \`previous-28-days.csv\`
- \`last-3-months.csv\`

Se \`docs/search-console-data-format.md\` for forventede kolonner.
`;
  fs.writeFileSync(outputFile, report, "utf8");
  console.log(`No Search Console files found. Wrote ${outputFile}.`);
  process.exit(0);
}

const rows = files.flatMap((file) => readRows(file).map((row) => ({ ...row, _file: path.basename(file) })));
const withMetrics = rows.map((row) => ({ ...row, ...metrics(row), query: rowQuery(row), page: rowPage(row) }));

const lowCtr = withMetrics
  .filter((row) => row.impressions >= 20 && row.ctr > 0 && row.ctr < 3)
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 10);

const nearPageOne = withMetrics
  .filter((row) => row.position >= 8 && row.position <= 20)
  .sort((a, b) => a.position - b.position || b.impressions - a.impressions)
  .slice(0, 10);

const contentGaps = withMetrics
  .filter((row) => row.impressions >= 10 && !row.page)
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 10);

const report = `# Generated Search Console report

Generert: ${new Date().toISOString().slice(0, 10)}

Datakilder:

${files.map((file) => `- \`${file}\``).join("\n")}

## Høy visning, lav CTR

${table(["Søkefrase", "Side", "Klikk", "Visninger", "CTR", "Posisjon"], lowCtr.map((row) => [
  row.query || "-",
  row.page || "-",
  String(row.clicks),
  String(row.impressions),
  `${row.ctr.toFixed(1)}%`,
  row.position ? row.position.toFixed(1) : "-"
]))}

## Nær side 1

${table(["Søkefrase", "Side", "Klikk", "Visninger", "CTR", "Posisjon"], nearPageOne.map((row) => [
  row.query || "-",
  row.page || "-",
  String(row.clicks),
  String(row.impressions),
  `${row.ctr.toFixed(1)}%`,
  row.position ? row.position.toFixed(1) : "-"
]))}

## Mulige innholdshull

${table(["Søkefrase", "Klikk", "Visninger", "CTR", "Posisjon"], contentGaps.map((row) => [
  row.query || "-",
  String(row.clicks),
  String(row.impressions),
  `${row.ctr.toFixed(1)}%`,
  row.position ? row.position.toFixed(1) : "-"
]))}
`;

fs.writeFileSync(outputFile, report, "utf8");
console.log(`Wrote ${outputFile} from ${rows.length} rows.`);
