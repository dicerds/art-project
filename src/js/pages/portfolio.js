import { initHeader, initRevealAnimations } from '../utils/shared.js';
import { projects, CATEGORIES, STYLES, SCALES, filterProjects } from '../data/projects.js';
import { createDesignLightbox } from '../components/design-lightbox.js';

initHeader();

const designLightbox = createDesignLightbox();
let currentResults = [];

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

function initDragScroll(container, onTap) {
  let isDown = false;
  let dragged = false;
  let startX = 0;
  let startScrollLeft = 0;

  container.addEventListener('pointerdown', (e) => {
    isDown = true;
    dragged = false;
    startX = e.clientX;
    startScrollLeft = container.scrollLeft;
    container.setPointerCapture(e.pointerId);
    container.classList.add('dragging');
  });

  container.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    const delta = e.clientX - startX;
    if (Math.abs(delta) > 5) dragged = true;
    container.scrollLeft = startScrollLeft - delta;
  });

  const stop = () => {
    isDown = false;
    container.classList.remove('dragging');
  };
  container.addEventListener('pointerup', stop);
  container.addEventListener('pointercancel', stop);
  container.addEventListener('pointerleave', stop);

  container.addEventListener('click', (e) => {
    if (dragged) {
      e.preventDefault();
      return;
    }
    let card = e.target.closest ? e.target.closest('.project-card') : null;
    if (!card && typeof e.clientX === 'number' && (e.clientX || e.clientY)) {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      card = el && el.closest ? el.closest('.project-card') : null;
    }
    if (card && container.contains(card) && onTap) onTap(card);
  });
}

function render() {
  const grid = document.getElementById('portfolioGrid');
  if (!grid) return;

  const filtersEl = document.getElementById('filters');

  if (projects.length === 0) {
    if (filtersEl) filtersEl.style.display = 'none';
    grid.classList.remove('is-carousel');
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon mono">◇</div>
        <h3 class="display">Portfolio In Progress</h3>
        <p>Project documentation is being prepared.</p>
        <div class="empty-state-actions">
          <a href="/services.html" class="btn-outline mono">View Services</a>
          <a href="/contact.html" class="btn-link mono">Contact Studio →</a>
        </div>
      </div>
    `;
    return;
  }

  const results = filterProjects(state);
  currentResults = results;

  if (results.length === 0) {
    grid.classList.remove('is-carousel');
    grid.innerHTML = `<div class="portfolio-empty">No projects match the selected filters.</div>`;
    return;
  }

  grid.classList.add('is-carousel');
  grid.innerHTML = results
    .map(
      (p, i) => `
    <button type="button" class="project-card" draggable="false" data-index="${i}" aria-label="Open ${p.title} — design drawings" data-reveal>
      <span class="card-num mono">N.${String(i + 1).padStart(2, '0')}</span>
      <div class="card-image black-img">
        <span class="corner tl"></span><span class="corner br"></span>
        <span class="card-view-hint mono">View Designs</span>
      </div>
      <h3 class="display">${p.title}</h3>
      <div class="card-meta"><span>${CATEGORIES[p.primaryCategory] || p.primaryCategory}</span><span>${p.year || ''}</span></div>
      <div class="card-tags">${(p.styles || []).map((s) => `<span class="tag">${STYLES[s] || s}</span>`).join('')}</div>
      <div class="frame"></div>
    </button>
  `
    )
    .join('');
}

buildFilterButtons(document.getElementById('filterCategory'), CATEGORIES, 'category');
buildFilterButtons(document.getElementById('filterStyle'), STYLES, 'style');
buildFilterButtons(document.getElementById('filterScale'), SCALES, 'scale');

render();
initRevealAnimations();

const portfolioGrid = document.getElementById('portfolioGrid');
if (portfolioGrid) {
  initDragScroll(portfolioGrid, (card) => {
    const idx = Number(card.dataset.index);
    if (Number.isNaN(idx) || !currentResults[idx]) return;
    designLightbox.open(currentResults, idx);
  });
}
