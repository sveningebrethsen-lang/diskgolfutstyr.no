export const COURSE_SCHEMA_VERSION = "1.1";
export const FRESH_DAYS = 90;
export const AGING_DAYS = 180;

export const QUALIFIED_SOURCE_TYPES = new Set([
  "club", "operator", "municipality", "public_authority", "open_data", "official_course", "pdga_api"
]);

const VALID_STATUSES = new Set(["active", "seasonal", "temporarily_closed", "closed", "unknown"]);
const VALID_PUBLICATION_STATES = new Set(["legacy", "draft", "verified", "publishable", "withheld"]);
const VALID_REVIEW_STATES = new Set(["not_requested", "required", "approved", "rejected"]);
const VALID_COORDINATE_PRECISIONS = new Set(["first_tee", "entrance", "course_center", "approximate", null]);
const VALID_TRI_STATES = new Set(["yes", "no", "unknown"]);
const VALID_LAYOUT_STATUSES = new Set(["primary", "alternative", "seasonal", "inactive", "unknown"]);
const VALID_SUITABILITY_SCOPES = new Set(["course", "layout", "unknown"]);
const VALID_CONFIDENCE = new Set(["high", "medium", "low", "unknown"]);
const VALID_DIFFICULTIES = new Set(["Lett", "Moderat", "Krevende", "Svært krevende", "Ukjent"]);
const REQUIRED_OBJECTS = ["location", "operator", "access", "facilities", "suitability", "links", "field_sources", "publication", "editorial"];
const REQUIRED_ARRAYS = ["terrain", "layouts", "sources", "source_conflicts"];

export const REQUIRED_PATHS = [
  "schema_version", "id", "slug", "name", "location.municipality", "location.county",
  "location.country", "location.latitude", "location.longitude", "summary", "sources",
  "publication.state", "editorial.source_checked_at"
];

export const RECOMMENDED_PATHS = [
  "course_type", "terrain", "operator.name", "links.official_url",
  "suitability.beginner.value", "suitability.family.value"
];

function issue(level, code, path, message) {
  return { level, code, path, message };
}

export function getPath(value, path) {
  return path.split(".").reduce((current, key) => current?.[key], value);
}

export function hasValue(value) {
  if (value === null || value === undefined || value === "") return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return value !== "unknown" && value !== "Ukjent";
}

export function daysSince(dateString, now = new Date()) {
  if (!dateString || Number.isNaN(Date.parse(dateString))) return null;
  const checked = new Date(`${dateString}T00:00:00Z`);
  return Math.max(0, Math.floor((now.getTime() - checked.getTime()) / 86400000));
}

export function freshnessStatus(dateString, now = new Date()) {
  const age = daysSince(dateString, now);
  if (age === null) return "stale";
  if (age <= FRESH_DAYS) return "fresh";
  if (age <= AGING_DAYS) return "aging";
  return "stale";
}

export function sourceFreshness(course, now = new Date()) {
  const dates = (course.sources || []).map((source) => source.checked_at)
    .filter((date) => date && !Number.isNaN(Date.parse(date))).sort();
  const oldestCheckedAt = dates[0] || course.editorial?.source_checked_at || null;
  return { checked_at: oldestCheckedAt, age_days: daysSince(oldestCheckedAt, now), status: freshnessStatus(oldestCheckedAt, now) };
}

export function isQualifiedSource(source) {
  return Boolean(source && QUALIFIED_SOURCE_TYPES.has(source.source_type) && hasValue(source.source_url) && hasValue(source.checked_at));
}

export function fieldHasQualifiedSource(course, field) {
  const sources = new Map((course.sources || []).map((source) => [source.id, source]));
  return (course.field_sources?.[field] || []).some((id) => isQualifiedSource(sources.get(id)));
}

export function verifiedFactGroups(course) {
  const sources = new Map((course.sources || []).map((source) => [source.id, source]));
  const excluded = new Set(["name", "location", "location.locality", "location.municipality", "location.county", "location.country"]);
  return Object.entries(course.field_sources || {})
    .filter(([field]) => !excluded.has(field))
    .filter(([, ids]) => Array.isArray(ids) && ids.some((id) => isQualifiedSource(sources.get(id))))
    .map(([field]) => field);
}

function hasCoordinates(course) {
  return typeof course.location?.latitude === "number" || typeof course.location?.longitude === "number";
}

function validateTriState(value, path, issues) {
  if (!value || typeof value !== "object" || !VALID_TRI_STATES.has(value.status)) {
    issues.push(issue("ERROR", "invalid_tri_state", path, `${path} må ha status yes, no eller unknown.`));
  }
}

