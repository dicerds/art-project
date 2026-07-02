import { initHeader, initRevealAnimations } from '../utils/shared.js';
import { getFeaturedProjects, CATEGORIES } from '../data/projects.js';
import { services } from '../data/services.js';
import { createDesignLightbox } from '../components/design-lightbox.js';

initHeader();

const designLightbox = createDesignLightbox();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const servicesGrid = document.getElementById('servicesGrid');
if (servicesGrid) {
  servicesGrid.innerHTML = services
    .map(
      (s) => `
    <a href="/services.html#${s.slug}" class="service-card" data-reveal>
      <span class="service-num mono">N.${s.number}</span>
      <h3 class="display">${s.title}</h3>
      <p class="service-tagline mono">${s.tagline}</p>
      <p class="service-summary">${s.summary}</p>
      <span class="service-cta mono">Learn More →</span>
    </a>
  `
    )
    .join('');
}

const featuredGrid = document.getElementById('featuredGrid');
const featured = getFeaturedProjects();

if (featuredGrid) {
  if (featured.length === 0) {
    featuredGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon mono">◇</div>
        <h3 class="display">Portfolio In Progress</h3>
        <p>Project documentation is being prepared. In the meantime, explore our services or reach out to the studio directly.</p>
        <div class="empty-state-actions">
          <a href="/services.html" class="btn-outline mono">View Services</a>
          <a href="/contact.html" class="btn-link mono">Contact Studio →</a>
        </div>
      </div>
    `;
  } else {
    featuredGrid.innerHTML = `
      <div class="featured-carousel" id="featuredCarousel" aria-roledescription="carousel" aria-label="Featured work">
        <div class="featured-viewport" id="featuredViewport">
          <div class="featured-track" id="featuredTrack">
            ${featured
              .map(
                (p, i) => `
              <button type="button" class="project-card featured-card" data-index="${i}" aria-label="Open ${p.title} — design drawings">
                <span class="card-num mono">N.0${i + 1}</span>
                <div class="card-image black-img">
                  <span class="corner tl"></span>
                  <span class="corner br"></span>
                  <span class="card-view-hint mono">View Designs</span>
                </div>
                <h3 class="display">${p.title}</h3>
                <div class="card-meta">
                  <span>${CATEGORIES[p.primaryCategory]}</span>
                  <span>${p.year}</span>
                </div>
              </button>
            `
              )
              .join('')}
          </div>
        </div>
        <button type="button" class="carousel-nav carousel-prev" id="featuredPrev" aria-label="Previous">←</button>
        <button type="button" class="carousel-nav carousel-next" id="featuredNext" aria-label="Next">→</button>
        <div class="carousel-dots" id="featuredDots" role="tablist" aria-label="Featured slides"></div>
      </div>
    `;

    initFeaturedCarousel();
  }
}

function initFeaturedCarousel() {
  const carousel = document.getElementById('featuredCarousel');
  const viewport = document.getElementById('featuredViewport');
  const track = document.getElementById('featuredTrack');
  const prevBtn = document.getElementById('featuredPrev');
  const nextBtn = document.getElementById('featuredNext');
  const dots = document.getElementById('featuredDots');
  if (!carousel || !track) return;

  const cards = Array.from(track.children);
  const total = cards.length;
  let current = 0;

  function metrics() {
    const cardW = cards[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
    const step = cardW + gap;
    const visible = Math.max(1, Math.round((viewport.clientWidth + gap) / step));
    const maxIndex = Math.max(0, total - visible);
    return { step, visible, maxIndex };
  }

  function go(i) {
    const { step, maxIndex } = metrics();
    if (i < 0) current = maxIndex;
    else if (i > maxIndex) current = 0;
    else current = i;
    track.style.transform = `translateX(${-current * step}px)`;
    updateDots();
  }

  function next() {
    const { maxIndex } = metrics();
    go(current >= maxIndex ? 0 : current + 1);
  }

  function prev() {
    const { maxIndex } = metrics();
    go(current <= 0 ? maxIndex : current - 1);
  }

  function buildDots() {
    const { maxIndex } = metrics();
    dots.innerHTML = '';
    for (let i = 0; i <= maxIndex; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'carousel-dot';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', `Go to slide ${i + 1}`);
      b.addEventListener('click', () => {
        stopAuto();
        go(i);
        startAuto();
      });
      dots.appendChild(b);
    }
    updateDots();
  }

  function updateDots() {
    Array.from(dots.children).forEach((d, i) => {
      const active = i === current;
      d.classList.toggle('active', active);
      d.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  let timer = null;
  function startAuto() {
    if (reduceMotion) return;
    stopAuto();
    timer = setInterval(next, 4500);
  }
  function stopAuto() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  prevBtn.addEventListener('click', () => {
    stopAuto();
    prev();
    startAuto();
  });
  nextBtn.addEventListener('click', () => {
    stopAuto();
    next();
    startAuto();
  });

  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);
  carousel.addEventListener('focusin', stopAuto);
  carousel.addEventListener('focusout', startAuto);

  carousel.setAttribute('tabindex', '0');
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      stopAuto();
      next();
      startAuto();
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      stopAuto();
      prev();
      startAuto();
      e.preventDefault();
    }
  });

  let touchStart = 0;
  viewport.addEventListener(
    'touchstart',
    (e) => {
      touchStart = e.touches[0].clientX;
      stopAuto();
    },
    { passive: true }
  );
  viewport.addEventListener('touchend', (e) => {
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) (diff > 0 ? next : prev)();
    startAuto();
  });

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      stopAuto();
      designLightbox.open(featured, Number(card.dataset.index), { onClose: startAuto });
    });
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      current = Math.min(current, metrics().maxIndex);
      buildDots();
      go(current);
    }, 150);
  });

  buildDots();
  go(0);
  startAuto();

}

const canvas = document.getElementById('scene');

if (canvas && typeof THREE !== 'undefined') {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 1.2, 9);

  const structure = new THREE.Group();
  scene.add(structure);

  const cAccent = new THREE.Color(0x2c3e4f);
  const cGold = new THREE.Color(0xc5a572);

  function vol(w, h, d, x, y, z, color, opacity) {
    const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d));
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
    line.position.set(x, y, z);
    return line;
  }

  [
    vol(3.2, 1.2, 3.2, 0, -1.4, 0, cAccent, 0.55),
    vol(2.2, 1.6, 2.2, 0.6, -0.1, 0.3, cAccent, 0.85),
    vol(1.4, 2.4, 1.4, -0.9, 1.1, -0.4, cGold, 0.5),
    vol(0.9, 3.4, 0.9, 1.1, 1.9, -0.9, cAccent, 0.7),
  ].forEach((v) => structure.add(v));

  const grid = new THREE.GridHelper(20, 20, 0x2c3e4f, 0xcfcdc7);
  grid.position.y = -2;
  scene.add(grid);
  structure.rotation.y = 0.4;

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  let mx = 0;
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX / window.innerWidth - 0.5;
  });

  const clock = new THREE.Clock();
  camera.baseX = 0;

  (function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    if (!reduceMotion) {
      structure.rotation.y += 0.0018;
      structure.position.y = Math.sin(t * 0.4) * 0.08;
    }
    camera.position.x += (mx * 1.2 - camera.position.x + camera.baseX) * 0.04;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  })();

  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 0.6,
      onUpdate: (self) => {
        const p = self.progress;
        camera.position.z = 9 - p * 4;
        camera.position.y = 1.2 - p * 1.6;
        camera.baseX = p * 1.4;
      },
    });

    ScrollTrigger.create({
      trigger: '.home-services',
      start: 'top center',
      end: 'bottom top',
      onUpdate: (self) => {
        canvas.style.opacity = String(1 - self.progress * 0.9);
      },
    });
  }
}

if (typeof gsap !== 'undefined') {
  gsap
    .timeline({ defaults: { ease: 'power3.out' } })
    .from('.hero h1 span', { yPercent: 120, duration: 1.1, stagger: 0.12 }, 0.2)
    .from('.hero .eyebrow', { opacity: 0, y: 12, duration: 0.8 }, 0.1)
    .from('.hero .hero-sub', { opacity: 0, y: 12, duration: 0.8 }, 0.5)
    .from('.hero .hero-actions', { opacity: 0, y: 12, duration: 0.8 }, 0.7)
    .from('.site-header', { opacity: 0, y: -16, duration: 0.8 }, 0.1);
}

initRevealAnimations();
