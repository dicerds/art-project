# MERIDIAN — Architecture Studio

Portfolio website template untuk studio arsitektur. Dibangun dengan HTML/CSS/JS murni, Three.js (wireframe 3D), dan GSAP (animasi scroll).

## Struktur Proyek

```
art-project/
├── index.html                  # Halaman utama (HTML struktur)
├── vite.config.js              # Konfigurasi Vite
├── package.json
├── public/
│   └── favicon.svg
└── src/
    ├── styles/
    │   └── main.css            # Seluruh stylesheet
    └── js/
        ├── main.js             # Entry point — bootstrap semua modul
        ├── scene.js            # Three.js wireframe background
        ├── animations.js       # GSAP reveal & hero animations
        ├── data/
        │   └── projects.js     # Data proyek portfolio
        └── components/
            ├── works.js        # Grid karya & filter kategori
            ├── modal.js        # Modal detail proyek
            └── nav.js          # Navigasi smooth-scroll
```

## Cara Menjalankan

```bash
npm install
npm run dev
```

## Cara Kustomisasi

1. **Data proyek** — edit `src/js/data/projects.js`
2. **Profil & biografi** — edit bagian `#profile` di `index.html`
3. **Warna & tipografi** — edit CSS variables di `src/styles/main.css`
4. **Foto** — ganti placeholder `[ FOTO ]` dengan tag `<img>` asli

## Teknologi

- [Vite](https://vitejs.dev/) — Dev server & bundler
- [Three.js](https://threejs.org/) — Wireframe 3D background
- [GSAP](https://gsap.com/) + ScrollTrigger — Animasi entrance & scroll
- [Google Fonts](https://fonts.google.com/) — Fraunces, Space Grotesk, JetBrains Mono
