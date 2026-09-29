// Optional browser QA; uses an existing Playwright runtime, never installs dependencies.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { getDiskRecommendation } from "../verktoy/diskvelger/disk-selector-data.js";
import { flightPresets } from "../verktoy/flysimulator/flight-presets.js";
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.TEST_BASE_URL || "http://127.0.0.1:8124";
const output = join(tmpdir(), "diskgolfutstyr-24c-qa");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, channel: process.env.BROWSER_CHANNEL || "msedge" });
const failures = [];
const measurements = [];
let transitions = 0;
try {
  for (const [width, height] of [[1366,768], [390,844], [375,667]]) {
    const context = await browser.newContext({ viewport: { width, height }, hasTouch: width < 500, reducedMotion: "reduce" });
    await context.route("https://static.cloudflareinsights.com/**", route => route.abort());
    const page = await context.newPage();
    page.on("pageerror", error => failures.push(error.message));
    page.on("response", response => { if (response.url().startsWith(base) && response.status() >= 400) failures.push(`${response.status()} ${response.url()}`); });
    page.on("requestfailed", request => { if (request.url().startsWith(base)) failures.push(request.url()); });
    const overflow = async () => assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    const click = async locator => width < 500 ? locator.tap() : locator.click();
    const readValues = () => page.locator("[data-flight-input]").evaluateAll(inputs => Object.fromEntries(inputs.map(input => [input.dataset.flightInput, Number(input.value)])));
    const profiles = [
      { experience: "never", distance: "unknown", throw: "backhand", goal: "easy", problem: "unknown" },
      { experience: "beginner", distance: "50-70", throw: "forehand", goal: "distance", problem: "early-left", handedness: "right" },
      { experience: "intermediate", distance: "70-90", throw: "backhand", goal: "control", problem: "finish-right", handedness: "left" },
      { experience: "experienced", distance: "110plus", throw: "both", goal: "distance", problem: "early-right", problemStyle: "forehand", handedness: "left" }
    ];
    for (const [i, answers] of profiles.entries()) {
      await page.goto(`${base}/verktoy/diskvelger/`);
      await page.waitForSelector("[data-answer]");
      for (const value of Object.values(answers)) {
        await click(page.locator(`[data-answer="${value}"]`));
        await click(page.locator("[data-next]")); transitions++;
      }
      await page.waitForSelector(".tool-result");
      await overflow();
      const recommendation = getDiskRecommendation(answers);
      assert.equal(await page.locator(".result-category strong").textContent(), recommendation.category);
      if (i === 1) await page.screenshot({ path: join(output, `selector-${width}.png`), fullPage: true });
      await click(page.getByRole("link", { name: "Åpne flysimulator" }));
      await page.waitForSelector(".flight-svg");
      assert.deepEqual(await readValues(), recommendation.params);
      assert.equal(await page.locator("[data-url-prefill]").isVisible(), true);
      assert.equal(await page.locator('[name="throwStyle"]:checked').inputValue(), answers.problemStyle || answers.throw);
      if (answers.handedness) assert.equal(await page.locator('[name="handedness"]:checked').inputValue(), answers.handedness);
      await overflow();
    }

    await page.goto(`${base}/verktoy/flysimulator/`);
    await page.waitForSelector(".flight-svg");
    assert.equal(await page.locator("[data-url-prefill]").isVisible(), false);
    assert.equal(await page.locator("[data-url-prefill]").evaluate(e => e.getBoundingClientRect().height), 0);
    for (const [name, min, max] of [["speed",1,14], ["glide",1,7], ["turn",-5,1], ["fade",0,5]]) {
      const input = page.locator(`[data-flight-input="${name}"]`);
      assert.ok((await input.boundingBox()).height >= 44);
      for (let value = min; value <= max; value++) {
        await input.fill(String(value));
        assert.equal(await page.locator(`[data-value-for="${name}"]`).textContent(), String(value));
        assert.match(await page.locator(".flight-path").getAttribute("d"), /^M /);
      }
      await input.focus();
      await input.press("Home");
      assert.equal(await input.inputValue(), String(min));
      await input.press("ArrowRight");
      assert.equal(await input.inputValue(), String(min + 1));
      const focusStyle = await input.evaluate(e => ({ visible: e.matches(":focus-visible"), outline: getComputedStyle(e).outlineStyle }));
      assert.equal(focusStyle.visible, true);
      assert.notEqual(focusStyle.outline, "none");
      if (width < 500) {
        await input.press("Home");
        await input.tap({ position: { x: (await input.boundingBox()).width * 0.7, y: 22 } });
        assert.ok(Number(await input.inputValue()) > min);
      }
    }
    for (const preset of flightPresets) {
      await page.locator(`[data-preset="${preset.id}"]`).press("Enter");
      assert.deepEqual(await readValues(), preset.values);
      assert.ok((await page.locator("[data-flight-examples]").textContent()).includes(preset.example));
    }
    for (const style of ["backhand", "forehand"]) for (const hand of ["right", "left"]) {
      await page.locator(`[name="throwStyle"][value="${style}"]`).check();
      await page.locator(`[name="handedness"][value="${hand}"]`).check();
      assert.ok((await page.locator("#flight-svg-title").textContent()).includes(style));
      assert.ok((await page.locator("#flight-svg-description").textContent()).includes("ikke en lengdeprognose"));
    }
    const duration = await page.locator(".flight-path").evaluate(e => parseFloat(getComputedStyle(e).animationDuration));
    assert.ok(duration <= 0.001);
    await page.goto(`${base}/verktoy/flysimulator/?speed=7&glide=5&turn=-2&fade=1&throwStyle=forehand&handedness=left&origin=selector`);
    await page.waitForSelector(".flight-svg");
    await overflow();
    await page.screenshot({ path: join(output, `visualizer-${width}.png`), fullPage: true });
    measurements.push(await page.evaluate(() => ({ width: innerWidth, svgTop: document.querySelector(".flight-svg").getBoundingClientRect().top + scrollY, sliderHeights: [...document.querySelectorAll("[data-flight-input]")].map(e => e.getBoundingClientRect().height) })));

    const queries = [
      ["", { speed:7,glide:5,turn:-2,fade:1 }, false],
      ["?speed=1&glide=1&turn=1&fade=0", { speed:1,glide:1,turn:1,fade:0 }, false],
      ["?speed=14&glide=7&turn=-5&fade=5&origin=selector", { speed:14,glide:7,turn:-5,fade:5 }, true],
      ["?speed=7.5&glide=6&turn=&fade=&origin=selector", { speed:7,glide:6,turn:-2,fade:1 }, true],
      ["?speed=99&glide=6&turn=-3&fade=2", { speed:7,glide:6,turn:-3,fade:2 }, false],
      ["?origin=selector&turn=&fade=", { speed:7,glide:5,turn:-2,fade:1 }, false],
      ["?speed=5", { speed:5,glide:5,turn:-2,fade:1 }, false]
    ];
    for (const [query, expected, notice] of queries) {
      await page.goto(`${base}/verktoy/flysimulator/${query}`);
      await page.waitForSelector(".flight-svg");
      assert.deepEqual(await readValues(), expected);
      assert.equal(await page.locator("[data-url-prefill]").isVisible(), notice);
      await overflow();
    }

    // Keyboard activation must retain focus on a choice and move it only at a step transition.
    await page.goto(`${base}/verktoy/diskvelger/`);
    const first = page.locator('[data-answer="never"]');
    await first.focus();
    await first.press("Space");
    assert.equal(await first.evaluate(e => e === document.activeElement), true);
    await page.locator("[data-next]").press("Enter");
    assert.equal(await page.evaluate(() => document.activeElement.tagName), "H2");
    await page.keyboard.press("Tab");
    assert.ok(await page.evaluate(() => document.activeElement.hasAttribute("data-answer")));
    await page.locator("[data-back]").press("Enter");
    assert.equal(await first.getAttribute("aria-pressed"), "true");
    for (const value of ["never", "unknown", "backhand", "easy", "unknown"]) {
      await page.locator(`[data-answer="${value}"]`).press("Enter");
      await page.locator("[data-next]").press("Enter");
    }
    assert.equal(await page.evaluate(() => document.activeElement.tagName), "H2");
    await page.locator("[data-restart]").press("Enter");
    assert.equal(await page.evaluate(() => document.activeElement.tagName), "H2");
    assert.equal(await page.locator("[data-next]").isDisabled(), true);
    assert.equal(await page.locator('[aria-pressed="true"]').count(), 0);
    // Going back and removing a directional problem must discard the conditional context.
    for (const value of ["some", "70-90", "both", "distance", "early-left", "forehand"]) {
      await page.locator(`[data-answer="${value}"]`).press("Enter");
      await page.locator("[data-next]").press("Enter");
    }
    await page.locator('[data-answer="left"]').press("Enter");
    await page.locator("[data-back]").press("Enter");
    await page.locator("[data-back]").press("Enter");
    await page.locator('[data-answer="unknown"]').press("Enter");
    await page.locator("[data-next]").press("Enter");
    const href = await page.getByRole("link", { name: "Åpne flysimulator" }).getAttribute("href");
    assert.ok(!href.includes("handedness") && !href.includes("throwStyle"));
    await page.goto(`${base}/verktoy/flysimulator/`);
    await page.waitForSelector(".flight-svg");
    measurements.push(await page.evaluate(() => ({ width: innerWidth, directSvgTop: document.querySelector(".flight-svg").getBoundingClientRect().top + scrollY })));
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.locator('[data-flight-input="turn"]').fill("-5");
    await page.waitForTimeout(800);
    assert.equal(await page.locator(".flight-path").evaluate(e => getComputedStyle(e).opacity), "1");
    await overflow();
    await context.close();
  }
  assert.deepEqual(failures, []);
  console.log(JSON.stringify({ transitions, measurements, failures, screenshots: output }, null, 2));
} finally {
  await browser.close();
}
