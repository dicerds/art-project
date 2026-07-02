import { el, toast, pickFile, uploadImage, mediaUrl } from './ui.js';
import {
  PROJECT_FIELDS, SERVICE_FIELDS, ABOUT_SECTIONS,
  fetchAll, saveRecord, deleteRecord,
  fetchAbout, saveAbout,
} from './records.js';

const SCHEMAS = {
  projects: { fields: PROJECT_FIELDS, label: 'Portfolio', singular: 'Proyek' },
  services: { fields: SERVICE_FIELDS, label: 'Services', singular: 'Layanan' },
};

let overlay = null;
let activeKind = 'projects';

export async function openManager() {
  if (overlay) overlay.remove();
  overlay = el(`
    <div class="cms-overlay cms-manager" data-cms-ui>
      <div class="cms-manager-panel">
        <div class="cms-manager-head">
          <div class="cms-tabs">
            <button class="cms-tab is-on" data-kind="projects">Portfolio</button>
            <button class="cms-tab" data-kind="services">Services</button>
            <button class="cms-tab" data-kind="about">About</button>
          </div>
          <button class="cms-btn" data-close>Tutup</button>
        </div>
        <div class="cms-manager-body"></div>
      </div>
    </div>`);
  overlay.addEventListener('click', (e) => {
    if (e.target.dataset.close != null) close();
    const tab = e.target.closest('.cms-tab');
    if (tab) {
      activeKind = tab.dataset.kind;
      overlay.querySelectorAll('.cms-tab').forEach((t) => t.classList.toggle('is-on', t === tab));
      route();
    }
  });
  document.body.appendChild(overlay);
  await route();
}

function route() {
  return activeKind === 'about' ? renderAbout() : renderList();
}

function close() { overlay?.remove(); overlay = null; }
function body() { return overlay.querySelector('.cms-manager-body'); }

async function renderList() {
  const b = body();
  b.innerHTML = '<p class="cms-sub">Memuat…</p>';
  let records = [];
  try { records = await fetchAll(activeKind); }
  catch (e) { b.innerHTML = `<p class="cms-sub">Gagal memuat: ${e.message}</p>`; return; }

  const { singular } = SCHEMAS[activeKind];
  const rows = records.map((r) => `
    <div class="cms-list-row" data-slug="${r.slug}">
      <div class="cms-list-main">
        <strong>${r.title || r.slug}</strong>
        <span class="cms-list-sub">${r.slug}${r.featured ? ' · Featured' : ''}</span>
      </div>
      <div class="cms-list-actions">
        <button class="cms-btn" data-act="edit">Edit</button>
        <button class="cms-btn cms-danger" data-act="del">Hapus</button>
      </div>
    </div>`).join('');

  b.innerHTML = `
    <div class="cms-list-head">
      <p class="cms-sub">${records.length} ${singular.toLowerCase()}</p>
      <button class="cms-btn cms-primary" data-act="add">Tambah ${singular}</button>
    </div>
    <div class="cms-list">${rows || '<p class="cms-sub">Belum ada data.</p>'}</div>`;

  b.querySelector('[data-act="add"]').addEventListener('click', () => openForm(null, records.length));
  b.querySelectorAll('.cms-list-row').forEach((row) => {
    const slug = row.dataset.slug;
    const rec = records.find((r) => r.slug === slug);
    row.querySelector('[data-act="edit"]').addEventListener('click', () => openForm(rec, records.length));
    row.querySelector('[data-act="del"]').addEventListener('click', async () => {
      if (!confirm(`Hapus "${rec.title || slug}"? Tindakan ini permanen.`)) return;
      try { await deleteRecord(activeKind, slug); toast('Terhapus'); renderList(); }
      catch (e) { toast('Gagal hapus: ' + e.message, true); }
    });
  });
}

