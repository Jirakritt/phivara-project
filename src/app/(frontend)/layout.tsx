import React from 'react'
import Script from 'next/script'

// Root layout for the public site. Loads the same fonts + base stylesheets
// every page needs (site-shell.css covers header/footer/mobile menu, which
// every page renders via SiteHeader/SiteFooter). Page-specific stylesheets
// (e.g. journal-card.css, vip-modal.css) are declared by each page.
//
// Also owns the site-wide PDPA consent banner + GA4/Meta Pixel bootstrap
// (public/js/consent-banner.js) — this is the one place that renders on
// every page regardless of route, so it's the right spot for something
// that must appear everywhere rather than duplicating it per page like the
// legacy page-specific scripts.
export const metadata = {
  title: 'PHIVARA | The Art of Beaugevity',
  description: 'Hospital-grade aesthetic & longevity destination.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Both env vars are optional and blank until real GA4/Meta accounts
  // exist — consent-banner.js only loads a script when its id is actually
  // present, so an unset id here just means that one stays off entirely,
  // not a broken/placeholder state.
  const analyticsScript = `window.__PHIVARA_ANALYTICS__ = ${JSON.stringify({
    gaId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || '',
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
  }).replace(/</g, '\\u003c')};`

  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400;1,500;1,600&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Prompt:wght@200;300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/css/main_gpt.css" />
        <link rel="stylesheet" href="/css/site-shell.css" />
        <link rel="stylesheet" href="/css/consent-banner.css" />
        <Script id="phivara-analytics-config" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: analyticsScript }} />
      </head>
      <body>
        {children}

        <div id="consentBanner" role="region" aria-label="Cookie consent" hidden>
          <div className="consent-banner-inner">
            <div className="consent-banner-copy">
              {/* site-runtime.js's language toggle does `element.textContent =
                  data-th/data-en` on every match with no "skip if it has
                  element children" guard — so data-th/data-en must live only
                  on leaf nodes here, never on a parent wrapping the <a>, or
                  switching language would wipe out the link. */}
              <p>
                <span data-th="เว็บไซต์นี้ใช้คุกกี้เพื่อวิเคราะห์การใช้งานและปรับปรุงประสบการณ์ของคุณ คุณสามารถเลือกยอมรับหรือปฏิเสธได้ อ่านรายละเอียดเพิ่มเติมได้ที่ " data-en="This site uses cookies to analyze usage and improve your experience. You can accept or decline. Read more in our ">
                  เว็บไซต์นี้ใช้คุกกี้เพื่อวิเคราะห์การใช้งานและปรับปรุงประสบการณ์ของคุณ คุณสามารถเลือกยอมรับหรือปฏิเสธได้ อ่านรายละเอียดเพิ่มเติมได้ที่{' '}
                </span>
                <a href="/privacy-policy" data-th="นโยบายความเป็นส่วนตัว" data-en="Privacy Policy">นโยบายความเป็นส่วนตัว</a>
              </p>
            </div>
            <div className="consent-banner-actions">
              <button type="button" id="consentRejectBtn" data-th="ปฏิเสธ" data-en="Decline">ปฏิเสธ</button>
              <button type="button" id="consentAcceptBtn" data-th="ยอมรับ" data-en="Accept">ยอมรับ</button>
            </div>
          </div>
        </div>
        <Script src="/js/consent-banner.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
