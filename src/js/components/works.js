/* ===================================================================
   MERIDIAN — Works Grid & Filter Logic
   =================================================================== */

import { projects } from '../data/projects.js';

const worksGrid = document.getElementById('worksGrid');
const filtersEl = document.getElementById('filters');

/**
 * Render all project cards into the works grid.
 */
export function renderWorks() {
  worksGrid.innerHTML = projects
    .map(
      (p, i) => `
    <article class="work-card" data-reveal data-cat="${p.category}" data-id="${p.id}">
      <div class="num mono">N.0${i + 1}</div>
      <h3 class="display">${p.title}</h3>
      <div class="meta"><span>${p.categoryLabel}</span><span>${p.year}</span></div>
      <div class="frame"></div>
    </article>
  `
    )
    .join('');

  attachCardEvents();
}

/**
 * Attach tilt + click events to every work card.
 */
function attachCardEvents() {
  document.querySelectorAll('.work-card').forEach((card) => {
    // Click → open modal
    card.addEventListener('click', () => {
      const event = new CustomEvent('open-modal', { detail: card.dataset.id });
      window.dispatchEvent(event);
    });

    // Mousemove → 3D tilt
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(card, {
        rotateX: py * -4,
        rotateY: px * 6,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 800,
      });
    });

    // Mouseleave → reset tilt
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' });
    });
  });
}

/**
 * Initialize category filter buttons.
 */
export function initFilters() {
  filtersEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    // Toggle active state
    document.querySelectorAll('.filters button').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const f = btn.dataset.filter;

    document.querySelectorAll('.work-card').forEach((card) => {
      const show = f === 'all' || card.dataset.cat === f;
      card.classList.toggle('hidden', !show);

      if (show) {
        gsap.fromTo(
          card,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        );
      }
    });
  });
}
