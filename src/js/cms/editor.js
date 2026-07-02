import { supabase, currentPageKey, mediaUrl } from './supabase.js';
import { getPath, isEditableText, isEditableImage } from './path.js';
import { BLOCK_TYPES, renderBlock } from './blocks.js';
import { ensureRegion } from './public.js';
import { el, uid, toast, pickFile, uploadImage } from './ui.js';

const PAGE = currentPageKey();

let editing = false;
const fieldChanges = new Map();
let blocks = [];
const deletedBlockIds = new Set();

const originals = new Map();
let history = [];
let hIndex = -1;
let savedIndex = 0;
let pendingText = false;

function pendingCount() {
  return fieldChanges.size + deletedBlockIds.size;
}
function isDirty() {
  return hIndex !== savedIndex || pendingText;
}
function updateSaveLabel() {
  const btn = document.querySelector('.cms-save');
  if (!btn) return;
  const d = isDirty();
  const n = pendingCount();
  btn.disabled = !d;
  btn.textContent = d ? `Simpan${n ? ` (${n})` : ''} ✱` : 'Simpan';
  btn.classList.toggle('has-changes', d);
}

function snapshot() {
  return {
    fields: [...fieldChanges.entries()].map(([k, v]) => [k, { ...v }]),
    blocks: structuredClone(blocks),
    deleted: [...deletedBlockIds],
  };
}
function recordHistory() {
  history = history.slice(0, hIndex + 1);
  history.push(snapshot());
  hIndex = history.length - 1;
  if (history.length > 120) { history.shift(); hIndex--; savedIndex--; }
  refreshUndoRedo();
  updateSaveLabel();
}
function applySnapshot(s) {
  fieldChanges.clear();
  s.fields.forEach(([k, v]) => fieldChanges.set(k, { ...v }));
  blocks = structuredClone(s.blocks);
  deletedBlockIds.clear();
  s.deleted.forEach((d) => deletedBlockIds.add(d));
  applyFieldsToDom();
  renderBlocksEditable();
  refreshUndoRedo();
  updateSaveLabel();
}
function applyFieldsToDom() {
  document.querySelectorAll('[data-cms-path]').forEach((elm) => {
    if (elm.closest('[data-cms-ui]')) return;
    const path = elm.dataset.cmsPath;
    const val = fieldChanges.get(path) ?? originals.get(path);
    if (!val) return;
    if (elm.tagName === 'IMG') {
      if (val.src != null) elm.src = mediaUrl(val.src);
      if (val.alt != null) elm.alt = val.alt;
    } else if (val.text != null) {
      elm.textContent = val.text;
    }
  });
}
function commitPendingText() {
  if (pendingText) { pendingText = false; recordHistory(); }
}
function undo() {
  commitPendingText();
  if (hIndex <= 0) return;
  hIndex--;
  applySnapshot(history[hIndex]);
  toast('Diurungkan');
}
function redo() {
  if (hIndex >= history.length - 1) return;
  hIndex++;
  applySnapshot(history[hIndex]);
  toast('Diulangi');
}
function refreshUndoRedo() {
  const u = document.querySelector('.cms-undo');
  const r = document.querySelector('.cms-redo');
  if (u) u.disabled = hIndex <= 0;
  if (r) r.disabled = hIndex >= history.length - 1;
}

function blockNav(e) {
  if (!editing) return;
  const clickable = e.target.closest('a, button');
  if (clickable && !clickable.closest('[data-cms-ui]') &&
      (clickable.isContentEditable || clickable.closest('[contenteditable="true"]'))) {
    e.preventDefault();
  }
}

