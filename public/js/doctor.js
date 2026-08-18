'use strict';

// Next.js loads this script with the `afterInteractive` strategy, which can
// run after the browser's DOMContentLoaded event has already fired (unlike
// the original site's plain deferred <script> tags). Waiting on
// `DOMContentLoaded` in that case means this callback never runs at all, so
// run immediately if the DOM is already parsed instead of only listening.
function initDoctorPage() {
  // All doctor cards are now server-rendered from Payload (see
  // src/app/(frontend)/doctor/page.tsx) instead of being split between a
  // few hardcoded cards in the HTML and a JS-injected "cards 13-30" array —
  // this file only wires up filtering/search/pagination on top of whatever
  // cards already exist in the DOM.
  const doctorGrid = document.getElementById('doctorGrid');

  // Filter Elements & Custom Dropdowns
  const searchInput = document.getElementById('docSearchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const specialtySelectBox = document.getElementById('specialtySelectBox');
  const specialtyBtn = document.getElementById('specialtyBtn');
  const specialtyBtnText = document.getElementById('specialtyBtnText');
  const specialtyItems = document.querySelectorAll('#specialtyMenu .dropdown-item');
  const branchSelectBox = document.getElementById('branchSelectBox');
  const branchBtn = document.getElementById('branchBtn');
  const branchBtnText = document.getElementById('branchBtnText');
  const branchItems = document.querySelectorAll('#branchMenu .dropdown-item');
  const doctorCards = document.querySelectorAll('#doctorGrid .spec-card');
  const noDocFound = document.getElementById('noDocFound');
  const docCountBadge = document.getElementById('docCountBadge');
  const doctorPagination = document.getElementById('doctorPagination');

  let selectedSpecialty = 'all';
  let selectedBranch = 'all';
  let currentDoctorPage = 1;
  const doctorsPerPage = 20;
  const paginationControl = window.PhivaraCatalog.createPagination({
    container: doctorPagination,
    showArrows: false,
    onPageChange(page) {
      currentDoctorPage = page;
      filterDoctors(false);
      document.querySelector('.doctor-grid-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  function filterDoctors(resetPage = true) {
    const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';

    const matchedCards = [];
    doctorCards.forEach(card => {
      const cardSpecialty = card.getAttribute('data-specialty');
      const cardBranch = card.getAttribute('data-branch');
      const textContent = card.textContent.toLowerCase();

      const matchSpecialty = selectedSpecialty === 'all' || cardSpecialty === selectedSpecialty;
      const matchBranch = selectedBranch === 'all' || cardBranch === selectedBranch;
      const matchSearch = searchQuery === '' || textContent.includes(searchQuery);

      if (matchSpecialty && matchBranch && matchSearch) {
        matchedCards.push(card);
      } else {
        card.classList.add('hidden');
      }
    });

    if (resetPage) currentDoctorPage = 1;
    const totalPages = Math.ceil(matchedCards.length / doctorsPerPage);
    if (currentDoctorPage > totalPages) currentDoctorPage = Math.max(1, totalPages);
    const pageStart = (currentDoctorPage - 1) * doctorsPerPage;
    const pageEnd = pageStart + doctorsPerPage;
    matchedCards.forEach((card, index) => {
      card.classList.toggle('hidden', index < pageStart || index >= pageEnd);
    });

    if (noDocFound) {
      noDocFound.style.display = matchedCards.length === 0 ? 'block' : 'none';
    }
    if (docCountBadge) {
      docCountBadge.textContent = matchedCards.length;
    }
    paginationControl.render(currentDoctorPage, totalPages);
  }

  const dropdowns = window.PhivaraCatalog.createDropdownGroup([
    {
      name: 'specialty',
      selectBox: specialtySelectBox,
      button: specialtyBtn,
      buttonText: specialtyBtnText,
      items: specialtyItems,
      valueKey: 'specialty',
      onSelect(value) {
        selectedSpecialty = value;
        filterDoctors();
      }
    },
    {
      name: 'branch',
      selectBox: branchSelectBox,
      button: branchBtn,
      buttonText: branchBtnText,
      items: branchItems,
      valueKey: 'branch',
      onSelect(value) {
        selectedBranch = value;
        filterDoctors();
      }
    }
  ]);

  const searchControl = window.PhivaraCatalog.createSearch({
    input: searchInput,
    clearButton: searchClearBtn,
    onSearch() {
      filterDoctors();
    }
  });

  // Pre-filter from URL, e.g. doctor.html?specialty=longevity (used by ecosystem.html links)
  const urlParams = new URLSearchParams(window.location.search);
  const specialtyParam = urlParams.get('specialty');
  if (specialtyParam && dropdowns.specialty) {
    dropdowns.specialty.selectByValue(specialtyParam);
  }

  // Initial result count and first page
  filterDoctors();

  // Doctor profile navigation
  doctorGrid.addEventListener('click', (event) => {
    const button = event.target.closest('.btn-doc-detail');
    if (!button) return;
    const doctorId = button.dataset.docId || 'dr01';
    // i18n Phase 2: every page URL now carries a /th|en/ locale prefix
    // (see src/middleware.ts) — document.documentElement.lang holds the
    // current one (set server-side per request), so stay on it instead of
    // dropping back to a bare, locale-less path.
    const lang = document.documentElement.lang || 'th';
    window.location.href = `/${lang}/doctor/${doctorId}`;
  });

  // Pre-fill VIP Concierge Modal when clicking "จองปรึกษา"
  document.querySelectorAll('.vip-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const docName = trigger.getAttribute('data-doc-name');
      const vipNotesInput = document.querySelector('#vipForm textarea[name="notes"]');
      if (docName && vipNotesInput) {
        const lang = document.documentElement.lang || 'th';
        const prefix = lang === 'en' ? 'Book consultation with: ' : 'นัดหมายขอปรึกษาแพทย์: ';
        vipNotesInput.value = prefix + docName;
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDoctorPage);
} else {
  initDoctorPage();
}
