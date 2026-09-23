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

  // Google's standard GTM install snippet also adds a <noscript><iframe>
  // fallback right after <body> that fires UNCONDITIONALLY, with no
  // consent check — deliberately NOT added here, since that would load
  // tracking before the PDPA banner's "accept" click, defeating the whole
  // point of gating loadAnalytics() behind consent in the first place.
  // No-JS visitors simply get no analytics, same as they'd get no GA4/Pixel
  // today (this whole site needs JS to render regardless).
  function loadGTM(gtmId) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(gtmId);
    document.head.appendChild(script);
    window.__phivaraGtmLoaded = true;
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
    if (cfg.gtmId) {
      // Marketing team's setup (2026-09): GA4 + Meta Pixel are configured
      // as tags INSIDE this one GTM container, not loaded directly by us —
      // see phivaraTrackLead() below for how the generate_lead event
      // reaches them. Deliberately skips the direct gaId/metaPixelId
      // branch entirely when gtmId is set, so nothing double-fires once
      // GTM's own GA4/Pixel tags are wired up on the marketing team's side.
      if (!window.__phivaraGtmLoaded) loadGTM(cfg.gtmId);
      return;
    }
    // Fallback for the period before a GTM container exists yet (or if the
    // team ever goes back to direct-only tracking) — same direct gtag.js /
    // Meta Pixel loading this site used before GTM.
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
    if (window.__phivaraGtmLoaded) {
      // GTM setup: push to dataLayer and let the GA4 + Meta Pixel tags
      // configured inside the GTM container (marketing team's side, not
      // this codebase) pick it up via their own triggers. Do NOT also call
      // gtag/fbq directly here — GTM's own tags already forward to both,
      // so doing both would double-count every lead.
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'generate_lead' });
      return;
    }
    // Fallback for the period before a GTM container exists yet — see
    // loadAnalytics() above for the matching direct-load branch.
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
