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
      <h1 class="display">Proyek tidak ditemukan</h1>
      <p>Halaman proyek yang Anda cari belum tersedia atau slug tidak sesuai. Silakan kembali ke portofolio.</p>
      <div class="empty-state-actions">
        <a href="/portfolio.html" class="btn-outline mono">← Kembali ke Portofolio</a>
        <a href="/contact.html" class="btn-link mono">Hubungi Studio →</a>
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
  document.title = `${p.title} — Studio Arsitektur`;

  const styleTags = (p.styles || [])
    .map((s) => `<span class="tag">${STYLES[s] || s}</span>`)
    .join('');

  const hasGallery = Array.isArray(p.gallery) && p.gallery.some((g) => g);
  const gallery = hasGallery
    ? `
    <section class="detail-gallery" data-reveal>
      ${p.gallery
        .filter((g) => g)
        .map(
          (g, i) => `
        <div class="gallery-item">
          <img src="${g}" alt="${p.title} — foto ${i + 1}">
        </div>
      `
        )
        .join('')}
    </section>
  `
    : '';

  const floorplan = p.floorPlan
    ? `
    <section class="detail-floorplan" data-reveal>
      <h2>Denah</h2>
      <div class="floorplan-image">
        <img src="${p.floorPlan}" alt="Denah ${p.title}">
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
      <h2 class="mono">Proyek Terkait</h2>
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
        ${factRow('Lokasi', p.location)}
        ${factRow('Tahun', p.year)}
        ${factRow('Luas Bangunan', p.buildingArea)}
        ${factRow('Luas Lahan', p.landArea)}
        ${factRow('Peran', p.role)}
        ${factRow('Lingkup', p.scope)}
      </div>
    </div>

    ${p.conceptDescription
      ? `
      <section class="detail-concept" data-reveal>
        <h2>Konsep Desain</h2>
        <p>${p.conceptDescription}</p>
      </section>
    `
      : ''}

    ${gallery}
    ${floorplan}
    ${relatedSection}

    <div class="detail-cta" data-reveal>
      <a href="/portfolio.html" class="btn-outline mono">← Semua Proyek</a>
      <a href="/contact.html" class="btn-primary mono">Diskusikan Proyek Serupa</a>
    </div>
  `;
}

if (!slug) {
  renderNotFound();
} else {
  const p = getProjectBySlug(slug);
  if (!p) renderNotFound();
  else renderProject(p);
}

initRevealAnimations();
