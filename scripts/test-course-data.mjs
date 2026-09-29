import assert from "node:assert/strict";
import { validateCourse, validateDataset } from "./lib/course-data-v1.mjs";

function completeCourse(overrides = {}) {
  const source = {
    id: "source_club",
    source_name: "Eksempel klubb",
    source_url: "https://example.no/bane",
    publisher: "Eksempel klubb",
    source_type: "club",
    license: null,
    checked_at: "2026-09-20",
    automation_allowed: false,
    qualification: "primary"
  };
  return {
    schema_version: 1,
    id: "eksempel-bane",
    slug: "eksempel-bane",
    name: "Eksempelbane",
    status: "active",
    location: { locality: "Eksempel", municipality: "Eksempel", county: "Oslo", country: "Norge", latitude: 59.9, longitude: 10.7, coordinate_precision: "entrance" },
    summary: "En egenformulert og tilstrekkelig konkret beskrivelse av banen.",
    holes: 18,
    course_type: "Skogsbane",
    terrain: ["skog"],
    access: { fee: false, season: "hele året", opening_hours: null, booking_required: false, notes: null },
    facilities: { parking: true, toilet: null, practice_basket: true, other: [] },
    suitability: { difficulty: "Middels", beginner_friendly: false, family_friendly: null, good_for: ["hobbyspillere"], assessment_basis: "redaksjonell vurdering" },
    links: { official_url: "https://example.no/bane", club_url: "https://example.no", map_url: "https://www.openstreetmap.org/", external_course_url: null, external_course_provider: null },
    sources: [source],
    field_sources: { name: [source.id], location: [source.id], status: [source.id], holes: [source.id], terrain: [source.id], access: [source.id] },
    editorial: { legacy: false, publication_status: "review", data_quality_status: "complete", source_checked_at: "2026-09-20", content_last_updated_at: "2026-09-20", notes: null },
    ...overrides
  };
}

const now = new Date("2026-09-28T12:00:00Z");
const tests = [];
function test(name, fn) { tests.push({ name, fn }); }

test("valid complete course", () => assert.equal(validateCourse(completeCourse(), { now }).publishable, true));
test("missing coordinates", () => {
  const course = completeCourse(); course.location.latitude = null; course.location.longitude = null;
  assert(validateCourse(course, { now }).errors.some((item) => item.path === "location.latitude"));
});
test("missing source", () => {
  const course = completeCourse({ sources: [], field_sources: {} });
  assert(validateCourse(course, { now }).errors.some((item) => item.code === "qualified_source_missing"));
});
test("stale source", () => {
  const course = completeCourse(); course.sources[0].checked_at = "2025-01-01";
  assert(validateCourse(course, { now }).warnings.some((item) => item.code === "sources_stale"));
});
test("invalid slug", () => assert(validateCourse(completeCourse({ slug: "Ikke Gyldig" }), { now }).errors.some((item) => item.code === "invalid_slug")));
test("duplicate id", () => assert(validateDataset([completeCourse(), { ...completeCourse(), slug: "annen-bane" }], { now }).datasetIssues.some((item) => item.code === "duplicate_id")));
test("duplicate slug", () => assert(validateDataset([completeCourse(), { ...completeCourse(), id: "annen-bane" }], { now }).datasetIssues.some((item) => item.code === "duplicate_slug")));
test("invalid coordinates", () => {
  const course = completeCourse(); course.location.latitude = 120;
  assert(validateCourse(course, { now }).errors.some((item) => item.code === "invalid_latitude"));
});
test("insufficient verified facts", () => {
  const course = completeCourse(); course.field_sources = { name: ["source_club"], location: ["source_club"], status: ["source_club"], holes: ["source_club"] };
  assert(validateCourse(course, { now }).errors.some((item) => item.code === "insufficient_verified_facts"));
});
test("legacy existing record", () => {
  const course = completeCourse(); course.editorial.legacy = true; course.location.latitude = null; course.location.longitude = null;
  const result = validateCourse(course, { now });
  assert.equal(result.publishable, false); assert.equal(result.errors.length, 0); assert(result.warnings.length > 0);
});
test("unknown field source", () => {
  const course = completeCourse(); course.field_sources.holes = ["source_missing"];
  assert(validateCourse(course, { now }).errors.some((item) => item.code === "unknown_source_ref"));
});

for (const item of tests) item.fn();
console.log(`Course-data-tester: ${tests.length}/${tests.length} bestått.`);
