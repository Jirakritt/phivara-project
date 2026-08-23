import type { Metadata } from 'next'
import Script from 'next/script'
import React from 'react'

import { LOCALE_GOOGLE_FONTS } from '@/lib/fonts'
import { DEFAULT_LOCALE, isLocaleCode, isRtl, translator } from '@/lib/i18n'
import type { LocaleCode } from '@/lib/i18n'

// Root layout for the public site tree (src/app/[locale]/**).
// Deliberately a TOP-LEVEL sibling of the (payload) route group, not
// nested inside a (frontend) group — this file renders its own
// <html>/<body>, so it must sit where no other layout.tsx sits above it
// in the tree, same as (payload)/layout.tsx does for the admin panel
// (see next.config.mjs's experimental.globalNotFound comment: two
// independent root layouts). It was briefly nested at
// src/app/(frontend)/[locale]/** during initial Phase 2 development,
// which caused a real bug — the old (frontend)/layout.tsx's own
// <html lang="th"> wrapped THIS layout's <html>, an invalid nested-html-tag
// structure that only surfaced as a React hydration mismatch on the `dir`
// attribute in the browser, not as a build error. Moving this folder up
// one level to be a sibling of (frontend) fixed it, ahead of the Phase 2
// cutover that retired (frontend)'s old flat pages entirely (see
// _archive/frontend-flat-pages-pre-i18n/ and src/middleware.ts's
// PHASE_2_LOCALE_ROUTING_LIVE flag, now permanently true).
//
// Loads the same fonts + base stylesheets every page needs (site-shell.css
// covers header/footer/mobile menu, which every page renders via
// SiteHeader/SiteFooter). Page-specific stylesheets (e.g. journal-card.css,
// vip-modal.css) are declared by each page.
//
// Also owns the site-wide PDPA consent banner + GA4/Meta Pixel bootstrap
// (public/js/consent-banner.js) — this is the one place that renders on
// every page regardless of route, so it's the right spot for something
// that must appear everywhere rather than duplicating it per page.
const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

