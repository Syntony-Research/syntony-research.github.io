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

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initAtmosphere() {
  if (prefersReducedMotion()) return;
  const canvas = document.createElement('canvas');
  canvas.id = 'atmosphere-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let tick = 0;
  const points = Array.from({ length: 72 }).map(() => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.45 + 0.25 }));

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };

  const draw = () => {
    tick += 0.004;
    ctx.clearRect(0, 0, width, height);
    const gradient = ctx.createRadialGradient(width * 0.72, height * 0.12, 40, width * 0.5, height * 0.25, Math.max(width, height));
    gradient.addColorStop(0, 'rgba(201,168,76,0.18)');
    gradient.addColorStop(0.45, 'rgba(58,86,128,0.09)');
    gradient.addColorStop(1, 'rgba(10,22,40,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    points.forEach((point, index) => {
      const pulse = 0.5 + Math.sin(tick * 4 + index * 0.73) * 0.5;
      ctx.beginPath();
      ctx.arc(point.x * width, point.y * height, point.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(10,22,40,${0.04 + pulse * 0.1})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });
  draw();
}

function initNavigation() {
  const nav = document.getElementById('site-nav');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.getElementById('primary-nav');
  const dropdown = document.querySelector('.nav-dropdown');
  const dropdownTrigger = dropdown?.querySelector('[aria-haspopup="true"]');
  if (!nav || !toggle || !links) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    const next = !expanded;
    toggle.setAttribute('aria-expanded', String(next));
    links.classList.toggle('open', next);
    document.body.classList.toggle('nav-open', next);
  });

  const setDropdownExpanded = (expanded) => {
    if (dropdownTrigger) dropdownTrigger.setAttribute('aria-expanded', String(expanded));
  };

  if (dropdown) {
    dropdown.addEventListener('mouseenter', () => setDropdownExpanded(true));
    dropdown.addEventListener('mouseleave', () => setDropdownExpanded(false));
    dropdown.addEventListener('focusin', () => setDropdownExpanded(true));
    dropdown.addEventListener('focusout', (event) => {
      if (!dropdown.contains(event.relatedTarget)) setDropdownExpanded(false);
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !links.classList.contains('open')) return;
    toggle.setAttribute('aria-expanded', 'false');
    links.classList.remove('open');
    document.body.classList.remove('nav-open');
    toggle.focus();
  });

  links.querySelectorAll('a').forEach((link) => {
    if (link.pathname === window.location.pathname) link.setAttribute('aria-current', 'page');
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      links.classList.remove('open');
      document.body.classList.remove('nav-open');
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab' || !links.classList.contains('open')) return;
    const focusables = Array.from(links.querySelectorAll('a, button')).filter((el) => !el.hasAttribute('disabled'));
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
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

function initMouseGlow() {
  if (prefersReducedMotion()) return;
  const glow = document.createElement('div');
  glow.className = 'mouse-glow';
  glow.setAttribute('aria-hidden', 'true');
  document.body.appendChild(glow);
  window.addEventListener('pointermove', (event) => {
    glow.style.transform = `translate3d(${event.clientX - 160}px, ${event.clientY - 160}px, 0)`;
  }, { passive: true });
}

function initTiltCards() {
  return;
}

function initHeroAbstracts() {
  if (prefersReducedMotion()) return;
  document.querySelectorAll('.page-hero, .hero').forEach((hero, index) => {
    const layer = document.createElement('div');
    layer.className = 'hero-abstract-layer';
    layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML = `
      <svg viewBox="0 0 1200 380" role="presentation" preserveAspectRatio="none">
        <defs>
          <linearGradient id="hgA${index}" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="rgba(201,168,76,0)"/>
            <stop offset="50%" stop-color="rgba(201,168,76,0.48)"/>
            <stop offset="100%" stop-color="rgba(201,168,76,0)"/>
          </linearGradient>
          <linearGradient id="hgB${index}" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="rgba(58,86,128,0)"/>
            <stop offset="50%" stop-color="rgba(58,86,128,0.38)"/>
            <stop offset="100%" stop-color="rgba(58,86,128,0)"/>
          </linearGradient>
        </defs>
        <path class="hero-wave hero-wave-a" stroke="url(#hgA${index})" d="M0,240 C160,170 280,310 420,230 C560,150 700,300 840,220 C980,140 1080,280 1200,210"/>
        <path class="hero-wave hero-wave-b" stroke="url(#hgB${index})" d="M0,270 C160,200 280,340 420,260 C560,180 700,330 840,250 C980,170 1080,310 1200,240"/>
      </svg>
    `;
    hero.appendChild(layer);
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
  // Cal.com embed is now handled by the official Cal SDK inline script
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

function initResonanceLab() {
  document.querySelectorAll('[data-resonance-lab]').forEach((panel) => {
    const ranges = Array.from(panel.querySelectorAll('input[type="range"]'));
    const scoreEl = panel.querySelector('[data-resonance-score]');
    const statusEl = panel.querySelector('[data-resonance-status]');
    const copyEl = panel.querySelector('[data-resonance-copy]');
    const visual = panel.querySelector('.resonance-visual');
    if (!ranges.length || !scoreEl || !statusEl || !copyEl || !visual) return;

    const update = () => {
      const values = Object.fromEntries(ranges.map((range) => [range.name, Number(range.value)]));
      ranges.forEach((range) => {
        const valueEl = panel.querySelector(`[data-resonance-value="${range.name}"]`);
        if (valueEl) valueEl.textContent = range.value;
      });

      const artifactNames = ['model card', 'eval log', 'incident log', 'rollback plan', 'owner map', 'monitoring plan'];
      const coverage = values.artifacts;
      const rights = values.rights;
      const launch = values.launch;
      const coverageRatio = coverage / 6;
      const readiness = Math.max(0, Math.min(100, Math.round((coverageRatio * 48) + ((rights / 5) * 22) + (Math.max(0, 1 - launch / 90) * 30))));
      const risk = 100 - readiness;
      const coveredArtifacts = artifactNames.slice(0, coverage);
      const missingArtifacts = artifactNames.slice(coverage);
      const drift = Math.max(1, Math.min(11, Math.round((launch / 12) + (5 - rights))));

      let status = 'Out of phase';
      let copy = `Coverage spans ${coverage}/6 artifacts, ${rights}/5 decision rights, and ${launch} days to launch. Add named owners and a tighter review loop before deployment pressure rises.`;
      if (readiness >= 74) {
        status = 'In phase';
        copy = `Coverage spans ${coverage}/6 artifacts (${coveredArtifacts.join(' · ')}), ${rights}/5 decision rights, and ${launch} days to launch. The evidence stack is workable if the review cadence holds.`;
      } else if (readiness >= 50) {
        status = 'Partially tuned';
        copy = `Coverage spans ${coverage}/6 artifacts, ${rights}/5 decision rights, and ${launch} days to launch. Missing: ${missingArtifacts.join(' · ')}. Close the gaps before the next release.`;
      }

      visual.style.setProperty('--resonance', Math.max(24, readiness));
      visual.style.setProperty('--drift', drift);
      scoreEl.textContent = String(risk);
      statusEl.textContent = status;
      copyEl.textContent = copy;
    };

    ranges.forEach((range) => range.addEventListener('input', update));
    update();
  });
}

function initSignalMatrix() {
  document.querySelectorAll('[data-signal-matrix]').forEach((panel) => {
    const ranges = Array.from(panel.querySelectorAll('input[type="range"]'));
    const scoreEl = panel.querySelector('[data-signal-score]');
    const statusEl = panel.querySelector('[data-signal-status]');
    const copyEl = panel.querySelector('[data-signal-copy]');
    const linkEl = panel.querySelector('[data-signal-link]');
    if (!ranges.length || !scoreEl || !statusEl || !copyEl) return;

    const update = () => {
      const values = Object.fromEntries(ranges.map((range) => [range.name, Number(range.value)]));
      ranges.forEach((range) => {
        const valueEl = panel.querySelector(`[data-range-value="${range.name}"]`);
        if (valueEl) valueEl.textContent = range.value;
      });
      const lagRatio = values.release / Math.max(1, values.review);
      const coverage = values.coverage;
      const coveredFunctions = ['Govern', 'Map', 'Measure', 'Manage'].slice(0, coverage);
      const coveredFunctionsText = coveredFunctions.length ? coveredFunctions.join(' · ') : 'none yet';
      const score = Math.max(0, Math.min(100, Math.round((lagRatio * 28) + ((4 - coverage) * 18) + (values.release > values.review ? 12 : 0))));
      let status = 'Monitoring';
      let copy = `Release cadence is ${values.release} days and review cadence is ${values.review} days. NIST AI RMF coverage spans ${coverage}/4 functions.`;
      let href = '/services/geopolitical-forecasting/';
      let label = 'Review the control map';
      if (score >= 75) {
        status = 'Executive escalation';
        copy = `Release cadence is ${lagRatio.toFixed(1)}x the review cadence, with ${coverage}/4 NIST AI RMF functions covered. The control loop is too slow for the current tempo.`;
        href = '/services/briefings/';
        label = 'Scope an executive briefing';
      } else if (score >= 48) {
        status = 'Focused diagnostic';
        copy = `Release cadence is ${lagRatio.toFixed(1)}x the review cadence, with ${coverage}/4 NIST AI RMF functions covered (${coveredFunctionsText}). Tighten the next review before exposure compounds.`;
        href = '/services/risk-advisory/';
        label = 'Start a risk diagnostic';
      } else {
        copy = `Release cadence is ${values.release} days, review cadence is ${values.review} days, and coverage spans ${coverage}/4 NIST AI RMF functions (${coveredFunctionsText}). The loop is reasonably aligned.`;
      }
      scoreEl.textContent = String(score);
      statusEl.textContent = status;
      copyEl.textContent = copy;
      if (linkEl) {
        linkEl.href = href;
        linkEl.textContent = label;
      }
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

function initPublicationLens() {
  const lenses = {
    question: ['What question does it answer?', 'How can reward-hacking mitigation be studied in a reproducible environment where objective design, learned approval, and agent behavior can be examined together?'],
    method: ['What was built?', 'The work extends the public MONA Camera Dropbox setup, emphasizes reproduction, and tests learned approval as part of the mitigation design space.'],
    implication: ['Why does it matter?', 'Safety claims become more useful when they are reproducible, environment-aware, and connected to mechanisms that can constrain reward-seeking behavior before deployment.']
  };

  document.querySelectorAll('[data-publication-lens]').forEach((panel) => {
    const chips = Array.from(panel.querySelectorAll('[data-lens]'));
    const title = panel.querySelector('[data-lens-title]');
    const copy = panel.querySelector('[data-lens-copy]');
    if (!chips.length || !title || !copy) return;

    const setLens = (key) => {
      const next = lenses[key] || lenses.question;
      chips.forEach((chip) => chip.classList.toggle('active', chip.dataset.lens === key));
      title.textContent = next[0];
      copy.textContent = next[1];
    };

    chips.forEach((chip) => chip.addEventListener('click', () => setLens(chip.dataset.lens)));
    setLens(chips[0].dataset.lens);
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
  initAtmosphere();
  initNavigation();
  initMouseGlow();
  initReveal();
  initFaq();
  initHeroAbstracts();
  initCalEmbed();
  initForms();
  initTracking();
  initBreadcrumbSchema();
  initResonanceLab();
  initSignalMatrix();
  initPublicationLens();
  initServiceRecommender();
  initForecastLab();
})();
