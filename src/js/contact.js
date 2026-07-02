import { initHeader, initRevealAnimations } from './shared.js';

initHeader();

const channels = [
  { label: 'Email', value: '', placeholder: 'Belum tersedia' },
  { label: 'WhatsApp', value: '', placeholder: 'Belum tersedia' },
  { label: 'Instagram', value: '', placeholder: 'Belum tersedia' },
  { label: 'LinkedIn', value: '', placeholder: 'Belum tersedia' },
];

const channelsEl = document.getElementById('contactChannels');
if (channelsEl) {
  channelsEl.innerHTML = channels
    .map((c) => {
      if (c.value) {
        return `
        <div class="channel-item">
          <span class="channel-icon mono">◆</span>
          <div>
            <span class="channel-label mono">${c.label}</span>
            <a href="${c.value}">${c.value.replace(/^mailto:|^tel:/, '')}</a>
          </div>
        </div>
      `;
      }
      return `
      <div class="channel-item channel-empty">
        <span class="channel-icon mono">◇</span>
        <div>
          <span class="channel-label mono">${c.label}</span>
          <span class="channel-placeholder mono">${c.placeholder}</span>
        </div>
      </div>
    `;
    })
    .join('');
}

const url = new URL(window.location.href);
const preselectService = url.searchParams.get('service');
if (preselectService) {
  const select = document.getElementById('service');
  if (select) {
    const opt = Array.from(select.options).find((o) => o.value === preselectService);
    if (opt) select.value = preselectService;
  }
}

const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const service = form.querySelector('#service').value;
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !service || !message) {
      note.textContent = 'Mohon lengkapi kolom yang wajib diisi.';
      note.className = 'form-note mono error';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      note.textContent = 'Format email tidak valid.';
      note.className = 'form-note mono error';
      return;
    }

    note.textContent = 'Terima kasih. Sistem pengiriman formulir sedang dikonfigurasi — silakan gunakan kanal kontak di samping untuk sementara.';
    note.className = 'form-note mono info';
  });
}

initRevealAnimations();
