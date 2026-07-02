import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 'https://ozclqphizbgdmsxhxgis.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_J9BgpqI6IO8umdLrN-DCPA_SlAe2oai';
export const MEDIA_BUCKET = 'media';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'architekta-admin-auth',
  },
});

export function mediaUrl(path) {
  if (!path) return '';
  if (/^(https?:)?\/\//.test(path) || path.startsWith('/')) return path;
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

export function currentPageKey() {
  let p = window.location.pathname.replace(/\/+$/, '');
  if (p === '' || p === '/index.html') return 'home';
  const file = p.split('/').pop() || 'home';
  return file.replace(/\.html$/, '') || 'home';
}
