const currentPath = window.location.pathname;

export function initHeader() {
  const header = document.querySelector('.site-header');
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  });

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  document.querySelectorAll('.site-header nav a, .mobile-nav a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href && !href.startsWith('#')) {
      const linkPath = new URL(href, window.location.origin).pathname;
      if (linkPath === currentPath || (currentPath === '/' && linkPath === '/index.html')) {
        a.classList.add('active');
      }
    }
  });
}

export function getHeaderHTML(activePage) {
  return `
    <header class="site-header">
      <a href="/" class="mark display">MERIDIAN</a>
      <nav>
        <a href="/portfolio.html">Portfolio</a>
        <a href="/about.html">About</a>
        <a href="/contact.html">Contact</a>
      </nav>
      <button class="hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </header>
    <div class="mobile-nav">
      <a href="/">Home</a>
      <a href="/portfolio.html">Portfolio</a>
      <a href="/about.html">About</a>
      <a href="/contact.html">Contact</a>
    </div>
  `;
}

export function getFooterHTML() {
  return `
    <footer class="site-footer">
      <div class="footer-col">
        <span class="footer-title mono">Meridian Studio</span>
        <span class="mono">Architecture & Spatial Design</span>
      </div>
      <div class="footer-col">
        <span class="footer-title mono">Navigate</span>
        <a href="/portfolio.html" class="mono">Portfolio</a>
        <a href="/about.html" class="mono">About</a>
        <a href="/contact.html" class="mono">Contact</a>
      </div>
      <div class="footer-col">
        <span class="footer-title mono">Connect</span>
        <a href="mailto:hello@meridian-studio.com" class="mono">hello@meridian-studio.com</a>
        <a href="https://instagram.com" target="_blank" rel="noopener" class="mono">Instagram</a>
        <a href="https://linkedin.com" target="_blank" rel="noopener" class="mono">LinkedIn</a>
      </div>
      <div class="footer-bottom">
        <span class="mono">© 2026 Meridian Studio. All rights reserved.</span>
        <span class="mono">New York, US</span>
      </div>
    </footer>
  `;
}

export function getTemplateNotice() {
  return `
    <div class="template-notice mono">
      ⚠ This is a <b>template</b> — replace photos, biography, and project data with your own before publishing.
    </div>
  `;
}

export function initRevealAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    onEnter: (els) =>
      gsap.to(els, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
      }),
  });
}
