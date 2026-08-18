import Script from 'next/script'

import NotFoundContent from '@/components/NotFoundContent'

// Experimental Next.js 15.4+ convention (enabled via experimental.globalNotFound
// in next.config.mjs) for URLs that don't match any route at all. This app
// has two root layouts — [locale]/layout.tsx for the public site and
// (payload)/layout.tsx for the Payload admin panel — so there's no single
// shared root layout Next.js can compose a normal root not-found.tsx from
// for a completely unmatched URL (e.g. a typo'd or deleted link). This file
// bypasses layout rendering entirely, so — unlike every other page in this
// app — it has to bring its own <html>/<body>, fonts, stylesheets, and the
// PDPA consent banner (normally each root layout's own job) itself.
// See src/app/[locale]/not-found.tsx for the counterpart that handles
// notFound() thrown from a *matched* route (missing doctor/article/etc. slug).
//
// (The old flat, non-[locale] page tree — which used to be a third root
// layout here — was retired during the Phase 2 i18n cutover; its source
// lives at _archive/frontend-flat-pages-pre-i18n/ for rollback, outside
// src/app/ so Next.js no longer builds it.)
export const metadata = {
  title: 'PHIVARA | ไม่พบหน้าที่คุณค้นหา',
}

export default function GlobalNotFound() {
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
        <link rel="stylesheet" href="/css/main.css" />
        <link rel="stylesheet" href="/css/site-shell.css" />
        <link rel="stylesheet" href="/css/journal-card.css" />
        <link rel="stylesheet" href="/css/404.css" />
        <link rel="stylesheet" href="/css/vip-modal.css" />
        <link rel="stylesheet" href="/css/consent-banner.css" />
        <Script id="phivara-analytics-config" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: analyticsScript }} />
      </head>
      <body>
        <div id="preloader">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <path d="M50 8 C60 28 78 40 92 50 C78 60 60 72 50 92 C40 72 22 60 8 50 C22 40 40 28 50 8Z" />
          </svg>
          <div className="pre-word">PHIVARA</div>
        </div>
        <div id="progressBar"></div>
        <div id="cursorRing"></div>

        <NotFoundContent />

        <div id="consentBanner" role="region" aria-label="Cookie consent" hidden>
          <div className="consent-banner-inner">
            <div className="consent-banner-copy">
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
