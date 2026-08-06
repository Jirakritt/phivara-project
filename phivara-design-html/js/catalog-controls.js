(function () {
  'use strict';

  function currentLanguage() {
    return document.documentElement.lang === 'en' ? 'en' : 'th';
  }

  function createDropdownGroup(configurations) {
    const dropdowns = configurations.map((configuration) => {
      const items = [...configuration.items];
      const { selectBox, button, buttonText, valueKey, onSelect } = configuration;

      const dropdown = {
        close() {
          selectBox.classList.remove('open');
          button.setAttribute('aria-expanded', 'false');
        },

        select(item, { notify = true } = {}) {
          if (!item) return '';

          items.forEach((option) => option.classList.toggle('active', option === item));
          const language = currentLanguage();
          buttonText.textContent = item.getAttribute(`data-${language}`) || item.textContent;
          buttonText.dataset.th = item.dataset.th || '';
          buttonText.dataset.en = item.dataset.en || '';
          dropdown.close();

          const value = item.dataset[valueKey] || '';
          if (notify) onSelect(value, item);
          return value;
        },

        selectByValue(value, options) {
          const item = items.find((option) => option.dataset[valueKey] === value);
          return dropdown.select(item, options);
        }
      };

      return { ...configuration, items, dropdown };
    });

    dropdowns.forEach(({ selectBox, button, items, dropdown }) => {
      button.setAttribute('aria-haspopup', 'listbox');
      button.setAttribute('aria-expanded', 'false');
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const willOpen = !selectBox.classList.contains('open');
        dropdowns.forEach((item) => item.dropdown.close());
        selectBox.classList.toggle('open', willOpen);
        button.setAttribute('aria-expanded', String(willOpen));
      });

      items.forEach((item) => {
        item.addEventListener('click', (event) => {
          event.stopPropagation();
          dropdown.select(item);
        });
      });
    });

    document.addEventListener('click', () => {
      dropdowns.forEach((item) => item.dropdown.close());
    });

    return Object.fromEntries(
      dropdowns.map(({ name, dropdown }) => [name, dropdown])
    );
  }

  function createPagination({ container, onPageChange, showArrows = true }) {
    function addButton(label, page, { active = false, disabled = false, ariaLabel }) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.disabled = disabled;
      button.setAttribute('aria-label', ariaLabel);
      if (active) {
        button.classList.add('active');
        button.setAttribute('aria-current', 'page');
      }
      button.addEventListener('click', () => onPageChange(page));
      container.appendChild(button);
    }

    function render(currentPage, totalPages) {
      container.replaceChildren();
      if (totalPages <= 1) return;

      const language = currentLanguage();
      if (showArrows) {
        addButton('←', currentPage - 1, {
          disabled: currentPage === 1,
          ariaLabel: language === 'en' ? 'Previous page' : 'หน้าก่อนหน้า'
        });
      }

      for (let page = 1; page <= totalPages; page += 1) {
        addButton(String(page), page, {
          active: page === currentPage,
          ariaLabel: `${language === 'en' ? 'Page' : 'หน้า'} ${page}`
        });
      }

      if (showArrows) {
        addButton('→', currentPage + 1, {
          disabled: currentPage === totalPages,
          ariaLabel: language === 'en' ? 'Next page' : 'หน้าถัดไป'
        });
      }
    }

    return Object.freeze({ render });
  }

  function createSearch({ input, clearButton, onSearch }) {
    function updateClearButton() {
      clearButton?.classList.toggle('show', Boolean(input.value.trim()));
    }

    function notify() {
      updateClearButton();
      onSearch(input.value);
    }

    function clear({ focus = false, notify: shouldNotify = true } = {}) {
      input.value = '';
      updateClearButton();
      if (shouldNotify) onSearch('');
      if (focus) input.focus();
    }

    input.addEventListener('input', notify);
    clearButton?.addEventListener('click', () => clear({ focus: true }));
    updateClearButton();

    return Object.freeze({ clear });
  }

  function createFilterReset({ button, search, dropdowns, defaults, onReset }) {
    if (!button) return;

    button.addEventListener('click', () => {
      search?.clear({ notify: false });
      const values = Object.fromEntries(
        Object.entries(defaults).map(([name, value]) => [
          name,
          dropdowns[name].selectByValue(value, { notify: false })
        ])
      );
      onReset(values);
    });
  }

  window.PhivaraCatalog = Object.freeze({
    createDropdownGroup,
    createPagination,
    createSearch,
    createFilterReset
  });
})();
