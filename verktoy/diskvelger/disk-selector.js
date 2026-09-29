import { stepsFor, needsDirection, getDiskRecommendation, resultLinks } from "./disk-selector-data.js";
import { simulatorUrl } from "../flight-core.js";

const state = {
  stepIndex: 0,
  answers: {}
};

const selector = document.querySelector("[data-disk-selector]");

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function progressPercent() {
  return Math.round(((state.stepIndex + 1) / stepsFor(state.answers).length) * 100);
}

function meter(value, max = 8) {
  const filled = Math.max(0, Math.min(max, Number(value) || 0));
  return "█".repeat(filled) + "░".repeat(max - filled);
}

function flightItem(label, value, visual, explanation) {
  return `
    <div>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      <em aria-hidden="true">${escapeHtml(visual)}</em>
      <small>${escapeHtml(explanation)}</small>
    </div>
  `;
}

function renderStep() {
  const diskSelectorSteps = stepsFor(state.answers);
  const step = diskSelectorSteps[state.stepIndex];
  const selectedValue = state.answers[step.id];
  const options = step.options.map((option) => {
    const selected = selectedValue === option.value;
    return `
      <button class="choice-button" type="button" data-answer="${escapeHtml(option.value)}" aria-pressed="${selected}">
        ${escapeHtml(option.label)}
      </button>
    `;
  }).join("");

  selector.innerHTML = `
    <div class="tool-progress" aria-label="Steg ${state.stepIndex + 1} av ${diskSelectorSteps.length}">
      <div class="tool-progress-bar"><span style="width: ${progressPercent()}%"></span></div>
      <p>Steg ${state.stepIndex + 1} av ${diskSelectorSteps.length}</p>
    </div>
    <div class="tool-question">
      <p class="eyebrow">Diskvelger</p>
      <h2 tabindex="-1">${escapeHtml(step.title)}</h2>
      <p class="muted">${escapeHtml(step.help)}</p>
      <div class="choice-grid">${options}</div>
    </div>
    <div class="tool-controls">
      <button class="button button-light" type="button" data-back ${state.stepIndex === 0 ? "disabled" : ""}>Tilbake</button>
      <button class="button" type="button" data-next ${selectedValue ? "" : "disabled"}>${state.stepIndex === diskSelectorSteps.length - 1 ? "Vis anbefaling" : "Neste"}</button>
    </div>
  `;
}

