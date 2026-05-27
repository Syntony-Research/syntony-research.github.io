/* Syntony — single-page JS */

(function () {
  'use strict';

  /* ── Scroll-spy ── */
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  var sections = Array.from(navLinks).map(function (link) {
    return document.getElementById(link.getAttribute('href').slice(1));
  }).filter(Boolean);

  function updateActiveLink() {
    var scrollY = window.scrollY + 100;
    var current = '';
    sections.forEach(function (s) { if (s.offsetTop <= scrollY) current = s.id; });
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ── Nav scroll state ── */
  var nav = document.getElementById('site-nav');
  function updateNavScroll() { nav.classList.toggle('scrolled', window.scrollY > 10); }
  window.addEventListener('scroll', updateNavScroll, { passive: true });
  updateNavScroll();

  /* ── Mobile menu ── */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      links.classList.toggle('open', !open);
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        links.classList.remove('open');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('open')) {
        toggle.setAttribute('aria-expanded', 'false');
        links.classList.remove('open');
        toggle.focus();
      }
    });
  }

  /* ── Reveal on scroll ── */
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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

  /* ── Smooth scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  /* ── Wave sync interaction ── */
  var syncBtn = document.querySelector('[data-wave-sync]');
  var waveSvg = document.querySelector('.wave-svg');
  if (syncBtn && waveSvg) {
    var synced = false;
    syncBtn.addEventListener('click', function () {
      synced = !synced;
      waveSvg.classList.toggle('synced', synced);
      syncBtn.classList.toggle('is-synced', synced);
      syncBtn.textContent = synced ? 'That\u2019s syntony' : 'Sync the signals';
    });
  }

})();
