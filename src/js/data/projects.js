export const projects = [];

export const CATEGORIES = {
  residential: 'Residensial',
  commercial: 'Komersial',
  hospitality: 'Hospitality',
  institutional: 'Institusional',
  interior: 'Interior & Renovasi',
};

export const STYLES = {
  'modern-minimalist': 'Modern Minimalis',
  'tropical-contemporary': 'Tropis Kontemporer',
  'industrial': 'Industrial',
  'vernacular': 'Vernakular',
  'sustainable': 'Berkelanjutan',
};

export const SCALES = {
  small: 'Skala Kecil',
  medium: 'Skala Menengah',
  large: 'Skala Besar',
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
