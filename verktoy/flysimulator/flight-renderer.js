const SVG_NS = "http://www.w3.org/2000/svg";

function el(name, attrs = {}) {
  const node = document.createElementNS(SVG_NS, name);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
  return node;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function directionMultiplier({ throwStyle, handedness }) {
  const rightBackhand = throwStyle === "backhand" && handedness === "right";
  const leftForehand = throwStyle === "forehand" && handedness === "left";
  return rightBackhand || leftForehand ? 1 : -1;
}

export function calculateFlight(values, options) {
  const direction = directionMultiplier(options);
  const distance = 260 + values.speed * 24 + values.glide * 18;
  const endX = clamp(distance, 320, 650);
  const start = { x: 54, y: 250 };
  const turnAmount = clamp(Math.abs(Math.min(values.turn, 0)) * 22 + Math.max(values.turn, 0) * -12, -20, 120);
  const fadeAmount = clamp(values.fade * 24, 0, 132);
  const lift = clamp(values.glide * 11 + values.speed * 2, 36, 112);
  const c1 = { x: start.x + endX * 0.28, y: start.y - lift - direction * turnAmount };
  const c2 = { x: start.x + endX * 0.68, y: start.y - lift * 0.72 - direction * turnAmount + direction * fadeAmount * 0.4 };
  const end = { x: start.x + endX, y: start.y + direction * fadeAmount * 0.45 };
  const path = `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`;
  return { start, c1, c2, end, path, direction };
}

export function createFlightSvg() {
  const svg = el("svg", {
    viewBox: "0 0 760 340",
    role: "img",
    "aria-label": "Forenklet flyvebane for diskgolfdisk",
    class: "flight-svg"
  });

  const grid = el("g", { class: "flight-grid-lines" });
  for (let x = 80; x <= 680; x += 120) grid.appendChild(el("line", { x1: x, y1: 40, x2: x, y2: 300 }));
  for (let y = 80; y <= 280; y += 50) grid.appendChild(el("line", { x1: 40, y1: y, x2: 720, y2: y }));

  const fairway = el("path", {
    d: "M 44 252 C 210 220, 390 220, 716 252",
    class: "flight-fairway"
  });

  const path = el("path", { class: "flight-path", d: "" });
  const shadow = el("path", { class: "flight-path-shadow", d: "" });
  const disc = el("circle", { class: "flight-disc-dot", cx: 54, cy: 250, r: 9 });
  const startLabel = el("text", { x: 42, y: 316, class: "flight-label" });
  startLabel.textContent = "Start";
  const endLabel = el("text", { x: 635, y: 316, class: "flight-label" });
  endLabel.textContent = "Mer speed/glide = lengre frem";
  const turnLabel = el("text", { x: 235, y: 46, class: "flight-label flight-turn-label" });
  turnLabel.textContent = "Turn";
  const fadeLabel = el("text", { x: 620, y: 76, class: "flight-label flight-fade-label" });
  fadeLabel.textContent = "Fade";

  svg.append(grid, fairway, shadow, path, disc, startLabel, endLabel, turnLabel, fadeLabel);
  return { svg, path, shadow, disc, turnLabel, fadeLabel };
}

export function renderFlight(parts, values, options) {
  const flight = calculateFlight(values, options);
  parts.path.setAttribute("d", flight.path);
  parts.shadow.setAttribute("d", flight.path);
  parts.disc.setAttribute("cx", flight.end.x);
  parts.disc.setAttribute("cy", flight.end.y);
  parts.turnLabel.setAttribute("x", flight.c1.x - 20);
  parts.turnLabel.setAttribute("y", flight.c1.y - 12);
  parts.fadeLabel.setAttribute("x", flight.end.x - 55);
  parts.fadeLabel.setAttribute("y", flight.end.y - 22);

  [parts.path, parts.shadow].forEach((path) => {
    path.style.animation = "none";
    path.getBoundingClientRect();
    path.style.animation = "";
  });
}
