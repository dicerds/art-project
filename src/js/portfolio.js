import { initHeader, initRevealAnimations } from './shared.js';
import { projects, CATEGORIES, STYLES, SCALES, filterProjects } from './data/projects.js';

initHeader();

const state = { category: 'all', style: 'all', scale: 'all' };

const url = new URL(window.location.href);
if (url.searchParams.get('category')) state.category = url.searchParams.get('category');
if (url.searchParams.get('style')) state.style = url.searchParams.get('style');
if (url.searchParams.get('scale')) state.scale = url.searchParams.get('scale');

function buildFilterButtons(container, options, key) {
  const entries = [['all', 'All'], ...Object.entries(options)];
  container.innerHTML = entries
    .map(
      ([val, label]) =>
        `<button class="filter-btn ${state[key] === val ? 'active' : ''}" data-val="${val}">${label}</button>`
    )
    .join('');

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    state[key] = btn.dataset.val;
    container.querySelectorAll('button').forEach((b) => {
      b.classList.toggle('active', b.dataset.val === state[key]);
    });
    render();
    syncUrl();
  });
}

function syncUrl() {
  const params = new URLSearchParams();
  if (state.category !== 'all') params.set('category', state.category);
  if (state.style !== 'all') params.set('style', state.style);
  if (state.scale !== 'all') params.set('scale', state.scale);
  const q = params.toString();
  const next = q ? `?${q}` : window.location.pathname;
  window.history.replaceState({}, '', next);
}

function render() {
  const grid = document.getElementById('portfolioGrid');
  if (!grid) return;

  const filtersEl = document.getElementById('filters');

  if (projects.length === 0) {
    if (filtersEl) filtersEl.style.display = 'none';
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon mono">◇</div>
        <h3 class="display">Portfolio In Progress</h3>
        <p>Project documentation is being prepared. In the meantime, explore our services or reach out to the studio to discuss your project.</p>
        <div class="empty-state-actions">
          <a href="/services.html" class="btn-outline mono">View Services</a>
          <a href="/contact.html" class="btn-link mono">Contact Studio →</a>
        </div>
      </div>
    `;
    return;
  }

  const results = filterProjects(state);

  if (results.length === 0) {
    grid.innerHTML = `
      <div class="portfolio-empty">
        No projects match the selected filters.
      </div>
    `;
    return;
  }

  grid.innerHTML = results
    .map(
      (p, i) => `
    <a href="/project.html?slug=${p.slug}" class="project-card" data-reveal>
      <span class="card-num mono">N.${String(i + 1).padStart(2, '0')}</span>
      <div class="card-image placeholder-img">
        <span class="corner tl"></span>
        <span class="corner br"></span>
      </div>
      <h3 class="display">${p.title}</h3>
      <div class="card-meta">
        <span>${CATEGORIES[p.primaryCategory] || p.primaryCategory}</span>
        <span>${p.year || ''}</span>
      </div>
      <div class="card-tags">
        ${(p.styles || []).map((s) => `<span class="tag">${STYLES[s] || s}</span>`).join('')}
      </div>
      <div class="frame"></div>
    </a>
  `
    )
    .join('');
}

buildFilterButtons(document.getElementById('filterCategory'), CATEGORIES, 'category');
buildFilterButtons(document.getElementById('filterStyle'), STYLES, 'style');
buildFilterButtons(document.getElementById('filterScale'), SCALES, 'scale');

render();
initRevealAnimations();