function enableInline() {
  document.body.classList.add('cms-editing');

  document.querySelectorAll('*').forEach((node) => {
    if (!isEditableText(node)) return;
    const path = getPath(node);
    node.setAttribute('contenteditable', 'true');
    node.setAttribute('spellcheck', 'false');
    node.dataset.cmsPath = path;
    node.title = 'Klik untuk mengubah teks';
    if (!originals.has(path)) originals.set(path, { text: node.textContent });
    node.addEventListener('input', onTextInput);
    node.addEventListener('blur', commitPendingText);
  });

  document.querySelectorAll('img').forEach((img) => {
    if (!isEditableImage(img)) return;
    const path = getPath(img);
    img.classList.add('cms-img-editable');
    img.dataset.cmsPath = path;
    img.title = 'Klik untuk mengganti gambar';
    if (!originals.has(path)) originals.set(path, { src: img.getAttribute('src') || '', alt: img.alt || '' });
    img.addEventListener('click', onImageClick);
  });

  document.addEventListener('click', blockNav, true);
  showHintBanner();
}
function disableInline() {
  document.body.classList.remove('cms-editing');
  document.querySelectorAll('[contenteditable="true"]').forEach((node) => {
    if (node.closest('[data-cms-ui]')) return;
    node.removeAttribute('contenteditable');
    node.removeAttribute('spellcheck');
    node.removeAttribute('title');
    node.removeEventListener('input', onTextInput);
    node.removeEventListener('blur', commitPendingText);
  });
  document.querySelectorAll('.cms-img-editable').forEach((img) => {
    img.classList.remove('cms-img-editable');
    img.removeAttribute('title');
    img.removeEventListener('click', onImageClick);
  });
  document.removeEventListener('click', blockNav, true);
  document.querySelector('.cms-hint-banner')?.remove();
}

function showHintBanner() {
  if (document.querySelector('.cms-hint-banner')) return;
  const banner = el(`
    <div class="cms-hint-banner" data-cms-ui>
      <span>✏️ <strong>Mode Edit aktif.</strong> Klik teks untuk mengubah · klik gambar untuk mengganti · <b>Ctrl+Z</b> urungkan · <b>Esc</b> keluar.</span>
      <button class="cms-hint-close" title="Tutup petunjuk">✕</button>
    </div>`);
  banner.querySelector('.cms-hint-close').addEventListener('click', () => banner.remove());
  document.body.appendChild(banner);
  setTimeout(() => banner.remove(), 8000);
}
function onTextInput(e) {
  const path = e.currentTarget.dataset.cmsPath;
  fieldChanges.set(path, { text: e.currentTarget.textContent });
  pendingText = true;
  updateSaveLabel();
}
async function onImageClick(e) {
  if (!editing) return;
  e.preventDefault();
  const img = e.currentTarget;
  const file = await pickFile();
  if (!file) return;
  toast('Mengunggah…');
  try {
    const path = await uploadImage(file);
    img.src = mediaUrl(path);
    fieldChanges.set(img.dataset.cmsPath, { src: path, alt: img.alt || '' });
    recordHistory();
    toast('Gambar diganti');
  } catch { /* handled */ }
}

function renderBlocksEditable() {
  const region = ensureRegion();
  region.innerHTML = blocks.map(renderBlock).join('');
  region.querySelectorAll('.cms-block').forEach((sec) => {
    const id = sec.dataset.cmsBlockId;
    const bar = el(`
      <div class="cms-block-toolbar" data-cms-ui>
        <button title="Naik" data-act="up">↑</button>
        <button title="Turun" data-act="down">↓</button>
        <button title="Edit" data-act="edit">✎</button>
        <button title="Hapus" data-act="del">🗑</button>
      </div>`);
    bar.addEventListener('click', (e) => {
      const act = e.target.dataset.act;
      if (act === 'up') moveBlock(id, -1);
      else if (act === 'down') moveBlock(id, 1);
      else if (act === 'edit') openBlockForm(id);
      else if (act === 'del') deleteBlock(id);
    });
    sec.appendChild(bar);
  });
}
function moveBlock(id, dir) {
  const i = blocks.findIndex((b) => b.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= blocks.length) return;
  [blocks[i], blocks[j]] = [blocks[j], blocks[i]];
  renderBlocksEditable();
  recordHistory();
}
function deleteBlock(id) {
  blocks = blocks.filter((b) => b.id !== id);
  deletedBlockIds.add(id);
  renderBlocksEditable();
  recordHistory();
}

