export const projects = [];

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
