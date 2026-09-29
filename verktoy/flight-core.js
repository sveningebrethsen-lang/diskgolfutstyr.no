export const flightLimits = { speed: [1, 14], glide: [1, 7], turn: [-5, 1], fade: [0, 5] };
export const defaultFlight = { speed: 7, glide: 5, turn: -2, fade: 1 };

// Directions are relative to the thrower looking along the initial flight line.
export function flightDirections({ throwStyle, handedness }) {
  if (!["backhand", "forehand"].includes(throwStyle) || !["right", "left"].includes(handedness)) return null;
  const sign = (throwStyle === "backhand") === (handedness === "right") ? 1 : -1;
  return { sign, turn: sign === 1 ? "høyre" : "venstre", fade: sign === 1 ? "venstre" : "høyre" };
}

export function parseFlightQuery(search) {
  const query = new URLSearchParams(search);
  const values = { ...defaultFlight };
  const valid = [];
  const rejected = [];
  for (const [key, [min, max]] of Object.entries(flightLimits)) {
    if (!query.has(key)) continue;
    const raw = query.get(key).trim();
    const value = Number(raw);
    // Sliders use whole numbers. Reject decimals, blanks, duplicates and out-of-range values.
    if (query.getAll(key).length !== 1 || !/^[+-]?\d+$/.test(raw) || !Number.isInteger(value) || value < min || value > max) {
      rejected.push(key);
    } else {
      values[key] = value;
      valid.push(key);
    }
  }
  const choice = (key, allowed, fallback) => query.getAll(key).length === 1 && allowed.includes(query.get(key)) ? query.get(key) : fallback;
  const handedness = choice("handedness", ["right", "left"], null);
  const throwStyle = choice("throwStyle", ["backhand", "forehand"], null);
  return {
    values, valid, rejected,
    options: { throwStyle: throwStyle || "backhand", handedness: handedness || "right" },
    assumedStyle: !throwStyle, assumedHand: !handedness,
    fromSelector: query.getAll("origin").length === 1 && query.get("origin") === "selector" && valid.length > 0
  };
}

export function simulatorUrl(values, answers) {
  const query = new URLSearchParams({ ...values, origin: "selector" });
  const style = answers.throw === "both" ? answers.problemStyle : answers.throw;
  if (["backhand", "forehand"].includes(style)) query.set("throwStyle", style);
  if (["right", "left"].includes(answers.handedness)) query.set("handedness", answers.handedness);
  return `/verktoy/flysimulator/?${query}`;
}

export function summaryFor(values) {
  const speed = values.speed <= 3 ? "Lav speed" : values.speed <= 6 ? "Moderat speed" : values.speed <= 9 ? "Fairway-fart" : "Høy speed som krever fart i kastet";
  const glide = values.glide <= 3 ? "lite glide" : values.glide <= 5 ? "moderat glide" : "mye glide";
  const turn = values.turn < -2 ? "tydelig tendens til tidlig turn" : values.turn < 0 ? "litt tidlig turn" : values.turn === 0 ? "ingen angitt tidlig turn" : "motstand mot tidlig turn";
  const fade = values.fade === 0 ? "minimal fade" : values.fade <= 2 ? "mild til moderat fade" : "kraftig fade";
  return `${speed}, ${glide}, ${turn} og ${fade}. Tallene forutsetter passende kastfart; dette er ikke en lengdeprognose.`;
}
