import { initHeader, initRevealAnimations } from './shared.js';
import { getFeaturedProjects, CATEGORIES } from './data/projects.js';
import { services } from './data/services.js';

initHeader();

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
      <span class="service-cta mono">Pelajari →</span>
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
        <h3 class="display">Portofolio dalam Persiapan</h3>
        <p>Dokumentasi proyek sedang disusun. Sementara ini, Anda dapat mempelajari layanan kami atau menghubungi studio langsung.</p>
        <div class="empty-state-actions">
          <a href="/services.html" class="btn-outline mono">Lihat Layanan</a>
          <a href="/contact.html" class="btn-link mono">Hubungi Studio →</a>
        </div>
      </div>
    `;
  } else {
    featuredGrid.innerHTML = featured
      .map(
        (p, i) => `
      <a href="/project.html?slug=${p.slug}" class="project-card" data-reveal>
        <span class="card-num mono">N.0${i + 1}</span>
        <div class="card-image placeholder-img">
          <span class="corner tl"></span>
          <span class="corner br"></span>
        </div>
        <h3 class="display">${p.title}</h3>
        <div class="card-meta">
          <span>${CATEGORIES[p.primaryCategory]}</span>
          <span>${p.year}</span>
        </div>
        <div class="frame"></div>
      </a>
    `
      )
      .join('');
  }
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

  const cAccent = new THREE.Color(0x7fa3c4);
  const cPaper = new THREE.Color(0xece9e2);

  function vol(w, h, d, x, y, z, color, opacity) {
    const edges = new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d));
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
    line.position.set(x, y, z);
    return line;
  }

  [
    vol(3.2, 1.2, 3.2, 0, -1.4, 0, cPaper, 0.5),
    vol(2.2, 1.6, 2.2, 0.6, -0.1, 0.3, cAccent, 0.7),
    vol(1.4, 2.4, 1.4, -0.9, 1.1, -0.4, cPaper, 0.4),
    vol(0.9, 3.4, 0.9, 1.1, 1.9, -0.9, cAccent, 0.55),
  ].forEach((v) => structure.add(v));

  const grid = new THREE.GridHelper(20, 20, 0x3a4a5c, 0x22262b);
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

  initRevealAnimations();
}
