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
      writing: ['Technical Writing', 'Turn complex evaluation or policy work into documents people can actually use.', '/services/technical-writing/'],
      transformation: ['Strategic Risk Advisory + Executive Briefings', 'Map which product lines are defensible against foundational model displacement, design an integration strategy, and build the board-ready transformation case.', '/services/risk-advisory/']
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

const PAGE_VISUALS = {
  '/services/': {
    mode: 'cards',
    kicker: 'Service atlas',
    title: 'Seven service lines, one operating picture',
    intro: 'The portfolio is easier to use when each lane shows the decision it supports, the evidence it needs, and the output it produces.',
    cards: [
      {
        title: 'Evaluation first',
        copy: 'Adversarial testing, safety research, and methods work show up early in the cycle, before governance decisions lock in.',
        points: ['Red teaming', 'Method design', 'Evidence synthesis']
      },
      {
        title: 'Governance and risk',
        copy: 'Controls, ownership, and escalation need to be visible before product tempo outruns review.',
        points: ['Decision rights', 'Escalation paths', 'Board readiness']
      },
      {
        title: 'External pressure',
        copy: 'Forecasting and briefings connect emerging technology change to regulation, supply chains, and leadership timing.',
        points: ['Geopolitics', 'Executive briefings', 'Decision triggers']
      }
    ]
  },
  '/services/red-teaming/': {
    mode: 'cards',
    kicker: 'Adversarial map',
    title: 'Where the system usually breaks first',
    intro: 'The useful question is not whether a model fails. It is which access path, tool chain, or workflow breaks under pressure.',
    cards: [
      {
        title: 'Attack surface',
        copy: 'Prompting, tool use, memory, retrieval, and output handling are mapped together so testing stays close to real workflows.',
        points: ['Prompt flow', 'Tool calls', 'Memory', 'Retrieval']
      },
      {
        title: 'Evidence',
        copy: 'Findings are captured in a form operators can replay, audit, and hand to the next owner.',
        points: ['Repro steps', 'Severity', 'Confidence', 'Artifacts']
      },
      {
        title: 'Remediation',
        copy: 'The output is a ranked set of fixes, not a decorative score.',
        points: ['Controls', 'Owners', 'Rollback', 'Monitoring']
      }
    ]
  },
  '/services/governance/': {
    mode: 'cards',
    kicker: 'Control map',
    title: 'Who owns the decision, and what happens when it changes',
    intro: 'Governance work becomes concrete when decision rights, controls, and escalation points are visible together.',
    cards: [
      {
        title: 'Decision rights',
        copy: 'Map who can approve, pause, escalate, or override AI-related decisions.',
        points: ['Product', 'Safety', 'Legal', 'Executive']
      },
      {
        title: 'Control stack',
        copy: 'Connect evaluation evidence to policy language, review cadence, and operating procedures.',
        points: ['Policy', 'Review loop', 'Escalation', 'Audit trail']
      },
      {
        title: 'Implementation',
        copy: 'Turn the governance memo into a working sequence the team can actually run.',
        points: ['Owners', 'Cadence', 'Backlog', 'Board packet']
      }
    ]
  },
  '/services/risk-advisory/': {
    mode: 'cards',
    kicker: 'Risk horizon',
    title: 'What changes if the deployment pace stays the same',
    intro: 'Risk advisory is most useful when it ties exposure, scenario moves, and decision timing to one view.',
    cards: [
      {
        title: 'Exposure',
        copy: 'Name the systems, functions, and dependencies that would change the risk posture if the model surface expands.',
        points: ['Product lines', 'Partners', 'Regulators']
      },
      {
        title: 'Scenario',
        copy: 'Track the external events that would actually move the plan.',
        points: ['Regulation', 'Supply chain', 'Incidents']
      },
      {
        title: 'Decision',
        copy: 'Show when leadership needs to act, not just what might happen later.',
        points: ['Thresholds', 'Owners', 'Dates']
      }
    ]
  },
  '/services/safety-research/': {
    mode: 'cards',
    kicker: 'Method stack',
    title: 'A cleaner path from question to evidence',
    intro: 'Safety research gets legible when protocols, metrics, and interpretation live in the same frame.',
    cards: [
      {
        title: 'Protocol',
        copy: 'Start with a measurement plan that states what is being tested and what is not.',
        points: ['Question', 'Assumptions', 'Limits']
      },
      {
        title: 'Metrics',
        copy: 'Use metrics that can survive review, reruns, and disagreement.',
        points: ['Definitions', 'Failure modes', 'Caveats']
      },
      {
        title: 'Evidence',
        copy: 'Synthesis should make it easy to brief a researcher or an executive without changing the facts.',
        points: ['Memo', 'Appendix', 'Next test']
      }
    ]
  },
  '/services/briefings/': {
    mode: 'cards',
    kicker: 'Briefing room',
    title: 'Short sessions with a clear output',
    intro: 'Briefings work best when the audience, the question, and the next action are visible before the meeting starts.',
    cards: [
      {
        title: 'Audience',
        copy: 'Board, C-suite, policy team, or cross-functional group.',
        points: ['Directors', 'Leaders', 'Operators']
      },
      {
        title: 'Session',
        copy: 'Use a short, tailored deck and a live discussion focused on decisions.',
        points: ['Pre-read', 'Facilitation', 'Q&A']
      },
      {
        title: 'Follow-up',
        copy: 'Leave with a decision log and a small set of concrete next steps.',
        points: ['Actions', 'Owners', 'Dates']
      }
    ]
  },
  '/services/research/': {
    mode: 'cards',
    kicker: 'Research frame',
    title: 'A narrow question, a clean evidence trail',
    intro: 'Custom research works when the question, evidence standard, and final use are pinned down early.',
    cards: [
      {
        title: 'Question',
        copy: 'Translate the request into something specific enough to answer.',
        points: ['Scope', 'Audience', 'Decision']
      },
      {
        title: 'Evidence',
        copy: 'Separate fact, inference, and judgment so the result can be reused.',
        points: ['Sources', 'Notes', 'Bibliography']
      },
      {
        title: 'Synthesis',
        copy: 'Package the work as a memo, briefing, or appendix depending on who needs it.',
        points: ['Memo', 'Deck', 'Appendix']
      }
    ]
  },
  '/services/technical-writing/': {
    mode: 'cards',
    kicker: 'Clarity layer',
    title: 'Make the work readable without flattening it',
    intro: 'Technical writing should make the logic easier to follow, not just shorter.',
    cards: [
      {
        title: 'Structure',
        copy: 'Rebuild long drafts into a sequence people can scan and trust.',
        points: ['Headings', 'Order', 'Flow']
      },
      {
        title: 'Language',
        copy: 'Replace jargon with plain language where the meaning stays intact.',
        points: ['Plain terms', 'Active voice', 'Shorter lines']
      },
      {
        title: 'Delivery',
        copy: 'Prepare the final version for the audience that actually has to use it.',
        points: ['Report', 'Brief', 'Website']
      }
    ]
  },
  '/services/geopolitical-forecasting/': {
    mode: 'geo',
    kicker: 'Geopolitical signal map',
    title: 'Where emerging technology pressure shows up first',
    intro: 'Use the map to move from vague horizon scanning to the actual regions where export controls, standards fights, capital flows, and conflict spillovers change the forecast.',
    regions: [
      {
        id: 'united-states',
        name: 'United States',
        lon: -98,
        lat: 39,
        note: 'Export controls, frontier labs, chip policy, cloud capex, and procurement timing.',
        signals: ['Export controls', 'Cloud buildout', 'Model deployment']
      },
      {
        id: 'europe',
        name: 'Europe',
        lon: 10,
        lat: 50,
        note: 'AI Act implementation, conformity work, and standards politics.',
        signals: ['AI Act guidance', 'Standards votes', 'Procurement rules']
      },
      {
        id: 'china',
        name: 'China',
        lon: 104,
        lat: 35,
        note: 'Domestic scaling, industrial policy, compute access, and standards alignment.',
        signals: ['Compute access', 'Industrial policy', 'Standards']
      },
      {
        id: 'taiwan',
        name: 'Taiwan',
        lon: 121,
        lat: 24,
        note: 'Foundry concentration and supply-chain continuity.',
        signals: ['Wafer starts', 'Shipping risk', 'Inventory buffers']
      },
      {
        id: 'japan-korea',
        name: 'Japan and Korea',
        lon: 136,
        lat: 37,
        note: 'Memory supply, equipment, and alliance coordination.',
        signals: ['HBM capacity', 'Tool exports', 'Bilateral controls']
      },
      {
        id: 'india',
        name: 'India',
        lon: 78,
        lat: 22,
        note: 'Diffusion, digital infrastructure, talent, and data policy.',
        signals: ['Digital public infra', 'Model adoption', 'Data rules']
      },
      {
        id: 'gulf',
        name: 'Gulf states',
        lon: 48,
        lat: 24,
        note: 'Sovereign capital, compute investment, and regional AI platforms.',
        signals: ['Data centers', 'Investment deals', 'Partnerships']
      },
      {
        id: 'asean',
        name: 'Southeast Asia',
        lon: 108,
        lat: 12,
        note: 'Manufacturing shifts, cloud expansion, and regulatory alignment.',
        signals: ['Factory relocation', 'Cloud regions', 'Cross-border rules']
      },
      {
        id: 'latin-america',
        name: 'Latin America',
        lon: -58,
        lat: -18,
        note: 'Digital infrastructure, public-sector adoption, and energy constraints.',
        signals: ['Procurement', 'Energy costs', 'Regional governance']
      }
    ]
  },
  '/research/': {
    mode: 'cards',
    kicker: 'Research map',
    title: 'Reports, verified papers, and the topics behind them',
    intro: 'The research page separates original Syntony reports, verified papers, and external references so the record stays clear.',
    cards: [
      {
        title: 'Original reports',
        copy: 'Syntony reports turn emerging-technology risk into concrete governance questions, evidence standards, and decision artifacts.',
        points: ['PDF', 'Governance lag', 'Decision use']
      },
      {
        title: 'Related reading',
        copy: 'Reference papers that shape the service work can sit beside the publication record without being mislabelled.',
        points: ['RedAgent', 'Evaluation', 'Red teaming']
      },
      {
        title: 'Research areas',
        copy: 'The site focuses on evaluation methodology, governance lag, risk characterization, and framework design.',
        points: ['Method', 'Governance', 'Frameworks']
      }
    ]
  },
  '/research/governance-lag-europe/': {
    mode: 'cards',
    kicker: 'Report frame',
    title: 'Governance lag is an organizational problem',
    intro: 'The report tracks the gap between fast AI-enabled deployment and slow institutional oversight across European defence, energy, finance, and public health.',
    cards: [
      {
        title: 'Screen',
        copy: 'The Governance Lag Screen compares release cadence, review cadence, and coverage of Govern, Map, Measure, and Manage.',
        points: ['Cadence', 'NIST AI RMF', 'Coverage']
      },
      {
        title: 'Pattern',
        copy: 'European institutions usually have rules and risk maps. The weaker functions are operational measurement and active management.',
        points: ['Measure', 'Manage', 'Feedback']
      },
      {
        title: 'Use',
        copy: 'The practical output is an evidence register that ties findings to owners, confidence, severity, and governance triggers.',
        points: ['Evidence', 'Owners', 'Triggers']
      }
    ]
  },
  '/research/mona-camera-dropbox/': {
    mode: 'cards',
    kicker: 'Paper frame',
    title: 'A reproducible extension, not a claim without evidence',
    intro: 'The paper matters because it shows what can be reproduced, what changed, and what the evidence actually supports.',
    cards: [
      {
        title: 'Question',
        copy: 'What happens when learned approval is studied inside a public environment that can be reproduced?',
        points: ['Reproduction', 'Approval', 'Reward hacking']
      },
      {
        title: 'Method',
        copy: 'The paper leans on public artifacts and testable runs instead of vague summary claims.',
        points: ['Public setup', 'Tracked runs', 'Artifacts']
      },
      {
        title: 'Use',
        copy: 'It is a useful example of how to turn evaluation work into readable evidence.',
        points: ['Interpretation', 'Governance', 'Next test']
      }
    ]
  },
  '/research/red-agent/': {
    mode: 'cards',
    kicker: 'External paper',
    title: 'A real reference for context-aware red teaming',
    intro: 'RedAgent is relevant here because it maps directly to the site’s adversarial evaluation work. It should be read as an external paper, not a Syntony-authored publication.',
    cards: [
      {
        title: 'Paper',
        copy: 'RedAgent: Red Teaming Large Language Models with Context-aware Autonomous Language Agent.',
        points: ['arXiv:2407.16667', '2024', 'External']
      },
      {
        title: 'What it adds',
        copy: 'The paper studies context-aware jailbreak strategies with an autonomous agent rather than a fixed prompt list.',
        points: ['Context', 'Autonomy', 'Red teaming']
      },
      {
        title: 'Why it sits here',
        copy: 'It is a strong reference point for anyone trying to understand adversarial evaluation in practice.',
        points: ['Evidence', 'Attack design', 'Operational relevance']
      }
    ]
  },
  '/about/': {
    mode: 'cards',
    kicker: 'About the firm',
    title: 'Why Syntony exists',
    intro: 'The firm sits at the gap between what AI systems can do and what institutions can safely own, review, and explain.',
    cards: [
      {
        title: 'Mission',
        copy: 'Turn technical signal into decisions people can carry through governance, policy, and operations.',
        points: ['Clarity', 'Evidence', 'Action']
      },
      {
        title: 'Method',
        copy: 'Work is built around empirical checks, clean writing, and practical controls.',
        points: ['Testing', 'Synthesis', 'Controls']
      },
      {
        title: 'Affiliations',
        copy: 'The public network around the firm gives the work broader context without turning it into noise.',
        points: ['Truman', 'BlueDot', 'Hertog', 'CSET']
      }
    ]
  },
  '/about/founder/': {
    mode: 'cards',
    kicker: 'Founder profile',
    title: 'A short timeline of the work behind the firm',
    intro: 'The founder page should show the path, the current role, and the public references that are actually real.',
    cards: [
      {
        title: 'Current role',
        copy: 'Founder and Chief Scientist at Syntony Research.',
        points: ['Research', 'Advisory', 'Writing']
      },
      {
        title: 'Background',
        copy: 'Experience spans research, red teaming, and policy-adjacent work across national security and AI safety contexts.',
        points: ['Research', 'Red teaming', 'Policy']
      },
      {
        title: 'Public work',
        copy: 'The public record should point to real papers, real talks, and verifiable affiliations.',
        points: ['arXiv', 'Speaking', 'Affiliations']
      }
    ]
  },
  '/insights/': {
    mode: 'cards',
    kicker: 'Insights hub',
    title: 'Short notes, long questions, and a feed people can follow',
    intro: 'The commentary page should behave like a proper reading hub, not a pile of teaser cards.',
    cards: [
      {
        title: 'Topics',
        copy: 'Track governance lag, evaluation design, strategic risk, and publication notes.',
        points: ['Governance', 'Evaluation', 'Risk']
      },
      {
        title: 'Format',
        copy: 'Keep posts short enough to read and specific enough to use.',
        points: ['Essay', 'Brief', 'Note']
      },
      {
        title: 'Distribution',
        copy: 'Use RSS and Substack so the page is a real entry point instead of a dead end.',
        points: ['RSS', 'Substack', 'Newsletter']
      }
    ]
  },
  '/work/': {
    mode: 'cards',
    kicker: 'Engagement map',
    title: 'A cleaner way to show what the firm does',
    intro: 'Case studies are more useful when they show the problem, the approach, and the outcome in one place.',
    cards: [
      {
        title: 'Industry',
        copy: 'Anonymized by sector, not by meaning.',
        points: ['Tech', 'Defense', 'Finance']
      },
      {
        title: 'Work type',
        copy: 'Evaluation, governance, forecasting, briefings, and research need separate presentation.',
        points: ['Memo', 'Workshop', 'Advisory']
      },
      {
        title: 'Outcome',
        copy: 'Show what changed after the work landed.',
        points: ['Decision', 'Control', 'Plan']
      }
    ]
  },
  '/contact/': {
    mode: 'cards',
    kicker: 'Contact paths',
    title: 'Three ways to reach the firm',
    intro: 'Make the next step obvious: email, phone, or a booking link that works on mobile.',
    cards: [
      {
        title: 'Email',
        copy: 'hello@syntonyresearch.org',
        points: ['Fastest route', 'Written scope', 'Attachments']
      },
      {
        title: 'Phone',
        copy: '828-418-7587',
        points: ['Direct call', 'Scheduling', 'Urgent follow-up']
      },
      {
        title: 'Location',
        copy: 'Research Triangle, NC',
        points: ['Local', 'Virtual', 'On-site']
      }
    ]
  },
  '/privacy/': {
    mode: 'cards',
    kicker: 'Policy map',
    title: 'What the site collects and why',
    intro: 'A legal page is easier to use when it tells you what matters in one glance.',
    cards: [
      {
        title: 'Data',
        copy: 'Only the information needed to reply to inquiries and operate the site.',
        points: ['Form input', 'Email', 'Analytics']
      },
      {
        title: 'Use',
        copy: 'Responses, scheduling, site reliability, and basic measurement.',
        points: ['Reply', 'Book', 'Improve']
      },
      {
        title: 'Contact',
        copy: 'hello@syntonyresearch.org',
        points: ['Questions', 'Deletion', 'Access']
      }
    ]
  },
  '/terms/': {
    mode: 'cards',
    kicker: 'Terms map',
    title: 'How the site and services are used',
    intro: 'This page should point users toward the rules that matter without making them hunt for them.',
    cards: [
      {
        title: 'Use',
        copy: 'Website content is informational until a written engagement begins.',
        points: ['No promise', 'No legal advice', 'Written scope']
      },
      {
        title: 'Engagement',
        copy: 'Consulting work is governed by the final agreement and NDA terms if present.',
        points: ['Agreement', 'Scope', 'Confidentiality']
      },
      {
        title: 'Changes',
        copy: 'The site may change as services, research, and contact details change.',
        points: ['Updated content', 'Current terms', 'Versioning']
      }
    ]
  },
  '/disclosures/': {
    mode: 'cards',
    kicker: 'Disclosure map',
    title: 'Where affiliations and conflicts belong',
    intro: 'A disclosure page should make the visible relationships easy to scan.',
    cards: [
      {
        title: 'Affiliations',
        copy: 'Public affiliations and memberships belong here, not hidden in prose.',
        points: ['Fellowships', 'Labs', 'Networks']
      },
      {
        title: 'Conflicts',
        copy: 'If there is overlap between work and external interests, state it plainly.',
        points: ['Overlaps', 'Constraints', 'Transparency']
      },
      {
        title: 'Contact',
        copy: 'hello@syntonyresearch.org',
        points: ['Questions', 'Corrections', 'Updates']
      }
    ]
  }
};

