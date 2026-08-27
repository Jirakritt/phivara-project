import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { DEFAULT_LOCALE, isLocaleCode } from './lib/i18n'
import { checkRateLimit } from './lib/rateLimit'

// Both of these are public, unauthenticated POST endpoints that previously
// had zero abuse protection: /api/leads accepts anonymous booking
// submissions (spam risk), /api/members/forgot-password sends an email to
// whatever address is given (email-bombing / account-enumeration risk).
// Keyed by IP — see src/lib/rateLimit.ts for the (in-memory, single
// pm2-instance) implementation.
const RATE_LIMITED_ROUTES: Record<string, { limit: number; windowMs: number }> = {
  '/api/leads': { limit: 5, windowMs: 10 * 60 * 1000 }, // 5 requests / 10 min / IP
  '/api/members/forgot-password': { limit: 3, windowMs: 60 * 60 * 1000 }, // 3 requests / hour / IP
}

function clientIp(request: NextRequest): string {
  // Trusts X-Forwarded-For, which is fine here since this app always sits
  // behind the project's own nginx reverse proxy (never exposed directly).
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}

// Locale-prefixes every public-site URL (e.g. /doctor -> /th/doctor) so
// crawlers see a distinct, indexable URL per language instead of the old
// single-URL-plus-client-JS-toggle scheme. Runs on the Edge runtime — no
// Payload Local API access here (that needs a Node DB connection), so this
// only checks whether the URL's first segment already looks like one of
// the 14 provisioned locale codes; it does NOT check whether that locale
// is currently `publiclyLive`. That second, real check happens in
// src/app/[locale]/layout.tsx (a Server Component, full Node
// access) which 404s a syntactically-valid but not-yet-live locale (e.g.
// /ja/... before an Admin turns Japanese on) rather than silently serving
// it. Two layers, two different runtimes — see src/lib/i18n.ts's
// getPubliclyLiveLocales() for the second layer.
//
// STATUS: LIVE (cutover complete). The old flat (non-[locale]) page tree
// has been moved out of src/app/(frontend) to _archive/frontend-flat-pages-pre-i18n
// (kept for rollback, not part of the Next.js build since it's outside
// src/app/), src/app/[locale]/** is the only public route tree left, and
// every internal link has been locale-prefixed. Every unprefixed request
// now redirects to /${DEFAULT_LOCALE}/... below.
const PHASE_2_LOCALE_ROUTING_LIVE = true

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rate-limit check runs first and short-circuits — these two paths are
  // matched explicitly below (config.matcher) alongside, not instead of,
  // the locale-routing catch-all, so any request to them (any method, not
  // just POST) must return here rather than fall through into the
  // locale-redirect logic meant for public page routes (which would
  // otherwise 302 a GET/OPTIONS to these API paths to /th/api/... instead
  // of reaching the actual API route).
  if (pathname in RATE_LIMITED_ROUTES) {
    if (request.method === 'POST') {
      const rule = RATE_LIMITED_ROUTES[pathname]
      const allowed = checkRateLimit(`${pathname}:${clientIp(request)}`, rule.limit, rule.windowMs)
      if (!allowed) {
        return new NextResponse('Too Many Requests', { status: 429 })
      }
    }
    return NextResponse.next()
  }

  if (!PHASE_2_LOCALE_ROUTING_LIVE) return NextResponse.next()

  const firstSegment = pathname.split('/')[1] || ''

  if (isLocaleCode(firstSegment)) {
    // Stamp the resolved locale onto a request header so Server Components
    // that can't receive route params directly — notably
    // src/app/[locale]/not-found.tsx, which Next.js never passes `params`
    // to even though it lives inside the [locale]/ segment — can still
    // read the visited locale via next/headers' headers() instead of
    // falling back to DEFAULT_LOCALE for every 404.
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-phivara-locale', firstSegment)
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  const url = request.nextUrl.clone()
  url.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    // Skip: Payload admin + API, Next internals, sitemap/robots (not
    // locale-specific for now), and any request for a file with an
    // extension (images/css/js/fonts under public/, favicon, etc.).
    '/((?!admin|api|_next/static|_next/image|sitemap\\.xml|robots\\.txt|.*\\.[\\w]+$).*)',
    // Explicitly re-included despite the /api exclusion above — these two
    // need the rate-limit check even though the rest of /api is left alone.
    '/api/leads',
    '/api/members/forgot-password',
  ],
}
