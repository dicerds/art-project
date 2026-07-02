export const services = [
  {
    slug: 'residensial',
    number: '01',
    category: 'residential',
    title: 'Residensial',
    tagline: 'Rumah tinggal & hunian pribadi',
    summary:
      'Merancang rumah yang tumbuh bersama penghuninya — dari analisis kebutuhan keluarga, orientasi tapak, hingga pemilihan material yang tahan lama dan hemat energi.',
    audience: [
      'Individu atau keluarga yang membangun rumah pertama',
      'Pemilik lahan yang ingin mengoptimalkan potensi kavling',
      'Klien yang menginginkan hunian dengan identitas personal',
    ],
    deliverables: [
      'Konsultasi awal & analisis kebutuhan ruang',
      'Studi tapak, orientasi bangunan, dan zonasi',
      'Konsep desain 2D dan visualisasi 3D',
      'Gambar kerja arsitektur, struktur, dan MEP',
      'Rencana anggaran biaya (RAB) awal',
      'Pengawasan berkala pelaksanaan',
    ],
    suitableFor: 'Rumah tinggal, villa, townhouse, guest house, hunian multi-generasi',
    timeline: '4–8 bulan dari konsep hingga gambar kerja lengkap',
    styles: ['modern-minimalist', 'tropical-contemporary', 'vernacular', 'sustainable'],
  },
  {
    slug: 'komersial',
    number: '02',
    category: 'commercial',
    title: 'Komersial',
    tagline: 'Kantor, ritel, & ruko',
    summary:
      'Ruang bisnis yang mengoptimalkan alur kerja, memperkuat identitas merek, dan mendukung pertumbuhan operasional dalam jangka panjang.',
    audience: [
      'Pemilik bisnis yang membangun kantor pusat baru',
      'Developer yang mengembangkan ruko atau blok komersial',
      'Merek ritel yang ingin memperkuat pengalaman toko fisik',
    ],
    deliverables: [
      'Studi kelayakan lokasi dan potensi ruang',
      'Perencanaan tata ruang berdasarkan alur pengguna',
      'Desain fasad dan sistem tanda visual (signage)',
      'Perhitungan efisiensi ruang sewa (lease-efficiency)',
      'Koordinasi dengan sistem MEP, HVAC, dan pencahayaan',
      'Dokumen tender dan pengawasan pelaksanaan',
    ],
    suitableFor: 'Perkantoran, ruko, showroom otomotif, ritel, coworking space',
    timeline: '3–6 bulan untuk paket desain lengkap',
    styles: ['modern-minimalist', 'industrial', 'sustainable'],
  },
  {
    slug: 'hospitality',
    number: '03',
    category: 'hospitality',
    title: 'Hospitality',
    tagline: 'Hotel, restoran, & kafe',
    summary:
      'Merancang pengalaman — bukan hanya ruangan — untuk industri yang menjual momen. Setiap keputusan desain didorong oleh perjalanan tamu dan kebutuhan operasional.',
    audience: [
      'Operator hotel butik yang mencari identitas visual kuat',
      'F&B entrepreneur yang membuka concept dining pertama',
      'Investor properti yang mengembangkan resort atau retreat',
    ],
    deliverables: [
      'Pengembangan konsep tematik dan storytelling ruang',
      'Zonasi berdasarkan alur tamu dan back-of-house',
      'Desain interior yang selaras dengan arsitektur',
      'Pertimbangan akustik, pencahayaan, dan atmosfer',
      'Koordinasi dengan tim brand identity dan F&B',
      'Perencanaan pentahapan operasional',
    ],
    suitableFor: 'Hotel butik, resort, restoran, kafe, bar, glamping, retreat',
    timeline: '6–12 bulan tergantung skala dan kompleksitas',
    styles: ['tropical-contemporary', 'industrial', 'sustainable'],
  },
  {
    slug: 'institusional',
    number: '04',
    category: 'institutional',
    title: 'Institusional',
    tagline: 'Publik, pendidikan, & ibadah',
    summary:
      'Bangunan yang melayani komunitas — dirancang untuk keberlanjutan jangka panjang, aksesibilitas universal, dan efisiensi biaya perawatan.',
    audience: [
      'Yayasan pendidikan yang membangun kampus baru',
      'Panitia pembangunan tempat ibadah',
      'Pemerintah daerah atau lembaga publik',
    ],
    deliverables: [
      'Studi kebutuhan komunitas dan program ruang',
      'Kepatuhan terhadap regulasi bangunan publik',
      'Desain aksesibilitas (universal design)',
      'Perhitungan kapasitas, sirkulasi, dan evakuasi',
      'Strategi pentahapan pembangunan',
      'Dokumentasi lengkap untuk perijinan',
    ],
    suitableFor: 'Sekolah, kampus, kantor pemerintahan, masjid/gereja, perpustakaan, balai warga',
    timeline: '8–18 bulan tergantung skala proyek',
    styles: ['modern-minimalist', 'sustainable', 'vernacular'],
  },
  {
    slug: 'interior-renovasi',
    number: '05',
    category: 'interior',
    title: 'Interior & Renovasi',
    tagline: 'Adaptasi ruang eksisting',
    summary:
      'Menghidupkan kembali bangunan yang ada — memaksimalkan potensi ruang tanpa membongkar segalanya. Solusi cerdas untuk klien yang membutuhkan transformasi cepat.',
    audience: [
      'Pemilik rumah yang ingin renovasi tanpa membangun ulang',
      'Perusahaan yang mengubah kantor lama menjadi ruang modern',
      'Pemilik bangunan cagar budaya atau adaptive reuse',
    ],
    deliverables: [
      'Survei kondisi eksisting dan pengukuran ulang',
      'Analisis struktur, utilitas, dan potensi ekspansi',
      'Konsep ulang tata ruang dan sirkulasi',
      'Rekomendasi material sesuai bujet',
      'Pengelolaan proyek renovasi bertahap',
      'Panduan pemeliharaan pasca-renovasi',
    ],
    suitableFor: 'Renovasi rumah, kantor lama, bangunan cagar budaya, adaptive reuse',
    timeline: '2–6 bulan tergantung lingkup pekerjaan',
    styles: ['modern-minimalist', 'industrial'],
  },
];

export function getServiceBySlug(slug) {
  return services.find((s) => s.slug === slug);
}
