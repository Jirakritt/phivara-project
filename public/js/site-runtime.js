(function () {
  'use strict';

  function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    let hidden = false;
    const hidePreloader = () => {
      if (hidden) return;
      hidden = true;
      preloader.classList.add('done');
    };
    const scheduleHide = () => window.setTimeout(hidePreloader, 500);

    if (document.readyState === 'complete') {
      scheduleHide();
    } else {
      window.addEventListener('load', scheduleHide, { once: true });
      // Safety net: some resource (e.g. a slow/blocked image) can delay or
      // suppress the 'load' event entirely. Never leave the preloader
      // stuck covering the page indefinitely.
      window.setTimeout(hidePreloader, 4000);
    }
  }

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

  initPreloader();
  initScrollState();
  initMobileMenu();
  initLanguageToggle();
  initRevealAnimations();
})();
