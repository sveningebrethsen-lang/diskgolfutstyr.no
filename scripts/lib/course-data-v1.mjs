export const COURSE_SCHEMA_VERSION = 1;
export const FRESH_DAYS = 90;
export const AGING_DAYS = 180;

const REQUIRED_OBJECTS = [
  "location",
  "access",
  "facilities",
  "suitability",
  "links",
  "field_sources",
  "editorial"
];

const VALID_STATUSES = new Set([
  "active",
  "seasonal",
  "temporarily_closed",
  "closed",
  "unknown"
]);

const VALID_COORDINATE_PRECISIONS = new Set([
  "entrance",
  "first_tee",
  "course_center",
  "approximate",
  "unknown"
]);

export const QUALIFIED_SOURCE_TYPES = new Set([
  "club",
  "operator",
  "municipality",
  "public_authority",
  "open_data",
  "official_course",
  "pdga_api"
]);

export const REQUIRED_PATHS = [
  "schema_version",
  "id",
  "slug",
  "name",
  "status",
  "location.locality",
  "location.municipality",
  "location.county",
  "location.country",
  "location.latitude",
  "location.longitude",
  "location.coordinate_precision",
  "summary",
  "sources",
  "editorial.source_checked_at"
];

export const RECOMMENDED_PATHS = [
  "holes",
  "course_type",
  "terrain",
  "access.season",
  "access.fee",
  "facilities.parking",
  "facilities.toilet",
  "facilities.practice_basket",
  "suitability.difficulty",
  "suitability.beginner_friendly",
  "links.official_url",
  "links.club_url"
];

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
  const dates = (course.sources || [])
    .map((source) => source.checked_at)
    .filter((date) => date && !Number.isNaN(Date.parse(date)))
    .sort();
  const oldestCheckedAt = dates[0] || course.editorial?.source_checked_at || null;
  return {
    checked_at: oldestCheckedAt,
    age_days: daysSince(oldestCheckedAt, now),
    status: freshnessStatus(oldestCheckedAt, now)
  };
}

export function isQualifiedSource(source) {
  return Boolean(
    source &&
      QUALIFIED_SOURCE_TYPES.has(source.source_type) &&
      hasValue(source.source_url) &&
      hasValue(source.checked_at)
  );
}

export function verifiedFactGroups(course) {
  const sourceMap = new Map((course.sources || []).map((source) => [source.id, source]));
  const excluded = new Set([
    "name",
    "location",
    "location.locality",
    "location.municipality",
    "location.county",
    "location.country"
  ]);

  return Object.entries(course.field_sources || {})
    .filter(([field]) => !excluded.has(field))
    .filter(([, refs]) =>
      Array.isArray(refs) && refs.some((ref) => isQualifiedSource(sourceMap.get(ref)))
    )
    .map(([field]) => field);
}

export function fieldHasQualifiedSource(course, field) {
  const sourceMap = new Map((course.sources || []).map((source) => [source.id, source]));
  const refs = course.field_sources?.[field] || [];
  return refs.some((ref) => isQualifiedSource(sourceMap.get(ref)));
}

function issue(level, code, path, message) {
  return { level, code, path, message };
}

