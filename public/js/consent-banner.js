'use strict';

// Site-wide PDPA consent banner + gated analytics loader. Loaded on every
// page from the root layout (src/app/(frontend)/layout.tsx), which also
// injects `window.__PHIVARA_ANALYTICS__ = { gaId, metaPixelId }` from
// NEXT_PUBLIC_GA4_MEASUREMENT_ID / NEXT_PUBLIC_META_PIXEL_ID.
//
// Thailand's PDPA requires explicit opt-in before any non-essential
// tracking runs — implied consent (e.g. "kept browsing = accepted") isn't
// valid. So GA4/Meta Pixel are never loaded up front: gtag.js and the
// Meta Pixel snippet are only injected here, after the fact, once the
// visitor actively clicks "accept". Rejecting (or just not answering yet)
// means neither script ever touches the page.
function initConsentBanner() {
  var STORAGE_KEY = 'phivara_consent';
  var banner = document.getElementById('consentBanner');
  var acceptBtn = document.getElementById('consentAcceptBtn');
  var rejectBtn = document.getElementById('consentRejectBtn');
  var cookieSettingsLink = document.getElementById('cookieSettingsLink');
  if (!banner) return;

  function readConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function writeConsent(choice) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice: choice, timestamp: new Date().toISOString() }));
    } catch (e) {
      // localStorage unavailable (private mode, etc.) — the banner will
      // just reappear next visit, which is an acceptable fallback.
    }
  }

  function showBanner() {
    banner.hidden = false;
    // A plain setTimeout (rather than requestAnimationFrame) so the
    // slide-up transition still triggers reliably even in a background/
    // unfocused tab, where rAF callbacks can be throttled or deferred
    // indefinitely by the browser.
    setTimeout(function () {
      banner.classList.add('visible');
    }, 20);
  }

  function hideBanner(immediate) {
    if (immediate) {
      banner.hidden = true;
      return;
    }
    banner.classList.remove('visible');
    setTimeout(function () {
      banner.hidden = true;
    }, 500);
  }

  function loadGA4(gaId) {
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gaId);
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', gaId);
  }

  function loadMetaPixel(pixelId) {
    /* eslint-disable */
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = true; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    /* eslint-enable */
    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
  }

  function loadAnalytics() {
    var cfg = window.__PHIVARA_ANALYTICS__ || {};
    if (cfg.gaId && typeof window.gtag !== 'function') loadGA4(cfg.gaId);
    if (cfg.metaPixelId && typeof window.fbq !== 'function') loadMetaPixel(cfg.metaPixelId);
  }

  // Public API used elsewhere on the site:
  // - vip-modal.js calls phivaraTrackLead() after a successful booking
  //   submission. Safe no-op if analytics was never loaded (no consent, or
  //   no GA4/Pixel id configured yet).
  // - SiteFooter's "Cookie Settings" link calls phivaraReopenConsent() so a
  //   visitor can change their mind after the initial choice.
  window.phivaraTrackLead = function () {
    if (typeof window.gtag === 'function') window.gtag('event', 'generate_lead');
    if (typeof window.fbq === 'function') window.fbq('track', 'Lead');
  };
  window.phivaraReopenConsent = function () {
    showBanner();
  };

  var existing = readConsent();
  if (existing && existing.choice === 'granted') {
    loadAnalytics();
    hideBanner(true);
  } else if (existing && existing.choice === 'denied') {
    hideBanner(true);
  } else {
    showBanner();
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', function () {
      writeConsent('granted');
      loadAnalytics();
      hideBanner();
    });
  }
  if (rejectBtn) {
    rejectBtn.addEventListener('click', function () {
      writeConsent('denied');
      hideBanner();
    });
  }
  if (cookieSettingsLink) {
    cookieSettingsLink.addEventListener('click', function (e) {
      e.preventDefault();
      window.phivaraReopenConsent();
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initConsentBanner);
} else {
  initConsentBanner();
}
