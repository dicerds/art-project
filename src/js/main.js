/* ===================================================================
   MERIDIAN — Main Entry Point
   Bootstraps all modules
   =================================================================== */

import { renderWorks, initFilters } from './components/works.js';
import { initModal } from './components/modal.js';
import { initNav } from './components/nav.js';
import { initScene } from './scene.js';
import { initAnimations } from './animations.js';

// Register GSAP ScrollTrigger plugin (globals from CDN)
gsap.registerPlugin(ScrollTrigger);

// 1. Render work cards into the grid
renderWorks();

// 2. Initialize category filters
initFilters();

// 3. Initialize project detail modal
initModal();

// 4. Initialize smooth-scroll navigation
initNav();

// 5. Initialize Three.js background scene
initScene();

// 6. Initialize GSAP reveal animations
initAnimations();
