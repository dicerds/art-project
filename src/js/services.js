import { initHeader, initRevealAnimations } from './shared.js';
import { services } from './data/services.js';
import { STYLES } from './data/projects.js';

initHeader();

const anchorNav = document.getElementById('servicesAnchorNav');
if (anchorNav) {
  anchorNav.innerHTML = services
    .map(
      (s) => `<a href="#${s.slug}"><span>${s.number}</span> ${s.title}</a>`
    )
    .join('');
}

const list = document.getElementById('servicesList');
if (list) {
  list.innerHTML = services
    .map(
      (s) => `
    <article class="service-detail" id="${s.slug}" data-reveal>
      <header class="service-detail-head">
        <span class="service-num display">${s.number}</span>
        <div>
          <h2 class="display">${s.title}</h2>
          <p class="service-tagline mono">${s.tagline}</p>
        </div>
      </header>

      <p class="service-summary-large">${s.summary}</p>

      <div class="service-body">
        <div class="service-column">
          <h3 class="service-column-title mono">Cocok untuk audiens</h3>
          <ul class="service-list">
            ${s.audience.map((a) => `<li>${a}</li>`).join('')}
          </ul>
        </div>

        <div class="service-column">
          <h3 class="service-column-title mono">Yang Anda dapatkan</h3>
          <ul class="service-list">
            ${s.deliverables.map((d) => `<li>${d}</li>`).join('')}
          </ul>
        </div>

        <div class="service-column">
          <h3 class="service-column-title mono">Cocok untuk proyek</h3>
          <p class="service-plain">${s.suitableFor}</p>

          <h3 class="service-column-title mono" style="margin-top:24px;">Estimasi waktu</h3>
          <p class="service-plain">${s.timeline}</p>

          <h3 class="service-column-title mono" style="margin-top:24px;">Gaya yang tersedia</h3>
          <div class="service-tags">
            ${s.styles.map((st) => `<span class="tag">${STYLES[st] || st}</span>`).join('')}
          </div>
        </div>
      </div>

      <div class="service-footer">
        <a href="/portfolio.html?category=${s.category}" class="btn-link mono">Lihat proyek ${s.title} →</a>
        <a href="/contact.html?service=${s.slug}" class="btn-outline mono">Diskusikan Proyek</a>
      </div>
    </article>
  `
    )
    .join('');
}

initRevealAnimations();

document.querySelectorAll('.services-anchor-nav a').forEach((a) => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
