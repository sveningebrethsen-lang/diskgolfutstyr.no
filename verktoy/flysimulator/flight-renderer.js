import { flightDirections, summaryFor } from "../flight-core.js";

const SVG_NS = "http://www.w3.org/2000/svg";
export const flightAxisY = 170;

function el(name, attrs = {}) {
  const node = document.createElementNS(SVG_NS, name);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
  return node;
}

export function calculateFlight(values, options) {
  const direction = flightDirections(options).sign;
  // Top-down, forward along +x. All lateral offsets share one mirror axis.
  // These coefficients illustrate ratings at suitable speed; they are not physics or metres.
  const endX = 300 + values.speed * 20 + values.glide * 6;
  const start = { x: 54, y: flightAxisY };
  const turnAmount = -values.turn * 20;
  const fadeAmount = values.fade * 20;
  const c1 = { x: start.x + endX * 0.28, y: start.y + direction * turnAmount };
  const c2 = { x: start.x + endX * 0.68, y: start.y + direction * (turnAmount - fadeAmount * 0.2) };
  const end = { x: start.x + endX, y: start.y + direction * (turnAmount * 0.65 - fadeAmount) };
  const path = `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`;
  return { start, c1, c2, end, path, direction };
}

export function createFlightSvg() {
  const svg = el("svg", {
    viewBox: "0 0 760 340",
    role: "img",
    "aria-labelledby": "flight-svg-title flight-svg-description",
    class: "flight-svg"
  });

  const title = el("title", { id: "flight-svg-title" });
  const description = el("desc", { id: "flight-svg-description" });
  const grid = el("g", { class: "flight-grid-lines" });
  for (let x = 80; x <= 680; x += 120) grid.appendChild(el("line", { x1: x, y1: 40, x2: x, y2: 300 }));
  for (let y = 80; y <= 280; y += 50) grid.appendChild(el("line", { x1: 40, y1: y, x2: 720, y2: y }));

  const fairway = el("path", {
    d: "M 44 170 L 716 170",
    class: "flight-fairway"
  });

  const path = el("path", { class: "flight-path", d: "" });
  const shadow = el("path", { class: "flight-path-shadow", d: "" });
  const disc = el("circle", { class: "flight-disc-dot", cx: 54, cy: flightAxisY, r: 9 });
  const startLabel = el("text", { x: 42, y: 316, class: "flight-label" });
  startLabel.textContent = "Start";
  const endLabel = el("text", { x: 240, y: 316, class: "flight-label" });
  endLabel.textContent = "Ovenfra · ikke målestokk";
  const turnLabel = el("text", { x: 235, y: 46, class: "flight-label flight-turn-label" });
  turnLabel.textContent = "Turn";
  const fadeLabel = el("text", { x: 620, y: 76, class: "flight-label flight-fade-label" });
  fadeLabel.textContent = "Fade";

  svg.append(title, description, grid, fairway, shadow, path, disc, startLabel, endLabel, turnLabel, fadeLabel);
  return { svg, title, description, path, shadow, disc, turnLabel, fadeLabel };
}

export function renderFlight(parts, values, options) {
  const flight = calculateFlight(values, options);
  const directions = flightDirections(options);
  const hand = options.handedness === "right" ? "Høyrehendt" : "Venstrehendt";
  parts.title.textContent = `${hand} ${options.throwStyle}: ${values.speed}/${values.glide}/${values.turn}/${values.fade}`;
  parts.description.textContent = `Forenklet pedagogisk visualisering sett ovenfra. ${summaryFor(values)} Negativ turn går mot ${directions.turn} og fade mot ${directions.fade}, sett fra kasteren. På skjermen er kasterens høyre nedover og venstre oppover.`;
  parts.path.setAttribute("d", flight.path);
  parts.shadow.setAttribute("d", flight.path);
  parts.disc.setAttribute("cx", flight.end.x);
  parts.disc.setAttribute("cy", flight.end.y);
  parts.turnLabel.setAttribute("x", flight.c1.x - 20);
  parts.turnLabel.setAttribute("y", 40);
  parts.turnLabel.textContent = `Turn ${values.turn}`;
  parts.fadeLabel.setAttribute("x", flight.end.x - 55);
  parts.fadeLabel.setAttribute("y", 40);
  parts.fadeLabel.textContent = `Fade ${values.fade}`;

  [parts.path, parts.shadow].forEach((path) => {
    path.style.animation = "none";
    path.getBoundingClientRect();
    path.style.animation = "";
  });
}
