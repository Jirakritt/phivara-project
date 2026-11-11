import NotFoundByLocale from '@/components/NotFoundByLocale'
import NotFoundContent from '@/components/NotFoundContent'
import { DEFAULT_LOCALE } from '@/lib/i18n'
import { getPubliclyLiveLocales } from '@/lib/i18n-server'

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
// NOTE: deliberately does NOT read headers() here. generateMetadata of a
// not-found boundary is evaluated for the whole [locale] segment, so a
// headers() call here silently turned EVERY public page into a dynamic,
// no-store render (~4s TTFB, `revalidate` ignored). Locale-neutral
// bilingual title instead; the 404 body below still renders per-locale.
export async function generateMetadata() {
  return {
    title: 'PHIVARA | ไม่พบหน้าที่คุณค้นหา | Page Not Found',
    robots: { index: false, follow: false },
  }
}

export default async function NotFound() {
  // Only publicly-live locales (usually th+en): keeps a 404 to a few queries.
  const liveLocales = await getPubliclyLiveLocales()
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

      <NotFoundByLocale
        fallback={DEFAULT_LOCALE}
        variants={Object.fromEntries(
          liveLocales.map((code) => [code, <NotFoundContent key={code} locale={code} />]),
        )}
      />
    </>
  )
}
