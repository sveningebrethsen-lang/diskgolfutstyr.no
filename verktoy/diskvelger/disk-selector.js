import { diskSelectorSteps, getDiskRecommendation, resultLinks } from "./disk-selector-data.js";

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
  return Math.round(((state.stepIndex + 1) / diskSelectorSteps.length) * 100);
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
      <h2>${escapeHtml(step.title)}</h2>
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
  const links = resultLinks.map((link) => `<a class="pill" href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>`).join("");
  const examples = result.examples.map((example) => `<li>${escapeHtml(example)}</li>`).join("");
  const flightItems = [
    flightItem("Speed", result.flight.speed, meter(result.visual.speed), "Lavere speed er lettere å få opp i fart."),
    flightItem("Glide", result.flight.glide, meter(result.visual.glide), "Mer glide kan gi mer flyvetid uten mer kraft."),
    flightItem("Turn", result.flight.turn, result.visual.turn, "Pil mot venstre betyr lettere turn for høyrehendt backhand."),
    flightItem("Fade", result.flight.fade, result.visual.fade, "Pil mot høyre viser hvor tydelig disken avslutter.")
  ].join("");

  selector.innerHTML = `
    <article class="tool-result" aria-live="polite">
      <div class="result-hero">
        <div class="result-icon" aria-hidden="true">🥏</div>
        <div>
          <p class="eyebrow">Din anbefaling</p>
          <h2>${escapeHtml(result.title)}</h2>
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
        <h3>Eksempler, ikke affiliate</h3>
        <p>Dette er bare eksempler på disker i riktig retning. Velg plast, vekt og håndfølelse med litt sunn skepsis.</p>
        <ul>${examples}</ul>
      </section>
      <section class="simulator-teaser">
        <div>
          <p class="eyebrow">Neste verktøy</p>
          <h3>Se hvordan denne typen disk flyr</h3>
          <p>Flysimulatoren er ikke klar ennå, men strukturen er satt opp for å forklare speed, glide, turn, fade og kastvinkel.</p>
        </div>
        <a class="button button-light" href="/verktoy/flysimulator/">Åpne flysimulator</a>
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
  if (state.stepIndex < diskSelectorSteps.length - 1) {
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
      const step = diskSelectorSteps[state.stepIndex];
      state.answers[step.id] = answer.dataset.answer;
      renderStep();
      return;
    }

    if (next) goNext();
    if (back) goBack();
    if (restartButton) restart();
  });

  renderStep();
}
