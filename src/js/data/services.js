import { supabase } from '../cms/supabase.js';

export const defaultServices = [
  {
    slug: 'residential',
    number: '01',
    category: 'residential',
    title: 'Residential',
    tagline: 'Private homes & dwelling spaces',
    summary:
      'Designing homes that grow with their inhabitants—from family needs analysis, site orientation, to durable material selection and energy efficiency.',
    audience: [
      'First-time home builders and families',
      'Landowners wanting to maximize plot potential',
      'Clients seeking homes with personal identity',
    ],
    deliverables: [
      'Initial consultation & space needs analysis',
      'Site study, building orientation & zoning',
      '2D design concepts and 3D visualization',
      'Complete architectural drawings & MEP plans',
      'Preliminary budget estimate (BOQ)',
      'Periodic construction oversight',
    ],
    suitableFor: 'Single-family homes, villas, townhouses, guest houses, multi-generational housing',
    timeline: '4–8 months from concept to complete drawings',
    styles: ['modern-minimalist', 'tropical-contemporary', 'vernacular', 'sustainable'],
  },
  {
    slug: 'commercial',
    number: '02',
    category: 'commercial',
    title: 'Commercial',
    tagline: 'Offices, retail & mixed-use',
    summary:
      'Business spaces that optimize workflow, reinforce brand identity, and support long-term operational growth.',
    audience: [
      'Business owners building new headquarters',
      'Developers creating commercial blocks',
      'Retail brands seeking memorable spaces',
    ],
    deliverables: [
      'Site feasibility & location analysis',
      'Space planning based on user flow',
      'Facade design & visual signage strategy',
      'Lease efficiency calculations',
      'MEP, HVAC & lighting coordination',
      'Tender documentation & construction admin',
    ],
    suitableFor: 'Office buildings, retail shops, automotive showrooms, mixed-use complexes, coworking',
    timeline: '3–6 months for complete design package',
    styles: ['modern-minimalist', 'industrial', 'sustainable'],
  },
  {
    slug: 'hospitality',
    number: '03',
    category: 'hospitality',
    title: 'Hospitality',
    tagline: 'Hotels, restaurants & experiences',
    summary:
      'Designing experiences—not just rooms. Every decision driven by guest journey and operational requirements.',
    audience: [
      'Boutique hotel operators seeking visual identity',
      'F&B entrepreneurs launching concept dining',
      'Investors developing resorts & retreats',
    ],
    deliverables: [
      'Thematic concept development & storytelling',
      'Guest flow zoning & back-of-house planning',
      'Interior design aligned with architecture',
      'Acoustics, lighting & atmosphere design',
      'Brand identity coordination',
      'Phased operational planning',
    ],
    suitableFor: 'Boutique hotels, resorts, restaurants, cafes, bars, glamping, wellness retreats',
    timeline: '6–12 months depending on scale',
    styles: ['tropical-contemporary', 'industrial', 'sustainable'],
  },
  {
    slug: 'institutional',
    number: '04',
    category: 'institutional',
    title: 'Institutional',
    tagline: 'Public, education & civic',
    summary:
      'Community-serving buildings designed for long-term sustainability, universal accessibility, and operational cost efficiency.',
    audience: [
      'Educational institutions building campuses',
      'Religious community building committees',
      'Government & public agencies',
    ],
    deliverables: [
      'Community needs assessment & space programming',
      'Public building code compliance',
      'Universal design & accessibility planning',
      'Capacity, circulation & evacuation calculations',
      'Phased construction strategy',
      'Complete permitting documentation',
    ],
    suitableFor: 'Schools, universities, government offices, places of worship, libraries, community centers',
    timeline: '8–18 months depending on project scale',
    styles: ['modern-minimalist', 'sustainable', 'vernacular'],
  },
  {
    slug: 'interior-renovation',
    number: '05',
    category: 'interior',
    title: 'Interior & Renovation',
    tagline: 'Adaptive reuse & space transformation',
    summary:
      'Reviving existing buildings—maximizing potential without demolition. Smart solutions for clients needing rapid transformation.',
    audience: [
      'Homeowners planning renovation without rebuild',
      'Companies modernizing older offices',
      'Heritage & adaptive reuse projects',
    ],
    deliverables: [
      'Existing condition survey & measurement',
      'Structural analysis & utility assessment',
      'Space reconfiguration & flow redesign',
      'Material recommendations per budget',
      'Phased renovation project management',
      'Post-renovation maintenance guide',
    ],
    suitableFor: 'Home renovations, office conversions, historic preservation, adaptive reuse',
    timeline: '2–6 months depending on scope',
    styles: ['modern-minimalist', 'industrial'],
  },
];

export const services = defaultServices.map((s) => ({ ...s }));

export async function loadServices() {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('slug,data,sort_order')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    if (data && data.length) {
      services.length = 0;
      data.forEach((row) => services.push({ slug: row.slug, ...(row.data || {}) }));
    }
  } catch (e) {
    console.warn('[cms] loadServices fallback to defaults:', e.message);
  }
  return services;
}

export function getServiceBySlug(slug) {
  return services.find((s) => s.slug === slug);
}
