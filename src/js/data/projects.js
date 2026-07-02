export const projects = [
  {
    id: 1,
    slug: 'modern-residential-villa',
    title: 'Modern Residential Villa',
    primaryCategory: 'residential',
    styles: ['modern-minimalist'],
    scale: 'medium',
    year: '2024',
    location: '',
    featured: true,
    heroImage: '/portfolio-1.png',
    externalUrl: 'https://www.google.com',
    gallery: [{ image: '/portfolio-1.png', caption: 'Front elevation with minimalist facade treatment' }],
  },
  {
    id: 2,
    slug: 'tropical-courtyard-house',
    title: 'Tropical Courtyard House',
    primaryCategory: 'residential',
    styles: ['tropical-contemporary'],
    scale: 'medium',
    year: '2024',
    location: '',
    featured: true,
    heroImage: '/portfolio-1.png',
    externalUrl: 'https://www.google.com',
    gallery: [{ image: '/portfolio-1.png', caption: 'Open courtyard integrating natural ventilation' }],
  },
  {
    id: 3,
    slug: 'commercial-office-retrofit',
    title: 'Commercial Office Retrofit',
    primaryCategory: 'commercial',
    styles: ['industrial'],
    scale: 'large',
    year: '2023',
    location: '',
    featured: true,
    heroImage: '/portfolio-1.png',
    externalUrl: 'https://www.google.com',
    gallery: [{ image: '/portfolio-1.png', caption: 'Workspace layout optimized for collaborative flow' }],
  },
  {
    id: 4,
    slug: 'boutique-hotel-concept',
    title: 'Boutique Hotel Concept',
    primaryCategory: 'hospitality',
    styles: ['tropical-contemporary', 'sustainable'],
    scale: 'large',
    year: '2023',
    location: '',
    featured: true,
    heroImage: '/portfolio-1.png',
    externalUrl: 'https://www.google.com',
    gallery: [{ image: '/portfolio-1.png', caption: 'Guest room module with integrated landscape view' }],
  },
  {
    id: 5,
    slug: 'interior-renovation-studio',
    title: 'Interior Renovation Studio',
    primaryCategory: 'interior',
    styles: ['modern-minimalist', 'industrial'],
    scale: 'small',
    year: '2024',
    location: '',
    featured: true,
    heroImage: '/portfolio-1.png',
    externalUrl: 'https://www.google.com',
    gallery: [{ image: '/portfolio-1.png', caption: 'Material palette and spatial reconfiguration' }],
  },
];

export const CATEGORIES = {
  residential: 'Residential',
  commercial: 'Commercial',
  hospitality: 'Hospitality',
  institutional: 'Institutional',
  interior: 'Interior & Renovation',
};

export const STYLES = {
  'modern-minimalist': 'Modern Minimalist',
  'tropical-contemporary': 'Tropical Contemporary',
  'industrial': 'Industrial',
  'vernacular': 'Vernacular',
  'sustainable': 'Sustainable',
};

export const SCALES = {
  small: 'Small Scale',
  medium: 'Medium Scale',
  large: 'Large Scale',
};

export function getProjectBySlug(slug) {
  return projects.find((p) => p.slug === slug);
}

export function getProjectById(id) {
  return projects.find((p) => p.id === id);
}

export function getFeaturedProjects() {
  return projects.filter((p) => p.featured);
}

export function filterProjects({ category, style, scale }) {
  return projects.filter((p) => {
    if (category && category !== 'all' && p.primaryCategory !== category) return false;
    if (style && style !== 'all' && !p.styles.includes(style)) return false;
    if (scale && scale !== 'all' && p.scale !== scale) return false;
    return true;
  });
}
