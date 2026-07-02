import { supabase } from './supabase.js';
import { CATEGORIES, STYLES, SCALES } from '../data/projects.js';

export const PROJECT_FIELDS = [
  { key: 'slug', label: 'Slug (URL, unik)', type: 'text', required: true, hint: 'contoh: meridian-residence' },
  { key: 'title', label: 'Judul Proyek', type: 'text', required: true },
  { key: 'primaryCategory', label: 'Kategori', type: 'select', options: CATEGORIES },
  { key: 'scale', label: 'Skala', type: 'select', options: SCALES },
  { key: 'styles', label: 'Gaya Desain', type: 'multiselect', options: STYLES },
  { key: 'year', label: 'Tahun', type: 'text' },
  { key: 'location', label: 'Lokasi', type: 'text' },
  { key: 'featured', label: 'Tampilkan di Beranda (Featured)', type: 'toggle' },
  { key: 'heroImage', label: 'Gambar Utama (Hero)', type: 'image' },
  { key: 'conceptDescription', label: 'Deskripsi Konsep', type: 'textarea' },
  { key: 'buildingArea', label: 'Luas Bangunan', type: 'text' },
  { key: 'landArea', label: 'Luas Lahan', type: 'text' },
  { key: 'role', label: 'Peran', type: 'text' },
  { key: 'scope', label: 'Lingkup', type: 'text' },
  {
    key: 'designs', label: 'Gambar Desain (Portfolio & Featured Work)', type: 'objlist',
    subfields: [
      { key: 'image', label: 'Gambar Desain', type: 'image' },
      { key: 'label', label: 'Label', type: 'text' },
      { key: 'caption', label: 'Keterangan', type: 'textarea' },
    ],
  },
  {
    key: 'gallery', label: 'Galeri Proyek', type: 'objlist',
    subfields: [
      { key: 'image', label: 'Gambar', type: 'image' },
      { key: 'caption', label: 'Keterangan', type: 'text' },
    ],
  },
];

export const SERVICE_FIELDS = [
  { key: 'slug', label: 'Slug (URL, unik)', type: 'text', required: true, hint: 'contoh: residential' },
  { key: 'number', label: 'Nomor (mis. 01)', type: 'text' },
  { key: 'category', label: 'Kategori', type: 'select', options: CATEGORIES },
  { key: 'title', label: 'Judul Layanan', type: 'text', required: true },
  { key: 'tagline', label: 'Tagline', type: 'text' },
  { key: 'summary', label: 'Ringkasan', type: 'textarea' },
  { key: 'audience', label: 'Klien Ideal', type: 'stringlist' },
  { key: 'deliverables', label: 'Hasil / Deliverables', type: 'stringlist' },
  { key: 'suitableFor', label: 'Cocok Untuk', type: 'textarea' },
  { key: 'timeline', label: 'Estimasi Waktu', type: 'text' },
  { key: 'styles', label: 'Gaya Desain', type: 'multiselect', options: STYLES },
];

export const ABOUT_SECTIONS = [
  {
    key: 'skills', label: 'Keahlian (Skills)',
    fields: [
      { key: 'name', label: 'Nama', type: 'text' },
      { key: 'level', label: 'Tingkat', type: 'text', hint: 'mis. Advanced / Intermediate' },
    ],
  },
  {
    key: 'languages', label: 'Bahasa (Languages)',
    fields: [
      { key: 'name', label: 'Bahasa', type: 'text' },
      { key: 'level', label: 'Tingkat', type: 'text' },
      { key: 'note', label: 'Catatan', type: 'text' },
      { key: 'certificateUrl', label: 'Link Sertifikat', type: 'url' },
    ],
  },
  {
    key: 'certifications', label: 'Sertifikasi (Certifications)',
    fields: [
      { key: 'title', label: 'Judul', type: 'text' },
      { key: 'issuer', label: 'Penerbit', type: 'text' },
      { key: 'year', label: 'Tahun', type: 'text' },
      { key: 'tag', label: 'Tag', type: 'text' },
      { key: 'certificateUrl', label: 'Link Sertifikat', type: 'url' },
    ],
  },
  {
    key: 'experience', label: 'Pengalaman (Experience)',
    fields: [
      { key: 'period', label: 'Periode', type: 'text' },
      { key: 'role', label: 'Peran/Jabatan', type: 'text' },
      { key: 'org', label: 'Organisasi', type: 'text' },
      { key: 'description', label: 'Deskripsi', type: 'textarea' },
      { key: 'highlights', label: 'Poin Highlight', type: 'stringlist' },
    ],
  },
  {
    key: 'education', label: 'Pendidikan (Education)',
    fields: [
      { key: 'period', label: 'Periode', type: 'text' },
      { key: 'role', label: 'Gelar/Program', type: 'text' },
      { key: 'org', label: 'Institusi', type: 'text' },
      { key: 'description', label: 'Deskripsi', type: 'textarea' },
      { key: 'highlights', label: 'Poin Highlight', type: 'stringlist' },
    ],
  },
  {
    key: 'interests', label: 'Minat (Interests)',
    fields: [
      { key: 'title', label: 'Judul', type: 'text' },
      { key: 'body', label: 'Deskripsi', type: 'textarea' },
    ],
  },
];

export async function fetchAbout() {
  const { data, error } = await supabase.from('singletons').select('data').eq('key', 'about').maybeSingle();
  if (error) throw error;
  return data?.data || {};
}

export async function saveAbout(doc) {
  const { error } = await supabase.from('singletons').upsert({ key: 'about', data: doc }, { onConflict: 'key' });
  if (error) throw error;
}

const TABLE = { projects: 'projects', services: 'services' };

export async function fetchAll(kind) {
  const { data, error } = await supabase
    .from(TABLE[kind]).select('slug,data,sort_order').order('sort_order', { ascending: true });
  if (error) throw error;
  return (data || []).map((r) => ({ slug: r.slug, sort_order: r.sort_order, ...(r.data || {}) }));
}

export async function saveRecord(kind, record, sortOrder, originalSlug) {
  const { slug, sort_order, ...data } = record;
  const row = { slug: record.slug, sort_order: sortOrder ?? 0, data };
  if (originalSlug && originalSlug !== record.slug) {
    await supabase.from(TABLE[kind]).delete().eq('slug', originalSlug);
    const { error } = await supabase.from(TABLE[kind]).insert(row);
    if (error) throw error;
  } else {
    const { error } = await supabase.from(TABLE[kind]).upsert(row, { onConflict: 'slug' });
    if (error) throw error;
  }
}

export async function deleteRecord(kind, slug) {
  const { error } = await supabase.from(TABLE[kind]).delete().eq('slug', slug);
  if (error) throw error;
}

export async function reorder(kind, slugs) {
  const rows = slugs.map((slug, i) => ({ slug, sort_order: i }));
  await Promise.all(rows.map((r) =>
    supabase.from(TABLE[kind]).update({ sort_order: r.sort_order }).eq('slug', r.slug)
  ));
}
