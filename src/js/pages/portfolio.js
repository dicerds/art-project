import { initHeader, initRevealAnimations } from '../utils/shared.js';
import { projects, CATEGORIES, STYLES, SCALES, filterProjects, loadProjects } from '../data/projects.js';
import { createDesignLightbox } from '../components/design-lightbox.js';
import { projectCarouselMarkup, initProjectCarousel } from '../components/project-carousel.js';

initHeader();

const designLightbox = createDesignLightbox();
const grid = document.getElementById('portfolioGrid');
let currentResults = [];
let carousel = null;
let trackEl = null;
let emptyEl = null;

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

function cardHtml(p, i) {
  return `
    <button type="button" class="project-card featured-card" data-index="${i}" aria-label="Open ${p.title} — design drawings">
      <span class="card-num mono">N.${String(i + 1).padStart(2, '0')}</span>
      <div class="card-image black-img">
        <span class="corner tl"></span><span class="corner br"></span>
        <span class="card-view-hint mono">View Designs</span>
      </div>
      <h3 class="display">${p.title}</h3>
      <div class="card-meta"><span>${CATEGORIES[p.primaryCategory] || p.primaryCategory}</span><span>${p.year || ''}</span></div>
      <div class="card-tags">${(p.styles || []).map((s) => `<span class="tag">${STYLES[s] || s}</span>`).join('')}</div>
    </button>`;
}

function ensureShell() {
  if (carousel) return;
  grid.insertAdjacentHTML('beforeend', projectCarouselMarkup(''));
  const root = grid.querySelector('.featured-carousel');
  trackEl = root.querySelector('.featured-track');
  carousel = initProjectCarousel(root, {
    onTap: (card) => {
      const idx = Number(card.dataset.index);
      if (!Number.isNaN(idx) && currentResults[idx]) designLightbox.open(currentResults, idx);
    },
  });
  emptyEl = document.createElement('div');
  emptyEl.style.display = 'none';
  grid.appendChild(emptyEl);
}

function showMessage(html) {
  grid.querySelector('.featured-carousel').style.display = 'none';
  emptyEl.innerHTML = html;
  emptyEl.style.display = '';
}

function render() {
  ensureShell();
  const filtersEl = document.getElementById('filters');

  if (projects.length === 0) {
    if (filtersEl) filtersEl.style.display = 'none';
    showMessage(`
      <div class="empty-state">
        <div class="empty-state-icon mono">◇</div>
        <h3 class="display">Portfolio In Progress</h3>
        <p>Project documentation is being prepared.</p>
        <div class="empty-state-actions">
          <a href="/services/" class="btn-outline mono">View Services</a>
          <a href="/contact/" class="btn-link mono">Contact Studio →</a>
        </div>
      </div>`);
    return;
  }

  const results = filterProjects(state);
  currentResults = results;

  if (results.length === 0) {
    showMessage('<div class="portfolio-empty">No projects match the selected filters.</div>');
    return;
  }

  emptyEl.style.display = 'none';
  grid.querySelector('.featured-carousel').style.display = '';
  trackEl.innerHTML = results.map(cardHtml).join('');
  carousel.refresh();
}

buildFilterButtons(document.getElementById('filterCategory'), CATEGORIES, 'category');
buildFilterButtons(document.getElementById('filterStyle'), STYLES, 'style');
buildFilterButtons(document.getElementById('filterScale'), SCALES, 'scale');

(async () => {
  await loadProjects();
  render();
  initRevealAnimations();
})();