function validateSuitability(value, path, sourceIds, layoutIds, issues) {
  if (!value || typeof value !== "object") {
    issues.push(issue("ERROR", "suitability_missing", path, `${path} mangler.`));
    return;
  }
  if (![true, false, null].includes(value.value)) issues.push(issue("ERROR", "invalid_suitability_value", `${path}.value`, "Egnethet må være true, false eller null."));
  if (!VALID_SUITABILITY_SCOPES.has(value.scope)) issues.push(issue("ERROR", "invalid_suitability_scope", `${path}.scope`, "Ugyldig scope."));
  if (!VALID_CONFIDENCE.has(value.confidence)) issues.push(issue("ERROR", "invalid_suitability_confidence", `${path}.confidence`, "Ugyldig confidence."));
  if (value.scope === "layout" && (!value.layout_id || !layoutIds.has(value.layout_id))) issues.push(issue("ERROR", "unknown_suitability_layout", `${path}.layout_id`, "Layout-scope må peke på en kjent layout."));
  for (const id of value.source_ids || []) if (!sourceIds.has(id)) issues.push(issue("ERROR", "unknown_source_ref", `${path}.source_ids`, `Ukjent source-id: ${id}.`));
  if (value.value !== null && (!Array.isArray(value.rationale) || value.rationale.length === 0)) {
    const legacy = value.migration_status === "legacy_value";
    issues.push(issue(legacy ? "WARNING" : "ERROR", legacy ? "legacy_suitability_without_rationale" : "suitability_rationale_missing", `${path}.rationale`, "Vurdering har ingen dokumentert begrunnelse."));
  }
}

function validateDifficulty(value, sourceIds, issues) {
  if (!value || typeof value !== "object") {
    issues.push(issue("ERROR", "difficulty_missing", "suitability.difficulty", "Difficulty må være et redaksjonelt vurderingsobjekt."));
    return;
  }
  if (!VALID_DIFFICULTIES.has(value.value)) issues.push(issue("ERROR", "invalid_difficulty", "suitability.difficulty.value", "Difficulty må være Lett, Moderat, Krevende, Svært krevende eller Ukjent."));
  if (!VALID_CONFIDENCE.has(value.confidence)) issues.push(issue("ERROR", "invalid_difficulty_confidence", "suitability.difficulty.confidence", "Ugyldig confidence for difficulty."));
  for (const id of value.source_ids || []) if (!sourceIds.has(id)) issues.push(issue("ERROR", "unknown_source_ref", "suitability.difficulty.source_ids", `Ukjent source-id: ${id}.`));
  if (value.value !== "Ukjent" && (!Array.isArray(value.rationale) || value.rationale.length === 0)) {
    issues.push(issue("WARNING", "difficulty_rationale_missing", "suitability.difficulty.rationale", "Redaksjonell difficulty mangler begrunnelse."));
  }
}

