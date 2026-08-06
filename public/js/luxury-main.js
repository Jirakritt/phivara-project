/* ==========================================================================
   PHIVARA - The Art of Beaugevity
   Luxury JavaScript Engine (v2.0 Luxury)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ------------------------------------------------------------------------
   * 1. Preloader Handler
   * ------------------------------------------------------------------------ */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('done');
      }, 1600);
    });
    // Safety fallback
    setTimeout(() => {
      if (!preloader.classList.contains('done')) {
        preloader.classList.add('done');
      }
    }, 3500);
  }

  /* ------------------------------------------------------------------------
   * 2. Custom Magnetic Cursor & Ambient Spotlight Follower
   * ------------------------------------------------------------------------ */
  const cursorRing = document.getElementById('cursorRing');
  const cursorDot = document.getElementById('cursorDot');
  const spotlight = document.querySelector('.ambient-spotlight');

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  if (window.innerWidth > 992 && cursorRing && cursorDot) {
    document.body.classList.add('has-cursor');

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursorDot.style.top = `${mouseY}px`;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.classList.add('show');
      cursorRing.classList.add('show');

      if (spotlight) {
        spotlight.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      }
    });

    // Smooth lerp for outer ring
    function renderCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      cursorRing.style.top = `${ringY}px`;
      cursorRing.style.left = `${ringX}px`;

      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Hover scale effects
    const interactiveElements = document.querySelectorAll('a, button, input, select, .exp-item-card, .spec-card, .pillar-card, .jr-card');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('grow'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('grow'));
    });
  }

  /* ------------------------------------------------------------------------
   * 3. Sticky Glass Header & Scrollspy
   * ------------------------------------------------------------------------ */
  const siteHeader = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('nav.main-nav a');
  const sections = Array.from(navLinks).map(link => {
    const target = link.getAttribute('href');
    return target && target.startsWith('#') && target.length > 1 ? document.querySelector(target) : null;
  }).filter(Boolean);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  // Scrollspy observer
  if (sections.length > 0) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });

    sections.forEach(sec => spyObserver.observe(sec));
  }

  /* ------------------------------------------------------------------------
   * 4. Hero Background Slideshow
   * ------------------------------------------------------------------------ */
  const heroSlides = document.querySelectorAll('#heroBg .bg-slide');
  if (heroSlides.length > 1) {
    let currentSlide = 0;
    setInterval(() => {
      heroSlides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % heroSlides.length;
      heroSlides[currentSlide].classList.add('active');
    }, 6500);
  }

  /* ------------------------------------------------------------------------
   * 5. Language Switcher (TH / EN)
   * ------------------------------------------------------------------------ */
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', (e) => {
      const targetSpan = e.target.closest('span[data-val]');
      if (!targetSpan) return;

      const lang = targetSpan.getAttribute('data-val');
      
      // Update data-th / data-en text across all elements
      document.querySelectorAll('[data-th][data-en]').forEach(el => {
        const newText = el.getAttribute(`data-${lang}`);
        if (newText) {
          if (el.children.length === 0 || el.dataset.replaceTextOnly === 'true') {
            el.textContent = newText;
          } else {
            // For elements with nested HTML, update inner text node if present
            const firstTextNode = Array.from(el.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
            if (firstTextNode) {
              firstTextNode.textContent = newText;
            } else {
              el.textContent = newText;
            }
          }
        }
      });

      // Update active toggle state
      langToggle.querySelectorAll('span').forEach(s => {
        s.classList.toggle('active', s.getAttribute('data-val') === lang);
      });

      document.documentElement.lang = lang;
    });
  }

  /* ------------------------------------------------------------------------
   * 6. Scroll Reveal Observer
   * ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal-up');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  /* ------------------------------------------------------------------------
   * 7. Interactive Expertise Tabs
   * ------------------------------------------------------------------------ */
  const expBtns = document.querySelectorAll('.exp-tab-btn');
  const expPanels = document.querySelectorAll('.exp-panel');

  if (expBtns.length > 0 && expPanels.length > 0) {
    expBtns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        expBtns.forEach(b => b.classList.remove('active'));
        expPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        if (expPanels[index]) {
          expPanels[index].classList.add('active');
        }
      });
    });
  }

  /* ------------------------------------------------------------------------
   * 8. Metric Counter Animation
   * ------------------------------------------------------------------------ */
  const statNumbers = document.querySelectorAll('.counter-val');
  if (statNumbers.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          let count = 0;
          const duration = 1800;
          const stepTime = 20;
          const increment = Math.ceil(target / (duration / stepTime));

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              el.textContent = target;
              clearInterval(timer);
            } else {
              el.textContent = count;
            }
          }, stepTime);

          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => counterObserver.observe(num));
  }

  /* ------------------------------------------------------------------------
   * 9. Awards Carousel System
   * ------------------------------------------------------------------------ */
  const awardTrack = document.getElementById('awardTrack');
  const prevBtn = document.getElementById('awardPrev');
  const nextBtn = document.getElementById('awardNext');

  if (awardTrack && prevBtn && nextBtn) {
    const cards = awardTrack.children;
    let cardWidth = cards[0].offsetWidth + 28; // card width + gap
    let currentIndex = 0;

    function updateCarousel() {
      cardWidth = cards[0].offsetWidth + 28;
      awardTrack.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }

    nextBtn.addEventListener('click', () => {
      const maxIndex = cards.length - Math.floor(awardTrack.parentElement.offsetWidth / cardWidth);
      if (currentIndex < maxIndex) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }
      updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = Math.max(0, cards.length - Math.floor(awardTrack.parentElement.offsetWidth / cardWidth));
      }
      updateCarousel();
    });

    window.addEventListener('resize', updateCarousel);
  }

  /* ------------------------------------------------------------------------
   * 10. Mobile Menu Toggle
   * ------------------------------------------------------------------------ */
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ------------------------------------------------------------------------
   * 11. VIP Consultation Modal Handler
   * ------------------------------------------------------------------------ */
  const vipModal = document.getElementById('vipModal');
  const openModalBtns = document.querySelectorAll('[data-open-modal="vipModal"], a[href="#contact"]');
  const closeModalBtns = document.querySelectorAll('.modal-close, [data-close-modal]');

  if (vipModal) {
    openModalBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        vipModal.classList.add('active');
      });
    });

    closeModalBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        vipModal.classList.remove('active');
      });
    });

    vipModal.addEventListener('click', (e) => {
      if (e.target === vipModal) {
        vipModal.classList.remove('active');
      }
    });

    // Form Submission Simulated VIP Response
    const form = vipModal.querySelector('form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('ขอบคุณสำหรับการติดต่อ ทีมงาน Concierge ของ PHIVARA จะติดต่อกลับเพื่อนัดหมายเวลาส่วนตัวโดยเร็วที่สุด');
        vipModal.classList.remove('active');
        form.reset();
      });
    }
  }
});
