import { readFileSync, writeFileSync } from "node:fs";

const courses = JSON.parse(readFileSync("data/courses/norway.json", "utf8"));
const outputPath = "data/courses/p1-research-queue.json";

const areas = [
  { id: "trondheim", label: "Trondheim", match: (course) => course.location.municipality === "Trondheim" },
  { id: "fredrikstad", label: "Fredrikstad", match: (course) => course.location.municipality === "Fredrikstad" },
  { id: "oslo", label: "Oslo", match: (course) => course.location.municipality === "Oslo" },
  { id: "bergen", label: "Bergen", match: (course) => course.location.municipality === "Bergen" },
  { id: "krokhol", label: "Krokhol", match: (course) => course.id === "krokhol-disc-golf-course" },
  { id: "kristiansand", label: "Kristiansand", match: (course) => course.location.municipality === "Kristiansand" },
  { id: "grenland", label: "Porsgrunn/Skien", match: (course) => ["Porsgrunn", "Skien"].includes(course.location.municipality) },
  { id: "drammen", label: "Drammen", match: (course) => course.location.municipality === "Drammen" }
];

function state(value, mode = "missing") {
  if (value === null || value === undefined || value === "" || value === "unknown" || (Array.isArray(value) && value.length === 0)) return "missing";
  return mode;
}

function researchFields(course) {
  const hasCoordinates = course.location.latitude !== null &&
    course.location.latitude !== undefined &&
    course.location.longitude !== null &&
    course.location.longitude !== undefined;

  return {
    coordinates: state(hasCoordinates ? true : null, "reverify"),
    status: state(course.status, "reverify"),
    holes: state(course.holes, "reverify_primary"),
    terrain: state(course.terrain, "reverify_primary"),
    access: state(course.access?.notes, "reverify_primary"),
    season: state(course.access?.season, "reverify_primary"),
    price: state(course.access?.fee, "reverify_primary"),
    parking: state(course.facilities?.parking, "reverify_primary"),
    toilet: state(course.facilities?.toilet, "reverify_primary"),
    practice_basket: state(course.facilities?.practice_basket, "reverify_primary"),
    club_or_operator: state(course.links?.club_url, "reverify_primary"),
    official_url: state(course.links?.official_url, "reverify_primary"),
    beginner_suitability: state(course.suitability?.beginner_friendly, "reverify_method")
  };
}

const queue = {
  schema_version: 1,
  generated_at: new Date().toISOString().slice(0, 10),
  purpose: "Research-kø. Inneholder ikke nye banefakta og skal ikke brukes direkte til publisering.",
  source_priority: [
    "club_or_operator",
    "municipality_or_public_authority",
    "permitted_open_data",
    "manual_secondary_check"
  ],
  udisc_policy: "Kun manuell kontroll og ekstern lenke. Ingen automatisert innhenting.",
  areas: areas.map((area, index) => ({
    priority_order: index + 1,
    id: area.id,
    label: area.label,
    courses: courses.filter(area.match).map((course) => ({
      id: course.id,
      slug: course.slug,
      name: course.name,
      research_fields: researchFields(course)
    }))
  }))
};

writeFileSync(outputPath, `${JSON.stringify(queue, null, 2)}\n`, "utf8");
console.log(`Skrev P1 research-kø med ${queue.areas.reduce((sum, area) => sum + area.courses.length, 0)} baner til ${outputPath}.`);