async function renderAbout() {
  const b = body();
  b.innerHTML = '<p class="cms-sub">Memuat…</p>';
  let doc;
  try { doc = await fetchAbout(); }
  catch (e) { b.innerHTML = `<p class="cms-sub">Gagal memuat: ${e.message}</p>`; return; }
  const model = structuredClone(doc || {});

  b.innerHTML = `
    <div class="cms-list-head">
      <p class="cms-sub">Halaman About</p>
      <button class="cms-btn cms-primary" data-save-about>Simpan About</button>
    </div>
    <div class="cms-about-form"></div>
    <div class="cms-panel-actions">
      <button class="cms-btn cms-primary" data-save-about>Simpan About</button>
    </div>`;

  const form = b.querySelector('.cms-about-form');
  form.appendChild(buildField({ key: 'photo', label: 'Foto Profil', type: 'image' }, model));
  ABOUT_SECTIONS.forEach((sec) => {
    const count = Array.isArray(model[sec.key]) ? model[sec.key].length : 0;
    const box = el(`<details class="cms-about-sec"><summary>${sec.label} <span class="cms-badge">${count}</span></summary></details>`);
    const field = { key: sec.key, label: '', type: 'objlist', subfields: sec.fields };
    box.appendChild(buildField(field, model));
    form.appendChild(box);
  });

  b.querySelectorAll('[data-save-about]').forEach((btn) =>
    btn.addEventListener('click', async () => {
      b.querySelectorAll('[data-save-about]').forEach((x) => { x.disabled = true; });
      btn.textContent = 'Menyimpan…';
      try { await saveAbout(model); toast('About disimpan'); renderAbout(); }
      catch (e) { toast('Gagal: ' + e.message, true); btn.textContent = 'Simpan About'; b.querySelectorAll('[data-save-about]').forEach((x) => { x.disabled = false; }); }
    })
  );
}

function openForm(record, count) {
  const { fields, singular } = SCHEMAS[activeKind];
  const isNew = !record;
  const model = structuredClone(record || {});
  const originalSlug = record?.slug;

  const b = body();
  b.innerHTML = `
    <div class="cms-form-head">
      <button class="cms-btn" data-back>← Kembali</button>
      <h3>${isNew ? 'Tambah' : 'Edit'} ${singular}</h3>
    </div>
    <div class="cms-form"></div>
    <div class="cms-panel-actions">
      <button class="cms-btn" data-back>Batal</button>
      <button class="cms-btn cms-primary" data-save>Simpan</button>
    </div>`;
  const form = b.querySelector('.cms-form');
  fields.forEach((f) => form.appendChild(buildField(f, model)));

  b.querySelectorAll('[data-back]').forEach((btn) => btn.addEventListener('click', renderList));
  b.querySelector('[data-save]').addEventListener('click', async () => {
    if (!model.slug || !model.slug.trim()) { toast('Slug wajib diisi', true); return; }
    model.slug = model.slug.trim().toLowerCase().replace(/\s+/g, '-');
    const btn = b.querySelector('[data-save]');
    btn.disabled = true; btn.textContent = 'Menyimpan…';
    try {
      const sortOrder = record?.sort_order ?? count;
      await saveRecord(activeKind, model, sortOrder, originalSlug);
      toast('Tersimpan');
      renderList();
    } catch (e) {
      toast('Gagal: ' + e.message, true);
      btn.disabled = false; btn.textContent = 'Simpan';
    }
  });
}