function projectLonLat(lon, lat) {
  const clampedLat = Math.max(-80, Math.min(80, lat));
  const lonNorm = (lon + 180) / 360;
  const latRad = clampedLat * Math.PI / 180;
  const mercN = Math.log(Math.tan((Math.PI / 4) + (latRad / 2)));
  const latNorm = 0.5 - (mercN / (2 * Math.PI));
  return {
    x: Math.max(0, Math.min(100, lonNorm * 100)),
    y: Math.max(0, Math.min(100, latNorm * 100))
  };
}

function buildCardVisual(config) {
  const firstCard = config.cards[0];
  const cards = config.cards.map((card, index) => `
    <button class="visual-card visual-card--button${index === 0 ? ' is-active' : ''}" type="button" data-visual-card-index="${index}">
      <span class="visual-card-kicker">${card.title}</span>
      <p>${card.copy}</p>
      <ul>
        ${card.points.map((point) => `<li>${point}</li>`).join('')}
      </ul>
    </button>
  `).join('');

  return `
    <div class="visual-panel">
      <div class="visual-panel__head">
        <span class="label">${config.kicker}</span>
        <h2>${config.title}</h2>
        <p>${config.intro}</p>
      </div>
      <div class="visual-panel__body visual-panel__body--cards">
        <aside class="visual-focus" data-visual-focus>
          <span class="label">Selected lens</span>
          <h3 data-visual-focus-title>${firstCard.title}</h3>
          <p data-visual-focus-copy>${firstCard.copy}</p>
          <div class="visual-focus-points" data-visual-focus-points>
            ${firstCard.points.map((point) => `<span class="visual-focus-chip">${point}</span>`).join('')}
          </div>
        </aside>
        <div class="visual-grid visual-grid--interactive">${cards}</div>
      </div>
    </div>
  `;
}

