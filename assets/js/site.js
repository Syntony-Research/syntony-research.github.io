/* Syntony site interactions */

(function () {
  'use strict';

  function loadIncludes() {
    var includeNodes = Array.from(document.querySelectorAll('[data-include]'));
    if (!includeNodes.length) return Promise.resolve();
    return Promise.all(includeNodes.map(function (node) {
      var url = node.getAttribute('data-include');
      return fetch(url)
        .then(function (response) {
          if (!response.ok) throw new Error('Include failed: ' + url);
          return response.text();
        })
        .then(function (html) { node.outerHTML = html; })
        .catch(function (err) {
          console.warn(err);
          node.remove();
        });
    }));
  }

  function initNav() {
    var nav = document.getElementById('site-nav');
    var toggle = document.querySelector('.nav-toggle');
    var links = document.getElementById('nav-links') || document.getElementById('primary-nav');
    var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    var sections = Array.from(navLinks).map(function (link) {
      return document.getElementById(link.getAttribute('href').slice(1));
    }).filter(Boolean);

    function updateActiveLink() {
      var scrollY = window.scrollY + 100;
      var current = '';
      sections.forEach(function (section) {
        if (section.offsetTop <= scrollY) current = section.id;
      });
      navLinks.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      });
    }

    function updateNavScroll() {
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    window.addEventListener('scroll', updateNavScroll, { passive: true });
    updateActiveLink();
    updateNavScroll();

    if (toggle && links) {
      toggle.addEventListener('click', function () {
        var open = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!open));
        links.classList.toggle('open', !open);
      });
      links.querySelectorAll('a').forEach(function (anchor) {
        anchor.addEventListener('click', function () {
          toggle.setAttribute('aria-expanded', 'false');
          links.classList.remove('open');
        });
      });
      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && links.classList.contains('open')) {
          toggle.setAttribute('aria-expanded', 'false');
          links.classList.remove('open');
          toggle.focus();
        }
      });
    }
  }

  function initReveal() {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el); });
    } else {
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('visible'); });
    }
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (event) {
        var target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  function initWaveSync() {
    var syncBtn = document.querySelector('[data-wave-sync]');
    var waveSvg = document.querySelector('.wave-svg');
    if (!syncBtn || !waveSvg) return;
    var synced = false;
    syncBtn.addEventListener('click', function () {
      synced = !synced;
      waveSvg.classList.toggle('synced', synced);
      syncBtn.classList.toggle('is-synced', synced);
      syncBtn.textContent = synced ? 'That\u2019s syntony' : 'Sync the signals';
    });
  }

  function initGovernanceLagScreen() {
    var panel = document.querySelector('[data-report-lag-panel]');
    if (!panel) return;
    var data = {
      defence: {
        score: 78,
        kicker: 'Defence procurement and autonomous systems',
        title: 'Decision rights move slower than deployment pressure.',
        copy: 'Ukraine shows how feedback loops tighten when experimentation is close to operators. Broader European procurement still adds review cycles across national, EU, NATO, and minilateral authorities.',
        values: [82, 76, 48, 42]
      },
      energy: {
        score: 72,
        kicker: 'AI-enabled smart grids',
        title: 'Control obligations overlap before validation matures.',
        copy: 'Utilities face the EU AI Act, GDPR, NIS2, the Electricity Market Directive, and the Data Act at once. The result is a measurement and assurance bottleneck around operational grid AI.',
        values: [80, 70, 45, 40]
      },
      finance: {
        score: 69,
        kicker: 'Financial services and algorithmic trading',
        title: 'Supervision has less language than the systems it supervises.',
        copy: 'MiFID II enabled technology-neutral adoption, but emergent AI behavior, opacity, and systemic interaction effects are harder to measure and govern after deployment.',
        values: [76, 68, 44, 39]
      },
      health: {
        score: 81,
        kicker: 'Public health and biosurveillance',
        title: 'Fragmented surveillance creates a sharper AI biosecurity blind spot.',
        copy: 'Delayed milestones and uneven public-health capacity leave biological AI models awkwardly outside the existing general-purpose AI governance frame.',
        values: [74, 64, 38, 34]
      }
    };
    var labels = ['Govern', 'Map', 'Measure', 'Manage'];
    var score = panel.querySelector('[data-lag-score]');
    var kicker = panel.querySelector('[data-lag-kicker]');
    var title = panel.querySelector('[data-lag-title]');
    var copy = panel.querySelector('[data-lag-copy]');
    var bars = Array.from(panel.querySelectorAll('.lag-bar'));
    var tabs = Array.from(panel.querySelectorAll('.lag-sector-tab'));

    function render(key) {
      var item = data[key] || data.defence;
      if (score) score.textContent = item.score;
      if (kicker) kicker.textContent = item.kicker;
      if (title) title.textContent = item.title;
      if (copy) copy.textContent = item.copy;
      bars.forEach(function (bar, index) {
        bar.style.setProperty('--value', item.values[index]);
        bar.querySelector('span').textContent = labels[index];
      });
      tabs.forEach(function (tab) {
        var active = tab.dataset.lagSector === key;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () { render(tab.dataset.lagSector); });
    });
    render('defence');
  }

  function initSite() {
    initNav();
    initReveal();
    initSmoothScroll();
    initWaveSync();
    initGovernanceLagScreen();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { loadIncludes().then(initSite); });
  } else {
    loadIncludes().then(initSite);
  }
})();
