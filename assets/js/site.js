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
    document.body.classList.toggle('nav-open', !expanded);
  });

  links.querySelectorAll('a').forEach((link) => {
    if (link.pathname === window.location.pathname) link.setAttribute('aria-current', 'page');
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      links.classList.remove('open');
      document.body.classList.remove('nav-open');
    });
  });
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

function initForms() {
  document.querySelectorAll('form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      const email = form.querySelector('input[type="email"][required]');
      if (email && !email.checkValidity()) {
        event.preventDefault();
        email.focus();
      }
    });
  });
}

function initTracking() {
  const params = new URLSearchParams(window.location.search);
  const utm = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
    .reduce((acc, key) => {
      const value = params.get(key);
      if (value) acc[key] = value;
      return acc;
    }, {});

  if (Object.keys(utm).length) {
    try {
      sessionStorage.setItem('syntony_utm', JSON.stringify(utm));
    } catch {}
  }

  document.querySelectorAll('a[href*="cal.com"]').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.plausible) window.plausible('Cal.com Click');
    });
  });

  if (window.location.pathname.startsWith('/services/')) {
    if (window.plausible) window.plausible('Service Page Visit');
  }

  if (window.location.pathname.startsWith('/research/')) {
    if (window.plausible) window.plausible('Research Page Visit');
  }
}

function initBreadcrumbSchema() {
  const breadcrumb = document.querySelector('.breadcrumb ol');
  if (!breadcrumb) return;
  const items = Array.from(breadcrumb.querySelectorAll('li')).map((li, index) => {
    const link = li.querySelector('a');
    return {
      '@type': 'ListItem',
      position: index + 1,
      name: li.textContent.trim(),
      item: link ? new URL(link.getAttribute('href'), window.location.origin).href : window.location.href
    };
  });
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items
  });
  document.head.appendChild(script);
}

(async function bootstrap() {
  await includePartials();
  initNavigation();
  initReveal();
  initFaq();
  initCalEmbed();
  initForms();
  initTracking();
  initBreadcrumbSchema();
})();
