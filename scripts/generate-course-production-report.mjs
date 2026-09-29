import { readFileSync, writeFileSync } from "node:fs";
import { validateDataset } from "./lib/course-data-v1.1.mjs";

const courses = JSON.parse(readFileSync("data/courses/norway.json", "utf8"));
const validation = validateDataset(courses);
const output = "docs/generated-course-production-report.md";
const rows = [
  ["TOTAL", courses.length], ["LEGACY", validation.legacy], ["RESEARCH COMPLETE", validation.researchComplete],
  ["VALIDATION PASS", validation.validationPass], ["REVIEW REQUIRED", validation.reviewRequired],
  ["VERIFIED", validation.verified], ["PUBLISHABLE", validation.publishable], ["WITHHELD", validation.withheld]
];

function coreCoverage(course) {
  const checks = [
    course.id, course.slug, course.name, course.location?.municipality, course.location?.county, course.location?.country,
    typeof course.location?.latitude === "number" && typeof course.location?.longitude === "number" && course.location?.coordinate_source_id,
    Number.isInteger(course.installed_holes) || (course.layouts || []).some((layout) => Number.isInteger(layout.holes)),
    course.summary, course.suitability?.difficulty?.value, course.editorial?.source_checked_at
  ];
  return `${checks.filter(Boolean).length}/${checks.length}`;
}
const lines = [
  "# Produksjonsrapport for banedata", "", `Generert: ${new Date().toISOString().slice(0, 10)}`, "",
  "## Aggregert operatørbilde", "", "| Status | Antall |", "|---|---:|", ...rows.map(([label, count]) => `| ${label} | ${count} |`), "",
  "## Pipeline per bane", "", "| Bane | Coverage | Source quality | Konflikter | Validation | Review | Publication | Publishable |", "|---|---|---|---|---|---|---|---|"
];
for (const course of courses) {
  const result = validation.results.find((entry) => entry.id === course.id);
  const conflicts = (course.source_conflicts || []).map((item) => `${item.id}:${item.status}`).join(", ") || "Ingen";
  const reviewStatus = ["changes_required", "rejected"].includes(course.editorial.review_status)
    ? course.editorial.review_status
    : result.review_approved ? "approved" : result.review_required ? "required" : course.editorial.review_status;
  lines.push(`| ${course.name} | ${coreCoverage(course)} | ${result.source_quality_passed ? "bestått" : "stopp"} | ${conflicts} | ${result.validation_passed ? "bestått" : "stopp"} | ${reviewStatus} | ${course.publication.state} | ${result.publishable ? "ja" : "nei"} |`);
}
writeFileSync(output, `${lines.join("\n")}\n`, "utf8");
console.log(JSON.stringify(Object.fromEntries(rows), null, 2));
