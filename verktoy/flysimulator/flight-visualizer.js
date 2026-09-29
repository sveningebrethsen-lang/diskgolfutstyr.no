import { exampleFor, flightPresets } from "./flight-presets.js";
import { parseFlightQuery, summaryFor, flightDirections } from "../flight-core.js";
import { createFlightSvg, renderFlight } from "./flight-renderer.js";

const root = document.querySelector("[data-flight-visualizer]");
const urlNotice = document.querySelector("[data-url-prefill]");

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
  const preset = exampleFor(values);
  target.innerHTML = preset
    ? `<li>${preset.example} (${Object.values(preset.values).join(" / ")}) · <a href="${preset.source}">Produsentens tall</a></li>`
    : "<li>Ingen verifisert eksempelmodell for disse tallene. Dette er en illustrasjon, ikke en produktanbefaling.</li>";
}

function updateSummary(values) {
  const target = root.querySelector("[data-flight-summary]");
  if (target) target.textContent = summaryFor(values);
  const directions = flightDirections(optionsFromInputs());
  root.querySelector("[data-flight-direction]").textContent = `Sett fra kasteren: negativ turn mot ${directions.turn}, fade mot ${directions.fade}. I grafen er fremover mot høyre på skjermen, kasterens høyre nedover og venstre oppover.`;
}

function renderPresetButtons() {
  const target = root.querySelector("[data-preset-buttons]");
  target.innerHTML = flightPresets
    .map((preset) => `<button class="preset-button" type="button" data-preset="${preset.id}">${preset.label}</button>`)
    .join("");
}

function initFromUrl() {
  const parsed = parseFlightQuery(window.location.search);
  setValues(parsed.values);
  for (const [key, value] of Object.entries(parsed.options)) {
    root.querySelector(`[data-flight-option="${key}"][value="${value}"]`).checked = true;
  }
  if (urlNotice) {
    urlNotice.hidden = !parsed.fromSelector;
    urlNotice.textContent = "Basert på resultatet ditt fra diskvelgeren. Gyldige flight-tall er fylt inn." +
      (parsed.rejected.length ? " Ugyldige tall er erstattet med standardverdier." : "") +
      (parsed.assumedStyle ? " Backhand er valgt som illustrasjon; du kan bytte kastestil." : "") +
      (parsed.assumedHand ? " Hånden var ikke oppgitt; illustrasjonen starter høyrehendt." : "");
  }
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
