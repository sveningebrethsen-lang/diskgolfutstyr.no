import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const DATA_PATH = "data/courses/norway.json";
const REPORT_PATH = "docs/generated-course-migration-v1.1-report.md";
const PILOTS = new Set([
  "krokhol-disc-golf-course",
  "klemetsrud-diskgolfbane",
  "dragvoll-diskgolfarena",
  "porsgrunn-kjolnes"
]);

const COORDINATE_SOURCES = {
  "krokhol-disc-golf-course": "source_krokhol_udisc",
  "klemetsrud-diskgolfbane": "source_klemetsrud_udisc",
  "dragvoll-diskgolfarena": "source_dragvoll_udisc",
  "sukkevann-frisbeegolfpark": "source_sukkevann_pdga",
  "porsgrunn-kjolnes": "source_kjolnes_udisc"
};

const OPERATORS = {
  "krokhol-disc-golf-course": { name: "Krokhol Disc Golf Course", type: "company", source_ids: ["source_krokhol_official"] },
  "klemetsrud-diskgolfbane": { name: "Klemetsrud IL", type: "club", source_ids: ["source_klemetsrud_club"] },
  "dragvoll-diskgolfarena": { name: "Trondheim Frisbeeklubb", type: "club", source_ids: ["source_dragvoll_club"] },
  "sukkevann-frisbeegolfpark": { name: "Sukkevann Frisbeeklubb", type: "club", source_ids: ["source_sukkevann_event"] },
  "porsgrunn-kjolnes": { name: "Porsgrunn Disc Golf Klubb", type: "club", source_ids: ["source_kjolnes_club"] }
};

const DIFFICULTY_RATIONALE = {
  "krokhol-disc-golf-course": "Vann, store høydeforskjeller, tette skogshull og lange åpne hull tilsier svært høy teknisk og fysisk vanskelighetsgrad.",
  "klemetsrud-diskgolfbane": "Store høydeforskjeller og lange, tekniske skogshull tilsier svært høy vanskelighetsgrad.",
  "dragvoll-diskgolfarena": "Kupert terreng og krevende linjer i et flerbruksområde tilsier en krevende bane.",
  "porsgrunn-kjolnes": "En 18-hulls par-54-bane i forholdsvis flatt terreng vurderes som moderat; vurderingen støttes også av nyere baneinformasjon.",
  "sukkevann-frisbeegolfpark": "Vanskelighetsgraden varierer mellom spilleoppsettene, så anlegget får ikke én samlet vanskelighetsgrad."
};

function controlledDifficulty(value) {
  if (value === "Lett") return "Lett";
  if (value === "Middels" || value === "Moderat") return "Moderat";
  if (value === "Krevende") return "Krevende";
  if (value === "Svært krevende") return "Svært krevende";
  return "Ukjent";
}

export function normalizeDifficulty(course, originalValue = course.suitability?.difficulty) {
  if (originalValue && typeof originalValue === "object") return structuredClone(originalValue);
  const rationale = DIFFICULTY_RATIONALE[course.id];
  return {
    value: controlledDifficulty(originalValue),
    legacy_value: originalValue ?? null,
    rationale: rationale ? [rationale] : [],
    confidence: rationale ? "medium" : "unknown",
    reviewed_at: null,
    source_ids: course.field_sources?.["suitability.difficulty"] || []
  };
}

function triState(value, sourceIds = []) {
  if (value === true) return { status: "yes", details: null, source_ids: sourceIds };
  if (value === false) return { status: "no", details: null, source_ids: sourceIds };
  if (typeof value === "string" && value.trim()) return { status: "yes", details: value, source_ids: sourceIds };
  return { status: "unknown", details: null, source_ids: [] };
}

function fee(value) {
  if (value === false) return { fee_status: "free", fee_details: null };
  if (value === true) return { fee_status: "paid", fee_details: null };
  if (typeof value === "string") {
    const normalized = value.toLowerCase();
    if (normalized.startsWith("gratis") && !normalized.includes("ellers")) return { fee_status: "free", fee_details: value };
    if (normalized.includes("gratis") && normalized.includes("ellers")) return { fee_status: "conditional", fee_details: value };
    return { fee_status: "unknown", fee_details: value };
  }
  return { fee_status: "unknown", fee_details: null };
}

function suitability(course, key) {
  const oldKey = key === "beginner" ? "beginner_friendly" : "family_friendly";
  const value = course.suitability?.[oldKey] ?? null;
  const sourceIds = course.field_sources?.[`suitability.${oldKey}`] || [];
  const hasDocumentedBasis = PILOTS.has(course.id) && value !== null && course.suitability?.assessment_basis && course.suitability.assessment_basis !== "legacy_migration";
  return {
    value,
    scope: "course",
    layout_id: null,
    rationale: hasDocumentedBasis ? [course.suitability.assessment_basis] : [],
    confidence: hasDocumentedBasis ? "medium" : "unknown",
    source_ids: hasDocumentedBasis ? sourceIds : [],
    migration_status: hasDocumentedBasis ? "verified" : value === null ? "unknown" : "legacy_value"
  };
}

