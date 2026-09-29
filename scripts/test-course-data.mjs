import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { canGenerateCourse, toLegacyCourseView, validateCourse, validateDataset } from "./lib/course-data-v1.1.mjs";
import { migrateCourseV1toV11, semanticParity } from "./migrate-course-data-v1.1.mjs";

const now = new Date("2026-09-29T12:00:00Z");
const source = {
  id: "source_club", source_name: "Eksempel klubb", source_url: "https://example.no/bane",
  publisher: "Eksempel klubb", source_type: "club", license: null, checked_at: "2026-09-20",
  automation_allowed: false, qualification: "primary"
};

function suitability(value = false) {
  return { value, scope: "course", layout_id: null, rationale: value === null ? [] : ["Dokumentert vurderingsgrunnlag."], confidence: value === null ? "unknown" : "medium", source_ids: value === null ? [] : [source.id], migration_status: value === null ? "unknown" : "verified" };
}

function completeCourse(overrides = {}) {
  return {
    schema_version: "1.1", id: "eksempel-bane", slug: "eksempel-bane", name: "Eksempelbane", status: "active",
    location: { locality: "Eksempel", municipality: "Eksempel", county: "Oslo", country: "Norge", latitude: 59.9, longitude: 10.7, coordinate_precision: "entrance", coordinate_source_id: source.id, coordinate_checked_at: "2026-09-20" },
    summary: "En egenformulert og tilstrekkelig konkret beskrivelse av banen.",
    installed_holes: 18, legacy_reported_holes: 18,
    layouts: [{ id: "main-layout", name: "Hovedlayout", holes: 18, par: 54, status: "primary", seasonal: false, notes: null, source_ids: [source.id] }],
    course_type: "Skogsbane", terrain: ["skog"],
    operator: { name: "Eksempel klubb", type: "club", official_url: "https://example.no", source_ids: [source.id] },
    access: { fee_status: "free", fee_details: null, booking_required: "no", booking_url: null, season: "hele året", opening_notes: null, public_transport: { status: "unknown", details: null, source_ids: [] }, accessibility: { status: "unknown", details: null, source_ids: [] }, dog_rules: { status: "unknown", details: null, source_ids: [] }, notes: null },
    facilities: { parking: { status: "yes", details: null, source_ids: [source.id] }, toilet: { status: "unknown", details: null, source_ids: [] }, practice_basket: { status: "yes", details: null, source_ids: [source.id] }, other: [] },
    suitability: { difficulty: { value: "Moderat", legacy_value: "Middels", rationale: ["Kjente baneegenskaper tilsier moderat vanskelighetsgrad."], confidence: "medium", reviewed_at: null, source_ids: [source.id] }, beginner: suitability(false), family: suitability(null), good_for: ["hobbyspillere"] },
    links: { official_url: "https://example.no/bane", club_url: "https://example.no", map_url: "https://www.openstreetmap.org/", external_course_url: null, external_course_provider: null },
    sources: [structuredClone(source)],
    field_sources: { name: [source.id], location: [source.id], status: [source.id], installed_holes: [source.id], terrain: [source.id], access: [source.id] },
    source_conflicts: [],
    publication: { state: "verified", grandfathered_existing_page: false },
    editorial: { data_quality_status: "complete", source_checked_at: "2026-09-20", content_last_updated_at: "2026-09-20", review_status: "approved", reviewed_at: "2026-09-21", reviewed_by: "redaksjon", review_notes: "Godkjent testfixture.", notes: null },
    ...overrides
  };
}

function v1Fixture() {
  return {
    schema_version: 1, id: "syntetisk-bane", slug: "syntetisk-bane", name: "Syntetisk bane", status: "unknown",
    location: { locality: "Sted", municipality: "Kommune", county: "Fylke", country: "Norge", latitude: null, longitude: null, coordinate_precision: "unknown" },
    summary: "Syntetisk migreringsfixture med bevart semantikk.", holes: 9, course_type: null, terrain: [],
    access: { fee: null, season: null, opening_hours: null, booking_required: null, notes: null },
    facilities: { parking: null, toilet: false, practice_basket: true, other: ["benk"] },
    suitability: { difficulty: null, beginner_friendly: true, family_friendly: null, good_for: ["trening"], assessment_basis: "legacy_migration" },
    links: { official_url: null, club_url: null, map_url: null, external_course_url: "https://udisc.com/courses/example", external_course_provider: "UDisc" },
    sources: [{ ...source, id: "source_1", source_type: "third_party_course_directory", qualification: "manual_secondary" }],
    field_sources: { name: ["source_1"], location: ["source_1"], holes: ["source_1"] },
    editorial: { legacy: true, publication_status: "published_legacy", data_quality_status: "legacy_incomplete", source_checked_at: "2026-09-20", content_last_updated_at: "2026-09-20", notes: "Bevares." }
  };
}

