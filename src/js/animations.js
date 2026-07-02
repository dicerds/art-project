/* ===================================================================
   MERIDIAN — GSAP Reveal Animations
   =================================================================== */

/**
 * Initialize all GSAP scroll-reveal and hero entrance animations.
 */
export function initAnimations() {
  // Hero entrance sequence
  gsap
    .timeline({ defaults: { ease: 'power3.out' } })
    .from('.hero h1 span', { yPercent: 120, duration: 1.1, stagger: 0.12 }, 0.2)
    .from('.hero .eyebrow', { opacity: 0, y: 12, duration: 0.8 }, 0.1)
    .from('.hero .sub', { opacity: 0, y: 12, duration: 0.8 }, 0.6)
    .from('header', { opacity: 0, y: -16, duration: 0.8 }, 0.1);

  // Batch reveal for [data-reveal] elements
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    onEnter: (els) =>
      gsap.to(els, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
      }),
  });
}
