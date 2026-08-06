'use strict';

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.documentElement.style.setProperty('--ambient-gold-rgb', '194,166,123');

  /* Preloader */
  window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('preloader').classList.add('done'), reduceMotion ? 80 : 1100);
  });

  /* Sticky header shrink + progress bar */
  const header = document.getElementById('siteHeader');
  const progressBar = document.getElementById('progressBar');
  window.addEventListener('scroll', () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 40);
    const h = document.documentElement;
    if (progressBar) progressBar.style.width = ((h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100) + '%';
  });

  /* Mobile menu */
  const burger = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      burger.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  /* Language toggle */
  const langToggle = document.getElementById('langToggle');
  function setLang(lang) {
    document.querySelectorAll('[data-th]').forEach((el) => {
      if (el.children.length > 0) return;
      const translation = el.getAttribute('data-' + lang);
      if (translation !== null) el.textContent = translation;
    });
    document.querySelectorAll('[data-placeholder-th]').forEach((el) => {
      const placeholder = el.getAttribute('data-placeholder-' + lang);
      if (placeholder !== null) el.setAttribute('placeholder', placeholder);
    });
    if (langToggle) langToggle.querySelectorAll('span').forEach((s) => s.classList.toggle('active', s.dataset.val === lang));
    document.documentElement.lang = lang;
  }
  if (langToggle) langToggle.addEventListener('click', (e) => { const val = e.target.dataset.val; if (val) setLang(val); });

  /* Reveal + stagger observer (also drives SVG line-draw icons) */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('in'); });
  }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal, .stagger').forEach((el) => revealObserver.observe(el));
  document.querySelectorAll('.stagger').forEach((group) => {
    Array.from(group.children).forEach((child, i) => { child.style.transitionDelay = (i * 0.09) + 's'; });
  });

  /* Eco ring: hover a tag to spotlight its segment + click to jump to section */
  document.querySelectorAll('.eco-ring-tag').forEach((tag) => {
    tag.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(tag.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* Floating ambient orb that follows the cursor within hero */
  const orb = document.getElementById('ecoOrb');
  const heroZone = document.getElementById('ecoHero');
  if (orb && heroZone && !reduceMotion) {
    heroZone.addEventListener('mousemove', (e) => {
      const rect = heroZone.getBoundingClientRect();
      orb.style.left = (e.clientX - rect.left) + 'px';
      orb.style.top = (e.clientY - rect.top) + 'px';
      orb.classList.add('visible');
    });
    heroZone.addEventListener('mouseleave', () => orb.classList.remove('visible'));
  }

  /* Counters (products/doctors covered per category) */
  const counters = document.querySelectorAll('.eco-counter');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        let cur = 0;
        const step = Math.max(1, Math.round(target / 30));
        const tick = () => {
          cur += step;
          if (cur >= target) { el.textContent = target; return; }
          el.textContent = cur;
          requestAnimationFrame(tick);
        };
        tick();
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.6 });
  counters.forEach((c) => countObserver.observe(c));
})();
