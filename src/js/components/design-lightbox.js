import { CATEGORIES } from '../data/projects.js';

// Shared design lightbox: shows a project's 5 design drawings
// (Maket, Perspektif, Tampak, Denah, Site Plan) one at a time,
// navigable only by slide — pointer drag, trackpad swipe, and arrow keys.
// Keeps Prev/Next Project navigation and a "View Full Design" link.
export function createDesignLightbox() {
  if (!document.getElementById('featuredLightbox')) {
    document.body.insertAdjacentHTML(
      'beforeend',
      `
      <div class="lightbox-overlay featured-lightbox" id="featuredLightbox" role="dialog" aria-modal="true" aria-label="Project design detail">
        <button type="button" class="lightbox-close" id="featuredLightboxClose" aria-label="Close">×</button>
        <div class="lightbox-content featured-lightbox-content" id="featuredLightboxContent"></div>
      </div>
    `
    );
  }

  const overlay = document.getElementById('featuredLightbox');
  const contentEl = document.getElementById('featuredLightboxContent');
  const closeBtn = document.getElementById('featuredLightboxClose');

  let list = [];
  let projIndex = 0;
  let imgIndex = 0;
  let imgCount = 0;
  let flTrack = null;
  let flViewport = null;
  let flDots = null;
  let flCounter = null;
  let onCloseCb = null;

  function designSlide(d, i) {
    return `
      <div class="fl-slide" data-slide="${i}">
        <div class="fl-image black-img">
          <span class="corner tl"></span>
          <span class="corner br"></span>
          <span class="fl-tag mono">${String(i + 1).padStart(2, '0')} · ${d.label}</span>
        </div>
        <div class="fl-slide-caption">
          <h4 class="display">${d.label}</h4>
          <p>${d.caption || ''}</p>
        </div>
      </div>`;
  }

  function offsetFor(i) {
    return -i * flViewport.clientWidth;
  }

  function applyImg(animate) {
    flTrack.style.transition = animate ? '' : 'none';
    flTrack.style.transform = `translateX(${offsetFor(imgIndex)}px)`;
    if (flDots) {
      Array.from(flDots.children).forEach((d, i) => d.classList.toggle('active', i === imgIndex));
    }
    if (flCounter) {
      flCounter.textContent = `${String(imgIndex + 1).padStart(2, '0')} / ${String(imgCount).padStart(2, '0')}`;
    }
  }

  function goImg(i, animate = true) {
    imgIndex = Math.max(0, Math.min(imgCount - 1, i));
    applyImg(animate);
  }

  function renderLightbox(i) {
    const p = list[i];
    if (!p) return;
    projIndex = i;
    imgIndex = 0;
    const designs = Array.isArray(p.designs) ? p.designs : [];
    imgCount = designs.length;
    const fullUrl = p.fullDesignUrl || 'https://www.google.com';

    contentEl.innerHTML = `
      <div class="fl-header">
        <div>
          <div class="eyebrow mono">${CATEGORIES[p.primaryCategory] || ''}</div>
          <h3 class="display">${p.title}</h3>
          <p class="fl-meta mono">${[p.location, p.year].filter(Boolean).join(' · ')}</p>
        </div>
        <span class="fl-index mono">Project ${String(i + 1).padStart(2, '0')} / ${String(list.length).padStart(2, '0')}</span>
      </div>

      <div class="fl-stage">
        <div class="fl-viewport" id="flViewport">
          <div class="fl-track" id="flTrack">
            ${designs.map((d, idx) => designSlide(d, idx)).join('')}
          </div>
        </div>
        <div class="fl-stage-foot">
          <span class="fl-hint mono">Swipe · trackpad · ← → to browse designs</span>
          <span class="fl-counter mono" id="flCounter"></span>
        </div>
        <div class="fl-dots" id="flDots" role="tablist" aria-label="Design drawings"></div>
      </div>

      <div class="fl-footer">
        <div class="fl-projnav">
          <button type="button" class="btn-outline mono" data-fl-prev>← Prev Project</button>
          <button type="button" class="btn-outline mono" data-fl-next>Next Project →</button>
        </div>
        <a class="btn-primary mono" href="${fullUrl}" target="_blank" rel="noopener noreferrer" data-fl-full>View Full Design →</a>
      </div>
    `;

    flViewport = document.getElementById('flViewport');
    flTrack = document.getElementById('flTrack');
    flDots = document.getElementById('flDots');
    flCounter = document.getElementById('flCounter');

    flDots.innerHTML = '';
    for (let d = 0; d < imgCount; d++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'fl-dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Design ${d + 1}`);
      dot.addEventListener('click', () => goImg(d));
      flDots.appendChild(dot);
    }

    setupImageDrag();
    applyImg(false);

    contentEl.querySelector('[data-fl-prev]').addEventListener('click', (e) => {
      e.stopPropagation();
      renderLightbox((i - 1 + list.length) % list.length);
    });
    contentEl.querySelector('[data-fl-next]').addEventListener('click', (e) => {
      e.stopPropagation();
      renderLightbox((i + 1) % list.length);
    });
  }

  function setupImageDrag() {
    let dragging = false;
    let startX = 0;
    let moved = 0;

    flViewport.addEventListener('pointerdown', (e) => {
      dragging = true;
      startX = e.clientX;
      moved = 0;
      flTrack.style.transition = 'none';
      flViewport.setPointerCapture?.(e.pointerId);
    });
    flViewport.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      moved = e.clientX - startX;
      flTrack.style.transform = `translateX(${offsetFor(imgIndex) + moved}px)`;
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false;
      if (moved < -50) goImg(imgIndex + 1);
      else if (moved > 50) goImg(imgIndex - 1);
      else goImg(imgIndex);
    }
    flViewport.addEventListener('pointerup', endDrag);
    flViewport.addEventListener('pointercancel', endDrag);
    flViewport.addEventListener('pointerleave', endDrag);

    // Trackpad two-finger horizontal swipe
    let wheelLock = false;
    flViewport.addEventListener(
      'wheel',
      (e) => {
        if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 20) return;
        e.preventDefault();
        if (wheelLock) return;
        if (e.deltaX > 0) goImg(imgIndex + 1);
        else goImg(imgIndex - 1);
        wheelLock = true;
        setTimeout(() => {
          wheelLock = false;
        }, 350);
      },
      { passive: false }
    );
  }

  function open(projects, index, opts = {}) {
    list = projects || [];
    onCloseCb = opts.onClose || null;
    renderLightbox(index || 0);
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (onCloseCb) onCloseCb();
  }

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') {
      close();
    } else if (e.key === 'ArrowRight') {
      goImg(imgIndex + 1);
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      goImg(imgIndex - 1);
      e.preventDefault();
    }
  });
  window.addEventListener('resize', () => {
    if (overlay.classList.contains('open') && flTrack) applyImg(false);
  });

  return { open, close };
}
