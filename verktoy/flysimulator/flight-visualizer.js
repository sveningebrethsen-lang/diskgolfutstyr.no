import { examplesFor, flightPresets, summaryFor } from "./flight-presets.js";
import { createFlightSvg, renderFlight } from "./flight-renderer.js";

const root = document.querySelector("[data-flight-visualizer]");
const urlNotice = document.querySelector("[data-url-prefill]");

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function readNumberParam(params, name, fallback, min, max) {
  const value = Number(params.get(name));
  if (!Number.isFinite(value)) return fallback;
  return clamp(value, min, max);
}

function hasValidNumberParam(params, name, min, max) {
  if (!params.has(name)) return false;
  const value = Number(params.get(name));
  return Number.isFinite(value) && value >= min && value <= max;
}

function valuesFromInputs() {
  const values = {};
  root.querySelectorAll("[data-flight-input]").forEach((input) => {
    values[input.dataset.flightInput] = Number(input.value);
  });
  return values;
}

function optionsFromInputs() {
  return {
    throwStyle: root.querySelector('[data-flight-option="throwStyle"]:checked')?.value || "backhand",
    handedness: root.querySelector('[data-flight-option="handedness"]:checked')?.value || "right"
  };
}

function setValues(values) {
  Object.entries(values).forEach(([key, value]) => {
    const input = root.querySelector(`[data-flight-input="${key}"]`);
    if (input) input.value = value;
  });
}

function updateValueLabels(values) {
  Object.entries(values).forEach(([key, value]) => {
    const label = root.querySelector(`[data-value-for="${key}"]`);
    if (label) label.textContent = value;
  });
}

function renderExamples(values) {
  const target = root.querySelector("[data-flight-examples]");
  target.innerHTML = examplesFor(values).map((example) => `<li>${example}</li>`).join("");
}

function updateSummary(values) {
  const target = root.querySelector("[data-flight-summary]");
  if (target) target.textContent = summaryFor(values);
}

function renderPresetButtons() {
  const target = root.querySelector("[data-preset-buttons]");
  target.innerHTML = flightPresets
    .map((preset) => `<button class="preset-button" type="button" data-preset="${preset.id}">${preset.label}</button>`)
    .join("");
}

function initFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const hasValidFlightParams =
    hasValidNumberParam(params, "speed", 1, 14) &&
    hasValidNumberParam(params, "glide", 1, 7) &&
    hasValidNumberParam(params, "turn", -5, 1) &&
    hasValidNumberParam(params, "fade", 0, 5);

  if (!hasValidFlightParams) return;

  setValues({
    speed: readNumberParam(params, "speed", 7, 1, 14),
    glide: readNumberParam(params, "glide", 5, 1, 7),
    turn: readNumberParam(params, "turn", -2, -5, 1),
    fade: readNumberParam(params, "fade", 1, 0, 5)
  });

  if (urlNotice) urlNotice.hidden = false;
}

function init() {
  if (!root) return;

  initFromUrl();
  renderPresetButtons();

  const svgTarget = root.querySelector("[data-flight-svg]");
  const svgParts = createFlightSvg();
  svgTarget.appendChild(svgParts.svg);

  const update = () => {
    const values = valuesFromInputs();
    updateValueLabels(values);
    renderExamples(values);
    updateSummary(values);
    renderFlight(svgParts, values, optionsFromInputs());
  };

  root.addEventListener("input", (event) => {
    if (event.target.matches("[data-flight-input], [data-flight-option]")) update();
  });

  root.addEventListener("change", (event) => {
    if (event.target.matches("[data-flight-option]")) update();
  });

  root.addEventListener("click", (event) => {
    const button = event.target.closest("[data-preset]");
    if (!button) return;
    const preset = flightPresets.find((item) => item.id === button.dataset.preset);
    if (!preset) return;
    setValues(preset.values);
    update();
  });

  update();
}

init();
