import { supabase, currentPageKey, mediaUrl } from './supabase.js';
import { resolvePath } from './path.js';
import { renderBlock } from './blocks.js';

const PAGE = currentPageKey();

function applyFields(fields) {
  for (const row of fields) {
    const path = row.key.slice(PAGE.length + 2);
    const el = resolvePath(path);
    if (!el) continue;
    const v = row.value || {};
    if (v.text != null && el.tagName !== 'IMG') {
      el.textContent = v.text;
    }
    if (v.src != null && el.tagName === 'IMG') {
      el.src = mediaUrl(v.src);
      if (v.alt != null) el.alt = v.alt;
    }
  }
}

export function ensureRegion() {
  let region = document.querySelector('[data-cms-region="main"]');
  if (region) return region;
  const main = document.querySelector('main') || document.body;
  const footer = main.querySelector('.site-footer, footer');
  region = document.createElement('div');
  region.setAttribute('data-cms-region', 'main');
  if (footer) main.insertBefore(region, footer);
  else main.appendChild(region);
  return region;
}

function renderBlocks(blocks) {
  const region = ensureRegion();
  region.innerHTML = blocks.map(renderBlock).join('');
}

async function loadContent() {
  const [fieldsRes, blocksRes] = await Promise.all([
    supabase.from('content_fields').select('key,value').like('key', `${PAGE}::%`),
    supabase.from('content_blocks').select('*').eq('page', PAGE).order('sort_order', { ascending: true }),
  ]);

  if (fieldsRes.data) {
    applyFields(fieldsRes.data);
    setTimeout(() => applyFields(fieldsRes.data), 400);
  }
  if (blocksRes.data) renderBlocks(blocksRes.data);
  return { fields: fieldsRes.data || [], blocks: blocksRes.data || [] };
}

async function init() {
  await loadContent();

  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    const { initEditor } = await import('./editor.js');
    initEditor();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
