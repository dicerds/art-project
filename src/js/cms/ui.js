import { supabase, mediaUrl, MEDIA_BUCKET } from './supabase.js';

export function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export function uid() {
  return crypto.randomUUID ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      });
}

export function toast(msg, isErr = false) {
  let t = document.querySelector('.cms-toast');
  if (!t) { t = el('<div class="cms-toast" data-cms-ui></div>'); document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.toggle('err', isErr);
  t.classList.add('show');
  clearTimeout(t._to);
  t._to = setTimeout(() => t.classList.remove('show'), 2600);
}

export function pickFile(accept = 'image/*') {
  return new Promise((resolve) => {
    const input = el(`<input type="file" accept="${accept}" style="display:none" data-cms-ui>`);
    document.body.appendChild(input);
    input.addEventListener('change', () => { resolve(input.files[0] || null); input.remove(); });
    input.click();
  });
}

export async function uploadImage(file) {
  const clean = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  const path = `uploads/${Date.now()}-${clean}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: '3600', upsert: false,
  });
  if (error) { toast('Upload gagal: ' + error.message, true); throw error; }
  return path;
}

export { mediaUrl };
