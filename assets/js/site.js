async function includePartials() {
  const nodes = document.querySelectorAll('[data-include]');
  await Promise.all(Array.from(nodes).map(async (node) => {
    const path = node.getAttribute('data-include');
    try {
      const response = await fetch(path);
      node.innerHTML = await response.text();
    } catch {
      node.innerHTML = '';
    }
  }));
}

function initAtmosphere() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.createElement('canvas');
  canvas.id = 'atmosphere-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let w = 0;
  let h = 0;
  let t = 0;
  const stars = Array.from({ length: 64 }).map(() => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.6 + 0.2 }));

  const resize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const draw = () => {
    t += 0.004;
    ctx.clearRect(0, 0, w, h);
    const g = ctx.createRadialGradient(w * 0.72, h * 0.1, 40, w * 0.5, h * 0.2, Math.max(w, h));
    g.addColorStop(0, 'rgba(212,163,115,0.16)');
    g.addColorStop(0.4, 'rgba(107,159,212,0.09)');
    g.addColorStop(1, 'rgba(11,13,18,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    stars.forEach((s, i) => {
      const pulse = 0.5 + Math.sin(t * 4 + i * 0.8) * 0.5;
      ctx.beginPath();
      ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(242,240,235,${0.08 + pulse * 0.15})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  };
  draw();
}

function initNavigation() {
  const nav = document.getElementById('site-nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.getElementById('primary-nav');
  if (!nav || !toggle || !links) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    links.classList.toggle('open');
  });
}

function initMouseGlow() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const glow = document.createElement('div');
  glow.className = 'mouse-glow';
  glow.setAttribute('aria-hidden', 'true');
  document.body.appendChild(glow);
  window.addEventListener('pointermove', (e) => {
    glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  }, { passive: true });
}

function initReveal() {
  const revealItems = document.querySelectorAll('.reveal');
  if (!revealItems.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  revealItems.forEach((el) => observer.observe(el));
}

function initTiltCards() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.service-card, .method-item, .eng-card, .scenario-card, .case-study').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - y) * 5;
      const ry = (x - 0.5) * 7;
      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

function initFaq() {
  document.querySelectorAll('.faq-question').forEach((button) => {
    button.addEventListener('click', () => {
      const parent = button.closest('.faq-item');
      if (parent) parent.classList.toggle('open');
    });
  });
}

function initCalEmbed() {
  const frame = document.querySelector('[data-cal-frame]');
  if (!frame) return;
  const buttons = document.querySelectorAll('[data-cal-link]');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const link = btn.getAttribute('data-cal-link');
      if (!link) return;
      frame.setAttribute('src', link);
      buttons.forEach((item) => item.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function initCountUp() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    counters.forEach((el) => { el.textContent = el.dataset.count || '0'; });
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = entry.target;
      const max = Number(target.getAttribute('data-count') || 0);
      let current = 0;
      const step = Math.max(1, Math.ceil(max / 40));
      const timer = window.setInterval(() => {
        current += step;
        if (current >= max) {
          target.textContent = String(max);
          window.clearInterval(timer);
          return;
        }
        target.textContent = String(current);
      }, 24);
      observer.unobserve(target);
    });
  }, { threshold: 0.5 });
  counters.forEach((el) => observer.observe(el));
}

function initHeroAbstracts() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.page-hero, .hero').forEach((hero) => {
    const layer = document.createElement('div');
    layer.className = 'hero-abstract-layer';
    layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML = `
      <svg viewBox="0 0 1200 380" role="presentation">
        <defs>
          <linearGradient id="hgA" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="rgba(212,163,115,0.0)"/>
            <stop offset="50%" stop-color="rgba(212,163,115,0.55)"/>
            <stop offset="100%" stop-color="rgba(212,163,115,0.0)"/>
          </linearGradient>
          <linearGradient id="hgB" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="rgba(107,159,212,0.0)"/>
            <stop offset="50%" stop-color="rgba(107,159,212,0.45)"/>
            <stop offset="100%" stop-color="rgba(107,159,212,0.0)"/>
          </linearGradient>
        </defs>
        <path class="hero-wave hero-wave-a" d="M0,240 C160,170 280,310 420,230 C560,150 700,300 840,220 C980,140 1080,280 1200,210"/>
        <path class="hero-wave hero-wave-b" d="M0,270 C160,200 280,340 420,260 C560,180 700,330 840,250 C980,170 1080,310 1200,240"/>
      </svg>
    `;
    hero.appendChild(layer);
  });
}

function initLogoCarousel() {
  const root = document.querySelector('[data-logo-carousel]');
  if (!root) return;
  const track = root.querySelector('[data-carousel-track]');
  const prev = root.querySelector('[data-carousel-prev]');
  const next = root.querySelector('[data-carousel-next]');
  if (!track || !prev || !next) return;

  const slides = Array.from(track.querySelectorAll('img'));
  if (!slides.length) return;
  let index = 0;
  let timer = 0;

  const step = () => {
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === index);
    });
  };
  const go = (dir) => {
    index = (index + dir + slides.length) % slides.length;
    step();
  };
  const start = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = window.setInterval(() => go(1), 2400);
  };
  const stop = () => window.clearInterval(timer);

  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  step();
  start();
}

(async function bootstrap() {
  await includePartials();
  initAtmosphere();
  initMouseGlow();
  initNavigation();
  initReveal();
  initTiltCards();
  initFaq();
  initCalEmbed();
  initCountUp();
  initHeroAbstracts();
  initLogoCarousel();
})();
