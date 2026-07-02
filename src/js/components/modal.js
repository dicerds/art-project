/* ===================================================================
   MERIDIAN — Project Detail Modal
   =================================================================== */

import { projects } from '../data/projects.js';

const overlay = document.getElementById('modalOverlay');
const modalBox = document.getElementById('modalBox');
const closeBtn = document.getElementById('modalClose');

/**
 * Open the modal and populate it with project data.
 */
function openModal(id) {
  const p = projects.find((x) => x.id === Number(id));
  if (!p) return;

  modalBox.innerHTML = `
    <div class="num mono">PROYEK N.0${p.id}</div>
    <h3 class="display">${p.title}</h3>
    <div class="meta-row">
      <div>KATEGORI<b>${p.categoryLabel}</b></div>
      <div>TAHUN<b>${p.year}</b></div>
      <div>LOKASI<b>${p.location}</b></div>
      <div>LUAS<b>${p.area}</b></div>
      <div>PERAN<b>${p.role}</b></div>
    </div>
    <p class="desc">${p.desc}</p>
    <div class="modal-gallery">
      <div>[ FOTO 01 ]</div>
      <div>[ FOTO 02 ]</div>
      <div>[ FOTO 03 ]</div>
    </div>
  `;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/**
 * Close the modal.
 */
function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

/**
 * Initialize all modal event listeners.
 */
export function initModal() {
  // Close button
  closeBtn.addEventListener('click', closeModal);

  // Click outside to close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Escape key to close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Listen for custom open-modal events from work cards
  window.addEventListener('open-modal', (e) => {
    openModal(e.detail);
  });
}
