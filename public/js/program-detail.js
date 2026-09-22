'use strict';

// Multi-unit programs only (e.g. Botox 50 vs 100 units — see
// cms/collections/Programs.ts's `priceVariants` field): toggles which
// radio-style option card is selected and swaps the displayed package
// price. Purely a client-side display swap — the server already rendered
// option 0's price on first paint (see [slug]/page.tsx's
// `initialVisualPrice`), so there's no flash of a wrong price before this
// runs.
(() => {
  function initProgramVariantSelect() {
    const wrap = document.getElementById('programVariantSelect');
    // The price itself is only shown in two places once a package is
    // selected: on each option card (server-rendered, never changes) and
    // on the hero image's floating price tag, which this keeps in sync.
    const heroPriceEl = document.getElementById('programPriceValue');
    const priceTag = document.getElementById('programPriceTag');
    if (!wrap || !heroPriceEl) return;
    const buttons = Array.from(wrap.querySelectorAll('button[data-variant-price]'));
    if (!buttons.length) return;

    wrap.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-variant-price]');
      if (!button) return;
      buttons.forEach((b) => {
        const isActive = b === button;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-checked', String(isActive));
      });
      const price = Number(button.dataset.variantPrice || 0);
      const formatted = price.toLocaleString('en-US');
      heroPriceEl.textContent = formatted;
      if (priceTag) {
        const unit = document.documentElement.lang && document.documentElement.lang.startsWith('en') ? 'THB' : 'บาท';
        priceTag.setAttribute('aria-label', `${formatted} ${unit}`);
      }
    });
  }

  initProgramVariantSelect();
})();
