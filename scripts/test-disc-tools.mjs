import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { diskSelectorSteps, stepsFor, getDiskRecommendation, recommendationProfiles } from "../verktoy/diskvelger/disk-selector-data.js";
import { defaultFlight, flightDirections, parseFlightQuery, simulatorUrl, summaryFor } from "../verktoy/flight-core.js";
import { calculateFlight, flightAxisY } from "../verktoy/flysimulator/flight-renderer.js";
import { flightPresets, exampleFor } from "../verktoy/flysimulator/flight-presets.js";

function* combinations(steps, answers = {}, index = 0) {
  if (index === steps.length) { yield answers; return; }
  for (const option of steps[index].options) yield* combinations(steps, { ...answers, [steps[index].id]: option.value }, index + 1);
}
const distribution = {};
let profiles = 0;
for (const base of combinations(diskSelectorSteps)) {
  for (const answers of combinations(stepsFor(base).slice(diskSelectorSteps.length), base)) {
    const result = getDiskRecommendation(answers);
    distribution[result.profileId] = (distribution[result.profileId] || 0) + 1;
    profiles++;
    assert.ok(result.description && result.fits && result.avoid && result.examples.length);
    for (const [key, [min, max]] of Object.entries(result.ranges)) {
      assert.ok(result.params[key] >= min && result.params[key] <= max, `${result.profileId} representative ${key}`);
      for (const example of result.examples) {
        assert.ok(example.values[key] >= min && example.values[key] <= max, `${example.name} ${key}`);
        assert.match(example.source, /^https:\/\//);
      }
    }
    const parsed = parseFlightQuery(new URL(simulatorUrl(result.params, answers), "https://example.test").search);
    assert.deepEqual(parsed.values, result.params);
    assert.equal(parsed.fromSelector, true);
    const style = answers.throw === "both" ? answers.problemStyle : answers.throw;
    if (style) assert.equal(parsed.options.throwStyle, style);
    if (answers.handedness) assert.equal(parsed.options.handedness, answers.handedness);
    if (answers.goal === "putting") assert.equal(result.profileId, "putter");
    if (answers.goal === "approach") assert.equal(result.profileId, "approach");
    if (answers.distance === "unknown") assert.ok(result.params.speed <= 5);
    if (answers.experience === "never" || answers.experience === "beginner") assert.ok(result.params.speed <= 5);
    if (result.direction) {
      const mirrored = { ...answers, handedness: answers.handedness === "right" ? "left" : "right", problem: answers.problem.endsWith("left") ? answers.problem.replace("left", "right") : answers.problem.replace("right", "left") };
      assert.equal(getDiskRecommendation(mirrored).profileId, result.profileId);
    }
  }
}
assert.equal(Object.keys(distribution).length, Object.keys(recommendationProfiles).length);
assert.equal(profiles, 7320);
console.log("Selector reachable profiles:", profiles, distribution);

// Keep the comparison reproducible without copying the old decision engine into production.
const baseline = execFileSync("git", ["show", "fd882af6e68f409498cd43e98eb932bb710e7905:verktoy/diskvelger/disk-selector-data.js"], { encoding: "utf8" });
const old = await import(`data:text/javascript;base64,${Buffer.from(baseline).toString("base64")}`);
const before = {};
for (const answers of combinations(old.diskSelectorSteps)) {
  const key = old.getDiskRecommendation(answers).category;
  before[key] = (before[key] || 0) + 1;
}
assert.equal(Object.values(before).reduce((sum, n) => sum + n, 0), 2700);
console.log("Baseline 2700 profiles:", before);

const persona = (experience, distance, style, goal, problem = "unknown", handedness) => ({ experience, distance, throw: style, goal, problem, handedness });
const personas = [
  [persona("never", "unknown", "backhand", "easy"), "approach"],
  [persona("beginner", "50-70", "backhand", "distance"), "easyMid"],
  [persona("beginner", "50-70", "forehand", "distance"), "neutralMid"],
  [persona("intermediate", "70-90", "backhand", "control"), "neutralFairway"],
  [persona("intermediate", "90-110", "backhand", "distance"), "easyFairway"],
  [persona("experienced", "110plus", "forehand", "distance"), "neutralFairway"],
  [persona("experienced", "under50", "forehand", "control"), "neutralMid"],
  [persona("experienced", "110plus", "forehand", "approach"), "approach"],
  [persona("some", "70-90", "backhand", "distance", "early-left", "left"), "neutralFairway"],
  [persona("some", "70-90", "backhand", "distance", "finish-right", "left"), "easyFairway"],
  [persona("some", "70-90", "forehand", "distance", "early-left", "right"), "neutralFairway"],
  [persona("some", "70-90", "forehand", "distance", "finish-right", "right"), "easyFairway"]
];
for (const [answers, expected] of personas) assert.equal(getDiskRecommendation(answers).profileId, expected, JSON.stringify(answers));
assert.equal(stepsFor(personas[0][0]).length, 5);
assert.equal(stepsFor(personas[8][0]).length, 6);
assert.equal(stepsFor({ ...personas[8][0], throw: "both" }).length, 7);
assert.equal(stepsFor({ ...personas[8][0], goal: "putting" }).length, 5);
console.log("Named personas:", personas.length, "passed");

const namedFlights = [[2,3,0,1], [5,5,-1,1], [7,5,-2,1], [7,5,0,2], [11,5,-3,1], [12,4,0,4], [1,1,1,0], [14,7,-5,5], [14,1,1,5], [1,7,-5,0]];
const options = [
  { handedness: "right", throwStyle: "backhand" }, { handedness: "left", throwStyle: "backhand" },
  { handedness: "right", throwStyle: "forehand" }, { handedness: "left", throwStyle: "forehand" }
];
assert.deepEqual(options.map(o => flightDirections(o).turn), ["høyre", "venstre", "venstre", "høyre"]);
assert.deepEqual(options.map(o => flightDirections(o).fade), ["venstre", "høyre", "høyre", "venstre"]);
const valuesFor = (tuple) => Object.fromEntries(["speed", "glide", "turn", "fade"].map((key, i) => [key, tuple[i]]));
function checkMirror(values) {
  const flights = options.map(o => calculateFlight(values, o));
  for (const key of ["start", "c1", "c2", "end"]) {
    assert.deepEqual(flights[0][key], flights[3][key]);
    assert.deepEqual(flights[1][key], flights[2][key]);
    assert.equal(flights[0][key].x, flights[1][key].x);
    assert.ok(Math.abs(flights[0][key].y + flights[1][key].y - 2 * flightAxisY) < 1e-10);
    for (const flight of flights) {
      assert.ok(Number.isFinite(flight[key].x) && Number.isFinite(flight[key].y));
      assert.ok(flight[key].x >= 0 && flight[key].x <= 760 && flight[key].y >= 35 && flight[key].y <= 290);
    }
  }
}
for (const tuple of namedFlights) checkMirror(valuesFor(tuple));
let flightProfiles = 0;
for (let speed = 1; speed <= 14; speed++) for (let glide = 1; glide <= 7; glide++)
  for (let turn = -5; turn <= 1; turn++) for (let fade = 0; fade <= 5; fade++) {
    checkMirror({ speed, glide, turn, fade }); flightProfiles++;
  }
for (const o of options) {
  const base = { speed: 7, glide: 5, turn: 0, fade: 1 };
  assert.notEqual(calculateFlight(base, o).end.y, calculateFlight({ ...base, turn: -5 }, o).end.y);
}
for (const key of ["speed", "glide", "turn", "fade"]) {
  const extremes = { speed: 14, glide: 7, turn: -5, fade: 5 };
  assert.notEqual(summaryFor(defaultFlight), summaryFor({ ...defaultFlight, [key]: extremes[key] }));
}
for (const preset of flightPresets) assert.equal(exampleFor(preset.values), preset);
assert.equal(exampleFor({ speed: 12, glide: 4, turn: 0, fade: 4 }), null);
console.log("Flight profiles:", flightProfiles, "x 4 orientations; named cases:", namedFlights.length * 4);

assert.deepEqual(parseFlightQuery("").values, defaultFlight);
assert.equal(parseFlightQuery("?speed=7&glide=5&turn=-2&fade=1").fromSelector, false);
assert.equal(parseFlightQuery("?origin=selector").fromSelector, false);
assert.equal(parseFlightQuery("?origin=selector&speed=7").fromSelector, true);
assert.equal(parseFlightQuery("?origin=selector&origin=selector&speed=7").fromSelector, false);
for (const bad of ["", "%20", "7.5", "Infinity", "NaN", "0x7", "1e1", "99", "-1", "abc"]) {
  const parsed = parseFlightQuery(`?speed=${bad}&glide=6&turn=-3&fade=2&origin=selector`);
  assert.equal(parsed.values.speed, 7);
  assert.equal(parsed.values.glide, 6);
  assert.equal(parsed.values.turn, -3);
  assert.equal(parsed.values.fade, 2);
  assert.deepEqual(parsed.rejected, ["speed"]);
}
assert.deepEqual(parseFlightQuery("?turn=&fade=").rejected, ["turn", "fade"]);
assert.equal(parseFlightQuery("?turn=0&fade=0").values.fade, 0);
assert.deepEqual(parseFlightQuery("?speed=2&speed=14").rejected, ["speed"]);
assert.deepEqual(parseFlightQuery("?speed=1&glide=1&turn=1&fade=0").values, valuesFor([1,1,1,0]));
assert.deepEqual(parseFlightQuery("?speed=14&glide=7&turn=-5&fade=5").values, valuesFor([14,7,-5,5]));
assert.deepEqual(parseFlightQuery("?throwStyle=bad&handedness=bad").options, options[0]);
assert.deepEqual(parseFlightQuery("?throwStyle=forehand&handedness=left").options, options[3]);
console.log("URL validation, evidence ranges, directions and integration: PASS");