function buildGeoVisual(config) {
  const markers = config.regions.map((region) => {
    const position = projectLonLat(region.lon, region.lat);
    return `
      <button
        class="geo-marker"
        type="button"
        data-geo-marker="${region.id}"
        style="left:${position.x}%; top:${position.y}%;"
        aria-label="${region.name}: ${region.signals[0]}"
      >
        <span></span>
      </button>
    `;
  }).join('');
  const list = config.regions.map((region) => `
    <button class="geo-region-row" type="button" data-geo-row="${region.id}">
      <span>${region.name}</span>
      <span class="geo-region-row-note">${region.signals[0]}</span>
    </button>
  `).join('');

  return `
    <div class="visual-panel visual-panel--geo">
      <div class="visual-panel__head">
        <span class="label">${config.kicker}</span>
        <h2>${config.title}</h2>
        <p>${config.intro}</p>
      </div>
      <div class="visual-panel__body">
        <div class="geo-map" data-geo-map>
          <div class="geo-controls" aria-label="Map controls">
            <button class="geo-control" type="button" data-geo-zoom="out">−</button>
            <button class="geo-control" type="button" data-geo-zoom="reset">Reset</button>
            <button class="geo-control" type="button" data-geo-zoom="in">+</button>
          </div>
          <div class="geo-hint">Click a marker or row. Drag to pan. Scroll to zoom.</div>
          <div class="geo-map-stage" data-geo-map-stage style="--geo-zoom:1;">
            <img class="geo-map-image" src="/assets/world-map.svg" alt="" aria-hidden="true">
            <div class="geo-graticule" aria-hidden="true"></div>
            <div class="geo-markers" data-geo-markers>${markers}</div>
          </div>
        </div>
        <aside class="visual-panel__sidebar">
          <div class="geo-detail" data-geo-detail>
            <span class="label">Selected region</span>
            <h3 data-geo-name></h3>
            <p data-geo-note></p>
            <div class="geo-signal-row" data-geo-signals></div>
          </div>
          <div class="geo-region-list" role="list" aria-label="Geographic watchpoints">
            ${list}
          </div>
        </aside>
      </div>
    </div>
  `;
}

