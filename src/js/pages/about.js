import { initHeader, initRevealAnimations } from '../utils/shared.js';
import { skills, languages, certifications, experience, education, interests } from '../data/about.js';

initHeader();

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

function timelineItem(item) {
  const highlights = (item.highlights || [])
    .map((h) => `<span class="tag">${h}</span>`)
    .join('');
  return `
    <div class="timeline-item" data-reveal>
      <div class="ti-period mono">${item.period}</div>
      <div class="ti-content">
        <h3>${item.role}</h3>
        <span class="ti-org mono">${item.org}</span>
        <p class="ti-desc">${item.description}</p>
        ${highlights ? `<div class="ti-highlights">${highlights}</div>` : ''}
      </div>
    </div>
  `;
}

const experienceList = document.getElementById('experienceList');
if (experienceList) {
  experienceList.innerHTML = experience.map(timelineItem).join('');
}

const educationList = document.getElementById('educationList');
if (educationList) {
  educationList.innerHTML = education.map(timelineItem).join('');
}

const interestsList = document.getElementById('interestsList');
if (interestsList) {
  interestsList.innerHTML = interests
    .map(
      (it) => `
    <div class="interest-card" data-reveal>
      <h3 class="display">${it.title}</h3>
      <p>${it.body}</p>
    </div>
  `
    )
    .join('');
}


initRevealAnimations();