function buildField(field, model) {
  const wrap = el(`<div class="cms-field"><label>${field.label}${field.required ? ' *' : ''}</label></div>`);
  if (field.hint) wrap.appendChild(el(`<div class="cms-hint">${field.hint}</div>`));
  const val = model[field.key];

  if (field.type === 'textarea') {
    const t = el('<textarea></textarea>'); t.value = val ?? '';
    t.addEventListener('input', () => { model[field.key] = t.value; });
    wrap.appendChild(t);

  } else if (field.type === 'select') {
    const s = el('<select><option value="">—</option></select>');
    Object.entries(field.options).forEach(([v, lbl]) => {
      const o = el(`<option value="${v}">${lbl}</option>`);
      if (v === val) o.selected = true;
      s.appendChild(o);
    });
    s.addEventListener('change', () => { model[field.key] = s.value; });
    wrap.appendChild(s);

  } else if (field.type === 'toggle') {
    const c = el('<input type="checkbox">'); c.checked = !!val;
    c.addEventListener('change', () => { model[field.key] = c.checked; });
    const lbl = el('<label style="display:flex;gap:8px;align-items:center">aktif</label>');
    lbl.prepend(c);
    wrap.appendChild(lbl);

  } else if (field.type === 'multiselect') {
    model[field.key] = Array.isArray(val) ? val : [];
    const box = el('<div class="cms-checkgroup"></div>');
    Object.entries(field.options).forEach(([v, lbl]) => {
      const id = 'ck_' + field.key + '_' + v;
      const row = el(`<label class="cms-check"><input type="checkbox" id="${id}"> ${lbl}</label>`);
      const c = row.querySelector('input');
      c.checked = model[field.key].includes(v);
      c.addEventListener('change', () => {
        const arr = model[field.key];
        if (c.checked) { if (!arr.includes(v)) arr.push(v); }
        else { const i = arr.indexOf(v); if (i > -1) arr.splice(i, 1); }
      });
      box.appendChild(row);
    });
    wrap.appendChild(box);

  } else if (field.type === 'image') {
    const cur = val ? mediaUrl(val) : '';
    const thumb = el(`<div class="cms-thumb"><img src="${cur}" alt=""><div class="cms-thumb-btns"></div></div>`);
    const btns = thumb.querySelector('.cms-thumb-btns');
    const up = el('<button class="cms-btn cms-primary" type="button">Upload</button>');
    up.addEventListener('click', async () => {
      const file = await pickFile(); if (!file) return;
      up.textContent = 'Mengunggah…';
      try { const p = await uploadImage(file); model[field.key] = p; thumb.querySelector('img').src = mediaUrl(p); }
      finally { up.textContent = 'Ganti'; }
    });
    const clr = el('<button class="cms-btn" type="button">Hapus</button>');
    clr.addEventListener('click', () => { model[field.key] = ''; thumb.querySelector('img').src = ''; });
    btns.append(up, clr);
    wrap.appendChild(thumb);

  } else if (field.type === 'stringlist') {
    model[field.key] = Array.isArray(val) ? val : [];
    const list = el('<div></div>');
    const redraw = () => {
      list.innerHTML = '';
      model[field.key].forEach((str, idx) => {
        const row = el('<div class="cms-inline-row"></div>');
        const i = el('<input type="text">'); i.value = str;
        i.addEventListener('input', () => { model[field.key][idx] = i.value; });
        const rm = el('<button class="cms-btn cms-danger" type="button">Hapus</button>');
        rm.addEventListener('click', () => { model[field.key].splice(idx, 1); redraw(); });
        row.append(i, rm);
        list.appendChild(row);
      });
    };
    const add = el('<button class="cms-btn cms-primary" type="button">Tambah item</button>');
    add.addEventListener('click', () => { model[field.key].push(''); redraw(); });
    redraw();
    wrap.append(list, add);

  } else if (field.type === 'objlist') {
    model[field.key] = Array.isArray(val) ? val : [];
    const arr = model[field.key];
    const list = el('<div></div>');
    const move = (from, to) => {
      if (to < 0 || to >= arr.length) return;
      [arr[from], arr[to]] = [arr[to], arr[from]];
      redraw();
    };
    const redraw = () => {
      list.innerHTML = '';
      arr.forEach((item, idx) => {
        const card = el('<div class="cms-repeat-item"></div>');
        const bar = el(`
          <div class="cms-repeat-bar">
            <span class="cms-repeat-num">${idx + 1}</span>
            <span class="cms-repeat-tools">
              <button type="button" data-mv="up" title="Naik">↑</button>
              <button type="button" data-mv="down" title="Turun">↓</button>
              <button type="button" class="cms-remove" title="Hapus">hapus</button>
            </span>
          </div>`);
        bar.querySelector('[data-mv="up"]').addEventListener('click', () => move(idx, idx - 1));
        bar.querySelector('[data-mv="down"]').addEventListener('click', () => move(idx, idx + 1));
        bar.querySelector('.cms-remove').addEventListener('click', () => { arr.splice(idx, 1); redraw(); });
        card.appendChild(bar);
        field.subfields.forEach((sf) => card.appendChild(buildField(sf, item)));
        list.appendChild(card);
      });
    };
    const add = el(`<button class="cms-btn cms-primary" type="button">Tambah</button>`);
    add.addEventListener('click', () => { arr.push({}); redraw(); });
    redraw();
    wrap.append(list, add);

  } else {
    const i = el(`<input type="${field.type === 'url' ? 'url' : 'text'}">`); i.value = val ?? '';
    i.addEventListener('input', () => { model[field.key] = i.value; });
    wrap.appendChild(i);
  }
  return wrap;
}