function openTypePicker() {
  const grid = Object.entries(BLOCK_TYPES)
    .map(([k, def]) => `<button data-type="${k}"><strong>${def.label}</strong></button>`).join('');
  const overlay = el(`
    <div class="cms-overlay" data-cms-ui>
      <div class="cms-panel">
        <h3>Tambah Section</h3>
        <p class="cms-sub">Pilih jenis section yang ingin ditambahkan ke halaman ini.</p>
        <div class="cms-type-grid">${grid}</div>
        <div class="cms-panel-actions"><button class="cms-btn" data-close>Batal</button></div>
      </div>
    </div>`);
  overlay.addEventListener('click', (e) => {
    if (e.target.dataset.close != null || e.target === overlay) overlay.remove();
    const type = e.target.closest('[data-type]')?.dataset.type;
    if (type) {
      overlay.remove();
      const def = BLOCK_TYPES[type];
      const block = { id: uid(), page: PAGE, region: 'main', type, data: structuredClone(def.defaults) };
      blocks.push(block);
      renderBlocksEditable();
      recordHistory();
      openBlockForm(block.id);
    }
  });
  document.body.appendChild(overlay);
}

function openBlockForm(id) {
  const block = blocks.find((b) => b.id === id);
  if (!block) return;
  const def = BLOCK_TYPES[block.type];
  const data = structuredClone(block.data || {});

  const overlay = el(`
    <div class="cms-overlay" data-cms-ui>
      <div class="cms-panel">
        <h3>Edit: ${def.label}</h3>
        <p class="cms-sub">Ubah isi section, lalu Terapkan.</p>
        <div class="cms-form"></div>
        <div class="cms-panel-actions">
          <button class="cms-btn" data-close>Batal</button>
          <button class="cms-btn cms-primary" data-apply>Terapkan</button>
        </div>
      </div>
    </div>`);
  const form = overlay.querySelector('.cms-form');

  def.fields.forEach((f) => form.appendChild(buildField(f, data)));

  overlay.addEventListener('click', (e) => {
    if (e.target.dataset.close != null || e.target === overlay) overlay.remove();
    if (e.target.dataset.apply != null) {
      block.data = data;
      renderBlocksEditable();
      recordHistory();
      overlay.remove();
    }
  });
  document.body.appendChild(overlay);
}

function buildField(field, data) {
  const wrap = el(`<div class="cms-field"><label>${field.label}</label></div>`);
  const val = data[field.key];

  if (field.type === 'textarea') {
    const t = el('<textarea></textarea>'); t.value = val ?? '';
    t.addEventListener('input', () => { data[field.key] = t.value; });
    wrap.appendChild(t);

  } else if (field.type === 'select') {
    const s = el('<select></select>');
    field.options.forEach((o) => {
      const opt = el(`<option value="${o}">${o}</option>`);
      if (o === val) opt.selected = true;
      s.appendChild(opt);
    });
    s.addEventListener('change', () => { data[field.key] = s.value; });
    wrap.appendChild(s);

  } else if (field.type === 'toggle') {
    const c = el('<input type="checkbox">'); c.checked = !!val;
    c.addEventListener('change', () => { data[field.key] = c.checked; });
    const lbl = el('<label style="display:flex;gap:8px;align-items:center;font-family:inherit"></label>');
    lbl.prepend(c); lbl.append(document.createTextNode(' aktif'));
    wrap.appendChild(lbl);

  } else if (field.type === 'image') {
    const thumb = el(`<div class="cms-thumb"><img src="${val ? mediaUrl(val) : ''}" alt=""><div></div></div>`);
    const btns = thumb.lastElementChild;
    const up = el('<button class="cms-btn cms-primary" type="button">Upload</button>');
    up.addEventListener('click', async () => {
      const file = await pickFile(); if (!file) return;
      up.textContent = 'Mengunggah…';
      try { const p = await uploadImage(file); data[field.key] = p; thumb.querySelector('img').src = mediaUrl(p); }
      finally { up.textContent = 'Upload'; }
    });
    btns.appendChild(up);
    wrap.appendChild(thumb);

  } else if (field.type === 'imagelist') {
    data[field.key] = Array.isArray(val) ? val : [];
    const list = el('<div></div>');
    const redraw = () => {
      list.innerHTML = '';
      data[field.key].forEach((im, idx) => {
        const row = el(`<div class="cms-repeat-item"><button class="cms-remove" type="button">hapus</button><div class="cms-thumb"><img src="${mediaUrl(im.src)}" alt=""></div></div>`);
        row.querySelector('.cms-remove').addEventListener('click', () => { data[field.key].splice(idx, 1); redraw(); });
        list.appendChild(row);
      });
    };
    const add = el('<button class="cms-btn cms-primary" type="button">+ Tambah gambar</button>');
    add.addEventListener('click', async () => {
      const file = await pickFile(); if (!file) return;
      const p = await uploadImage(file); data[field.key].push({ src: p, alt: '' }); redraw();
    });
    redraw();
    wrap.append(list, add);

  } else if (field.type === 'cardlist') {
    data[field.key] = Array.isArray(val) ? val : [];
    const list = el('<div></div>');
    const redraw = () => {
      list.innerHTML = '';
      data[field.key].forEach((it, idx) => {
        const row = el('<div class="cms-repeat-item"><button class="cms-remove" type="button">hapus</button></div>');
        const ti = el('<input type="text" placeholder="Judul kartu">'); ti.value = it.title || '';
        ti.addEventListener('input', () => { it.title = ti.value; });
        const tx = el('<textarea placeholder="Deskripsi"></textarea>'); tx.value = it.text || '';
        tx.addEventListener('input', () => { it.text = tx.value; });
        row.querySelector('.cms-remove').addEventListener('click', () => { data[field.key].splice(idx, 1); redraw(); });
        row.append(ti, tx);
        list.appendChild(row);
      });
    };
    const add = el('<button class="cms-btn cms-primary" type="button">+ Tambah kartu</button>');
    add.addEventListener('click', () => { data[field.key].push({ title: '', text: '' }); redraw(); });
    redraw();
    wrap.append(list, add);

  } else {
    const i = el(`<input type="${field.type === 'url' ? 'url' : 'text'}">`); i.value = val ?? '';
    i.addEventListener('input', () => { data[field.key] = i.value; });
    wrap.appendChild(i);
  }
  return wrap;
}

