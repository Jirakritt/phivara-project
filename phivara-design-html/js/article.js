'use strict';

function initArticleCatalog() {
  const cards = [...document.querySelectorAll('.journal-card')];
  const articleGrid = document.getElementById('articleGrid');
  const pagination = document.getElementById('articlePagination');
  const sectionTitle = document.getElementById('articleSectionTitle');
  const search = document.getElementById('articleSearch');
  const searchClear = document.getElementById('articleSearchClear');
  const categorySelect = document.getElementById('articleCategorySelectBox');
  const categoryButton = document.getElementById('articleCategoryBtn');
  const categoryButtonText = document.getElementById('articleCategoryBtnText');
  const categoryItems = [...document.querySelectorAll('#articleCategoryMenu .dropdown-item')];
  const sortSelect = document.getElementById('articleSortSelectBox');
  const sortButton = document.getElementById('articleSortBtn');
  const sortButtonText = document.getElementById('articleSortBtnText');
  const sortItems = [...document.querySelectorAll('#articleSortMenu .dropdown-item')];
  const filterCount = document.getElementById('articleFilterCount');
  const noResults = document.getElementById('noResults');

  if (!articleGrid || !search || !pagination) return;

  cards.forEach((card, index) => {
    card.dataset.order = index;
  });

  const articlesPerPage = 15;
  let category = 'all';
  let sortOrder = 'newest';
  let currentPage = 1;
  const paginationControl = window.PhivaraCatalog.createPagination({
    container: pagination,
    onPageChange(page) {
      currentPage = page;
      filterArticles();
      sectionTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  function currentLanguage() {
    return document.documentElement.lang === 'en' ? 'en' : 'th';
  }

  function updateHeading() {
    const language = currentLanguage();
    const selectedItem = categoryItems.find((item) => item.dataset.category === category);
    const categoryLabel = selectedItem?.getAttribute(`data-${language}`) || '';
    const query = search.value.trim();
    sectionTitle.textContent = query
      ? (language === 'en' ? `Search results for “${query}”` : `ผลการค้นหา “${query}”`)
      : categoryLabel;
  }

  function filterArticles() {
    const query = search.value.trim().toLowerCase();

    const sortedCards = [...cards].sort((first, second) => {
      const difference = Number(first.dataset.order) - Number(second.dataset.order);
      return sortOrder === 'oldest' ? -difference : difference;
    });
    articleGrid.append(...sortedCards);

    const matchedCards = sortedCards.filter((card) => {
      const matchesCategory = category === 'all' || card.dataset.category === category;
      const matchesQuery = !query || card.textContent.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });

    const totalPages = Math.ceil(matchedCards.length / articlesPerPage);
    currentPage = Math.min(currentPage, Math.max(1, totalPages));
    cards.forEach((card) => card.classList.add('hidden'));
    const firstIndex = (currentPage - 1) * articlesPerPage;
    matchedCards.slice(firstIndex, firstIndex + articlesPerPage).forEach((card) => card.classList.remove('hidden'));

    if (filterCount) filterCount.textContent = matchedCards.length;
    if (noResults) noResults.style.display = matchedCards.length ? 'none' : 'block';
    paginationControl.render(currentPage, totalPages);
    updateHeading();
  }

  const dropdowns = window.PhivaraCatalog.createDropdownGroup([
    {
      name: 'category',
      selectBox: categorySelect,
      button: categoryButton,
      buttonText: categoryButtonText,
      items: categoryItems,
      valueKey: 'category',
      onSelect(value) {
        category = value;
        currentPage = 1;
        filterArticles();
      }
    },
    {
      name: 'sort',
      selectBox: sortSelect,
      button: sortButton,
      buttonText: sortButtonText,
      items: sortItems,
      valueKey: 'sort',
      onSelect(value) {
        sortOrder = value;
        currentPage = 1;
        filterArticles();
      }
    }
  ]);

  document.addEventListener('phivara:languagechange', filterArticles);

  const searchControl = window.PhivaraCatalog.createSearch({
    input: search,
    clearButton: searchClear,
    onSearch() {
      currentPage = 1;
      filterArticles();
    }
  });

  // Pre-filter from URL, e.g. article.html?category=longevity (used by ecosystem.html links)
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  if (categoryParam && dropdowns.category) {
    dropdowns.category.selectByValue(categoryParam);
  }

  filterArticles();
}

initArticleCatalog();
