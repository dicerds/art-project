/* ===================================================================
   MERIDIAN — Navigation
   Smooth scroll for header nav links
   =================================================================== */

/**
 * Initialize smooth-scroll navigation.
 */
export function initNav() {
  document.querySelectorAll('header nav a').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