export function validateCourse(course, options = {}) {
  const issues = [];
  const legacy = course.publication?.state === "legacy";
  const requiredLevel = legacy ? "WARNING" : "ERROR";

  for (const path of REQUIRED_OBJECTS) {
    const value = course[path];
    if (!value || typeof value !== "object" || Array.isArray(value)) issues.push(issue("ERROR", "schema_object_missing", path, `${path} må være et objekt.`));
  }
  for (const path of REQUIRED_ARRAYS) if (!Array.isArray(course[path])) issues.push(issue("ERROR", "schema_array_missing", path, `${path} må være en liste.`));

  for (const path of REQUIRED_PATHS) {
    if (!hasValue(getPath(course, path))) issues.push(issue(requiredLevel, "required_missing", path, `Mangler ${path}.`));
  }
  for (const path of RECOMMENDED_PATHS) {
    if (!hasValue(getPath(course, path))) issues.push(issue("WARNING", "recommended_missing", path, `Anbefalt felt mangler: ${path}.`));
  }
  if (course.schema_version !== COURSE_SCHEMA_VERSION) issues.push(issue("ERROR", "schema_version", "schema_version", "Ustøttet schema_version."));
  if (!VALID_STATUSES.has(course.status)) issues.push(issue("ERROR", "invalid_status", "status", "Ugyldig banestatus."));
  if (!VALID_PUBLICATION_STATES.has(course.publication?.state)) issues.push(issue("ERROR", "invalid_publication_state", "publication.state", "Ugyldig publication state."));
  if (!VALID_REVIEW_STATES.has(course.editorial?.review_status)) issues.push(issue("ERROR", "invalid_review_status", "editorial.review_status", "Ugyldig review state."));
  if (hasValue(course.slug) && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(course.slug)) issues.push(issue("ERROR", "invalid_slug", "slug", "Slug må bruke små bokstaver, tall og bindestrek."));

  const latitude = course.location?.latitude;
  const longitude = course.location?.longitude;
  if ((latitude === null) !== (longitude === null)) issues.push(issue("ERROR", "incomplete_coordinates", "location", "Latitude og longitude må oppgis sammen."));
  if (typeof latitude === "number" && (latitude < -90 || latitude > 90)) issues.push(issue("ERROR", "invalid_latitude", "location.latitude", "Latitude må være mellom -90 og 90."));
  if (typeof longitude === "number" && (longitude < -180 || longitude > 180)) issues.push(issue("ERROR", "invalid_longitude", "location.longitude", "Longitude må være mellom -180 og 180."));
  if (!VALID_COORDINATE_PRECISIONS.has(course.location?.coordinate_precision)) issues.push(issue("ERROR", "invalid_coordinate_precision", "location.coordinate_precision", "Ugyldig koordinatpresisjon."));

  const sourceIds = new Set();
  for (const source of course.sources || []) {
    if (!hasValue(source.id)) issues.push(issue("ERROR", "source_id_missing", "sources", "Kilde mangler id."));
    if (sourceIds.has(source.id)) issues.push(issue("ERROR", "duplicate_source_id", "sources", `Duplikat source-id: ${source.id}.`));
    sourceIds.add(source.id);
    for (const field of ["source_name", "source_url", "publisher", "source_type", "checked_at"]) {
      if (!hasValue(source[field])) issues.push(issue(requiredLevel, "source_field_missing", `sources.${source.id}.${field}`, `Kilden mangler ${field}.`));
    }
  }
  for (const [field, refs] of Object.entries(course.field_sources || {})) {
    if (!Array.isArray(refs)) issues.push(issue("ERROR", "field_source_not_array", `field_sources.${field}`, "Kildereferanser må være en liste."));
    else for (const ref of refs) if (!sourceIds.has(ref)) issues.push(issue("ERROR", "unknown_source_ref", `field_sources.${field}`, `Ukjent source-id: ${ref}.`));
  }

  if (hasCoordinates(course)) {
    const coordinateSourceId = course.location?.coordinate_source_id;
    if (!coordinateSourceId) issues.push(issue("ERROR", "coordinate_source_missing", "location.coordinate_source_id", "Koordinater krever eksplisitt source-id."));
    else if (!sourceIds.has(coordinateSourceId)) issues.push(issue("ERROR", "coordinate_source_unknown", "location.coordinate_source_id", `Ukjent koordinatkilde: ${coordinateSourceId}.`));
    if (!hasValue(course.location?.coordinate_checked_at)) issues.push(issue("ERROR", "coordinate_checked_at_missing", "location.coordinate_checked_at", "Koordinater krever kontrollert-dato."));
  }

  const layoutIds = new Set();
  for (const layout of course.layouts || []) {
    if (!hasValue(layout.id)) issues.push(issue("ERROR", "layout_id_missing", "layouts", "Layout mangler id."));
    if (layoutIds.has(layout.id)) issues.push(issue("ERROR", "duplicate_layout_id", "layouts", `Duplikat layout-id: ${layout.id}.`));
    layoutIds.add(layout.id);
    if (!VALID_LAYOUT_STATUSES.has(layout.status)) issues.push(issue("ERROR", "invalid_layout_status", `layouts.${layout.id}.status`, "Ugyldig layout-status."));
    if (layout.holes !== null && (!Number.isInteger(layout.holes) || layout.holes < 1)) issues.push(issue("ERROR", "invalid_layout_holes", `layouts.${layout.id}.holes`, "Layout-hull må være positivt heltall eller null."));
    if (layout.par === null) issues.push(issue("WARNING", "layout_par_missing", `layouts.${layout.id}.par`, "Layout mangler par."));
    for (const id of layout.source_ids || []) if (!sourceIds.has(id)) issues.push(issue("ERROR", "unknown_source_ref", `layouts.${layout.id}.source_ids`, `Ukjent source-id: ${id}.`));
  }

  validateDifficulty(course.suitability?.difficulty, sourceIds, issues);
  validateSuitability(course.suitability?.beginner, "suitability.beginner", sourceIds, layoutIds, issues);
  validateSuitability(course.suitability?.family, "suitability.family", sourceIds, layoutIds, issues);
  for (const field of ["parking", "toilet", "practice_basket"]) validateTriState(course.facilities?.[field], `facilities.${field}`, issues);
  for (const field of ["public_transport", "accessibility", "dog_rules"]) validateTriState(course.access?.[field], `access.${field}`, issues);

  for (const id of course.operator?.source_ids || []) if (!sourceIds.has(id)) issues.push(issue("ERROR", "unknown_source_ref", "operator.source_ids", `Ukjent source-id: ${id}.`));
  for (const conflict of course.source_conflicts || []) {
    for (const value of conflict.values || []) if (value.source_id && !sourceIds.has(value.source_id)) issues.push(issue("ERROR", "unknown_source_ref", `source_conflicts.${conflict.id}`, `Ukjent source-id: ${value.source_id}.`));
    if (conflict.critical && conflict.status === "unresolved") issues.push(issue("ERROR", "critical_source_conflict", `source_conflicts.${conflict.id}`, "Kritisk kildekonflikt er ikke løst."));
    if (conflict.status === "resolved" && !hasValue(conflict.resolution)) issues.push(issue("ERROR", "conflict_resolution_missing", `source_conflicts.${conflict.id}.resolution`, "Løst konflikt krever dokumentert resolution."));
  }

  const qualifiedSources = (course.sources || []).filter(isQualifiedSource);
  if (qualifiedSources.length === 0) issues.push(issue(requiredLevel, "qualified_source_missing", "sources", "Mangler kvalifisert primær- eller åpen kilde."));
  if (qualifiedSources.length === 0 && (course.sources || []).some((source) => source.qualification === "manual_secondary")) {
    issues.push(issue("WARNING", "secondary_without_primary", "sources", "Posten har sekundærkilder, men ingen kvalifisert primær- eller åpen kilde."));
  }
  for (const field of ["name", "location"]) if (!fieldHasQualifiedSource(course, field)) issues.push(issue(requiredLevel, "required_fact_unverified", `field_sources.${field}`, `${field} mangler kobling til kvalifisert kilde.`));
  const factGroups = verifiedFactGroups(course);

  const freshness = sourceFreshness(course, options.now);
  if (freshness.status === "aging") issues.push(issue("WARNING", "sources_aging", "sources", `Eldste kildekontroll er ${freshness.age_days} dager gammel.`));
  if (freshness.status === "stale") issues.push(issue("WARNING", "sources_stale", "sources", "Kildene er eldre enn 180 dager eller mangler gyldig dato."));
  if (legacy) issues.push(issue("INFO", "legacy_record", "publication.state", "Eksisterende side er grandfathered, men ikke automatisk godkjent for ny publisering."));

  const holeInformationPresent = Number.isInteger(course.installed_holes) || (course.layouts || []).some((layout) => Number.isInteger(layout.holes));
  if (!holeInformationPresent) issues.push(issue(requiredLevel, "hole_information_missing", "installed_holes/layouts", "Mangler verifiserbart hullantall eller tydelig layoutinformasjon."));
  const coreValuesPresent = ["id", "slug", "name", "location.municipality", "location.county", "location.country", "summary", "editorial.source_checked_at"]
    .every((path) => hasValue(getPath(course, path))) && VALID_DIFFICULTIES.has(course.suitability?.difficulty?.value);
  const researchComplete = coreValuesPresent && hasCoordinates(course) && Boolean(course.location.coordinate_source_id && course.location.coordinate_checked_at) && holeInformationPresent;
  const sourceQualityPassed = qualifiedSources.length > 0 && ["name", "location"].every((field) => fieldHasQualifiedSource(course, field));
  const errorsBeforePublication = issues.filter((item) => item.level === "ERROR");
  const validationPassed = researchComplete && sourceQualityPassed && errorsBeforePublication.length === 0;
  if (!validationPassed) issues.push(issue("INFO", "research_candidate", "publication", "Posten trenger mer research eller kildekvalitet før review."));
  const reviewApproved = course.editorial?.review_status === "approved" && hasValue(course.editorial?.reviewed_at) && hasValue(course.editorial?.reviewed_by);
  const reviewRequired = validationPassed && !reviewApproved;

  if (["verified", "publishable"].includes(course.publication?.state) && !reviewApproved) issues.push(issue("ERROR", "publication_without_review", "publication.state", `${course.publication.state} krever eksplisitt godkjent review.`));
  if (course.publication?.state === "publishable" && !validationPassed) issues.push(issue("ERROR", "publishable_validation_failed", "publication.state", "Publishable krever bestått validering."));

  const errors = issues.filter((item) => item.level === "ERROR");
  const warnings = issues.filter((item) => item.level === "WARNING");
  const infos = issues.filter((item) => item.level === "INFO");
  const verified = ["verified", "publishable"].includes(course.publication?.state) && reviewApproved && errors.length === 0;
  const publishable = course.publication?.state === "publishable" && reviewApproved && errors.length === 0;
  return {
    id: course.id, legacy, research_complete: researchComplete, source_quality_passed: sourceQualityPassed,
    validation_passed: validationPassed, review_required: reviewRequired, review_approved: reviewApproved,
    verified, publishable, gate_ready: validationPassed, issues, errors, warnings, infos,
    qualified_source_count: qualifiedSources.length, verified_fact_groups: factGroups, freshness
  };
}