function resolveLocale(raw: string): LocaleCode {
  return isLocaleCode(raw) ? raw : DEFAULT_LOCALE
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  const locale = resolveLocale(raw)
  const t = translator(locale)
  const title = t('PHIVARA | ศิลปะแห่ง Beaugevity', 'PHIVARA | The Art of Beaugevity')
  const description = t(
    'จุดหมายด้านความงามและเวชศาสตร์อายุยืนยาวมาตรฐานโรงพยาบาล',
    'Hospital-grade aesthetic & longevity destination.',
  )

  return {
    // Needed so relative Open Graph image URLs (e.g. an uploaded media
    // file's /api/media/... path) resolve to absolute URLs — required by
    // LINE/Facebook/Twitter, which won't fetch a relative image path.
    metadataBase: new URL(SITE_URL),
    title,
    description,
    // Site-wide fallback for any page that doesn't set its own openGraph
    // (e.g. static pages like /membership, /ecosystem, /contact) — article/
    // program/doctor detail pages override this with their own seo.ogImage
    // or cover image (see generateMetadata in their respective page.tsx).
    openGraph: {
      siteName: 'PHIVARA',
      title,
      description,
      images: [{ url: '/logo/phivara_logo.jpg' }],
      locale: locale === 'en' ? 'en_US' : 'th_TH',
      type: 'website',
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  const locale = resolveLocale(raw)
  const t = translator(locale)

  // The publiclyLive guard used to live here, but a root layout (this
  // file owns <html>/<body>) can't call notFound() and still get a custom
  // not-found.tsx rendered — Next.js has no outer layout left to compose
  // the fallback into once the root layout itself throws. It moved to
  // src/app/[locale]/(public)/layout.tsx, a nested (non-root) layout,
  // where notFound() resolves to [locale]/not-found.tsx correctly with a
  // real 404 status. See that file's comment for the full story. This
  // layout now renders unconditionally for every locale in LOCALE_CODES —
  // fonts/CSS below are keyed off the syntactic locale, not liveness.

  // Phase 4: only fetch the extra Google Fonts family a locale actually
  // needs (see src/lib/fonts.ts) — th/en/vi/ms/id/de/fr all render fine on
  // the default Thai+Latin typefaces already loaded below, so this is
  // undefined for them and no extra request happens. The CSS variables
  // this family plugs into (--sans/--serif/--shell-sans/--shell-serif) are
  // overridden via `html[lang="…"]` rules in site-shell.css, not inline
  // here — that selector's specificity beats every page-level stylesheet's
  // plain `:root{--sans:…}` rule regardless of load order (see that file's
  // comment for why this matters).
  const localeFont = LOCALE_GOOGLE_FONTS[locale]

  // Both env vars are optional and blank until real GA4/Meta accounts
  // exist — consent-banner.js only loads a script when its id is actually
  // present, so an unset id here just means that one stays off entirely,
  // not a broken/placeholder state.
  const analyticsScript = `window.__PHIVARA_ANALYTICS__ = ${JSON.stringify({
    gaId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID || '',
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID || '',
  }).replace(/</g, '\\u003c')};`

  // The VIP Concierge booking modal (public/js/vip-modal.js) is legacy
  // client-side JS predating this i18n rewrite — it built its own markup
  // with hardcoded Thai text plus data-th/data-en attributes, and picked
  // between them via `document.documentElement.lang.startsWith('en') ?
  // 'en' : 'th'`, so every locale beyond th/en silently rendered Thai (a
  // real bug: found when testing the modal on /ja). Rather than teach that
  // file its own copy of every locale's translations, this injects the
  // already-resolved strings (via the same t()/pickText()+UI_DICTIONARY
  // used everywhere else) as a global the script reads once when it builds
  // the modal — vip-modal.js no longer does any client-side translation of
  // its own. See that file's VIP_MODAL_STRINGS/FALLBACK comment.
  const vipModalScript = `window.__PHIVARA_VIP_MODAL__ = ${JSON.stringify({
    locale,
    t: {
      brandQuote: t('การดูแลที่ออกแบบ รอบตัวคุณ', 'Care designed around you.'),
      point1: t('ผู้ประสานงานส่วนตัวตลอดการนัดหมาย', 'A dedicated coordinator throughout your appointment'),
      point2: t('เลือกเวลาและสาขาที่เหมาะกับคุณ', 'Choose a time and location that suits you'),
      point3: t('ข้อมูลของคุณได้รับการดูแลอย่างเป็นส่วนตัว', 'Your information is handled with discretion'),
      modalTitle: t('นัดหมายปรึกษาเฉพาะบุคคล', 'Book a Private Consultation'),
      modalLead: t(
        'ฝากข้อมูลไว้ แล้วทีม Concierge จะติดต่อกลับเพื่อจัดเวลาที่เหมาะกับคุณ',
        'Share your details and our Concierge team will arrange a time that suits you.',
      ),
      fieldName: t('ชื่อ - นามสกุล', 'Full Name'),
      namePlaceholder: t('คุณสมชาย ใจดี', 'Your full name'),
      fieldPhone: t('เบอร์โทรศัพท์', 'Phone Number'),
      phonePlaceholder: t('081-XXX-XXXX', 'Your phone number'),
      phoneError: t('กรุณากรอกเบอร์โทร 9–10 หลัก หรือรูปแบบ +66', 'Enter a 9–10 digit phone number or use the +66 format'),
      fieldBranch: t('สาขาที่สะดวก', 'Preferred Location'),
      selectBranchPlaceholder: t('เลือกสาขาที่สะดวก', 'Select a location'),
      fieldService: t('บริการที่สนใจ', 'Service of Interest'),
      selectServicePlaceholder: t('เลือกบริการที่สนใจ', 'Select a service'),
      servicePlasticSurgery: t('Plastic Surgery (ศัลยกรรมตกแต่ง)', 'Plastic Surgery'),
      serviceLongevity: t('Anti-Aging & Longevity (เวชศาสตร์อายุยืนยาว)', 'Anti-Aging & Longevity'),
      serviceDermatology: t('Dermatology (ผิวหนัง)', 'Dermatology'),
      serviceWellness: t('Aesthetic Wellness (สุขภาวะเชิงความงาม)', 'Aesthetic Wellness'),
      serviceMembership: t('สมาชิก PHIVARA AUM', 'PHIVARA AUM Membership'),
      fieldNotes: t('ข้อความเพิ่มเติม / เวลาที่สะดวก', 'Notes / Preferred Time'),
      notesPlaceholder: t(
        'ระบุเรื่องที่ต้องการปรึกษาหรือเวลาที่สะดวก',
        'Tell us what you would like to discuss or your preferred time',
      ),
      formNote: t(
        'ข้อมูลของคุณจะใช้เพื่อการติดต่อกลับและจัดการนัดหมายเท่านั้น',
        'Your information will only be used to contact you and arrange this appointment.',
      ),
      formError: t(
        'ขออภัย ระบบไม่สามารถส่งคำขอได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง หรือโทรติดต่อเราโดยตรง',
        "Sorry, we couldn't submit your request right now. Please try again or call us directly.",
      ),
      submitLabel: t('ส่งคำขอนัดหมาย', 'Request an Appointment'),
      thankYouTitle: t('ขอบคุณค่ะ', 'Thank You'),
      thankYouBody: t(
        'ทีมงาน PHIVARA VIP Concierge จะติดต่อกลับโดยเร็วที่สุด',
        'Our PHIVARA VIP Concierge team will be in touch with you shortly.',
      ),
      doctorPrefix: t('แพทย์ที่ต้องการปรึกษา: ', 'Preferred doctor: '),
      programPrefix: t('โปรแกรมที่สนใจ: ', 'Program of interest: '),
    },
  }).replace(/</g, '\\u003c')};`

  return (
    <html lang={locale} dir={isRtl(locale) ? 'rtl' : 'ltr'}>
      <head>
        {localeFont && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href={`https://fonts.googleapis.com/css2?${localeFont.googleFontsQuery}&display=swap`} rel="stylesheet" />
          </>
        )}
        <link rel="stylesheet" href="/css/main_gpt.css" />
        <link rel="stylesheet" href="/css/site-shell.css" />
        <link rel="stylesheet" href="/css/consent-banner.css" />
        <Script id="phivara-analytics-config" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: analyticsScript }} />
        <Script id="phivara-vip-modal-strings" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: vipModalScript }} />
      </head>
      <body>
        {children}

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
