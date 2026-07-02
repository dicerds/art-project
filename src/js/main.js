import { renderWorks, initFilters } from './components/works.js';
import { initModal } from './components/modal.js';
import { initNav } from './components/nav.js';
import { initScene } from './scene.js';
import { initAnimations } from './animations.js';

gsap.registerPlugin(ScrollTrigger);

renderWorks();
initFilters();
initModal();
initNav();
initScene();
initAnimations();
