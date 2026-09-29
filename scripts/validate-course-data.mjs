import { readFileSync, writeFileSync } from "node:fs";
import {
  RECOMMENDED_PATHS,
  REQUIRED_PATHS,
  getPath,
  hasValue,
  sourceFreshness,
  validateDataset
} from "./lib/course-data-v1.mjs";

const dataPath = "data/courses/norway.json";
const reportPath = "docs/generated-course-data-report.md";
const courses = JSON.parse(readFileSync(dataPath, "utf8"));
const now = new Date();
const validation = validateDataset(courses, { now });

const sourceHosts = new Map();
let sourceCount = 0;
let qualifiedSourceCount = 0;
for (const course of courses) {
  for (const source of course.sources || []) {
    sourceCount += 1;
    if (["club", "operator", "municipality", "public_authority", "open_data", "official_course", "pdga_api"].includes(source.source_type)) {
      qualifiedSourceCount += 1;
    }
    let host = "ugyldig";
    try {
      host = new URL(source.source_url).hostname;
    } catch {}
    sourceHosts.set(host, (sourceHosts.get(host) || 0) + 1);
  }
}

const freshnessCounts = { fresh: 0, aging: 0, stale: 0 };
for (const course of courses) freshnessCounts[sourceFreshness(course, now).status] += 1;

function coverage(course, paths) {
  const present = paths.filter((path) => hasValue(getPath(course, path))).length;
  return `${present}/${paths.length}`;
}

function objectCoverage(object, fields) {
  const present = fields.filter((field) => hasValue(object?.[field])).length;
  return `${present}/${fields.length}`;
}

const lines = [
  "# Generert rapport for banedata",
  "",
  `Generert: ${now.toISOString().slice(0, 10)}`,
  "",
  "Autoritativ publiseringskilde: `data/courses/norway.json`.",
  "",
  "`data/courses.json` er historisk research/backlog og skal ikke brukes til publisering.",
  "",
  "## Aggregert status",
  "",
  "| Målepunkt | Resultat |",
  "|---|---:|",
  `| Poster | ${courses.length} |`,
  `| Legacy-poster | ${validation.legacy} |`,
  `| Klare for ny V1-publisering | ${validation.gateReady} |`,
  `| Valideringsfeil | ${validation.errors} |`,
  `| Advarsler | ${validation.warnings} |`,
  `| Informasjonspunkter | ${validation.infos} |`,
  `| Kilder totalt | ${sourceCount} |`,
  `| Kvalifiserte primær-/åpne kilder | ${qualifiedSourceCount} |`,
  `| Fresh (0–90 dager) | ${freshnessCounts.fresh} |`,
  `| Aging (91–180 dager) | ${freshnessCounts.aging} |`,
  `| Stale (>180 dager eller ugyldig dato) | ${freshnessCounts.stale} |`,
  "",
  "## Kildedomener",
  "",
  "| Domene | Antall |",
  "|---|---:|",
  ...[...sourceHosts.entries()].sort((a, b) => b[1] - a[1]).map(([host, count]) => `| ${host} | ${count} |`),
  "",
  "## Dekning per bane",
  "",
  "| Bane | Required | Recommended | Kilder | Alder/status | Koordinater | Fasiliteter | Tilgang | Egnethet | V1-gate | Feil/advarsler |",
  "|---|---:|---:|---:|---|---|---:|---:|---:|---|---:|"
];

for (const course of courses) {
  const result = validation.results.find((item) => item.id === course.id);
  const freshness = result.freshness;
  const coordinates = hasValue(course.location?.latitude) && hasValue(course.location?.longitude)
    ? course.location.coordinate_precision
    : "mangler";
  lines.push(
    `| ${course.name} | ${coverage(course, REQUIRED_PATHS)} | ${coverage(course, RECOMMENDED_PATHS)} | ${(course.sources || []).length} | ${freshness.age_days ?? "?"} dager / ${freshness.status} | ${coordinates} | ${objectCoverage(course.facilities, ["parking", "toilet", "practice_basket"])} | ${objectCoverage(course.access, ["fee", "season", "opening_hours", "booking_required"])} | ${objectCoverage(course.suitability, ["difficulty", "beginner_friendly", "family_friendly"])} | ${result.gate_ready ? "klar" : "legacy/incomplete"} | ${result.errors.length}/${result.warnings.length} |`
  );
}

lines.push("", "## Mangler per bane", "");
for (const course of courses) {
  const result = validation.results.find((item) => item.id === course.id);
  lines.push(`### ${course.name}`, "");
  lines.push(`- Required mangler: ${REQUIRED_PATHS.filter((path) => !hasValue(getPath(course, path))).join(", ") || "Ingen"}`);
  lines.push(`- Recommended mangler: ${RECOMMENDED_PATHS.filter((path) => !hasValue(getPath(course, path))).join(", ") || "Ingen"}`);
  lines.push(`- Kvalifiserte kilder: ${result.qualified_source_count}`);
  lines.push(`- Verifiserte faktagrupper utover navn/plassering: ${result.verified_fact_groups.join(", ") || "Ingen etter V1-krav"}`);
  lines.push(`- Issues: ${result.issues.map((item) => `${item.level}:${item.code}`).join(", ") || "Ingen"}`, "");
}

writeFileSync(reportPath, `${lines.join("\n").trimEnd()}\n`, "utf8");

console.log(JSON.stringify({
  courses: courses.length,
  legacy: validation.legacy,
  gateReady: validation.gateReady,
  errors: validation.errors,
  warnings: validation.warnings,
  infos: validation.infos,
  freshness: freshnessCounts,
  report: reportPath
}, null, 2));

if (validation.errors > 0) process.exit(1);
