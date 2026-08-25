(function () {
  'use strict';

  // Preloader dismissal used to live here (a one-shot initPreloader() run
  // by the <Script strategy="afterInteractive"> tag that loads this file).
  // It worked on a page's first full load but never re-ran on client-side
  // navigations, leaving every subsequently-mounted `#preloader` div stuck
  // on screen forever — most visibly right after a login/register redirect.
  // Moved to src/components/PreloaderController.tsx, which re-runs on every
  // route change (see that file's comment for the full story). global-
  // not-found.tsx is the one page still outside that component's reach
  // (it owns its own standalone <html>, outside [locale]/layout.tsx) — that
  // page is only ever reached via a full page load, where this removal
  // doesn't affect anything since PreloaderController already re-runs the
  // same logic for the [locale] tree covering the rest of the site.

  function initScrollState() {
    const header = document.getElementById('siteHeader');
    const progressBar = document.getElementById('progressBar');
    if (!header && !progressBar) return;

    const updateScrollState = () => {
      header?.classList.toggle('scrolled', window.scrollY > 40);
      if (!progressBar) return;

      const page = document.documentElement;
      const scrollableHeight = page.scrollHeight - page.clientHeight;
      const progress = scrollableHeight ? page.scrollTop / scrollableHeight * 100 : 0;
      progressBar.style.width = `${progress}%`;
    };

    window.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();
  }

  function initMobileMenu() {
    const burger = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!burger || !mobileMenu) return;

    const setMenuOpen = (isOpen) => {
      mobileMenu.classList.toggle('open', isOpen);
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    burger.addEventListener('click', () => {
      setMenuOpen(!mobileMenu.classList.contains('open'));
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenuOpen(false));
    });
  }

  function initLanguageToggle() {
    const languageToggle = document.getElementById('langToggle');
    if (!languageToggle) return;

    const setLanguage = (language) => {
      if (language !== 'th' && language !== 'en') return;

      document.querySelectorAll(`[data-${language}]`).forEach((element) => {
        element.textContent = element.getAttribute(`data-${language}`);
      });
      document.querySelectorAll(`[data-${language}-placeholder]`).forEach((element) => {
        element.placeholder = element.getAttribute(`data-${language}-placeholder`);
      });
      languageToggle.querySelectorAll('[data-val]').forEach((option) => {
        option.classList.toggle('active', option.dataset.val === language);
      });
      document.documentElement.lang = language;
      document.dispatchEvent(new CustomEvent('phivara:languagechange', {
        detail: { language }
      }));
    };

    languageToggle.addEventListener('click', (event) => {
      const option = event.target.closest('[data-val]');
      if (option) setLanguage(option.dataset.val);
    });
  }

  function initRevealAnimations() {
    const animatedElements = document.querySelectorAll('.reveal, .stagger');
    if (!animatedElements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('in');
      });
    }, { threshold: .12 });

    animatedElements.forEach((element) => observer.observe(element));
    document.querySelectorAll('.stagger').forEach((group) => {
      [...group.children].forEach((child, index) => {
        child.style.transitionDelay = `${index * .08}s`;
      });
    });
  }

  initScrollState();
  initMobileMenu();
  initLanguageToggle();
  initRevealAnimations();
})();
