export function projectCarouselMarkup(cardsHtml) {
  return `
    <div class="featured-carousel" aria-roledescription="carousel" aria-label="Projects">
      <div class="featured-viewport">
        <div class="featured-track">${cardsHtml}</div>
      </div>
      <button type="button" class="carousel-nav carousel-prev" aria-label="Previous">←</button>
      <button type="button" class="carousel-nav carousel-next" aria-label="Next">→</button>
    </div>`;
}

export function initProjectCarousel(root, { onTap } = {}) {
  const viewport = root.querySelector('.featured-viewport');
  const track = root.querySelector('.featured-track');
  const prevBtn = root.querySelector('.carousel-prev');
  const nextBtn = root.querySelector('.carousel-next');
  if (!viewport || !track) return { refresh() {} };

  let current = 0;

  function metrics() {
    const cards = track.children;
    if (!cards.length) return { step: 0, maxIndex: 0 };
    const cardW = cards[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
    const step = cardW + gap;
    const visible = Math.max(1, Math.round((viewport.clientWidth + gap) / step));
    const maxIndex = Math.max(0, cards.length - visible);
    return { step, maxIndex };
  }

  function go(i) {
    const { step, maxIndex } = metrics();
    if (i < 0) current = maxIndex;
    else if (i > maxIndex) current = 0;
    else current = i;
    track.style.transform = `translateX(${-current * step}px)`;
  }
  const next = () => go(current + 1);
  const prev = () => go(current - 1);

  prevBtn?.addEventListener('click', prev);
  nextBtn?.addEventListener('click', next);

  root.setAttribute('tabindex', '0');
  root.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { next(); e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { prev(); e.preventDefault(); }
  });

  let downX = null, dragged = false;
  viewport.addEventListener('pointerdown', (e) => { downX = e.clientX; dragged = false; });
  viewport.addEventListener('pointermove', (e) => {
    if (downX !== null && Math.abs(e.clientX - downX) > 6) dragged = true;
  });
  viewport.addEventListener('pointerup', (e) => {
    if (downX === null) return;
    const d = e.clientX - downX;
    downX = null;
    if (d < -40) next();
    else if (d > 40) prev();
  });
  viewport.addEventListener('pointercancel', () => { downX = null; });

  let wheelLock = false;
  viewport.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 20) return;
    e.preventDefault();
    if (wheelLock) return;
    (e.deltaX > 0 ? next : prev)();
    wheelLock = true;
    setTimeout(() => { wheelLock = false; }, 350);
  }, { passive: false });

  viewport.addEventListener('click', (e) => {
    if (dragged) { e.preventDefault(); return; }
    const card = e.target.closest('.project-card');
    if (card && viewport.contains(card) && onTap) onTap(card);
  });

  window.addEventListener('resize', () => go(current));
  go(0);

  return { refresh() { go(0); } };
}
