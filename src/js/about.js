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
      'Free discussion to understand your vision, requirements, and budget. This session defines the scope of work and timeline.',
  },
  {
    title: 'Site Analysis & Programming',
    description:
      'Site survey, measurements, regulatory analysis, and space requirements based on how you will use the building.',
  },
  {
    title: 'Design Concept',
    description:
      'Initial sketches, layout options, and early 3D visualization. You choose the direction before I proceed.',
  },
  {
    title: 'Design Development',
    description:
      'Material selection, structural strategy, and coordination with engineering consultants. Detailed drawings take shape.',
  },
  {
    title: 'Construction Documents',
    description:
      'Complete technical drawings for construction: floor plans, elevations, sections, details, and material specifications.',
  },
  {
    title: 'Construction Oversight',
    description:
      'Periodic site visits, contractor coordination, and quality checks through project completion and handover.',
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
