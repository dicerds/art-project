import { initHeader, initRevealAnimations } from './shared.js';
import { getProjectBySlug, getProjectById, CATEGORIES, STYLES } from './data/projects.js';

initHeader();

const url = new URL(window.location.href);
const slug = url.searchParams.get('slug');
const content = document.getElementById('projectContent');

function renderNotFound() {
  content.innerHTML = `
    <div class="empty-state">
      <div class="empty-state-icon mono">◇</div>
      <h1 class="display">Project Not Found</h1>
      <p>The project you're looking for is not available. Please check the URL or return to the portfolio.</p>
      <div class="empty-state-actions">
        <a href="/portfolio.html" class="btn-outline mono">← Back to Portfolio</a>
        <a href="/contact.html" class="btn-link mono">Get In Touch →</a>
      </div>
    </div>
  `;
}

function factRow(label, value) {
  if (!value) return '';
  return `
    <div class="fact-row">
      <span class="fact-label mono">${label}</span>
      <span class="fact-value">${value}</span>
    </div>
  `;
}

function relatedCard(id) {
  const rp = getProjectById(id);
  if (!rp) return '';
  return `
    <a href="/project.html?slug=${rp.slug}" class="project-card" data-reveal>
      <div class="card-image placeholder-img">
        <span class="corner tl"></span>
        <span class="corner br"></span>
      </div>
      <h3 class="display">${rp.title}</h3>
      <div class="card-meta">
        <span>${CATEGORIES[rp.primaryCategory] || rp.primaryCategory}</span>
        <span>${rp.year || ''}</span>
      </div>
      <div class="frame"></div>
    </a>
  `;
}

function renderProject(p) {
  document.title = `${p.title} — ARCHITEKTA`;

  const styleTags = (p.styles || [])
    .map((s) => `<span class="tag">${STYLES[s] || s}</span>`)
    .join('');

  const hasGallery = Array.isArray(p.gallery) && p.gallery.some((g) => g && g.image);
  const gallery = hasGallery
    ? `
    <section class="detail-gallery-section" data-reveal>
      <h2>Project Gallery</h2>
      <div class="gallery-carousel" id="galleryCarousel">
        <div class="gallery-track" id="galleryTrack">
          ${p.gallery
            .filter((g) => g && g.image)
            .map(
              (g, i) => `
            <div class="gallery-slide" data-slide="${i}">
              <img src="${g.image}" alt="${g.caption || `${p.title} - Image ${i + 1}`}">
              <div class="gallery-caption">${g.caption || ''}</div>
            </div>
          `
            )
            .join('')}
        </div>
        <button class="gallery-nav gallery-prev" id="galleryPrev" aria-label="Previous image">←</button>
        <button class="gallery-nav gallery-next" id="galleryNext" aria-label="Next image">→</button>
        <div class="gallery-counter" aria-live="polite"><span id="galleryIndex">1</span> / <span id="galleryTotal">${p.gallery.filter((g) => g && g.image).length}</span></div>
      </div>
    </section>
  `
    : '';

  const floorplan = p.floorPlan
    ? `
    <section class="detail-floorplan" data-reveal>
      <h2>Floor Plan</h2>
      <div class="floorplan-image">
        <img src="${p.floorPlan}" alt="Floor plan for ${p.title}">
      </div>
    </section>
  `
    : '';

  const related =
    (p.relatedProjects || [])
      .map((id) => relatedCard(id))
      .filter(Boolean)
      .join('') || '';

  const relatedSection = related
    ? `
    <section class="detail-related" data-reveal>
      <h2 class="mono">Related Projects</h2>
      <div class="related-grid">${related}</div>
    </section>
  `
    : '';

  content.innerHTML = `
    ${p.heroImage
      ? `<div class="detail-hero-image"><img src="${p.heroImage}" alt="${p.title}"></div>`
      : `<div class="detail-hero-image placeholder-img">
          <span class="corner tl"></span>
          <span class="corner br"></span>
        </div>`}

    <header class="detail-header" data-reveal>
      <div>
        <div class="eyebrow mono">${CATEGORIES[p.primaryCategory] || ''}</div>
        <h1>${p.title}</h1>
      </div>
      <div class="detail-tags">${styleTags}</div>
    </header>

    <div class="detail-facts" data-reveal>
      <div class="fact-table">
        ${factRow('Location', p.location)}
        ${factRow('Year', p.year)}
        ${factRow('Building Area', p.buildingArea)}
        ${factRow('Land Area', p.landArea)}
        ${factRow('Role', p.role)}
        ${factRow('Scope', p.scope)}
      </div>
    </div>

    ${p.conceptDescription
      ? `
      <section class="detail-concept" data-reveal>
        <h2>Design Concept</h2>
        <p>${p.conceptDescription}</p>
      </section>
    `
      : ''}

    ${gallery}
    ${floorplan}
    ${relatedSection}

    <div class="detail-cta" data-reveal>
      <a href="/portfolio.html" class="btn-outline mono">← All Projects</a>
      <a href="/contact.html" class="btn-primary mono">Discuss Similar Project</a>
    </div>
  `;

  if (hasGallery) {
    setTimeout(() => initGallery(), 100);
  }
}

function initGallery() {
  const carousel = document.getElementById('galleryCarousel');
  if (!carousel) return;

  const track = document.getElementById('galleryTrack');
  const slides = track.querySelectorAll('.gallery-slide');
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');
  const indexEl = document.getElementById('galleryIndex');
  const totalEl = document.getElementById('galleryTotal');

  let current = 0;
  const total = slides.length;

  function updateCarousel() {
    const offset = -current * 100;
    track.style.transform = `translateX(${offset}%)`;
    indexEl.textContent = current + 1;
  }

  prevBtn.addEventListener('click', () => {
    current = (current - 1 + total) % total;
    updateCarousel();
  });

  nextBtn.addEventListener('click', () => {
    current = (current + 1) % total;
    updateCarousel();
  });

  let touchStart = 0;
  carousel.addEventListener('touchstart', (e) => {
    touchStart = e.touches[0].clientX;
  });

  carousel.addEventListener('touchend', (e) => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        current = (current + 1) % total;
      } else {
        current = (current - 1 + total) % total;
      }
      updateCarousel();
    }
  });

  carousel.setAttribute('tabindex', '0');
  carousel.setAttribute('role', 'region');
  carousel.setAttribute('aria-label', 'Project gallery');

  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      current = (current + 1) % total;
      updateCarousel();
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      current = (current - 1 + total) % total;
      updateCarousel();
      e.preventDefault();
    }
  });

  updateCarousel();
}

if (!slug) {
  renderNotFound();
} else {
  const p = getProjectBySlug(slug);
  if (!p) renderNotFound();
  else renderProject(p);
}

initRevealAnimations();
