const typeLabels = {
  startsett: "Startsett",
  putter: "Putter",
  midrange: "Midrange",
  "fairway-driver": "Fairway-driver",
  bag: "Bag"
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function statusBadge(product) {
  if (product.testetAvOss) {
    return '<span class="badge badge-tested">Fysisk testet av Diskgolfguiden</span>';
  }

  return '<span class="badge badge-research">Research-basert - ikke fysisk testet</span>';
}

function productCard(product) {
  const fordeler = product.fordeler.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const ulemper = product.ulemper.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const link = product.affiliateUrl
    ? `<a class="button" href="${escapeHtml(product.affiliateUrl)}" rel="sponsored nofollow">Se butikk</a>`
    : '<span class="button button-disabled" aria-disabled="true">Butikklenke kommer</span>';

  return `
    <article class="product-card">
      <div class="product-card__top">
        <p class="eyebrow">${escapeHtml(typeLabels[product.type] || product.type)}</p>
        ${statusBadge(product)}
      </div>
      <h3>${escapeHtml(product.navn)}</h3>
      <p>${escapeHtml(product.kortNotat)}</p>
      <dl class="product-facts">
        <div><dt>Stabilitet</dt><dd>${escapeHtml(product.stabilitet)}</dd></div>
        <div><dt>Plast</dt><dd>${escapeHtml(product.plast)}</dd></div>
        <div><dt>Passer for</dt><dd>${escapeHtml(product.anbefaltNiva)}</dd></div>
        <div><dt>Bruk</dt><dd>${escapeHtml(product.bruksomrade)}</dd></div>
      </dl>
      <div class="pros-cons">
        <div>
          <h4>Fordeler</h4>
          <ul>${fordeler}</ul>
        </div>
        <div>
          <h4>Ulemper</h4>
          <ul>${ulemper}</ul>
        </div>
      </div>
      ${link}
    </article>
  `;
}

async function renderProducts() {
  const targets = document.querySelectorAll("[data-product-list]");
  if (!targets.length) return;

  try {
    const response = await fetch("data/products.json");
    const products = await response.json();

    targets.forEach((target) => {
      const type = target.dataset.productList;
      const limit = Number(target.dataset.limit || 99);
      const filtered = products
        .filter((product) => type === "all" || product.type === type)
        .slice(0, limit);

      target.innerHTML = filtered.length
        ? filtered.map(productCard).join("")
        : '<p class="notice">Ingen produkter er lagt inn i denne kategorien ennå.</p>';
    });
  } catch (error) {
    targets.forEach((target) => {
      target.innerHTML = '<p class="notice">Produktdata kunne ikke lastes akkurat nå.</p>';
    });
  }
}

function courseCard(course) {
  return `
    <article class="course-card">
      <div class="product-card__top">
        <p class="eyebrow">${escapeHtml(course.region)}</p>
        <span class="badge">${escapeHtml(course.profileStatus)}</span>
      </div>
      <h3>${escapeHtml(course.name)}</h3>
      <p>${escapeHtml(course.why)}</p>
      <dl class="product-facts">
        <div><dt>Sted</dt><dd>${escapeHtml(course.location)}</dd></div>
        <div><dt>Passer for</dt><dd>${escapeHtml(course.bestFor)}</dd></div>
        <div><dt>Datastatus</dt><dd>${escapeHtml(course.sourceStatus)}</dd></div>
      </dl>
      <a href="${escapeHtml(course.sourceUrl)}">Sjekk kilde</a>
    </article>
  `;
}

async function renderCourses() {
  const target = document.querySelector("[data-course-list]");
  if (!target) return;

  try {
    const response = await fetch("data/courses.json");
    const courses = await response.json();
    target.innerHTML = courses.map(courseCard).join("");
  } catch (error) {
    target.innerHTML = '<p class="notice">Banedata kunne ikke lastes akkurat nå.</p>';
  }
}

function articleCard(article) {
  return `
    <article class="roadmap-card">
      <div class="roadmap-card__meta">
        <span class="priority">#${escapeHtml(article.priority)}</span>
        <span>${escapeHtml(article.category)}</span>
      </div>
      <h3>${escapeHtml(article.title)}</h3>
      <p>${escapeHtml(article.reason)}</p>
      <dl class="roadmap-facts">
        <div><dt>Nøkkelord</dt><dd>${escapeHtml(article.keyword)}</dd></div>
        <div><dt>Intensjon</dt><dd>${escapeHtml(article.intent)}</dd></div>
        <div><dt>Vanskelighet</dt><dd>${escapeHtml(article.difficulty)}</dd></div>
        <div><dt>Verdi</dt><dd>${escapeHtml(article.value)}</dd></div>
        <div><dt>Affiliate</dt><dd>${escapeHtml(article.affiliatePotential)}</dd></div>
        <div><dt>Slug</dt><dd>/${escapeHtml(article.slug)}</dd></div>
      </dl>
    </article>
  `;
}

function testRow(test) {
  return `
    <tr>
      <td>${escapeHtml(test.priority)}</td>
      <td>${escapeHtml(test.title)}</td>
      <td>${escapeHtml(test.method)}</td>
      <td>${escapeHtml(test.evidence)}</td>
    </tr>
  `;
}

async function renderContentRoadmap() {
  const articleTarget = document.querySelector("[data-content-roadmap]");
  const categoryTarget = document.querySelector("[data-content-categories]");
  const testTarget = document.querySelector("[data-test-roadmap]");
  const comparisonTarget = document.querySelector("[data-comparison-list]");
  if (!articleTarget && !testTarget && !comparisonTarget) return;

  try {
    const response = await fetch("data/content.json");
    const content = await response.json();
    const limit = Number(articleTarget?.dataset.limit || content.articles.length);

    if (articleTarget) {
      articleTarget.innerHTML = content.articles.slice(0, limit).map(articleCard).join("");
    }

    if (categoryTarget) {
      const counts = content.articles.reduce((acc, article) => {
        acc[article.category] = (acc[article.category] || 0) + 1;
        return acc;
      }, {});
      categoryTarget.innerHTML = Object.entries(counts)
        .map(([name, count]) => `<span class="topic-pill">${escapeHtml(name)} <strong>${count}</strong></span>`)
        .join("");
    }

    if (testTarget) {
      testTarget.innerHTML = content.tests.map(testRow).join("");
    }

    if (comparisonTarget) {
      comparisonTarget.innerHTML = content.comparisons
        .map((comparison) => `<li>${escapeHtml(comparison)}</li>`)
        .join("");
    }
  } catch (error) {
    [articleTarget, testTarget, comparisonTarget].forEach((target) => {
      if (target) target.innerHTML = '<p class="notice">Innholdskartet kunne ikke lastes akkurat nå.</p>';
    });
  }
}

function initMenu() {
  const button = document.querySelector("[data-menu-button]");
  const nav = document.querySelector("[data-nav]");
  if (!button || !nav) return;

  const setMenu = (isOpen) => {
    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute("aria-label", isOpen ? "Lukk meny" : "Åpne meny");
    button.textContent = isOpen ? "×" : "☰";
    nav.toggleAttribute("data-open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
  };

  const closeMenu = () => setMenu(false);

  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";
    setMenu(!isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (button.getAttribute("aria-expanded") !== "true") return;
    if (button.contains(event.target) || nav.contains(event.target)) return;
    closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

function initCurrentNav() {
  const currentPath = window.location.pathname.replace(/\/$/, "/index.html");
  document.querySelectorAll(".nav a").forEach((link) => {
    const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/$/, "/index.html");
    const sectionMatch =
      (currentPath.startsWith("/baner/") && linkPath === "/baner/index.html") ||
      (currentPath.startsWith("/klubber/") && linkPath === "/klubber/index.html") ||
      (currentPath.startsWith("/turneringer/") && linkPath === "/turneringer/index.html");

    if (linkPath === currentPath || sectionMatch) {
      link.setAttribute("aria-current", "page");
    }
  });
}

function initCourseFilters() {
  const filter = document.querySelector("[data-course-filter]");
  const cards = Array.from(document.querySelectorAll("[data-course-card]"));
  if (!filter || !cards.length) return;

  const city = filter.querySelector("[data-filter-city]");
  const county = filter.querySelector("[data-filter-county]");
  const holes = filter.querySelector("[data-filter-holes]");
  const beginner = filter.querySelector("[data-filter-beginner]");
  const family = filter.querySelector("[data-filter-family]");
  const count = document.querySelector("[data-filter-count]");

  const apply = () => {
    let visible = 0;

    cards.forEach((card) => {
      const holeCount = Number(card.dataset.holes || 0);
      const matchesCity = !city?.value || card.dataset.city === city.value;
      const matchesCounty = !county?.value || card.dataset.county === county.value;
      const matchesHoles = !holes?.value || (holes.value === "18" ? holeCount >= 18 : holeCount > 0 && holeCount < 18);
      const matchesBeginner = !beginner?.checked || card.dataset.beginner === "true";
      const matchesFamily = !family?.checked || card.dataset.family === "true";
      const show = matchesCity && matchesCounty && matchesHoles && matchesBeginner && matchesFamily;

      card.hidden = !show;
      if (show) visible += 1;
    });

    if (count) count.textContent = `${visible} baner vises.`;
  };

  [city, county, holes, beginner, family].forEach((control) => {
    if (control) control.addEventListener("change", apply);
  });

  apply();
}

document.addEventListener("DOMContentLoaded", () => {
  initMenu();
  initCurrentNav();
  initCourseFilters();
  renderProducts();
  renderCourses();
  renderContentRoadmap();
});