export function validateCourse(course, options = {}) {
  const legacy = course.editorial?.legacy === true;
  const requiredLevel = legacy ? "WARNING" : "ERROR";
  const issues = [];

  for (const path of REQUIRED_OBJECTS) {
    const value = course[path];
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      issues.push(issue("ERROR", "schema_object_missing", path, `${path} må være et objekt.`));
    }
  }
  for (const path of ["terrain", "sources"]) {
    if (!Array.isArray(course[path])) {
      issues.push(issue("ERROR", "schema_array_missing", path, `${path} må være en liste.`));
    }
  }

  for (const path of REQUIRED_PATHS) {
    if (!hasValue(getPath(course, path))) {
      issues.push(issue(requiredLevel, "required_missing", path, `Mangler ${path}.`));
    }
  }

  if (course.schema_version !== COURSE_SCHEMA_VERSION) {
    issues.push(issue("ERROR", "schema_version", "schema_version", "Ustøttet schema_version."));
  }
  if (!VALID_STATUSES.has(course.status)) {
    issues.push(issue("ERROR", "invalid_status", "status", "Ugyldig banestatus."));
  }
  if (!VALID_COORDINATE_PRECISIONS.has(course.location?.coordinate_precision)) {
    issues.push(issue("ERROR", "invalid_coordinate_precision", "location.coordinate_precision", "Ugyldig koordinatpresisjon."));
  }
  if (hasValue(course.slug) && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(course.slug)) {
    issues.push(issue("ERROR", "invalid_slug", "slug", "Slug må bruke små bokstaver, tall og bindestrek."));
  }
  if (hasValue(course.location?.latitude) && (course.location.latitude < -90 || course.location.latitude > 90)) {
    issues.push(issue("ERROR", "invalid_latitude", "location.latitude", "Latitude må være mellom -90 og 90."));
  }
  if (hasValue(course.location?.longitude) && (course.location.longitude < -180 || course.location.longitude > 180)) {
    issues.push(issue("ERROR", "invalid_longitude", "location.longitude", "Longitude må være mellom -180 og 180."));
  }

  const sourceIds = new Set();
  for (const source of course.sources || []) {
    if (!hasValue(source.id)) issues.push(issue("ERROR", "source_id_missing", "sources", "Kilde mangler id."));
    if (sourceIds.has(source.id)) issues.push(issue("ERROR", "duplicate_source_id", "sources", `Duplikat source-id: ${source.id}.`));
    sourceIds.add(source.id);
    for (const field of ["source_name", "source_url", "publisher", "source_type", "checked_at"]) {
      if (!hasValue(source[field])) issues.push(issue(requiredLevel, "source_field_missing", `sources.${source.id}.${field}`, `Kilden mangler ${field}.`));
    }
    if (typeof source.automation_allowed !== "boolean") {
      issues.push(issue(requiredLevel, "source_automation_unknown", `sources.${source.id}.automation_allowed`, "automation_allowed må være eksplisitt true eller false."));
    }
  }

  for (const [field, refs] of Object.entries(course.field_sources || {})) {
    if (!Array.isArray(refs)) {
      issues.push(issue("ERROR", "field_source_not_array", `field_sources.${field}`, "Kildereferanser må være en liste."));
      continue;
    }
    for (const ref of refs) {
      if (!sourceIds.has(ref)) issues.push(issue("ERROR", "unknown_source_ref", `field_sources.${field}`, `Ukjent source-id: ${ref}.`));
    }
  }

  const qualifiedSources = (course.sources || []).filter(isQualifiedSource);
  if (qualifiedSources.length === 0) {
    issues.push(issue(requiredLevel, "qualified_source_missing", "sources", "Mangler kvalifisert primær- eller åpen kilde."));
  }

  for (const field of ["name", "location", "status"]) {
    if (!fieldHasQualifiedSource(course, field)) {
      issues.push(issue(requiredLevel, "required_fact_unverified", `field_sources.${field}`, `${field} mangler kobling til kvalifisert kilde.`));
    }
  }

  const factGroups = verifiedFactGroups(course);
  if (factGroups.length < 3) {
    issues.push(issue(requiredLevel, "insufficient_verified_facts", "field_sources", `Har ${factGroups.length} av minst 3 verifiserte faktagrupper utover navn/plassering.`));
  }

  const freshness = sourceFreshness(course, options.now);
  if (freshness.status === "aging") issues.push(issue("WARNING", "sources_aging", "sources", `Eldste kildekontroll er ${freshness.age_days} dager gammel.`));
  if (freshness.status === "stale") issues.push(issue("WARNING", "sources_stale", "sources", "Kildene er eldre enn 180 dager eller mangler gyldig dato."));

  if (legacy) issues.push(issue("INFO", "legacy_record", "editorial.legacy", "Eksisterende publisert post er beskyttet mot automatisk avpublisering."));

  const errors = issues.filter((item) => item.level === "ERROR");
  const warnings = issues.filter((item) => item.level === "WARNING");
  const infos = issues.filter((item) => item.level === "INFO");
  return {
    id: course.id,
    legacy,
    publishable: !legacy && errors.length === 0,
    gate_ready: errors.length === 0 && qualifiedSources.length > 0 && factGroups.length >= 3,
    issues,
    errors,
    warnings,
    infos,
    qualified_source_count: qualifiedSources.length,
    verified_fact_groups: factGroups,
    freshness
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
      if (seen.has(value)) {
        datasetIssues.push(issue("ERROR", `duplicate_${field}`, field, `${value} brukes av både ${seen.get(value)} og ${course.id || "ukjent"}.`));
      } else {
        seen.set(value, course.id || value);
      }
    }
  }

  return {
    results,
    datasetIssues,
    errors: results.reduce((sum, result) => sum + result.errors.length, 0) + datasetIssues.filter((item) => item.level === "ERROR").length,
    warnings: results.reduce((sum, result) => sum + result.warnings.length, 0),
    infos: results.reduce((sum, result) => sum + result.infos.length, 0) + datasetIssues.filter((item) => item.level === "INFO").length,
    publishable: results.filter((result) => result.publishable).length,
    legacy: results.filter((result) => result.legacy).length,
    gateReady: results.filter((result) => result.gate_ready).length
  };
}

export function toLegacyCourseView(course) {
  return {
    id: course.id,
    name: course.name,
    slug: course.slug,
    city: course.location?.locality || "",
    municipality: course.location?.municipality || "",
    county: course.location?.county || "",
    country: course.location?.country || "Norge",
    holes: course.holes,
    difficulty: course.suitability?.difficulty || "Ukjent",
    beginner_friendly: course.suitability?.beginner_friendly ?? null,
    family_friendly: course.suitability?.family_friendly ?? null,
    course_type: course.course_type || "Ukjent",
    terrain: course.terrain?.length ? course.terrain.join(", ") : "Ukjent",
    short_description: course.summary,
    good_for: course.suitability?.good_for || [],
    facilities: course.facilities?.other || [],
    udisc_url: course.links?.external_course_provider === "UDisc" ? course.links.external_course_url : "",
    club_url: course.links?.club_url || "",
    map_url: course.links?.map_url || "",
    source_urls: (course.sources || []).map((source) => source.source_url),
    last_checked: course.editorial?.source_checked_at || null,
    notes: course.editorial?.notes || ""
  };
}
