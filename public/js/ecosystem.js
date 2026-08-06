'use strict';

// Ported from phivara-design-html/js/ecosystem.js. Left out on purpose
// (site-runtime.js already covers these on every page): preloader hide,
// header scroll state + progress bar, mobile menu toggle, language toggle,
// reveal-on-scroll animations. Kept: everything specific to this page — the
// eco ring's hover/click-to-scroll behavior, the cursor-following ambient
// orb in the hero, and the (currently unused, kept for parity) counters.
function initEcosystemPage() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.documentElement.style.setProperty('--ambient-gold-rgb', '194,166,123');

  /* Eco ring: click a tag to jump to its section */
  document.querySelectorAll('.eco-ring-tag').forEach((tag) => {
    tag.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(tag.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* Floating ambient orb that follows the cursor within the hero */
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

  /* Counters (kept for parity — no .eco-counter elements on the page currently) */
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
}

// Next.js loads this with the `afterInteractive` strategy, which can run
// after the browser's DOMContentLoaded has already fired — so run
// immediately if the DOM is already parsed (same fix as the other ported
// page scripts in this project).
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEcosystemPage);
} else {
  initEcosystemPage();
}
