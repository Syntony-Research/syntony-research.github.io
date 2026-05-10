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

function initSignalMatrix() {
  document.querySelectorAll('[data-signal-matrix]').forEach((panel) => {
    const ranges = Array.from(panel.querySelectorAll('input[type="range"]'));
    const scoreEl = panel.querySelector('[data-signal-score]');
    const statusEl = panel.querySelector('[data-signal-status]');
    const copyEl = panel.querySelector('[data-signal-copy]');
    if (!ranges.length || !scoreEl || !statusEl || !copyEl) return;

    const update = () => {
      const values = ranges.map((range) => Number(range.value));
      ranges.forEach((range) => {
        const valueEl = panel.querySelector(`[data-range-value="${range.name}"]`);
        if (valueEl) valueEl.textContent = range.value;
      });
      const score = Math.round((values[0] * 0.38 + values[1] * 0.34 + values[2] * 0.28) * 10);
      let status = 'Watch';
      let copy = 'Maintain monitoring cadence and define the next review trigger.';
      if (score >= 75) {
        status = 'Escalate';
        copy = 'Decision tempo is likely behind the risk environment. Use executive review, scenario planning, and explicit intervention thresholds.';
      } else if (score >= 48) {
        status = 'Pressure building';
        copy = 'Governance, forecasting, and monitoring should be synchronized before emerging technology exposure compounds.';
      }
      scoreEl.textContent = String(score);
      statusEl.textContent = status;
      copyEl.textContent = copy;
    };

    ranges.forEach((range) => range.addEventListener('input', update));
    update();
  });
}

function initServiceRecommender() {
  document.querySelectorAll('[data-service-recommender]').forEach((panel) => {
    const chips = Array.from(panel.querySelectorAll('[data-recommend]'));
    const title = panel.querySelector('[data-recommend-title]');
    const copy = panel.querySelector('[data-recommend-copy]');
    const link = panel.querySelector('[data-recommend-link]');
    const recommendations = {
      testing: ['Adversarial Evaluation', 'Stress-test models, tools, and deployment workflows before risk becomes operational.', '/services/red-teaming/'],
      governance: ['Governance Advisory', 'Clarify decision rights, controls, escalation paths, and oversight evidence.', '/services/governance/'],
      geopolitics: ['Geopolitical Forecasting', 'Track how emerging technology, state competition, regulation, and crisis dynamics affect your decisions.', '/services/geopolitical-forecasting/'],
      executive: ['Executive Briefings', 'Align leaders quickly around a decision-grade risk picture and next actions.', '/services/briefings/'],
      writing: ['Technical Writing', 'Turn complex evaluation or policy work into documents people can actually use.', '/services/technical-writing/']
    };

    const setRecommendation = (key) => {
      const next = recommendations[key] || recommendations.testing;
      chips.forEach((chip) => chip.classList.toggle('active', chip.dataset.recommend === key));
      if (title) title.textContent = next[0];
      if (copy) copy.textContent = next[1];
      if (link) {
        link.href = next[2];
        link.textContent = `Explore ${next[0]}`;
      }
    };

    chips.forEach((chip) => chip.addEventListener('click', () => setRecommendation(chip.dataset.recommend)));
    setRecommendation(chips[0]?.dataset.recommend || 'testing');
  });
}

function initForecastLab() {
  document.querySelectorAll('[data-forecast-lab]').forEach((panel) => {
    const selects = Array.from(panel.querySelectorAll('select'));
    const status = panel.querySelector('[data-forecast-status]');
    const copy = panel.querySelector('[data-forecast-copy]');
    if (!selects.length || !status || !copy) return;

    const update = () => {
      const [region, tech, horizon] = selects.map((select) => select.value);
      const horizonText = horizon === 'near' ? '0-6 months' : horizon === 'mid' ? '6-18 months' : '18-36 months';
      status.textContent = `${tech} · ${region} · ${horizonText}`;
      copy.textContent = `Priority watchpoints: policy moves, supply-chain chokepoints, capital restrictions, standards competition, and dual-use adoption signals in ${region}. Forecasting should tie each signal to a decision trigger, not just a trend note.`;
    };

    selects.forEach((select) => select.addEventListener('change', update));
    update();
  });
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
  initSignalMatrix();
  initServiceRecommender();
  initForecastLab();
})();
