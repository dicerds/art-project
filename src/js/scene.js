const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const canvas = document.getElementById('scene');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.2, 9);

const structure = new THREE.Group();
scene.add(structure);

const lineColorAccent = new THREE.Color(0x7fa3c4);
const lineColorPaper = new THREE.Color(0xece9e2);

function makeVolume(w, h, d, x, y, z, color, opacity) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const edges = new THREE.EdgesGeometry(geo);
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  const line = new THREE.LineSegments(edges, mat);
  line.position.set(x, y, z);
  return line;
}

const volumes = [
  makeVolume(3.2, 1.2, 3.2, 0, -1.4, 0, lineColorPaper, 0.5),
  makeVolume(2.2, 1.6, 2.2, 0.6, -0.1, 0.3, lineColorAccent, 0.7),
  makeVolume(1.4, 2.4, 1.4, -0.9, 1.1, -0.4, lineColorPaper, 0.4),
  makeVolume(0.9, 3.4, 0.9, 1.1, 1.9, -0.9, lineColorAccent, 0.55),
];
volumes.forEach((v) => structure.add(v));

const grid = new THREE.GridHelper(20, 20, 0x3a4a5c, 0x22262b);
grid.position.y = -2;
scene.add(grid);

structure.rotation.y = 0.4;

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onResize);

let mouseX = 0;
let mouseY = 0;
window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX / window.innerWidth - 0.5;
  mouseY = e.clientY / window.innerHeight - 0.5;
});

const clock = new THREE.Clock();
camera.baseX = 0;

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  if (!reduceMotion) {
    structure.rotation.y += 0.0018;
    structure.position.y = Math.sin(t * 0.4) * 0.08;
  }

  camera.position.x += (mouseX * 1.2 - camera.position.x + camera.baseX) * 0.04;
  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
}

export function initScene() {
  animate();

  ScrollTrigger.create({
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 0.6,
    onUpdate: (self) => {
      const p = self.progress;
      camera.position.z = 9 - p * 4;
      camera.position.y = 1.2 - p * 1.6;
      camera.baseX = p * 1.4;
    },
  });

  ScrollTrigger.create({
    trigger: '#works',
    start: 'top center',
    end: 'bottom top',
    onUpdate: (self) => {
      canvas.style.opacity = String(1 - self.progress * 0.9);
    },
  });
}
