import { readFileSync, writeFileSync } from "node:fs";
import { RECOMMENDED_PATHS, getPath, hasValue, sourceFreshness, validateDataset } from "./lib/course-data-v1.1.mjs";

const dataPath = "data/courses/norway.json";
const reportPath = "docs/generated-course-data-report.md";
const courses = JSON.parse(readFileSync(dataPath, "utf8"));
const now = new Date();
const validation = validateDataset(courses, { now });

function coverage(course, paths) {
  return `${paths.filter((path) => hasValue(getPath(course, path))).length}/${paths.length}`;
}

function coreCoverage(course) {
  const checks = [
    hasValue(course.id), hasValue(course.slug), hasValue(course.name),
    hasValue(course.location?.municipality), hasValue(course.location?.county), hasValue(course.location?.country),
    typeof course.location?.latitude === "number" && typeof course.location?.longitude === "number" && hasValue(course.location?.coordinate_source_id),
    Number.isInteger(course.installed_holes) || (course.layouts || []).some((layout) => Number.isInteger(layout.holes)),
    hasValue(course.summary), hasValue(course.suitability?.difficulty?.value), hasValue(course.editorial?.source_checked_at)
  ];
  return `${checks.filter(Boolean).length}/${checks.length}`;
}

const lines = [
  "# Generert rapport for banedata", "", `Generert: ${now.toISOString().slice(0, 10)}`, "",
  "Autoritativ publiseringskilde: `data/courses/norway.json` (Course Schema V1.1).", "",
  "| Målepunkt | Resultat |", "|---|---:|",
  `| Poster | ${courses.length} |`, `| Legacy | ${validation.legacy} |`, `| Research complete | ${validation.researchComplete} |`,
  `| Validation pass | ${validation.validationPass} |`, `| Review required | ${validation.reviewRequired} |`,
  `| Verified | ${validation.verified} |`, `| Publishable | ${validation.publishable} |`, `| Withheld | ${validation.withheld} |`,
  `| Feil | ${validation.errors} |`, `| Advarsler | ${validation.warnings} |`, `| Info | ${validation.infos} |`, "",
  "## Status per bane", "",
  "| Bane | Kjerne | Recommended | Kilder | Kildealder | Konflikter | Research | Validate | Review | Publication | Feil/advarsler |",
  "|---|---:|---:|---:|---|---:|---|---|---|---|---:|"
];

for (const course of courses) {
  const result = validation.results.find((item) => item.id === course.id);
  const freshness = sourceFreshness(course, now);
  lines.push(`| ${course.name} | ${coreCoverage(course)} | ${coverage(course, RECOMMENDED_PATHS)} | ${(course.sources || []).length} | ${freshness.age_days ?? "?"} dager / ${freshness.status} | ${(course.source_conflicts || []).length} | ${result.research_complete ? "klar" : "mangler"} | ${result.validation_passed ? "bestått" : "stopp"} | ${result.review_approved ? "godkjent" : result.review_required ? "kreves" : course.editorial?.review_status || "-"} | ${course.publication?.state || "-"} | ${result.errors.length}/${result.warnings.length} |`);
}

lines.push("", "## Issues per bane", "");
for (const course of courses) {
  const result = validation.results.find((item) => item.id === course.id);
  lines.push(`### ${course.name}`, "", `- Pipeline: research=${result.research_complete}, validate=${result.validation_passed}, review_required=${result.review_required}, approved=${result.review_approved}, publishable=${result.publishable}`);
  lines.push(`- Issues: ${result.issues.map((item) => `${item.level}:${item.code}`).join(", ") || "Ingen"}`, "");
}

writeFileSync(reportPath, `${lines.join("\n").trimEnd()}\n`, "utf8");
console.log(JSON.stringify({ courses: courses.length, legacy: validation.legacy, researchComplete: validation.researchComplete, validationPass: validation.validationPass, reviewRequired: validation.reviewRequired, verified: validation.verified, publishable: validation.publishable, errors: validation.errors, warnings: validation.warnings, infos: validation.infos, report: reportPath }, null, 2));
if (validation.errors > 0) process.exit(1);