function renderResult() {
  const result = getDiskRecommendation(state.answers);
  const flightUrl = simulatorUrl(result.params, state.answers);
  const nextLinks = resultLinks.map((link) => state.answers.throw === "forehand" && link.href.includes("backhand")
    ? { label: "Hvordan kaste forehand", href: "/guider/forehand-for-nybegynnere.html" } : link);
  const links = nextLinks.map((link) => `<a class="pill" href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`).join("");
  const examples = result.examples.map((example) => `<li>${escapeHtml(example.name)} (${Object.values(example.values).join(" / ")}) · <a href="${escapeHtml(example.source)}">Produsentens tall</a></li>`).join("");
  const direction = result.direction;
  const context = direction ? `Sett fra deg som kaster: ${state.answers.handedness === "right" ? "høyrehendt" : "venstrehendt"} ${state.answers.throw === "both" ? state.answers.problemStyle : state.answers.throw}.` : "Retningen avhenger av hånd og kastestil.";
  const flightItems = [
    flightItem("Speed", result.flight.speed, meter(result.visual.speed), "Lavere speed er lettere å få opp i fart."),
    flightItem("Glide", result.flight.glide, meter(result.visual.glide), "Mer glide kan gi mer flyvetid uten mer kraft."),
    flightItem("Turn", result.flight.turn, direction ? (direction.turn === "høyre" ? "►" : "◄") : "↔", `Mer negativt tall betyr større tendens til tidlig sving${direction ? ` mot ${direction.turn}` : ""}. ${context}`),
    flightItem("Fade", result.flight.fade, direction ? (direction.fade === "høyre" ? "►" : "◄") : "↔", `Høyere tall betyr tydeligere avslutning${direction ? ` mot ${direction.fade}` : ""}. ${direction ? "" : context}`)
  ].join("");

  selector.innerHTML = `
    <article class="tool-result" aria-live="polite">
      <div class="result-hero">
        <div class="result-icon" aria-hidden="true">🥏</div>
        <div>
          <p class="eyebrow">Din anbefaling</p>
          <h2 tabindex="-1">${escapeHtml(result.title)}</h2>
          <div class="result-category">
            <span>Anbefalt kategori</span>
            <strong>${escapeHtml(result.category)}</strong>
          </div>
        </div>
      </div>
      <div class="flight-grid" aria-label="Anbefalte flight numbers">
        ${flightItems}
      </div>
      <section>
        <h3>Hvorfor?</h3>
        <p>${escapeHtml(result.description)}</p>
      </section>
      <section>
        <h3>Hvilke kast passer den til?</h3>
        <p>${escapeHtml(result.fits)}</p>
      </section>
      <section class="avoid-box">
        <h3>Hva bør du unngå?</h3>
        <p>${escapeHtml(result.avoid)}</p>
      </section>
      <section class="example-box">
        <h3>Eksempeldisker</h3>
        <p>Eksempler innenfor intervallet, ikke fysisk testet her. Produsenttall er veiledende; plast, vekt og slitasje kan endre flyvebanen.</p>
        <ul>${examples}</ul>
      </section>
      <section class="simulator-teaser">
        <div>
          <p class="eyebrow">Neste verktøy</p>
          <h3>Se hvordan denne typen disk flyr</h3>
          <p>Se et eksempel innenfor intervallet. ${state.answers.throw === "both" && !state.answers.problemStyle ? "Illustrasjonen starter med backhand; du kan bytte kastestil." : "Kastestilen din følger med."} ${state.answers.handedness ? "" : "Høyrehendt brukes som illustrasjon til du velger hånd."}</p>
        </div>
        <a class="button button-light" href="${escapeHtml(flightUrl)}">Åpne flysimulator</a>
      </section>
      <section>
        <h3>Neste steg</h3>
        <div class="pill-row">${links}</div>
      </section>
      <div class="tool-controls">
        <button class="button button-light" type="button" data-restart>Kjør testen på nytt</button>
        <button class="button button-disabled" type="button" disabled>Del resultat kommer</button>
      </div>
    </article>
  `;
}

function goNext() {
  if (state.stepIndex < stepsFor(state.answers).length - 1) {
    state.stepIndex += 1;
    renderStep();
    return;
  }

  renderResult();
}

function goBack() {
  if (state.stepIndex > 0) {
    state.stepIndex -= 1;
    renderStep();
  }
}

function restart() {
  state.stepIndex = 0;
  state.answers = {};
  renderStep();
}

if (selector) {
  selector.addEventListener("click", (event) => {
    const answer = event.target.closest("[data-answer]");
    const next = event.target.closest("[data-next]");
    const back = event.target.closest("[data-back]");
    const restartButton = event.target.closest("[data-restart]");

    if (answer) {
      const step = stepsFor(state.answers)[state.stepIndex];
      state.answers[step.id] = answer.dataset.answer;
      if (["throw", "goal", "problem"].includes(step.id)) {
        delete state.answers.problemStyle;
        delete state.answers.handedness;
      }
      if (!needsDirection(state.answers)) delete state.answers.handedness;
      // Preserve the actual focused button; selecting an answer must not replace the DOM.
      selector.querySelectorAll("[data-answer]").forEach((button) => button.setAttribute("aria-pressed", String(button === answer)));
      const count = stepsFor(state.answers).length;
      const progress = selector.querySelector(".tool-progress");
      progress.setAttribute("aria-label", `Steg ${state.stepIndex + 1} av ${count}`);
      progress.querySelector("p").textContent = `Steg ${state.stepIndex + 1} av ${count}`;
      progress.querySelector("span").style.width = `${progressPercent()}%`;
      const nextButton = selector.querySelector("[data-next]");
      nextButton.disabled = false;
      nextButton.textContent = state.stepIndex === count - 1 ? "Vis anbefaling" : "Neste";
      return;
    }

    if (next) goNext();
    if (back) goBack();
    if (restartButton) restart();
    if ((next || back || restartButton) && event.detail === 0) selector.querySelector("h2")?.focus();
  });

  renderStep();
}