export function validateDataset(courses, options = {}) {
  const results = courses.map((course) => validateCourse(course, options));
  const datasetIssues = [];
  for (const field of ["id", "slug"]) {
    const seen = new Map();
    for (const course of courses) {
      const value = course[field];
      if (!hasValue(value)) continue;
      if (seen.has(value)) datasetIssues.push(issue("ERROR", `duplicate_${field}`, field, `${value} brukes av både ${seen.get(value)} og ${course.id || "ukjent"}.`));
      else seen.set(value, course.id || value);
    }
  }
  return {
    results, datasetIssues,
    errors: results.reduce((sum, result) => sum + result.errors.length, 0) + datasetIssues.filter((item) => item.level === "ERROR").length,
    warnings: results.reduce((sum, result) => sum + result.warnings.length, 0),
    infos: results.reduce((sum, result) => sum + result.infos.length, 0),
    legacy: results.filter((result) => result.legacy).length,
    researchComplete: results.filter((result) => result.research_complete).length,
    validationPass: results.filter((result) => result.validation_passed).length,
    reviewRequired: results.filter((result) => result.review_required).length,
    verified: results.filter((result) => result.verified).length,
    publishable: results.filter((result) => result.publishable).length,
    withheld: courses.filter((course) => course.publication?.state === "withheld").length
  };
}