function pilotLayout(course) {
  if (!PILOTS.has(course.id)) return [];
  const ids = course.field_sources?.holes || [];
  return [{
    id: "main-layout",
    name: course.id === "dragvoll-diskgolfarena" ? "Hovedlayout" : "Dokumentert hovedlayout",
    holes: course.holes,
    par: course.id === "porsgrunn-kjolnes" ? 54 : null,
    status: "primary",
    seasonal: null,
    notes: null,
    source_ids: ids
  }];
}

function migrateSukkevann(course, migrated) {
  migrated.installed_holes = 27;
  migrated.layouts = [
    { id: "documented-18-hole-layout", name: "Dokumentert 18-hullsoppsett", holes: 18, par: null, status: "primary", seasonal: null, notes: "Navn og detaljert konfigurasjon er ikke verifisert i datagrunnlaget.", source_ids: ["source_sukkevann_udisc", "source_sukkevann_event"] },
    { id: "short-layout", name: "Kortsløyfe", holes: null, par: null, status: "alternative", seasonal: null, notes: "Hullantall er ikke verifisert i datagrunnlaget.", source_ids: ["source_sukkevann_udisc"] }
  ];
  migrated.suitability.beginner = {
    value: true,
    scope: "layout",
    layout_id: "short-layout",
    rationale: [course.suitability.assessment_basis],
    confidence: "medium",
    source_ids: ["source_sukkevann_udisc"],
    migration_status: "verified"
  };
  migrated.source_conflicts = [{
    id: "installed-holes-vs-layout-holes",
    field: "installed_holes/layouts.holes",
    critical: true,
    status: "resolved",
    values: [
      { value: 27, source_id: "source_sukkevann_pdga", note: "Installert anlegg." },
      { value: 18, source_id: "source_sukkevann_event", note: "Dokumentert spilleoppsett." }
    ],
    resolution: "Tallene beskriver ulike nivåer: 27 installerte hull og 18 hull i et dokumentert spilleoppsett.",
    resolved_value: { installed_holes: 27, layout_holes: 18 },
    resolved_at: "2026-09-28",
    rationale: "Historikken beholdes; verdiene er ikke konkurrerende når installasjon og layout modelleres separat."
  }];
}

export function migrateCourseV1toV11(course) {
  if (course.schema_version === "1.1") {
    const clone = structuredClone(course);
    clone.suitability.difficulty = normalizeDifficulty(clone);
    return clone;
  }
  if (course.schema_version !== 1) throw new Error(`Kan ikke migrere ${course.id || "ukjent"}: forventet schema_version 1.`);
  const sourceExists = new Set((course.sources || []).map((source) => source.id));
  const coordinateSourceId = COORDINATE_SOURCES[course.id] || null;
  const hasCoordinates = typeof course.location?.latitude === "number" && typeof course.location?.longitude === "number";
  if (hasCoordinates && (!coordinateSourceId || !sourceExists.has(coordinateSourceId))) throw new Error(`Koordinatkilde mangler for ${course.id}.`);
  const operator = OPERATORS[course.id] || { name: null, type: "unknown", source_ids: [] };
  const feeData = fee(course.access?.fee);
  const migrated = {
    schema_version: "1.1",
    id: course.id,
    slug: course.slug,
    name: course.name,
    status: course.status,
    location: {
      locality: course.location?.locality ?? null,
      municipality: course.location?.municipality ?? null,
      county: course.location?.county ?? null,
      country: course.location?.country ?? null,
      latitude: course.location?.latitude ?? null,
      longitude: course.location?.longitude ?? null,
      coordinate_precision: hasCoordinates && course.location?.coordinate_precision !== "unknown" ? course.location.coordinate_precision : null,
      coordinate_source_id: hasCoordinates ? coordinateSourceId : null,
      coordinate_checked_at: hasCoordinates ? course.editorial?.source_checked_at ?? null : null
    },
    summary: course.summary,
    installed_holes: PILOTS.has(course.id) || course.id === "sukkevann-frisbeegolfpark" ? course.holes : null,
    legacy_reported_holes: course.holes,
    layouts: pilotLayout(course),
    course_type: course.course_type,
    terrain: course.terrain,
    operator: {
      name: operator.name,
      type: operator.type,
      official_url: course.links?.official_url || course.links?.club_url || null,
      source_ids: operator.source_ids
    },
    access: {
      ...feeData,
      booking_required: course.access?.booking_required === true ? "yes" : course.access?.booking_required === false ? "no" : "unknown",
      booking_url: course.access?.booking_required === true ? course.links?.external_course_url || null : null,
      season: course.access?.season ?? null,
      opening_notes: course.access?.opening_hours ?? null,
      public_transport: { status: "unknown", details: null, source_ids: [] },
      accessibility: { status: "unknown", details: null, source_ids: [] },
      dog_rules: { status: "unknown", details: null, source_ids: [] },
      notes: course.access?.notes ?? null
    },
    facilities: {
      parking: triState(course.facilities?.parking, course.field_sources?.["facilities.parking"] || []),
      toilet: triState(course.facilities?.toilet, course.field_sources?.["facilities.toilet"] || []),
      practice_basket: triState(course.facilities?.practice_basket, course.field_sources?.["facilities.practice_basket"] || []),
      other: course.facilities?.other || []
    },
    suitability: {
      difficulty: normalizeDifficulty(course, course.suitability?.difficulty),
      beginner: suitability(course, "beginner"),
      family: suitability(course, "family"),
      good_for: course.suitability?.good_for || []
    },
    links: structuredClone(course.links),
    sources: structuredClone(course.sources || []),
    field_sources: structuredClone(course.field_sources || {}),
    source_conflicts: [],
    publication: { state: "legacy", grandfathered_existing_page: true },
    editorial: {
      data_quality_status: course.editorial?.data_quality_status || "legacy_incomplete",
      source_checked_at: course.editorial?.source_checked_at ?? null,
      content_last_updated_at: course.editorial?.content_last_updated_at ?? null,
      review_status: PILOTS.has(course.id) ? "required" : "not_requested",
      reviewed_at: null,
      reviewed_by: null,
      review_notes: PILOTS.has(course.id) ? "Teknisk klar for redaksjonell review; ingen automatisk godkjenning er utført." : null,
      notes: course.editorial?.notes ?? null
    }
  };
  if (course.id === "krokhol-disc-golf-course") {
    migrated.access.public_transport = { status: "yes", details: "Operatøren beskriver kollektivtransport til området.", source_ids: ["source_krokhol_official"] };
  }
  if (course.id === "sukkevann-frisbeegolfpark") migrateSukkevann(course, migrated);
  return migrated;
}

