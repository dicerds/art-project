import { supabase } from './supabase.js';

const form = document.getElementById('loginForm');
const emailEl = document.getElementById('email');
const passEl = document.getElementById('password');
const errEl = document.getElementById('loginErr');
const btn = document.getElementById('loginBtn');
const passToggle = document.getElementById('passToggle');

passToggle.addEventListener('click', () => {
  const show = passEl.type === 'password';
  passEl.type = show ? 'text' : 'password';
  passToggle.classList.toggle('is-on', show);
  passEl.focus();
});

const { data: { session } } = await supabase.auth.getSession();
if (session) window.location.replace('/');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errEl.textContent = '';
  btn.disabled = true; btn.textContent = 'Masuk…';
  const { error } = await supabase.auth.signInWithPassword({
    email: emailEl.value.trim(),
    password: passEl.value,
  });
  if (error) {
    errEl.textContent = 'Email atau kata sandi salah.';
    btn.disabled = false; btn.textContent = 'Masuk';
    return;
  }
  window.location.replace('/');
});