export function canGenerateCourse(course, { existingPage = false } = {}) {
  if (course.publication?.state === "publishable" && validateCourse(course).publishable) return true;
  return existingPage && course.publication?.state === "legacy" && course.publication?.grandfathered_existing_page === true;
}

function legacyFacility(value) {
  if (!value) return null;
  if (value.details) return value.details;
  if (value.status === "yes") return true;
  if (value.status === "no") return false;
  return null;
}

function legacyFee(access) {
  if (access?.fee_details !== null && access?.fee_details !== undefined) return access.fee_details;
  if (access?.fee_status === "free") return false;
  if (access?.fee_status === "paid" || access?.fee_status === "conditional") return true;
  return null;
}

export function toLegacyCourseView(course) {
  const holes = course.legacy_reported_holes ?? course.installed_holes ?? course.layouts?.find((layout) => layout.status === "primary")?.holes ?? null;
  return {
    id: course.id, name: course.name, slug: course.slug,
    city: course.location?.locality || "", municipality: course.location?.municipality || "", county: course.location?.county || "", country: course.location?.country || "Norge",
    holes, difficulty: course.suitability?.difficulty?.legacy_value || course.suitability?.difficulty?.value || "Ukjent",
    beginner_friendly: course.suitability?.beginner?.scope === "course" ? course.suitability.beginner.value : null,
    family_friendly: course.suitability?.family?.scope === "course" ? course.suitability.family.value : null,
    course_type: course.course_type || "Ukjent", terrain: course.terrain?.length ? course.terrain.join(", ") : "Ukjent",
    short_description: course.summary, good_for: course.suitability?.good_for || [], facilities: course.facilities?.other || [],
    udisc_url: course.links?.external_course_provider === "UDisc" ? course.links.external_course_url : "",
    club_url: course.links?.club_url || "", map_url: course.links?.map_url || "",
    source_urls: (course.sources || []).map((source) => source.source_url), last_checked: course.editorial?.source_checked_at || null,
    notes: course.editorial?.notes || "",
    access: { fee: legacyFee(course.access), season: course.access?.season ?? null, opening_hours: course.access?.opening_notes ?? null, booking_required: course.access?.booking_required === "yes" ? true : course.access?.booking_required === "no" ? false : null, notes: course.access?.notes ?? null },
    facility_details: { parking: legacyFacility(course.facilities?.parking), toilet: legacyFacility(course.facilities?.toilet), practice_basket: legacyFacility(course.facilities?.practice_basket) }
  };
}
