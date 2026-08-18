import { headers } from 'next/headers'

import NotFoundContent from '@/components/NotFoundContent'
import { DEFAULT_LOCALE, isLocaleCode, translator } from '@/lib/i18n'
import type { LocaleCode } from '@/lib/i18n'

// Handles notFound() calls thrown from a *matched* route under [locale]/
// (e.g. /[locale]/doctor/[slug] for a slug that doesn't exist, or a locale
// segment that's syntactically valid but not currently publiclyLive — see
// [locale]/layout.tsx). [locale]/layout.tsx already supplies <html>/<body>,
// fonts, and stylesheets, so this only needs its own page-specific CSS plus
// the preloader shell every page renders.
//
// Next.js resolves notFound() to the nearest not-found.tsx in the route
// segment tree — this file being inside [locale]/ means it's used instead
// of the old flat src/app/(frontend)/not-found.tsx for every route under
// this tree, but it can't read the `locale` route param directly (Next.js
// doesn't pass params to not-found.tsx). Worked around via
// src/middleware.ts, which stamps the resolved locale onto an
// `x-phivara-locale` request header for every request whose first path
// segment is a valid locale code — read back here via next/headers so the
// 404 page (title + NotFoundContent body) renders in the visited locale
// instead of always falling back to DEFAULT_LOCALE (th).
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
    robots: { index: false, follow: false },
  }
}

export default async function NotFound() {
  const locale = await resolveLocale()
  return (
    <>
      <link rel="stylesheet" href="/css/main.css" />
      <link rel="stylesheet" href="/css/journal-card.css" />
      <link rel="stylesheet" href="/css/404.css" />
      <link rel="stylesheet" href="/css/vip-modal.css" />

      <div id="preloader">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <path d="M50 8 C60 28 78 40 92 50 C78 60 60 72 50 92 C40 72 22 60 8 50 C22 40 40 28 50 8Z" />
        </svg>
        <div className="pre-word">PHIVARA</div>
      </div>
      <div id="progressBar"></div>
      <div id="cursorRing"></div>

      <NotFoundContent locale={locale} />
    </>
  )
}
