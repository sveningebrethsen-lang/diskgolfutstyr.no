// Curated illustrations with exact manufacturer ratings, checked 2026-09-29.
// No model is suggested for arbitrary slider combinations.
const innovaSource = "https://www.innovadiscs.com/disc-golf-discs/disc-comparison/";
export const flightPresets = [
  { id: "putter", label: "Putter", values: { speed: 2, glide: 3, turn: 0, fade: 1 }, example: "Innova Aviar (Putt & Approach)", source: innovaSource },
  { id: "midrange", label: "Midrange", values: { speed: 5, glide: 5, turn: 0, fade: 0 }, example: "Innova Mako3", source: innovaSource },
  { id: "fairway", label: "Fairway", values: { speed: 7, glide: 6, turn: 0, fade: 1 }, example: "Discmania S-Line FD", source: "https://www.discmania.net/collections/s-line/fd" },
  { id: "distance", label: "Distance Driver", values: { speed: 11, glide: 5, turn: -1, fade: 3 }, example: "Innova Wraith", source: innovaSource }
];

export function exampleFor(values) {
  return flightPresets.find((preset) => Object.entries(preset.values).every(([key, value]) => values[key] === value)) || null;
}
