
const SKIP = new Set(['SCRIPT', 'STYLE', 'CANVAS', 'SVG', 'PATH', 'NOSCRIPT']);

function nthOfType(el) {
  let i = 1;
  let sib = el.previousElementSibling;
  while (sib) {
    if (sib.tagName === el.tagName) i++;
    sib = sib.previousElementSibling;
  }
  return i;
}

export function getPath(el) {
  if (!el || el === document.body) return 'body';
  const parts = [];
  let node = el;
  while (node && node !== document.body && node.nodeType === 1) {
    const tag = node.tagName.toLowerCase();
    parts.unshift(`${tag}:nth-of-type(${nthOfType(node)})`);
    node = node.parentElement;
  }
  return parts.join('>');
}

export function resolvePath(path) {
  if (!path || path === 'body') return document.body;
  let node = document.body;
  for (const part of path.split('>')) {
    if (!node) return null;
    const m = part.match(/^([a-z0-9]+):nth-of-type\((\d+)\)$/i);
    if (!m) return null;
    const [, tag, nStr] = m;
    const n = parseInt(nStr, 10);
    let count = 0;
    let found = null;
    for (const child of node.children) {
      if (child.tagName.toLowerCase() === tag) {
        count++;
        if (count === n) { found = child; break; }
      }
    }
    node = found;
  }
  return node;
}

const TEXT_TAGS = new Set([
  'H1','H2','H3','H4','H5','H6','P','SPAN','A','LI','BUTTON',
  'BLOCKQUOTE','FIGCAPTION','EM','STRONG','SMALL','TD','TH','LABEL','CITE','B','I',
]);

export function isEditableText(el) {
  if (!el || el.nodeType !== 1) return false;
  if (SKIP.has(el.tagName)) return false;
  if (el.closest('[data-cms-ui]')) return false;
  if (el.isContentEditable) return false;
  if (!TEXT_TAGS.has(el.tagName)) return false;
  if (el.children.length > 0) return false;
  const txt = (el.textContent || '').trim();
  return txt.length > 0;
}

export function isEditableImage(el) {
  return el && el.tagName === 'IMG' && !el.closest('[data-cms-ui]');
}
