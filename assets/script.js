// Menú móvil + banner cookies + anti-spam básico. Sin dependencias.
const nav = document.querySelector('.main-nav');
const toggle = document.querySelector('.nav-toggle');
if (toggle && nav) {
  const setMenu = (open) => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.textContent = open ? '✕' : '☰';
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); toggle.focus(); }
  });
}

// Header: estado "scrolled" al pasar el hero.
const header = document.querySelector('.site-header');
if (header) {
  const onScroll = () => header.toggleAttribute('data-scrolled', window.scrollY > 24);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });
}

// Reveal al scroll: una sola vez, sin pelear con el lector.
const revealEls = document.querySelectorAll('[data-reveal]');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.setAttribute('data-visible', ''); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.setAttribute('data-visible', ''));
}

// Cookies: solo recuerdo local, sin rastreo. Si el aviso está visible, sube el FAB.
try {
  const key = 'imsa-cookie-ok';
  const bar = document.getElementById('cookie-bar');
  if (bar && !localStorage.getItem(key)) {
    bar.hidden = false;
    document.documentElement.classList.add('has-cookiebar');
    const hide = (v) => {
      localStorage.setItem(key, v);
      bar.hidden = true;
      document.documentElement.classList.remove('has-cookiebar');
    };
    bar.querySelector('.ok').addEventListener('click', () => hide('1'));
    bar.querySelector('.no').addEventListener('click', () => hide('0'));
  }
} catch (e) { /* modo privado: no pasa nada */ }

// Formulario: valida y abre el email con los datos (sin backend, rapidísimo).
const form = document.getElementById('contact-form');
if (form) {
  const status = form.querySelector('.form-status');
  const sum = form.querySelector('[name="sum"]');
  const btn = form.querySelector('button[type="submit"]');
  let busy = false;
  const say = (msg, state) => {
    if (!status) return;
    status.textContent = msg;
    status.dataset.state = state;
  };
  if (sum) sum.addEventListener('input', () => say('', ''));
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    if (busy) return;
    const q = (n) => form.querySelector(`[name="${n}"]`).value.trim();
    if (sum && sum.value.trim() !== '17') {
      say('Revisa la suma anti-spam: 12 + 5 = 17.', 'error');
      sum.focus();
      return;
    }
    busy = true;
    if (btn) btn.disabled = true;
    say('Abriendo tu app de correo… Si no se abre, llámanos al +34 613 09 28 48 o usa WhatsApp.', 'info');
    const subject = encodeURIComponent('Contacto web IMSA Ruzafa — ' + q('nombre') + ' ' + q('apellidos'));
    const body = encodeURIComponent(`Nombre: ${q('nombre')} ${q('apellidos')}\nTeléfono: ${q('telefono')}\nEmail: ${q('email')}\n\n${q('mensaje')}`);
    location.href = `mailto:imsa.ruzafa@gmail.com?subject=${subject}&body=${body}`;
    setTimeout(() => { busy = false; if (btn) btn.disabled = false; }, 1500);
  });
}
