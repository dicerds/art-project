import { initHeader, initRevealAnimations } from './shared.js';

initHeader();

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
