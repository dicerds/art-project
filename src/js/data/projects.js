export const projects = [
  {
    slug: 'meridian-residence',
    title: 'Meridian Residence',
    primaryCategory: 'residential',
    styles: ['modern-minimalist'],
    scale: 'medium',
    year: '2024',
    featured: true,
    location: 'Bandung, West Java',
    fullDesignUrl: 'https://www.google.com',
    designs: [
      { label: 'Desain Maket', caption: '1:100 study model in matte black board, testing the stacked volumes and how the cantilever shades the ground-level terrace.' },
      { label: 'Perspektif Bangunan', caption: 'Outdoor and indoor perspectives: the street approach and the double-height living void seen from the stair.' },
      { label: 'Tampak Bangunan', caption: 'North, south, east, and west elevations showing the clerestory band and the timber sun-screen.' },
      { label: 'Denah Bangunan', caption: 'Ground and first floor plans at 1:50 with the structural grid and MEP routing.' },
      { label: 'Site Plan', caption: 'Site plan with orientation, setbacks, driveway, and the rear garden landscape.' },
    ],
  },
  {
    slug: 'alun-commercial-tower',
    title: 'Alun Commercial Tower',
    primaryCategory: 'commercial',
    styles: ['industrial'],
    scale: 'large',
    year: '2023',
    featured: true,
    location: 'Surabaya, East Java',
    fullDesignUrl: 'https://www.google.com',
    designs: [
      { label: 'Desain Maket', caption: '1:200 massing model in black acrylic articulating the circulation core and the setback rhythm of the facade.' },
      { label: 'Perspektif Bangunan', caption: 'Outdoor plaza-level view and indoor lobby perspective at the double-height entrance datum.' },
      { label: 'Tampak Bangunan', caption: 'Curtain-wall elevations across all four faces with the vertical mullion rhythm.' },
      { label: 'Denah Bangunan', caption: 'Typical floor plate and core detail at 1:100, coordinating the service risers.' },
      { label: 'Site Plan', caption: 'Site plan with street frontage, vehicle drop-off, and the podium footprint.' },
    ],
  },
  {
    slug: 'serena-boutique-hotel',
    title: 'Serena Boutique Hotel',
    primaryCategory: 'hospitality',
    styles: ['tropical-contemporary'],
    scale: 'large',
    year: '2023',
    featured: true,
    location: 'Ubud, Bali',
    fullDesignUrl: 'https://www.google.com',
    designs: [
      { label: 'Desain Maket', caption: '1:150 site model in dark board, the terraced guest pavilions cascading toward the river valley.' },
      { label: 'Perspektif Bangunan', caption: 'Outdoor pool-deck horizon and indoor lobby-lounge perspectives.' },
      { label: 'Tampak Bangunan', caption: 'Pavilion elevations showing the pitched roofs and the timber louvre facade.' },
      { label: 'Denah Bangunan', caption: 'Guest pavilion typicals and public-area floor plans at 1:100.' },
      { label: 'Site Plan', caption: 'Site plan layering guest circulation over the back-of-house loop and the sloped-site drainage.' },
    ],
  },
  {
    slug: 'cendana-public-library',
    title: 'Cendana Public Library',
    primaryCategory: 'institutional',
    styles: ['vernacular', 'sustainable'],
    scale: 'medium',
    year: '2022',
    featured: true,
    location: 'Yogyakarta',
    fullDesignUrl: 'https://www.google.com',
    designs: [
      { label: 'Desain Maket', caption: '1:100 sectional model in black card revealing the passive-ventilation atrium and the timber roof lattice.' },
      { label: 'Perspektif Bangunan', caption: 'Outdoor entry court and indoor reading-hall perspectives under the clerestory.' },
      { label: 'Tampak Bangunan', caption: 'Elevations with the deep eaves and the perforated brick sun-screen.' },
      { label: 'Denah Bangunan', caption: 'Floor plans and reflected ceiling plan at 1:50 with the accessible ramp network.' },
      { label: 'Site Plan', caption: 'Site plan with the public plaza, parking, and the rain-garden edge.' },
    ],
  },
  {
    slug: 'loft-interior-renovation',
    title: 'Loft Interior Renovation',
    primaryCategory: 'interior',
    styles: ['sustainable'],
    scale: 'small',
    year: '2024',
    featured: true,
    location: 'Jakarta',
    fullDesignUrl: 'https://www.google.com',
    designs: [
      { label: 'Desain Maket', caption: '1:50 interior model in black foam board, mapping the new mezzanine insertion and the exposed-services ceiling.' },
      { label: 'Perspektif Bangunan', caption: 'Indoor perspectives of the open kitchen and the exposed-services ceiling.' },
      { label: 'Tampak Bangunan', caption: 'Interior elevations of the joinery wall and the mezzanine balustrade.' },
      { label: 'Denah Bangunan', caption: 'Demolition and construction plans overlaid at 1:25 with the re-planned open layout.' },
      { label: 'Site Plan', caption: 'Unit plan within the building core, showing access and service points.' },
    ],
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
