import { readFileSync, writeFileSync } from "node:fs";

const path = "data/courses/norway.json";
const courses = JSON.parse(readFileSync(path, "utf8"));

if (courses.every((course) => course.schema_version === 1)) {
  console.log(`Course Schema V1 er allerede aktivt for ${courses.length} poster.`);
  process.exit(0);
}

function sourceMetadata(url, index, checkedAt) {
  const host = new URL(url).hostname.replace(/^www\./, "");
  if (host === "udisc.com" || host === "app.udisc.com") {
    return {
      id: `source_${index + 1}`,
      source_name: "UDisc baneoversikt",
      source_url: url,
      publisher: "UDisc",
      source_type: "third_party_course_directory",
      license: "Proprietær; manuell referanse og ekstern lenke",
      checked_at: checkedAt,
      automation_allowed: false,
      qualification: "manual_secondary"
    };
  }
  if (host === "pdga.com") {
    return {
      id: `source_${index + 1}`,
      source_name: "PDGA Course Directory",
      source_url: url,
      publisher: "Professional Disc Golf Association",
      source_type: "third_party_course_directory",
      license: "PDGA-vilkår; API-avtale kreves for automatisert bruk",
      checked_at: checkedAt,
      automation_allowed: false,
      qualification: "manual_secondary"
    };
  }
  return {
    id: `source_${index + 1}`,
    source_name: host,
    source_url: url,
    publisher: host,
    source_type: "web_reference",
    license: null,
    checked_at: checkedAt,
    automation_allowed: false,
    qualification: "manual_secondary"
  };
}

const migrated = courses.map((course) => {
  const sources = course.source_urls.map((url, index) => sourceMetadata(url, index, course.last_checked));
  const sourceRefs = sources.map((source) => source.id);
  const fieldSources = {
    name: sourceRefs,
    location: sourceRefs,
    holes: sourceRefs
  };

  if (course.course_type && course.course_type !== "Ukjent") fieldSources.course_type = sourceRefs;
  if (course.terrain && course.terrain !== "Ukjent") fieldSources.terrain = sourceRefs;
  if (course.difficulty && course.difficulty !== "Ukjent") fieldSources["suitability.difficulty"] = sourceRefs;
  if (course.beginner_friendly !== null) fieldSources["suitability.beginner_friendly"] = sourceRefs;
  if (course.family_friendly !== null) fieldSources["suitability.family_friendly"] = sourceRefs;

  return {
    schema_version: 1,
    id: course.id,
    slug: course.slug,
    name: course.name,
    status: "unknown",
    location: {
      locality: course.city,
      municipality: course.municipality,
      county: course.county,
      country: course.country,
      latitude: null,
      longitude: null,
      coordinate_precision: "unknown"
    },
    summary: course.short_description,
    holes: course.holes,
    course_type: course.course_type === "Ukjent" ? null : course.course_type,
    terrain: course.terrain === "Ukjent" ? [] : [course.terrain],
    access: {
      fee: null,
      season: null,
      opening_hours: null,
      booking_required: null,
      notes: null
    },
    facilities: {
      parking: null,
      toilet: null,
      practice_basket: null,
      other: course.facilities
    },
    suitability: {
      difficulty: course.difficulty === "Ukjent" ? null : course.difficulty,
      beginner_friendly: course.beginner_friendly,
      family_friendly: course.family_friendly,
      good_for: course.good_for,
      assessment_basis: "legacy_migration"
    },
    links: {
      official_url: null,
      club_url: course.club_url || null,
      map_url: course.map_url || null,
      external_course_url: course.udisc_url || null,
      external_course_provider: course.udisc_url ? "UDisc" : null
    },
    sources,
    field_sources: fieldSources,
    editorial: {
      legacy: true,
      publication_status: "published_legacy",
      data_quality_status: "legacy_incomplete",
      source_checked_at: course.last_checked,
      content_last_updated_at: course.last_checked,
      notes: course.notes
    }
  };
});

writeFileSync(path, `${JSON.stringify(migrated, null, 2)}\n`, "utf8");
console.log(`Migrerte ${migrated.length} baner til Course Schema V1.`);