async function saveAll() {
  commitPendingText();
  const btn = document.querySelector('.cms-save');
  if (btn) { btn.disabled = true; btn.textContent = 'Menyimpan…'; }
  try {
    if (fieldChanges.size) {
      const rows = [...fieldChanges.entries()].map(([path, value]) => ({ key: `${PAGE}::${path}`, value }));
      const { error } = await supabase.from('content_fields').upsert(rows, { onConflict: 'key' });
      if (error) throw error;
    }
    if (deletedBlockIds.size) {
      const { error } = await supabase.from('content_blocks').delete().in('id', [...deletedBlockIds]);
      if (error) throw error;
    }
    if (blocks.length) {
      const rows = blocks.map((b, i) => ({
        id: b.id, page: PAGE, region: b.region || 'main', sort_order: i, type: b.type, data: b.data || {},
      }));
      const { error } = await supabase.from('content_blocks').upsert(rows, { onConflict: 'id' });
      if (error) throw error;
    }
    savedIndex = hIndex;
    updateSaveLabel();
    toast('Semua perubahan tersimpan ✓');
  } catch (err) {
    toast('Gagal menyimpan: ' + (err.message || err), true);
    if (btn) { btn.textContent = 'Coba lagi'; btn.disabled = false; }
  }
}

function setEditing(on) {
  if (editing === on) return;
  editing = on;
  const t = document.querySelector('.cms-edit-toggle');
  const toolButtons = document.querySelectorAll('.cms-add, .cms-undo, .cms-redo');
  if (editing) {
    enableInline();
    renderBlocksEditable();
    if (history.length === 0) { recordHistory(); savedIndex = 0; }
    t.classList.add('is-on'); t.innerHTML = '<span class="cms-dot"></span> Mode Edit AKTIF';
    toolButtons.forEach((b) => { b.style.display = ''; });
    refreshUndoRedo();
  } else {
    commitPendingText();
    disableInline();
    const region = ensureRegion();
    region.innerHTML = blocks.map(renderBlock).join('');
    t.classList.remove('is-on'); t.innerHTML = '✏️ Mulai Edit';
    toolButtons.forEach((b) => { b.style.display = 'none'; });
  }
}
function toggleEdit() { setEditing(!editing); }

