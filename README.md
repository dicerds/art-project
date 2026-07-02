# ARCHITEKTA — Architecture Studio Portfolio

A professional architecture studio portfolio website. Built with vanilla HTML/CSS/JS, Three.js (3D wireframe hero), and GSAP (scroll animations). Modern light theme with an architectural sensibility.

## Project Structure

```
art-project-main/
├── index.html                 # Home
├── services.html              # Services (5 architecture types)
├── portfolio.html             # Portfolio grid with filters
├── project.html               # Project detail (dynamic via ?slug=)
├── about.html                 # About the studio
├── contact.html               # Contact form
├── vite.config.js
├── package.json
├── public/
│   └── favicon.svg
└── src/
    ├── styles/
    │   ├── main.css           # Entry (imports base/layout/components/pages/services)
    │   ├── base.css           # CSS variables, resets, typography
    │   ├── layout.css         # Grid, header, footer, responsive
    │   ├── components.css     # Reusable UI components
    │   ├── pages.css          # Page-specific styles
    │   └── services.css       # Services page styles
    └── js/
        ├── pages/             # Per-page entry scripts
        │   ├── home.js
        │   ├── services.js
        │   ├── portfolio.js
        │   ├── project.js
        │   ├── about.js
        │   └── contact.js
        ├── components/        # Reusable UI components
        │   └── design-lightbox.js
        ├── utils/             # Shared utilities
        │   └── shared.js      # Header + reveal animations
        └── data/              # Data layer (content & config)
            ├── projects.js    # Portfolio project data
            ├── services.js    # 5 architecture service types
            ├── about.js       # About page data (skills, experience, etc.)
            └── testimonials.js
```

## Getting Started

```bash
npm install
npm run dev
```

## Customizing Content

1. **Portfolio projects** — edit `src/js/data/projects.js`
2. **About page data** — edit `src/js/data/about.js`
3. **Contact channels** — edit `src/js/pages/contact.js`
4. **Philosophy & process** — edit `about.html` and `src/js/pages/about.js`
5. **Colors & typography** — edit CSS variables in `src/styles/base.css`

## Project Data Model

Each project in `projects.js` supports a swipeable gallery. Each gallery item is an object with an image and a caption:

```js
{
  slug: 'project-name',
  title: 'Project Name',
  primaryCategory: 'residential',
  styles: ['modern-minimalist'],
  scale: 'medium',
  location: 'City, Region',
  year: '2025',
  heroImage: '/path/to/hero.jpg',
  conceptDescription: 'Full design explanation...',
  gallery: [
    { image: '/path/to/img1.jpg', caption: 'Description for this image' },
    { image: '/path/to/img2.jpg', caption: 'Description for this image' }
  ],
  relatedProjects: [2, 3],
  featured: true
}
```

## Navigation

- Home → service teasers + featured work + approach
- Services → detailed breakdown per architecture type
- Portfolio → grid + filters (type/style/scale), supports URL params
- Project Detail → `project.html?slug=<slug>` with swipeable gallery and full concept description; project cards link here
- About → philosophy, process, scope of services
- Contact → form + FAQ + studio hours
