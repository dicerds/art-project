import { mediaUrl } from './supabase.js';

export function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function nl2br(s) {
  return esc(s).replace(/\n/g, '<br>');
}

export const BLOCK_TYPES = {
  heading: {
    label: 'Heading / Judul Section',
    defaults: { eyebrow: 'SECTION', title: 'Judul Baru', align: 'left' },
    fields: [
      { key: 'eyebrow', label: 'Eyebrow (label kecil)', type: 'text' },
      { key: 'title', label: 'Judul', type: 'text' },
      { key: 'align', label: 'Perataan', type: 'select', options: ['left', 'center'] },
    ],
    render: (d) => `
      <div class="section-head" style="text-align:${d.align === 'center' ? 'center' : 'left'}">
        ${d.eyebrow ? `<div class="label mono">${esc(d.eyebrow)}</div>` : ''}
        <h2 class="display">${esc(d.title)}</h2>
      </div>`,
  },

  text: {
    label: 'Teks / Paragraf',
    defaults: { text: 'Tulis paragraf di sini...' },
    fields: [{ key: 'text', label: 'Isi teks', type: 'textarea' }],
    render: (d) => `<div class="cms-prose"><p>${nl2br(d.text)}</p></div>`,
  },

  image: {
    label: 'Gambar',
    defaults: { src: '', alt: '', caption: '' },
    fields: [
      { key: 'src', label: 'Gambar', type: 'image' },
      { key: 'alt', label: 'Teks alternatif', type: 'text' },
      { key: 'caption', label: 'Keterangan (opsional)', type: 'text' },
    ],
    render: (d) => `
      <figure class="cms-figure">
        ${d.src ? `<img src="${esc(mediaUrl(d.src))}" alt="${esc(d.alt)}" loading="lazy">` : '<div class="cms-img-empty">Belum ada gambar</div>'}
        ${d.caption ? `<figcaption>${esc(d.caption)}</figcaption>` : ''}
      </figure>`,
  },

  imageText: {
    label: 'Gambar + Teks',
    defaults: { src: '', alt: '', title: 'Judul', text: 'Deskripsi...', side: 'left' },
    fields: [
      { key: 'src', label: 'Gambar', type: 'image' },
      { key: 'alt', label: 'Teks alternatif', type: 'text' },
      { key: 'title', label: 'Judul', type: 'text' },
      { key: 'text', label: 'Deskripsi', type: 'textarea' },
      { key: 'side', label: 'Posisi gambar', type: 'select', options: ['left', 'right'] },
    ],
    render: (d) => `
      <div class="cms-imgtext ${d.side === 'right' ? 'is-right' : ''}">
        <div class="cms-imgtext-media">
          ${d.src ? `<img src="${esc(mediaUrl(d.src))}" alt="${esc(d.alt)}" loading="lazy">` : '<div class="cms-img-empty">Belum ada gambar</div>'}
        </div>
        <div class="cms-imgtext-body">
          <h3 class="display">${esc(d.title)}</h3>
          <p>${nl2br(d.text)}</p>
        </div>
      </div>`,
  },

  gallery: {
    label: 'Galeri Gambar',
    defaults: { images: [] },
    fields: [{ key: 'images', label: 'Gambar', type: 'imagelist' }],
    render: (d) => `
      <div class="cms-gallery">
        ${(d.images || []).map((im) => `<img src="${esc(mediaUrl(im.src))}" alt="${esc(im.alt || '')}" loading="lazy">`).join('')}
      </div>`,
  },

  cards: {
    label: 'Kartu (grid poin)',
    defaults: { items: [{ title: 'Poin 1', text: 'Deskripsi' }, { title: 'Poin 2', text: 'Deskripsi' }] },
    fields: [{ key: 'items', label: 'Kartu', type: 'cardlist' }],
    render: (d) => `
      <div class="cms-cards">
        ${(d.items || []).map((it, i) => `
          <div class="cms-card">
            <span class="approach-num display">${String(i + 1).padStart(2, '0')}</span>
            <h3>${esc(it.title)}</h3>
            <p>${nl2br(it.text)}</p>
          </div>`).join('')}
      </div>`,
  },

  button: {
    label: 'Tombol / Link',
    defaults: { label: 'Klik di sini', href: '/contact/', style: 'primary' },
    fields: [
      { key: 'label', label: 'Teks tombol', type: 'text' },
      { key: 'href', label: 'Tautan (URL)', type: 'url' },
      { key: 'style', label: 'Gaya', type: 'select', options: ['primary', 'outline'] },
    ],
    render: (d) => `
      <div class="cms-btn-wrap">
        <a href="${esc(d.href)}" class="${d.style === 'outline' ? 'btn-outline' : 'btn-primary'} mono">${esc(d.label)}</a>
      </div>`,
  },

  spacer: {
    label: 'Jarak / Pemisah',
    defaults: { size: 'medium', divider: true },
    fields: [
      { key: 'size', label: 'Ukuran jarak', type: 'select', options: ['small', 'medium', 'large'] },
      { key: 'divider', label: 'Tampilkan garis', type: 'toggle' },
    ],
    render: (d) => {
      const h = d.size === 'small' ? 40 : d.size === 'large' ? 140 : 80;
      return `<div style="height:${h}px" aria-hidden="true">${d.divider ? '<div class="section-divider"><span></span></div>' : ''}</div>`;
    },
  },
};

export function renderBlock(block) {
  const def = BLOCK_TYPES[block.type];
  const inner = def ? def.render(block.data || {}) : `<!-- unknown block: ${esc(block.type)} -->`;
  return `<section class="page-section cms-block" data-cms-block-id="${esc(block.id)}" data-cms-block-type="${esc(block.type)}">${inner}</section>`;
}