async function loadBlocks() {
  const { data } = await supabase.from('content_blocks').select('*').eq('page', PAGE).order('sort_order', { ascending: true });
  blocks = data || [];
}

export async function initEditor() {
  await loadBlocks();
  const { data: { user } } = await supabase.auth.getUser();
  const email = user?.email || 'admin';

  const bar = el(`
    <div class="cms-bar" data-cms-ui>
      <div class="cms-bar-brand">
        <span class="cms-bar-logo">◆</span>
        <span class="cms-bar-titles">
          <strong>Panel Admin</strong>
          <small>${email}</small>
        </span>
      </div>
      <div class="cms-bar-actions">
        <label class="cms-nav">
          <span class="cms-nav-label">Halaman</span>
          <select class="cms-nav-select" title="Pindah ke halaman lain untuk diedit">
            <option value="/">Home</option>
            <option value="/services/">Services</option>
            <option value="/portfolio/">Portfolio</option>
            <option value="/about/">About</option>
            <option value="/contact/">Contact</option>
          </select>
        </label>
        <button class="cms-btn cms-edit-toggle" title="Aktifkan mode edit di halaman ini">✏️ Mulai Edit</button>
        <button class="cms-btn cms-add" style="display:none" title="Tambahkan section baru">＋ Section</button>
        <button class="cms-btn cms-undo" style="display:none" title="Urungkan (Ctrl+Z)" disabled>↶ Undo</button>
        <button class="cms-btn cms-redo" style="display:none" title="Ulangi (Ctrl+Shift+Z)" disabled>↷ Redo</button>
        <button class="cms-btn cms-manage" title="Kelola Portfolio, Services & About">🗂 Kelola Data</button>
        <button class="cms-btn cms-save" disabled title="Simpan semua perubahan">Simpan</button>
        <button class="cms-btn cms-logout" title="Keluar dari panel admin">Keluar</button>
      </div>
    </div>`);
  document.body.appendChild(bar);

  const keyToPath = { home: '/', services: '/services/', portfolio: '/portfolio/', about: '/about/', contact: '/contact/' };
  const navSelect = bar.querySelector('.cms-nav-select');
  const curPath = keyToPath[PAGE];
  if (curPath) navSelect.value = curPath;
  navSelect.addEventListener('change', () => {
    const dest = navSelect.value;
    if (dest === curPath) return;
    if (isDirty() && !confirm('Ada perubahan yang belum disimpan. Pindah halaman tanpa menyimpan?')) {
      navSelect.value = curPath || '/';
      return;
    }
    window.location.href = dest;
  });

  bar.querySelector('.cms-edit-toggle').addEventListener('click', toggleEdit);
  bar.querySelector('.cms-add').addEventListener('click', openTypePicker);
  bar.querySelector('.cms-undo').addEventListener('click', undo);
  bar.querySelector('.cms-redo').addEventListener('click', redo);
  bar.querySelector('.cms-manage').addEventListener('click', async () => {
    const { openManager } = await import('./manager.js');
    openManager();
  });
  bar.querySelector('.cms-save').addEventListener('click', saveAll);
  bar.querySelector('.cms-logout').addEventListener('click', async () => {
    if (isDirty() && !confirm('Ada perubahan yang belum disimpan. Tetap keluar?')) return;
    await supabase.auth.signOut();
    window.location.href = '/';
  });

  document.addEventListener('keydown', (e) => {
    if (!editing) return;
    const k = e.key.toLowerCase();
    if (e.key === 'Escape' && !document.querySelector('.cms-overlay')) { setEditing(false); return; }
    if ((e.ctrlKey || e.metaKey) && k === 'z') {
      e.preventDefault();
      if (e.shiftKey) redo(); else undo();
    } else if ((e.ctrlKey || e.metaKey) && k === 'y') {
      e.preventDefault();
      redo();
    } else if ((e.ctrlKey || e.metaKey) && k === 's') {
      e.preventDefault();
      if (isDirty()) saveAll();
    }
  });

  window.addEventListener('beforeunload', (e) => {
    if (isDirty()) { e.preventDefault(); e.returnValue = ''; }
  });
}
