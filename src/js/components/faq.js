export function initFaq(root = document) {
  root.querySelectorAll('.contact-faq details').forEach((d) => {
    const summary = d.querySelector('summary');
    if (!summary || d.dataset.faqReady) return;
    d.dataset.faqReady = '1';

    const body = document.createElement('div');
    body.className = 'faq-body';
    [...d.children].forEach((c) => { if (c !== summary) body.appendChild(c); });
    d.appendChild(body);

    if (!d.open) body.style.height = '0px';

    summary.addEventListener('click', (e) => {
      e.preventDefault();
      if (d.dataset.animating) return;
      d.dataset.animating = '1';

      if (d.open) {
        body.style.height = body.scrollHeight + 'px';
        requestAnimationFrame(() => { body.style.height = '0px'; });
        body.addEventListener('transitionend', () => {
          d.open = false;
          delete d.dataset.animating;
        }, { once: true });
      } else {
        d.open = true;
        body.style.height = '0px';
        requestAnimationFrame(() => { body.style.height = body.scrollHeight + 'px'; });
        body.addEventListener('transitionend', () => {
          body.style.height = 'auto';
          delete d.dataset.animating;
        }, { once: true });
      }
    });
  });
}
