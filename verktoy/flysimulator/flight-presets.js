export const flightPresets = [
  {
    id: "putter",
    label: "Putter",
    values: { speed: 3, glide: 4, turn: 0, fade: 1 },
    summary: "Puttere flyr saktere, kortere og mer kontrollert.",
    examples: ["Dynamic Discs Judge", "Innova Aviar", "Latitude 64 Pure"]
  },
  {
    id: "midrange",
    label: "Midrange",
    values: { speed: 5, glide: 5, turn: -1, fade: 1 },
    summary: "Midrange-disker viser flight-tall tydelig uten å kreve ekstrem fart.",
    examples: ["Innova Mako3", "Discraft Buzzz", "Latitude 64 Fuse"]
  },
  {
    id: "fairway",
    label: "Fairway",
    values: { speed: 7, glide: 6, turn: -2, fade: 1 },
    summary: "Fairway-drivere kan gi mer lengde, men fortsatt med kontroll.",
    examples: ["Innova Leopard", "Latitude 64 Diamond", "Discmania Essence"]
  },
  {
    id: "distance",
    label: "Distance Driver",
    values: { speed: 12, glide: 5, turn: -1, fade: 3 },
    summary: "Distance drivers krever mer fart og avslutter ofte hardere.",
    examples: ["Innova Wraith", "Discraft Hades", "Latitude 64 Grace"]
  }
];

export function examplesFor(values) {
  if (values.speed <= 3) return flightPresets[0].examples;
  if (values.speed <= 6) return flightPresets[1].examples;
  if (values.speed <= 9) return flightPresets[2].examples;
  return flightPresets[3].examples;
}

export function summaryFor(values) {
  if (values.speed <= 3) return "Saktere disk med mye kontroll og rolig avslutning.";
  if (values.speed <= 6) return "Kontrollerbar midrange som passer til rette kast og læring.";
  if (values.speed <= 9) return "Fairway-driver med mer lengde, men fortsatt håndterbar fart.";
  return "Rask driver som krever mer armhastighet og ofte mer presis teknikk.";
}
