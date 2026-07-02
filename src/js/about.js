import { initHeader, initRevealAnimations } from './shared.js';

initHeader();

const skills = [
  { name: 'AutoCAD', level: 'Advanced' },
  { name: 'SketchUp', level: 'Advanced' },
  { name: 'Photoshop', level: 'Intermediate' },
  { name: 'Canva', level: 'Intermediate' },
];

const languages = [
  { name: 'Indonesian', level: 'Native' },
  { name: 'English', level: 'Professional', note: 'TOEFL Certified', certificateUrl: '' },
];

const certifications = [
  {
    title: 'TOEFL iBT',
    issuer: 'ETS',
    year: '',
    tag: 'Language',
    certificateUrl: '',
  },
  {
    title: 'Autodesk Certified Professional — AutoCAD',
    issuer: 'Autodesk',
    year: '',
    tag: 'Software',
    certificateUrl: '',
  },
  {
    title: 'SketchUp Pro Certification',
    issuer: 'Trimble',
    year: '',
    tag: 'Software',
    certificateUrl: '',
  },
  {
    title: 'LEED Green Associate',
    issuer: 'U.S. Green Building Council',
    year: '',
    tag: 'Sustainability',
    certificateUrl: '',
  },
  {
    title: 'Adobe Photoshop — Visual Design',
    issuer: 'Adobe',
    year: '',
    tag: 'Software',
    certificateUrl: '',
  },
  {
    title: 'BIM & Revit Fundamentals',
    issuer: 'Professional Workshop',
    year: '',
    tag: 'Competency',
    certificateUrl: '',
  },
];

function skillItem(s) {
  const note = s.note ? `<span class="skill-note mono">${s.note}</span>` : '';
  const cert = s.certificateUrl
    ? `<a class="cert-link mono" href="${s.certificateUrl}" target="_blank" rel="noopener">View Certificate →</a>`
    : s.note
      ? `<span class="cert-link cert-link-pending mono">View Certificate →</span>`
      : '';
  return `
    <div class="skill-item">
      <span class="skill-name">${s.name}${note}${cert}</span>
      <span class="skill-level" data-level="${s.level.toLowerCase()}">${s.level}</span>
    </div>
  `;
}

const skillList = document.getElementById('skillList');
if (skillList) {
  skillList.innerHTML = skills.map(skillItem).join('');
}

const languageList = document.getElementById('languageList');
if (languageList) {
  languageList.innerHTML = languages.map(skillItem).join('');
}

const certList = document.getElementById('certList');
if (certList) {
  certList.innerHTML = certifications
    .map((c) => {
      const meta = [c.issuer, c.year].filter(Boolean).join(' · ');
      const link = c.certificateUrl
        ? `<a class="cert-link mono" href="${c.certificateUrl}" target="_blank" rel="noopener">View Certificate →</a>`
        : `<span class="cert-link cert-link-pending mono">View Certificate →</span>`;
      return `
      <div class="cert-item">
        <div class="cert-main">
          <span class="cert-title">${c.title}</span>
          <span class="cert-issuer mono">${meta}</span>
        </div>
        <div class="cert-action">
          <span class="cert-tag mono">${c.tag}</span>
          ${link}
        </div>
      </div>
    `;
    })
    .join('');
}

const processSteps = [
  {
    title: 'Initial Consultation',
    description:
      'No-cost discussion to understand your vision, budget, timeline, and goals. This session informs the scope of work proposal.',
  },
  {
    title: 'Site Research & Programming',
    description:
      'Field survey, measurements, regulatory analysis, solar orientation study, and space program development based on user needs.',
  },
  {
    title: 'Design Concept',
    description:
      'Initial sketches, mass studies, and layout alternatives. Concepts presented via drawings, diagrams, and early 3D visualization.',
  },
  {
    title: 'Design Development',
    description:
      'Material detailing, finishing systems, structural strategy, and initial coordination with MEP, structural, and landscape consultants.',
  },
  {
    title: 'Construction Documents',
    description:
      'Complete documentation for bidding and construction: floor plans, elevations, sections, detail drawings, specifications, and material schedules.',
  },
  {
    title: 'Construction Administration',
    description:
      'Periodic site visits, contractor coordination, change order review, and quality assurance through project handoff.',
  },
];

const processList = document.getElementById('processList');
if (processList) {
  processList.innerHTML = processSteps
    .map(
      (s, i) => `
    <div class="process-step" data-reveal>
      <span class="step-num display">${String(i + 1).padStart(2, '0')}</span>
      <div class="step-content">
        <h3>${s.title}</h3>
        <p>${s.description}</p>
      </div>
    </div>
  `
    )
    .join('');
}

initRevealAnimations();