function initPageVisuals() {
  const hero = document.querySelector('main .page-hero');
  if (!hero || document.querySelector('.page-visual')) return;
  const path = window.location.pathname;
  const normalizedPath = path === '/' ? '/' : (path.endsWith('/') ? path : `${path}/`);
  const config = PAGE_VISUALS[path] || PAGE_VISUALS[normalizedPath] || null;
  if (!config) return;

  const section = document.createElement('section');
  section.className = 'page-visual reveal';
  section.innerHTML = config.mode === 'geo' ? buildGeoVisual(config) : buildCardVisual(config);
  hero.insertAdjacentElement('afterend', section);

  if (config.mode === 'geo') {
    const detailName = section.querySelector('[data-geo-name]');
    const detailNote = section.querySelector('[data-geo-note]');
    const detailSignals = section.querySelector('[data-geo-signals]');
    const map = section.querySelector('[data-geo-map]');
    const mapStage = section.querySelector('[data-geo-map-stage]');
    const zoomButtons = Array.from(section.querySelectorAll('[data-geo-zoom]'));
    const rows = Array.from(section.querySelectorAll('[data-geo-row]'));
    const markers = Array.from(section.querySelectorAll('[data-geo-marker]'));
    let selectedRegionId = config.regions[0]?.id || null;
    let geoZoom = 1;
    let geoPanX = 0;
    let geoPanY = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragOriginX = 0;
    let dragOriginY = 0;

    const selectedRegion = () => config.regions.find((entry) => entry.id === selectedRegionId) || config.regions[0];

    const applyGeoTransform = () => {
      if (!mapStage) return;
      mapStage.style.setProperty('--geo-zoom', geoZoom.toFixed(2));
      mapStage.style.setProperty('--geo-pan-x', `${Math.round(geoPanX)}px`);
      mapStage.style.setProperty('--geo-pan-y', `${Math.round(geoPanY)}px`);
    };

    const setRegion = (regionId, options = {}) => {
      selectedRegionId = regionId;
      const region = selectedRegion();
      if (!region) return;
      detailName.textContent = region.name;
      detailNote.textContent = region.note;
      detailSignals.innerHTML = region.signals.map((signal) => `<span class="geo-signal">${signal}</span>`).join('');
      rows.forEach((row) => row.classList.toggle('is-active', row.dataset.geoRow === region.id));
      rows.forEach((row) => row.setAttribute('aria-pressed', String(row.dataset.geoRow === region.id)));
      markers.forEach((marker) => marker.classList.toggle('is-active', marker.dataset.geoMarker === region.id));
      markers.forEach((marker) => marker.setAttribute('aria-pressed', String(marker.dataset.geoMarker === region.id)));
      const row = rows.find((entry) => entry.dataset.geoRow === region.id);
      if (options.scroll !== false) {
        row?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
      if (mapStage) {
        mapStage.style.setProperty('--geo-focus-x', `${projectLonLat(region.lon, region.lat).x}%`);
        mapStage.style.setProperty('--geo-focus-y', `${projectLonLat(region.lon, region.lat).y}%`);
      }
    };

    rows.forEach((row) => row.addEventListener('click', () => setRegion(row.dataset.geoRow)));
    markers.forEach((marker) => marker.addEventListener('click', () => setRegion(marker.dataset.geoMarker)));
    zoomButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.dataset.geoZoom;
        if (action === 'in') geoZoom = Math.min(1.5, geoZoom + 0.12);
        if (action === 'out') geoZoom = Math.max(1, geoZoom - 0.12);
        if (action === 'reset') {
          geoZoom = 1;
          geoPanX = 0;
          geoPanY = 0;
        }
        applyGeoTransform();
      });
    });
    if (mapStage) {
      map.addEventListener('pointerdown', (event) => {
        if (event.target.closest('.geo-control') || event.target.closest('.geo-marker')) return;
        isDragging = true;
        dragStartX = event.clientX;
        dragStartY = event.clientY;
        dragOriginX = geoPanX;
        dragOriginY = geoPanY;
        map.setPointerCapture(event.pointerId);
      });
      map.addEventListener('pointermove', (event) => {
        if (!isDragging) return;
        geoPanX = dragOriginX + (event.clientX - dragStartX);
        geoPanY = dragOriginY + (event.clientY - dragStartY);
        applyGeoTransform();
      });
      const endDrag = () => { isDragging = false; };
      map.addEventListener('pointerup', endDrag);
      map.addEventListener('pointercancel', endDrag);
      map.addEventListener('pointerleave', endDrag);
      map.addEventListener('wheel', (event) => {
        event.preventDefault();
        const delta = event.deltaY < 0 ? 0.08 : -0.08;
        geoZoom = Math.max(1, Math.min(1.8, geoZoom + delta));
        applyGeoTransform();
      }, { passive: false });
      applyGeoTransform();
    }
    setRegion(selectedRegionId, { scroll: false });
  }

  if (config.mode !== 'geo') {
    const focusTitle = section.querySelector('[data-visual-focus-title]');
    const focusCopy = section.querySelector('[data-visual-focus-copy]');
    const focusPoints = section.querySelector('[data-visual-focus-points]');
    const cards = Array.from(section.querySelectorAll('[data-visual-card-index]'));
    if (focusTitle && focusCopy && focusPoints && cards.length) {
      const setCard = (index) => {
        const card = config.cards[index];
        if (!card) return;
        focusTitle.textContent = card.title;
        focusCopy.textContent = card.copy;
        focusPoints.innerHTML = card.points.map((point) => `<span class="visual-focus-chip">${point}</span>`).join('');
        cards.forEach((button) => {
          const active = Number(button.dataset.visualCardIndex) === index;
          button.classList.toggle('is-active', active);
          button.setAttribute('aria-pressed', String(active));
        });
      };

      cards.forEach((button) => {
        button.addEventListener('click', () => setCard(Number(button.dataset.visualCardIndex)));
      });
      setCard(0);
    }
  }
}

(async function bootstrap() {
  await includePartials();
  initAtmosphere();
  initNavigation();
  initMouseGlow();
  initFaq();
  initHeroAbstracts();
  initCalEmbed();
  initForms();
  initTracking();
  initBreadcrumbSchema();
  initPageVisuals();
  initReveal();
  initResonanceLab();
  initSignalMatrix();
  initPublicationLens();
  initServiceRecommender();
  initForecastLab();
})();
