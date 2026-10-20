// Menú móvil + banner cookies + anti-spam + stats count-up. Sin dependencias.
const nav = document.querySelector('.main-nav');
const toggle = document.querySelector('.nav-toggle');
if (toggle && nav) {
  const setMenu = (open) => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.textContent = open ? '✕' : '☰';
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };
  toggle.addEventListener('click', (e) => { e.stopPropagation(); setMenu(!nav.classList.contains('open')); });
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('open') && !nav.contains(e.target) && e.target !== toggle) setMenu(false);
  });
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

// Cookies: solo recuerdo local, sin rastreo.
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

// Stats count-up (solo números enteros con data-count).
const countEls = document.querySelectorAll('[data-count]');
if ('IntersectionObserver' in window && countEls.length) {
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      if (isNaN(target)) { cio.unobserve(el); return; }
      const dur = 900;
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased);
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      cio.unobserve(el);
    });
  }, { threshold: 0.4 });
  countEls.forEach((el) => cio.observe(el));
}

// Formulario: valida y abre el email; estado inline + fallbacks (sin alert).
const form = document.getElementById('contact-form');
if (form) {
  const status = form.querySelector('.form-status');
  const sum = form.querySelector('[name="sum"]');
  const btn = form.querySelector('button[type="submit"]');
  let busy = false;
  const say = (msg, state) => {
    if (!status) return;
    status.textContent = msg;
    status.dataset.state = state || '';
  };
  if (sum) sum.addEventListener('input', () => say('', ''));
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    if (busy) return;
    const q = (n) => { const el = form.querySelector(`[name="${n}"]`); return el ? el.value.trim() : ''; };
    if (sum && sum.value.trim() !== '17') {
      say('Revisa la suma anti-spam: 12 + 5 = 17.', 'error');
      sum.focus();
      sum.setAttribute('aria-invalid', 'true');
      return;
    }
    if (sum) sum.removeAttribute('aria-invalid');
    busy = true;
    if (btn) btn.disabled = true;
    say('Abriendo tu app de correo… Si no se abre, llámanos al +34 613 09 28 48 o usa WhatsApp.', 'info');
    const subject = encodeURIComponent('Contacto web IMSA Ruzafa — ' + q('nombre') + ' ' + q('apellidos'));
    const body = encodeURIComponent(`Nombre: ${q('nombre')} ${q('apellidos')}\nTeléfono: ${q('telefono')}\nEmail: ${q('email')}\n\n${q('mensaje')}`);
    location.href = `mailto:imsa.ruzafa@gmail.com?subject=${subject}&body=${body}`;
    setTimeout(() => { busy = false; if (btn) btn.disabled = false; }, 1500);
  });
}

// Formulario colapsable (contacto): toggle panel.
const formToggle = document.querySelector('.form-toggle');
const formPanel = document.querySelector('.form-panel');
if (formToggle && formPanel) {
  formToggle.addEventListener('click', () => {
    const open = formPanel.classList.toggle('open');
    formToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    formToggle.querySelector('.ft-label').textContent = open ? 'Ocultar formulario' : 'Enviar un mensaje por email';
  });
}

// ---------- Efectos 3D ligeros: tilt, parallax y partículas ----------
const reducedMotion = matchMedia('(prefers-reduced-motion:reduce)').matches;
const finePointer = matchMedia('(hover:hover) and (pointer:fine)').matches;

// Tilt 3D en tarjetas (solo puntero fino; en móvil no se aplica).
if (!reducedMotion && finePointer) {
  document.querySelectorAll('.rev, .team-card, .hcard, .ccard').forEach((el) => {
    el.classList.add('tilt');
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform =
        `perspective(900px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 7).toFixed(2)}deg) translateY(-4px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

// Parallax suave en la foto del hero (solo puntero fino).
if (!reducedMotion && finePointer) {
  const heroSec = document.querySelector('.hero');
  const heroImg = document.querySelector('.hero-media img');
  if (heroSec && heroImg) {
    let ticking = false;
    const updateParallax = () => {
      const r = heroSec.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) {
        const p = Math.max(-1, Math.min(1, r.top / innerHeight));
        heroImg.style.transform = `translateY(${(p * 26).toFixed(1)}px) scale(1.08)`;
      }
      ticking = false;
    };
    addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(updateParallax); }
    }, { passive: true });
    updateParallax();
  }
}

// Partículas flotantes en secciones oscuras (canvas propio, sin dependencias).
if (!reducedMotion) {
  document.querySelectorAll('.hero, .stats-band, .honesty, .page-hero, .section-dark').forEach((section) => {
    const cv = document.createElement('canvas');
    cv.className = 'particles';
    cv.setAttribute('aria-hidden', 'true');
    section.prepend(cv);
    const ctx = cv.getContext('2d');
    const count = finePointer ? 34 : 16;
    let w = 0, h = 0, parts = [], raf = 0, running = false;
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = section.clientWidth; h = section.clientHeight;
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      cv.style.width = w + 'px'; cv.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const seed = () => {
      parts = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2.6 + 1.1,
        vx: (Math.random() - 0.5) * 0.14,
        vy: -(Math.random() * 0.16 + 0.03),
        a: Math.random() * 0.35 + 0.15,
        g: Math.random() < 0.22
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -6) { p.y = h + 6; p.x = Math.random() * w; }
        if (p.x < -6) p.x = w + 6;
        else if (p.x > w + 6) p.x = -6;
        ctx.beginPath();
        ctx.fillStyle = p.g ? `rgba(126,217,87,${p.a})` : `rgba(255,255,255,${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((es) => {
        es.forEach((e) => {
          if (e.isIntersecting && !running) { running = true; resize(); seed(); raf = requestAnimationFrame(draw); }
          else if (!e.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
        });
      }, { threshold: 0 });
      io.observe(section);
    }
    addEventListener('resize', () => { if (running) { resize(); seed(); } }, { passive: true });
  });
}
