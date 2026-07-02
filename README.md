# ARCHITEKTA — Architecture Studio Portfolio

A professional architecture studio portfolio website. Built with vanilla HTML/CSS/JS, Three.js (3D wireframe hero), and GSAP (scroll animations). Modern light theme with an architectural sensibility.

## Project Structure

> **Clean URLs:** each page lives in its own folder as `index.html`, so the URLs are
> extensionless — `/`, `/services/`, `/portfolio/`, `/project/?slug=…`, `/about/`,
> `/contact/`, `/admin/` (no `.html`). This works in `vite dev`, `vite preview`, and on
> any static host that serves directory index files (Netlify, Vercel, GitHub Pages, S3, nginx…).
> Unknown paths return a styled **404** page — in `vite dev` and `vite preview` via a
> fallback plugin in `vite.config.js`, and in production via `404.html` (served by static
> hosts). An unknown `project/?slug=…` shows an in-page "Project Not Found" state.

```
art-project-main/
├── index.html                 # Home
├── services/index.html        # Services (5 architecture types)  →  /services/
├── portfolio/index.html       # Portfolio grid with filters      →  /portfolio/
├── project/index.html         # Project detail (dynamic ?slug=)  →  /project/
├── about/index.html           # About the studio                 →  /about/
├── contact/index.html         # Contact form                     →  /contact/
├── admin/index.html           # Admin login portal               →  /admin/
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

## Admin / CMS (edit the site from the browser)

The site has a visual admin panel backed by **Supabase** (auth + Postgres + storage).
Content edits are stored in the cloud, so **all visitors see the changes** — no code edits or redeploy needed.

- **Login:** open `/admin/` (there is also a subtle **Internal Access** link in every page
  footer), sign in with the admin email + password.
- **Edit existing content:** after login, an admin bar appears on every page. Click
  **Mode Edit: ON**, then click any text to edit it inline, or click any image to
  replace it (uploads to Supabase Storage). Click **Simpan** to save.
- **Add / remove / reorder sections (page builder):** in edit mode use **+ Tambah Section**
  to add blocks (heading, text, image, image+text, gallery, cards, button, spacer).
  Hover a section to move (↑/↓), edit (✎), or delete (🗑) it.
- **Switch pages to edit:** the admin bar has a **Halaman** dropdown — pick any page
  (Home / Services / Portfolio / About / Contact) to jump there and edit it (warns first if
  you have unsaved changes).
- **Manage Portfolio, Services & About (CRUD):** click **Kelola Data** in the admin bar to
  open the manager. Tabs: **Portfolio** and **Services** (add / edit / delete records with
  multi-select styles, hero/gallery image uploads, repeatable lists, featured toggle) and
  **About**. Under a project's **Gambar Desain (Portfolio & Featured Work)** you can add,
  replace, reorder (↑/↓) and caption the design drawings shown when a project is opened.
  Changes save to Supabase and drive the live pages.

**Editing comfort:** entering edit mode shows a non-blocking hint pill (bottom, auto-hides);
links don't navigate while editing (so you can fix their text); the Save button shows a
pending-change count; **Undo/Redo** buttons (and **Ctrl+Z** / **Ctrl+Shift+Z**) revert
mistakes; **Esc** exits edit mode and **Ctrl/⌘+S** saves; leaving with unsaved changes warns
first. The admin tools use a distinct violet theme so they never read as page content.

### CMS architecture
- `src/js/cms/supabase.js` — client config (project URL + publishable anon key).
- `src/js/cms/public.js` — runtime on every page: loads overrides + section blocks; loads the editor when an admin is logged in.
- `src/js/cms/editor.js` — the in-page visual editor (inline editing, uploads, block builder, save).
- `src/js/cms/blocks.js` — section/block type registry (render + editor form schema).
- `src/js/cms/manager.js` + `src/js/cms/records.js` — Portfolio/Services CRUD UI + data access.
- `src/js/cms/ui.js` — shared helpers (element builder, toasts, image upload/picker).
- `src/js/cms/path.js` — stable DOM-path keys so inline edits re-apply on reload.
- `admin/index.html` + `src/js/cms/login.js` — login portal.

Portfolio & services load from Supabase at runtime (`loadProjects()` / `loadServices()` in
`src/js/data/`), falling back to the static seed arrays in those same files if Supabase is
unreachable or empty — so the site never renders blank.

Database tables: `content_fields` (inline text/image overrides, keyed `page::domPath`),
`content_blocks` (added sections), `projects` and `services` (JSONB records), and
`singletons` (single-document content such as the About page, key `about`). All are
public-read, admin-write (RLS). Images live in the public `media` storage bucket.
About loads via `loadAbout()` in `src/js/data/about.js` (static seed = `defaultAbout`).

> **Security:** the anon/publishable key in `supabase.js` is safe to ship (it only allows
> what RLS permits: public reads, authenticated writes). Change the default admin password
> in the Supabase dashboard (Authentication → Users) after first login.

## Customizing Content

> The items below are the code-level content sources. The **portfolio projects** and
> **services** are still defined in the data files; the CMS above edits static page text,
> images, and added sections.


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
