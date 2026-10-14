// Menu móvil + banner cookies + anti-spam básico. Sin dependencias.
const nav = document.querySelector('.main-nav');
const toggle = document.querySelector('.nav-toggle');
if (toggle && nav) toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});

// Cookies: solo recuerdo local, sin rastreo.
try {
  const key = 'imsa-cookie-ok';
  const bar = document.getElementById('cookie-bar');
  if (bar && !localStorage.getItem(key)) {
    bar.hidden = false;
    bar.querySelector('.ok').addEventListener('click', () => { localStorage.setItem(key, '1'); bar.hidden = true; });
    bar.querySelector('.no').addEventListener('click', () => { localStorage.setItem(key, '0'); bar.hidden = true; });
  }
} catch (e) { /* modo privado: no pasa nada */ }

// Formulario: valida y abre el email con los datos (sin backend, rapidísimo).
const form = document.getElementById('contact-form');
if (form) form.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const q = (n) => form.querySelector(`[name="${n}"]`).value.trim();
  const sum = form.querySelector('[name="sum"]');
  if (sum && sum.value.trim() !== '17') { alert('Revisa la suma anti-spam (12 + 5 = 17).'); sum.focus(); return; }
  const subject = encodeURIComponent('Contacto web IMSA Ruzafa — ' + q('nombre') + ' ' + q('apellidos'));
  const body = encodeURIComponent(`Nombre: ${q('nombre')} ${q('apellidos')}\nTeléfono: ${q('telefono')}\nEmail: ${q('email')}\n\n${q('mensaje')}`);
  location.href = `mailto:imsa.ruzafa@gmail.com?subject=${subject}&body=${body}`;
});