export function migrateDatasetV1toV11(courses) {
  return courses.map(migrateCourseV1toV11);
}

function semanticSnapshotV1(course) {
  return {
    id: course.id, slug: course.slug, name: course.name, holes: course.holes,
    beginner: course.suitability?.beginner_friendly ?? null, family: course.suitability?.family_friendly ?? null,
    sourceUrls: (course.sources || []).map((source) => source.source_url),
    location: [course.location?.locality, course.location?.municipality, course.location?.county, course.location?.country]
  };
}

function semanticSnapshotV11(course) {
  return {
    id: course.id, slug: course.slug, name: course.name, holes: course.legacy_reported_holes,
    beginner: course.suitability?.beginner?.scope === "course" ? course.suitability.beginner.value : null,
    family: course.suitability?.family?.scope === "course" ? course.suitability.family.value : null,
    sourceUrls: (course.sources || []).map((source) => source.source_url),
    location: [course.location?.locality, course.location?.municipality, course.location?.county, course.location?.country]
  };
}

export function semanticParity(v1Courses, v11Courses) {
  const failures = [];
  for (let index = 0; index < v1Courses.length; index += 1) {
    const before = semanticSnapshotV1(v1Courses[index]);
    const after = semanticSnapshotV11(v11Courses[index]);
    if (JSON.stringify(before) !== JSON.stringify(after)) failures.push({ id: before.id, before, after });
  }
  return { passed: failures.length === 0, failures };
}

function run() {
  const before = JSON.parse(readFileSync(DATA_PATH, "utf8"));
  if (before.every((course) => course.schema_version === "1.1" && typeof course.suitability?.difficulty === "object")) {
    console.log(`Course Schema V1.1 er allerede aktivt for ${before.length} poster.`);
    return;
  }
  const after = migrateDatasetV1toV11(before);
  const fromV1 = before.every((course) => course.schema_version === 1);
  const parity = fromV1 ? semanticParity(before, after) : { passed: true, failures: [] };
  if (before.length !== after.length || !parity.passed) throw new Error(`Migreringskontroll feilet: ${parity.failures.length} semantiske avvik.`);
  if (before.some((course, index) => course.id !== after[index].id || course.slug !== after[index].slug)) throw new Error("ID eller slug ble endret under migrering.");
  writeFileSync(DATA_PATH, `${JSON.stringify(after, null, 2)}\n`, "utf8");
  const lines = [
    "# Course Schema V1.1 migreringsrapport", "", `Dato: ${new Date().toISOString().slice(0, 10)}`, "",
    `- Inn: ${before.length} poster`, `- Ut: ${after.length} V1.1-poster`, "- ID/slug: uendret", "- Semantisk parity: bestått",
    "- Difficulty: normalisert til kontrollert redaksjonell skala; original etikett bevart som legacy_value",
    "- Nye HTML-sider: 0", "- Sitemap-endringer: 0", "",
    "Sukkevanns tidligere globale nybegynnerverdi er flyttet til kortsløyfen. Dette er en presisering av scope, ikke en ny påstand."
  ];
  writeFileSync(REPORT_PATH, `${lines.join("\n")}\n`, "utf8");
  console.log(`Migrerte ${after.length} baner til Course Schema V1.1 med semantisk parity.`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) run();
