'use strict';

// Ported from phivara-design-html/program.html's large inline <script>.
// Left out on purpose (site-runtime.js already covers these on every page):
// preloader hide, header scroll state, mobile menu toggle, language toggle,
// reveal-on-scroll animations. Also left out: the `extraPrograms` array and
// branch/price DOM-injection logic — every program card is now
// server-rendered directly from Payload with real data from the start.
//
// Next.js loads this with the `afterInteractive` strategy, which can run
// after the browser's DOMContentLoaded has already fired — so run
// immediately if the DOM is already parsed instead of only listening for
// an event that may never fire again (same fix as public/js/doctor.js).
function initProgramPage() {
  // ---------------------------------------------------------------------
  // Catalog filter / search / pagination (category + branch dropdowns)
  // ---------------------------------------------------------------------
  const cards = [...document.querySelectorAll('.program-card')];
  const search = document.getElementById('programSearch');
  const count = document.getElementById('programCount');
  const noResults = document.getElementById('noResults');
  const pagination = document.getElementById('programPagination');

  if (cards.length && window.PhivaraCatalog) {
    const categorySelect = document.getElementById('categorySelectBox');
    const categoryBtn = document.getElementById('categoryBtn');
    const categoryText = document.getElementById('categoryBtnText');
    const categoryItems = [...document.querySelectorAll('#categoryMenu .dropdown-item')];
    const branchSelect = document.getElementById('branchSelectBox');
    const branchBtn = document.getElementById('branchBtn');
    const branchText = document.getElementById('branchBtnText');
    const branchItems = [...document.querySelectorAll('#branchMenu .dropdown-item')];
    const programsPerPage = 15;
    let activeCategory = 'all';
    let activeBranch = 'all';
    let currentPage = 1;

    const paginationControl = window.PhivaraCatalog.createPagination({
      container: pagination,
      onPageChange(page) {
        currentPage = page;
        filterPrograms();
        document.getElementById('programs').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    function filterPrograms() {
      const q = search ? search.value.trim().toLowerCase() : '';
      const matched = cards.filter((card) => {
        const matchCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
        const matchBranch = activeBranch === 'all' || card.dataset.branch === activeBranch;
        const matchSearch = !q || (card.dataset.search + ' ' + card.textContent).toLowerCase().includes(q);
        return matchCategory && matchBranch && matchSearch;
      });
      const totalPages = Math.ceil(matched.length / programsPerPage);
      currentPage = Math.min(currentPage, Math.max(1, totalPages));
      cards.forEach((card) => card.classList.add('hidden'));
      matched.slice((currentPage - 1) * programsPerPage, currentPage * programsPerPage).forEach((card) => card.classList.remove('hidden'));
      if (count) count.textContent = matched.length;
      if (noResults) noResults.style.display = matched.length ? 'none' : 'block';
      paginationControl.render(currentPage, totalPages);
    }

    const dropdowns = window.PhivaraCatalog.createDropdownGroup([
      {
        name: 'category', selectBox: categorySelect, button: categoryBtn, buttonText: categoryText, items: categoryItems, valueKey: 'category',
        onSelect(value) { activeCategory = value; currentPage = 1; filterPrograms(); }
      },
      {
        name: 'branch', selectBox: branchSelect, button: branchBtn, buttonText: branchText, items: branchItems, valueKey: 'branch',
        onSelect(value) { activeBranch = value; currentPage = 1; filterPrograms(); }
      }
    ]);
    window.PhivaraCatalog.createSearch({ input: search, onSearch() { currentPage = 1; filterPrograms(); } });

    // Pre-filter from URL, e.g. program.html?category=longevity (used by
    // ecosystem.html links). doctor.js/article.js already did this for their
    // own ?specialty=/?category= params; program.js never had it even on the
    // original static site, so this is a small parity fix added alongside
    // the ecosystem page that actually links here with ?category=.
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    if (categoryParam && dropdowns.category) {
      dropdowns.category.selectByValue(categoryParam);
    }

    filterPrograms();
  }

  // ---------------------------------------------------------------------
  // Highlight carousel (featured programs)
  // ---------------------------------------------------------------------
  const highlightCarousel = document.getElementById('highlightCarousel');
  if (highlightCarousel) {
    const highlightTrack = highlightCarousel.querySelector('.highlight-grid');
    const highlightCards = [...highlightCarousel.querySelectorAll('.highlight-card')];
    const highlightPrev = highlightCarousel.querySelector('.highlight-carousel-prev');
    const highlightNext = highlightCarousel.querySelector('.highlight-carousel-next');
    const highlightDots = highlightCarousel.querySelector('.highlight-carousel-dots');
    const highlightCounter = document.getElementById('highlightCounter');

    highlightCarousel.setAttribute('tabindex', '0');
    highlightCarousel.setAttribute('aria-roledescription', 'carousel');
    highlightCards.forEach((card, index) => {
      card.setAttribute('role', 'group');
      card.setAttribute('aria-roledescription', 'slide');
      card.setAttribute('aria-label', (index + 1) + ' of ' + highlightCards.length);
      const media = card.querySelector('.card-media');
      if (media) media.dataset.slideNumber = String(index + 1).padStart(2, '0');
    });

    let highlightPosition = 0;
    let highlightAutoTimer;

    function renderHighlightCarousel() {
      if (!highlightCards.length) return;
      highlightPosition = Math.max(0, Math.min(highlightPosition, highlightCards.length - 1));
      const cardWidth = highlightCards[0].offsetWidth;
      const trackGap = parseFloat(getComputedStyle(highlightTrack).gap) || 0;
      const trackOffset = -(highlightPosition * (cardWidth + trackGap));
      highlightTrack.style.transform = 'translateX(' + trackOffset + 'px)';
      highlightCards.forEach((card, index) => {
        const isActive = index === highlightPosition;
        card.classList.toggle('is-active', isActive);
        card.setAttribute('aria-current', isActive ? 'true' : 'false');
      });
      if (highlightCounter) {
        highlightCounter.textContent = String(highlightPosition + 1).padStart(2, '0') + ' / ' + String(highlightCards.length).padStart(2, '0');
      }
      highlightCarousel.style.setProperty('--highlight-progress', ((highlightPosition + 1) / highlightCards.length * 100) + '%');
      const hasMultiple = highlightCards.length > 1;
      if (highlightPrev) highlightPrev.disabled = !hasMultiple;
      if (highlightNext) highlightNext.disabled = !hasMultiple;
      if (highlightDots) {
        highlightDots.innerHTML = '';
        highlightCards.forEach((card, index) => {
          const dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'highlight-carousel-dot' + (index === highlightPosition ? ' active' : '');
          dot.setAttribute('aria-label', 'Highlight program ' + (index + 1));
          dot.setAttribute('aria-current', index === highlightPosition ? 'true' : 'false');
          dot.addEventListener('click', () => { highlightPosition = index; renderHighlightCarousel(); startHighlightAutoSlide(); });
          highlightDots.appendChild(dot);
        });
      }
    }

    function startHighlightAutoSlide() {
      clearInterval(highlightAutoTimer);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (highlightCards.length <= 1) return;
      highlightAutoTimer = setInterval(() => {
        highlightPosition = highlightPosition >= highlightCards.length - 1 ? 0 : highlightPosition + 1;
        renderHighlightCarousel();
      }, 7500);
    }

    if (highlightPrev) highlightPrev.addEventListener('click', () => { highlightPosition = highlightPosition <= 0 ? highlightCards.length - 1 : highlightPosition - 1; renderHighlightCarousel(); startHighlightAutoSlide(); });
    if (highlightNext) highlightNext.addEventListener('click', () => { highlightPosition = highlightPosition >= highlightCards.length - 1 ? 0 : highlightPosition + 1; renderHighlightCarousel(); startHighlightAutoSlide(); });
    highlightCards.forEach((card, index) => card.addEventListener('click', (event) => {
      if (event.target.closest('a,button')) return;
      highlightPosition = index;
      renderHighlightCarousel();
      startHighlightAutoSlide();
    }));
    highlightCarousel.addEventListener('mouseenter', () => clearInterval(highlightAutoTimer));
    highlightCarousel.addEventListener('mouseleave', startHighlightAutoSlide);
    highlightCarousel.addEventListener('focusin', () => clearInterval(highlightAutoTimer));
    highlightCarousel.addEventListener('focusout', startHighlightAutoSlide);
    highlightCarousel.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      highlightPosition = (highlightPosition + direction + highlightCards.length) % highlightCards.length;
      renderHighlightCarousel();
      startHighlightAutoSlide();
    });
    let highlightTouchStart = 0;
    highlightCarousel.addEventListener('touchstart', (event) => { highlightTouchStart = event.changedTouches[0].clientX; clearInterval(highlightAutoTimer); }, { passive: true });
    highlightCarousel.addEventListener('touchend', (event) => {
      const distance = event.changedTouches[0].clientX - highlightTouchStart;
      if (Math.abs(distance) > 45) {
        highlightPosition = (highlightPosition + (distance < 0 ? 1 : -1) + highlightCards.length) % highlightCards.length;
        renderHighlightCarousel();
      }
      startHighlightAutoSlide();
    }, { passive: true });
    window.addEventListener('resize', renderHighlightCarousel);
    renderHighlightCarousel();
    startHighlightAutoSlide();
  }

  // Note: program.html originally had its own local "#bookingModal" popup
  // wired to ".booking-trigger" buttons. That's intentionally NOT ported —
  // public/js/vip-modal.js in this project already intercepts every
  // ".booking-trigger" click site-wide (capture-phase listener) and opens
  // the shared #vipModalOverlay, prefilled with the program name via
  // `data-program`. A second local modal here would just be dead code.
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProgramPage);
} else {
  initProgramPage();
}
