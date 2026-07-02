import { supabase } from '../cms/supabase.js';

export const defaultAbout = {
  skills: [
    { name: 'AutoCAD', level: 'Advanced' },
    { name: 'SketchUp', level: 'Advanced' },
    { name: 'Photoshop', level: 'Intermediate' },
    { name: 'Canva', level: 'Intermediate' },
  ],
  languages: [
    { name: 'Indonesian', level: 'Native' },
    { name: 'English', level: 'Professional', note: 'TOEFL Certified', certificateUrl: '' },
  ],
  certifications: [
    { title: 'TOEFL iBT', issuer: 'ETS', year: '', tag: 'Language', certificateUrl: '' },
    { title: 'Autodesk Certified Professional — AutoCAD', issuer: 'Autodesk', year: '', tag: 'Software', certificateUrl: '' },
    { title: 'SketchUp Pro Certification', issuer: 'Trimble', year: '', tag: 'Software', certificateUrl: '' },
    { title: 'LEED Green Associate', issuer: 'U.S. Green Building Council', year: '', tag: 'Sustainability', certificateUrl: '' },
    { title: 'Adobe Photoshop — Visual Design', issuer: 'Adobe', year: '', tag: 'Software', certificateUrl: '' },
    { title: 'BIM & Revit Fundamentals', issuer: 'Professional Workshop', year: '', tag: 'Competency', certificateUrl: '' },
  ],
  experience: [
    {
      period: '2021 — Present',
      role: 'Principal Architect & Founder',
      org: 'ARCHITEKTA Studio · Bandung',
      description:
        'Founded and lead the studio. Personally direct 40+ residential and commercial projects from first sketch through construction administration, managing a core team of five.',
      highlights: ['40+ projects delivered', 'Concept to hand-off', 'Team of 5'],
    },
    {
      period: '2018 — 2021',
      role: 'Senior Architect',
      org: 'Padma Design Group · Jakarta',
      description:
        'Led design development for mixed-use and hospitality projects, including two boutique hotels and a 14-storey commercial tower. Coordinated structural and MEP consultants through documentation.',
      highlights: ['Hospitality & mixed-use', 'Consultant coordination', 'Led 6-person teams'],
    },
    {
      period: '2016 — 2018',
      role: 'Project Architect',
      org: 'Nusantara Atelier · Surabaya',
      description:
        'Focused on institutional and public work—libraries, campus buildings, and community centres—with an emphasis on accessibility, passive ventilation, and phased construction.',
      highlights: ['Institutional & civic', 'Accessibility-first', 'Passive design'],
    },
    {
      period: '2015 — 2016',
      role: 'Junior Architect',
      org: 'Studio Lima · Yogyakarta',
      description:
        'Produced residential construction drawings, built physical study models, and assisted site supervision—where the habit of testing every design as a maket first took root.',
      highlights: ['Residential drafting', 'Model-making', 'Site supervision'],
    },
  ],
  education: [
    {
      period: '2013 — 2015',
      role: 'Master of Architecture (M.Arch)',
      org: 'Institut Teknologi Bandung (ITB)',
      description:
        'Thesis on passive-cooling strategies for tropical mid-rise housing. Graduated cum laude with a focus on building physics and daylight modelling.',
      highlights: ['Cum laude', 'Passive cooling research'],
    },
    {
      period: '2009 — 2013',
      role: 'Bachelor of Architecture (S.Ars)',
      org: 'Universitas Gadjah Mada (UGM)',
      description:
        'Foundation in design, structures, and history of architecture. Active in the campus architecture society and inter-university design competitions.',
      highlights: ['Design society', 'Competition finalist'],
    },
  ],
  interests: [
    { title: 'Passive & Sustainable Design', body: 'Orientation, cross-ventilation, and shading studied before mechanical systems—buildings that stay comfortable with less energy.' },
    { title: 'Vernacular Material Research', body: 'Studying local timber, brick, and stone traditions, and how they can be detailed for a modern lifespan.' },
    { title: 'Physical Model-Making', body: 'Every project begins as a maket. Working in the physical model reveals proportion and shadow that a screen hides.' },
    { title: 'Daylight & Spatial Studies', body: 'Mapping how light moves through a space across the day—the quality most clients feel but rarely name.' },
    { title: 'Urban Sketching & Travel', body: 'Sketchbook in hand across Southeast Asia, recording how cities and courtyards actually get used.' },
    { title: 'Teaching & Mentoring', body: 'Occasional design-studio critic and mentor to junior architects—teaching keeps the fundamentals sharp.' },
  ],
};

export const skills = [...defaultAbout.skills];
export const languages = [...defaultAbout.languages];
export const certifications = [...defaultAbout.certifications];
export const experience = [...defaultAbout.experience];
export const education = [...defaultAbout.education];
export const interests = [...defaultAbout.interests];

const CACHES = { skills, languages, certifications, experience, education, interests };

export async function loadAbout() {
  try {
    const { data, error } = await supabase.from('singletons').select('data').eq('key', 'about').maybeSingle();
    if (error) throw error;
    const doc = data?.data;
    if (doc && Object.keys(doc).length) {
      for (const key of Object.keys(CACHES)) {
        if (Array.isArray(doc[key])) {
          CACHES[key].length = 0;
          doc[key].forEach((item) => CACHES[key].push(item));
        }
      }
    }
  } catch (e) {
    console.warn('[cms] loadAbout fallback to defaults:', e.message);
  }
  return CACHES;
}
