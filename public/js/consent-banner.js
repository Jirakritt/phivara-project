'use strict';

// Site-wide cookie banner + analytics loader. Loaded on every page from the
// root layout, which also injects `window.__PHIVARA_ANALYTICS__ = { gtmId,
// gaId, metaPixelId }` from NEXT_PUBLIC_GTM_CONTAINER_ID /
// NEXT_PUBLIC_GA4_MEASUREMENT_ID / NEXT_PUBLIC_META_PIXEL_ID.
//
// PHIVARA policy (confirmed by the team, 2026-10): cookies needed to run and
// improve the site, i.e. Google Tag Manager / GA4 analytics, load on every
// page view and do NOT depend on the banner buttons. The accept / decline
// choice is still recorded and now governs MARKETING / advertising cookies
// only:
//   - Google Consent Mode: before GTM/gtag loads we push a consent default
//     of analytics_storage = granted and ad_storage / ad_user_data /
//     ad_personalization = denied; "accept" updates those three to granted,
//     "decline" (or no answer) leaves / returns them denied. Ad tags in the
//     GTM container that honour consent settings follow that choice.
//   - The Meta Pixel snippet loaded DIRECTLY by this file (only used when no
//     GTM id is set) is injected after "accept" only.
// Whether this policy is compliant is the team's / DPO's call; to go back to
// strict opt-in, load GTM/GA4 only inside the accept handler again.
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
  // fallback right after <body>. Not added here: it can't carry the Consent
  // Mode defaults set above (ad_* = denied until "accept"), and this whole
  // site needs JS to render anyway, so no-JS visitors get no analytics.
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

  // Consent Mode helpers (see header). Pushes the same `arguments` object
  // gtag() would, so gtm.js and gtag.js both understand it.
  function pushGtag() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }
  function setConsentDefaults(marketingGranted) {
    var m = marketingGranted ? 'granted' : 'denied';
    pushGtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: m,
      ad_user_data: m,
      ad_personalization: m,
    });
  }
  function updateMarketingConsent(granted) {
    var m = granted ? 'granted' : 'denied';
    pushGtag('consent', 'update', { ad_storage: m, ad_user_data: m, ad_personalization: m });
  }

  // Analytics: always loaded (policy above). GTM wins over direct GA4 when
  // both ids exist so nothing double-counts once GTM's own GA4 tag is live.
  function loadAnalytics() {
    var cfg = window.__PHIVARA_ANALYTICS__ || {};
    if (cfg.gtmId) {
      // GA4 + Meta Pixel are expected to be configured as tags INSIDE the
      // GTM container (marketing team's side); phivaraTrackLead() below
      // pushes generate_lead to the dataLayer for them.
      if (!window.__phivaraGtmLoaded) loadGTM(cfg.gtmId);
      return;
    }
    // No GTM container: direct GA4 (analytics) as before.
    if (cfg.gaId && typeof window.gtag !== 'function') loadGA4(cfg.gaId);
  }

  // Marketing: Meta Pixel loaded directly by us, after "accept" only. With a
  // GTM container the Pixel lives inside GTM and follows Consent Mode instead.
  function loadMarketing() {
    var cfg = window.__PHIVARA_ANALYTICS__ || {};
    if (cfg.gtmId) return;
    if (cfg.metaPixelId && typeof window.fbq !== 'function') loadMetaPixel(cfg.metaPixelId);
  }

  // Public API used elsewhere on the site:
  // - vip-modal.js calls phivaraTrackLead() after a successful booking
  //   submission. Safe no-op if no GTM/GA4/Pixel id is configured yet.
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

  // Homepage only: (public)/page.tsx sets window.__PHIVARA_POPUP_GATE__ =
  // 'pending' while the "special day" popup (HomePopup.tsx) may still show.
  // The first-visit banner waits for it ('done' via phivaraPopupDone) so the
  // two never stack; a fallback timer guarantees the banner still appears
  // even if the popup code never reports back.
  var bannerWaiting = false;
  function popupBusy() {
    var gate = window.__PHIVARA_POPUP_GATE__;
    return gate === 'pending' || gate === 'open';
  }
  function showBannerWhenFree() {
    if (!popupBusy()) {
      showBanner();
      return;
    }
    bannerWaiting = true;
    setTimeout(function () {
      // 'pending' this long means HomePopup never ran/answered; an 'open'
      // popup is still on screen, so keep waiting for its close.
      if (bannerWaiting && window.__PHIVARA_POPUP_GATE__ === 'pending') window.phivaraPopupDone();
    }, 12000);
  }
  window.phivaraPopupDone = function () {
    window.__PHIVARA_POPUP_GATE__ = 'done';
    if (bannerWaiting) {
      bannerWaiting = false;
      showBanner();
    }
  };

  var existing = readConsent();
  var marketingGranted = !!(existing && existing.choice === 'granted');
  // Consent Mode default first, THEN GTM/gtag (they read what's in the
  // dataLayer when they start). Analytics always loads (see header).
  setConsentDefaults(marketingGranted);
  loadAnalytics();
  if (marketingGranted) {
    loadMarketing();
    hideBanner(true);
  } else if (existing && existing.choice === 'denied') {
    hideBanner(true);
  } else {
    showBannerWhenFree();
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', function () {
      writeConsent('granted');
      updateMarketingConsent(true);
      loadMarketing();
      hideBanner();
    });
  }
  if (rejectBtn) {
    rejectBtn.addEventListener('click', function () {
      writeConsent('denied');
      updateMarketingConsent(false);
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
