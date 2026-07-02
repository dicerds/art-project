# Studio Arsitektur — Website Portofolio

Website portofolio arsitektur profesional. Dibangun dengan HTML/CSS/JS murni, Three.js (wireframe 3D untuk hero), dan GSAP (animasi scroll).

## Struktur Proyek

```
art-project/
├── index.html                 # Beranda
├── services.html              # Layanan (5 jenis arsitektur)
├── portfolio.html             # Grid portofolio dengan filter
├── project.html               # Detail proyek (dinamis via ?slug=)
├── about.html                 # Tentang studio
├── contact.html               # Formulir kontak
├── vite.config.js
├── package.json
├── public/
│   └── favicon.svg
└── src/
    ├── styles/
    │   ├── main.css           # Entry (import base/layout/components/pages)
    │   ├── base.css
    │   ├── layout.css
    │   ├── components.css
    │   └── pages.css
    └── js/
        ├── shared.js          # Header + reveal animations
        ├── home.js
        ├── services.js
        ├── portfolio.js
        ├── project.js
        ├── about.js
        ├── contact.js
        └── data/
            ├── services.js    # Data 5 jenis layanan arsitektur
            ├── projects.js    # Data proyek portofolio
            └── testimonials.js
```

## Menjalankan

```bash
npm install
npm run dev
```

## Kustomisasi Isi

1. **Data proyek portofolio** — edit `src/js/data/projects.js`
2. **Kontak & channel** — edit `src/js/contact.js`
3. **Filosofi & proses kerja** — edit `about.html` dan `src/js/about.js`
4. **Warna & tipografi** — edit CSS variables di `src/styles/base.css`

## Navigasi

- Beranda → teaser 5 jenis layanan + karya terpilih + pendekatan
- Layanan → detail setiap jenis arsitektur (residensial, komersial, hospitality, institusional, interior)
- Portofolio → grid + filter (kategori/gaya/skala) — mendukung URL params
- Detail Proyek → `project.html?slug=<slug>` dengan fallback empty-state
- Tentang → filosofi, proses kerja, lingkup layanan
- Kontak → formulir + FAQ + jam kerja
