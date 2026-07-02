import { projects } from '../data/projects.js';

const overlay = document.getElementById('modalOverlay');
const modalBox = document.getElementById('modalBox');
const closeBtn = document.getElementById('modalClose');

function openModal(id) {
  const p = projects.find((x) => x.id === Number(id));
  if (!p) return;

  modalBox.innerHTML = `
    <div class="num mono">PROJECT N.0${p.id}</div>
    <h3 class="display">${p.title}</h3>
    <div class="meta-row">
      <div>CATEGORY<b>${p.categoryLabel}</b></div>
      <div>YEAR<b>${p.year}</b></div>
      <div>LOCATION<b>${p.location}</b></div>
      <div>AREA<b>${p.area}</b></div>
      <div>ROLE<b>${p.role}</b></div>
    </div>
    <p class="desc">${p.desc}</p>
    <div class="modal-gallery">
      <div>[ PHOTO 01 ]</div>
      <div>[ PHOTO 02 ]</div>
      <div>[ PHOTO 03 ]</div>
    </div>
  `;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

export function initModal() {
  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  window.addEventListener('open-modal', (e) => {
    openModal(e.detail);
  });
}
