import { headers } from 'next/headers'
import Script from 'next/script'

import NotFoundContent from '@/components/NotFoundContent'
import { DEFAULT_LOCALE, isLocaleCode, isRtl, translator } from '@/lib/i18n'
import type { LocaleCode } from '@/lib/i18n'

// Experimental Next.js 15.4+ convention (enabled via experimental.globalNotFound
// in next.config.mjs) for URLs that don't match any route at all — including
// ones with a syntactically valid /xx/ locale prefix (e.g. /ja/doc/xxx),
// since [locale] only matches a single segment and there's no catch-all
// under [locale]/(public)/, so an unrecognized second segment makes the
// whole path unroutable rather than falling through to
// [locale]/not-found.tsx. This app has two root layouts — [locale]/layout.tsx
// for the public site and (payload)/layout.tsx for the Payload admin panel —
// so there's no single shared root layout Next.js can compose a normal root
// not-found.tsx from for a completely unmatched URL. This file bypasses
// layout rendering entirely, so — unlike every other page in this app — it
// has to bring its own <html>/<body>, fonts, stylesheets, and the PDPA
// consent banner (normally each root layout's own job) itself.
// See src/app/[locale]/not-found.tsx for the counterpart that handles
// notFound() thrown from a *matched* route (missing doctor/article/etc. slug).
//
// Locale resolution: src/middleware.ts stamps an `x-phivara-locale` request
// header for every request whose first path segment is a valid locale code
// (which /ja/doc/xxx's "ja" is, even though the rest of the path is
// unroutable) — same mechanism [locale]/not-found.tsx uses. Read back here so
// this page renders in the visited locale instead of being hardcoded to th.
// A request that reaches this file with NO valid locale-looking first
// segment at all (a truly malformed URL) still falls back to DEFAULT_LOCALE.
//
// (The old flat, non-[locale] page tree — which used to be a third root
// layout here — was retired during the Phase 2 i18n cutover; its source
// lives at _archive/frontend-flat-pages-pre-i18n/ for rollback, outside
// src/app/ so Next.js no longer builds it.)
async function resolveLocale(): Promise<LocaleCode> {
  const h = await headers()
  const raw = h.get('x-phivara-locale') ?? ''
  return isLocaleCode(raw) ? raw : DEFAULT_LOCALE
}

export async function generateMetadata() {
  const locale = await resolveLocale()
  const t = translator(locale)
  return {
    title: t('PHIVARA | ไม่พบหน้าที่คุณค้นหา', 'PHIVARA | Page Not Found'),
  }
}

export default async function GlobalNotFound() {
  const locale = await resolveLocale()
  const t = translator(locale)
  const analyticsScript = `window.__PHIVARA_ANALYTICS__ = ${JSON.stringify({
    gaId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || '',
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
  }).replace(/</g, '\\u003c')};`

  return (
    <html lang={locale} dir={isRtl(locale) ? 'rtl' : 'ltr'}>
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

        <NotFoundContent locale={locale} />

        <div id="consentBanner" role="region" aria-label="Cookie consent" hidden>
          <div className="consent-banner-inner">
            <div className="consent-banner-copy">
              <p>
                {t(
                  'เว็บไซต์นี้ใช้คุกกี้เพื่อวิเคราะห์การใช้งานและปรับปรุงประสบการณ์ของคุณ คุณสามารถเลือกยอมรับหรือปฏิเสธได้ อ่านรายละเอียดเพิ่มเติมได้ที่ ',
                  'This site uses cookies to analyze usage and improve your experience. You can accept or decline. Read more in our ',
                )}
                <a href={`/${locale}/privacy-policy`}>{t('นโยบายความเป็นส่วนตัว', 'Privacy Policy')}</a>
              </p>
            </div>
            <div className="consent-banner-actions">
              <button type="button" id="consentRejectBtn">{t('ปฏิเสธ', 'Decline')}</button>
              <button type="button" id="consentAcceptBtn">{t('ยอมรับ', 'Accept')}</button>
            </div>
          </div>
        </div>
        <Script src="/js/consent-banner.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