const tests = [];
function test(name, fn) { tests.push({ name, fn }); }

test("1 complete verified course", () => assert.equal(validateCourse(completeCourse(), { now }).verified, true));
test("2 legacy course", () => { const c = completeCourse({ publication: { state: "legacy", grandfathered_existing_page: true }, editorial: { ...completeCourse().editorial, review_status: "not_requested", reviewed_at: null, reviewed_by: null } }); assert.equal(validateCourse(c, { now }).legacy, true); });
test("3 legacy to review required", () => { const c = completeCourse({ publication: { state: "legacy", grandfathered_existing_page: true }, editorial: { ...completeCourse().editorial, review_status: "required", reviewed_at: null, reviewed_by: null } }); assert.equal(validateCourse(c, { now }).review_required, true); });
test("4 approved review can be publishable", () => { const c = completeCourse({ publication: { state: "publishable", grandfathered_existing_page: false } }); assert.equal(validateCourse(c, { now }).publishable, true); });
test("5 publishable without review is error", () => { const c = completeCourse({ publication: { state: "publishable", grandfathered_existing_page: false }, editorial: { ...completeCourse().editorial, review_status: "required", reviewed_at: null, reviewed_by: null } }); assert(validateCourse(c, { now }).errors.some((item) => item.code === "publication_without_review")); });
test("6 missing coordinate source", () => { const c = completeCourse(); c.location.coordinate_source_id = null; assert(validateCourse(c, { now }).errors.some((item) => item.code === "coordinate_source_missing")); });
test("7 unknown coordinate source", () => { const c = completeCourse(); c.location.coordinate_source_id = "source_unknown"; assert(validateCourse(c, { now }).errors.some((item) => item.code === "coordinate_source_unknown")); });
test("8 multiple layouts", () => { const c = completeCourse(); c.layouts.push({ ...c.layouts[0], id: "short-layout", name: "Kort layout", holes: 9 }); assert.equal(validateCourse(c, { now }).errors.length, 0); });
test("9 installed holes can differ from layout", () => { const c = completeCourse({ installed_holes: 27 }); assert.equal(validateCourse(c, { now }).errors.length, 0); });
test("10 unresolved critical conflict", () => { const c = completeCourse(); c.source_conflicts = [{ id: "holes-conflict", field: "installed_holes", critical: true, status: "unresolved", values: [{ value: 18, source_id: source.id, note: null }, { value: 20, source_id: source.id, note: null }], resolution: null, resolved_value: null, resolved_at: null, rationale: null }]; assert(validateCourse(c, { now }).errors.some((item) => item.code === "critical_source_conflict")); });
test("11 resolved conflict", () => { const c = completeCourse(); c.source_conflicts = [{ id: "holes-conflict", field: "installed_holes", critical: true, status: "resolved", values: [{ value: 18, source_id: source.id, note: null }, { value: 20, source_id: source.id, note: null }], resolution: "Nyere operatørkilde brukes.", resolved_value: 20, resolved_at: "2026-09-20", rationale: "Dokumentert." }]; assert.equal(validateCourse(c, { now }).errors.length, 0); });
test("12 suitability with rationale", () => assert(!validateCourse(completeCourse(), { now }).issues.some((item) => item.code === "suitability_rationale_missing")));
test("13 legacy suitability without rationale warns", () => { const c = completeCourse(); c.suitability.beginner = { ...c.suitability.beginner, rationale: [], migration_status: "legacy_value" }; assert(validateCourse(c, { now }).warnings.some((item) => item.code === "legacy_suitability_without_rationale")); });
test("14 structured operator", () => assert.equal(validateCourse(completeCourse(), { now }).errors.filter((item) => item.path.startsWith("operator")).length, 0));
test("15 access unknown is not false", () => { const migrated = migrateCourseV1toV11(v1Fixture()); assert.equal(migrated.access.booking_required, "unknown"); assert.notEqual(migrated.access.booking_required, false); });
test("16 Sukkevann remains negative control", () => { const c = JSON.parse(readFileSync("data/courses/norway.json", "utf8")).find((item) => item.id === "sukkevann-frisbeegolfpark"); const result = validateCourse(c, { now }); assert.equal(result.validation_passed, false); assert.equal(result.publishable, false); assert(result.warnings.some((item) => item.code === "qualified_source_missing")); });
test("17 duplicate slug", () => assert(validateDataset([completeCourse(), { ...completeCourse(), id: "annen-bane" }], { now }).datasetIssues.some((item) => item.code === "duplicate_slug")));
test("18 duplicate id", () => assert(validateDataset([completeCourse(), { ...completeCourse(), slug: "annen-bane" }], { now }).datasetIssues.some((item) => item.code === "duplicate_id")));
test("19 semantic migration parity", () => { const before = v1Fixture(); const after = migrateCourseV1toV11(before); assert.equal(semanticParity([before], [after]).passed, true); assert.deepEqual(toLegacyCourseView(after).source_urls, before.sources.map((item) => item.source_url)); });
test("20 generator allows grandfathered existing page", () => { const c = completeCourse({ publication: { state: "legacy", grandfathered_existing_page: true } }); assert.equal(canGenerateCourse(c, { existingPage: true }), true); assert.equal(canGenerateCourse(c, { existingPage: false }), false); });
test("21 generator allows reviewed publishable page", () => { const c = completeCourse({ publication: { state: "publishable", grandfathered_existing_page: false } }); assert.equal(canGenerateCourse(c), true); });
test("22 generator blocks draft", () => { const c = completeCourse({ publication: { state: "draft", grandfathered_existing_page: false } }); assert.equal(canGenerateCourse(c), false); });
test("23 missing recommended field warns", () => { const c = completeCourse({ course_type: null }); assert(validateCourse(c, { now }).warnings.some((item) => item.code === "recommended_missing" && item.path === "course_type")); });
test("24 secondary source without primary warns", () => { const c = completeCourse({ publication: { state: "legacy", grandfathered_existing_page: true } }); c.sources[0].source_type = "third_party_course_directory"; c.sources[0].qualification = "manual_secondary"; assert(validateCourse(c, { now }).warnings.some((item) => item.code === "secondary_without_primary")); });
test("25 incomplete post is research candidate", () => { const c = completeCourse({ publication: { state: "legacy", grandfathered_existing_page: true } }); c.sources = []; c.field_sources = {}; assert(validateCourse(c, { now }).infos.some((item) => item.code === "research_candidate")); });
test("26 one qualified source is enough for minimal gate", () => { const c = completeCourse({ publication: { state: "legacy", grandfathered_existing_page: true } }); c.field_sources = { name: [source.id], location: [source.id] }; assert.equal(validateCourse(c, { now }).validation_passed, true); });
test("27 optional facilities do not block", () => { const c = completeCourse({ publication: { state: "legacy", grandfathered_existing_page: true } }); for (const key of ["parking", "toilet", "practice_basket"]) c.facilities[key] = { status: "unknown", details: null, source_ids: [] }; assert.equal(validateCourse(c, { now }).validation_passed, true); });
test("28 difficulty uses controlled scale", () => { const c = completeCourse(); c.suitability.difficulty.value = "Middels"; assert(validateCourse(c, { now }).errors.some((item) => item.code === "invalid_difficulty")); });
test("29 missing hole information blocks new record", () => { const c = completeCourse({ installed_holes: null, layouts: [] }); assert(validateCourse(c, { now }).errors.some((item) => item.code === "hole_information_missing")); });
test("30 approved pilots pass the publishable generator gate", () => { const data = JSON.parse(readFileSync("data/courses/norway.json", "utf8")); const ids = ["krokhol-disc-golf-course", "klemetsrud-diskgolfbane", "dragvoll-diskgolfarena", "porsgrunn-kjolnes"]; for (const id of ids) { const c = data.find((item) => item.id === id); const result = validateCourse(c, { now }); assert.equal(result.verified, true, id); assert.equal(result.publishable, true, id); assert.equal(canGenerateCourse(c), true, id); } });
test("31 Sukkevann is denied by the publishable generator gate", () => { const c = JSON.parse(readFileSync("data/courses/norway.json", "utf8")).find((item) => item.id === "sukkevann-frisbeegolfpark"); assert.equal(c.editorial.review_status, "not_requested"); assert.equal(c.publication.state, "legacy"); assert.equal(canGenerateCourse(c), false); });

for (const item of tests) {
  try { item.fn(); }
  catch (error) { error.message = `${item.name}: ${error.message}`; throw error; }
}
console.log(`Course-data-tester V1.1: ${tests.length}/${tests.length} bestått.`);
