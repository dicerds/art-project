import { initHeader, initRevealAnimations } from './shared.js';

initHeader();

const processSteps = [
  {
    title: 'Konsultasi Awal',
    description:
      'Sesi diskusi tanpa biaya untuk memahami kebutuhan, anggaran, timeline, dan visi Anda. Hasil sesi ini menjadi dasar penawaran lingkup pekerjaan.',
  },
  {
    title: 'Riset Tapak & Program Ruang',
    description:
      'Survei lapangan, pengukuran, analisis regulasi setempat, orientasi matahari, dan penyusunan program ruang berdasarkan kebutuhan pengguna.',
  },
  {
    title: 'Konsep Desain',
    description:
      'Sketsa awal, studi massa, dan alternatif tata ruang. Konsep dipresentasikan dalam bentuk gambar, diagram, dan visualisasi 3D awal.',
  },
  {
    title: 'Pengembangan Desain',
    description:
      'Detail material, finishing, sistem struktur, dan koordinasi awal dengan konsultan MEP, struktur, dan lansekap.',
  },
  {
    title: 'Gambar Kerja',
    description:
      'Dokumentasi lengkap untuk tender dan pelaksanaan: denah, tampak, potongan, detail sambungan, spesifikasi material, dan Bill of Quantity (BoQ).',
  },
  {
    title: 'Pengawasan Pelaksanaan',
    description:
      'Kunjungan lapangan berkala, koordinasi dengan kontraktor, review perubahan, dan penjaminan mutu hingga serah terima.',
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
