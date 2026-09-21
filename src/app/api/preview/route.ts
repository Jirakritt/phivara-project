import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Lets a reviewer (e.g. a native speaker checking ja/zh/vi/ar UI copy)
// browse a locale that isn't publiclyLive yet (src/lib/i18n-server.ts's
// getPubliclyLiveLocales, enforced in src/app/[locale]/(public)/layout.tsx)
// without flipping it on for every visitor/search engine.
//
// Visiting this URL with the right secret sets Next's own signed "draft
// mode" cookie (httpOnly, can't be forged or read/copied by client JS) on
// the reviewer's browser, then redirects them into the site. The
// (public)/layout.tsx gate checks draftMode().isEnabled and skips the
// not-live 404 for that request only — everyone else still gets the normal
// 404 for a locale that isn't live. See /api/preview/disable/route.ts to
// turn it back off.
//
// PREVIEW_SECRET must be set in .env (same pattern as PAYLOAD_SECRET) —
// generate one with `openssl rand -base64 32` and share the resulting
// preview URL only with whoever needs to review, not publicly.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const rawSecret = searchParams.get('secret')
  const redirectPath = searchParams.get('redirect') || '/'

  // PREVIEW_SECRET is base64 (openssl rand -base64 32), which can contain a
  // literal "+". If whoever shares the link pastes it into the URL without
  // percent-encoding, URLSearchParams (per the WHATWG URL spec, following
  // the x-www-form-urlencoded convention) reads that unencoded "+" as a
  // space — so "AB+CD" arrives here as "AB CD" and silently fails to match.
  // Base64 never contains a real space, so undoing that swap is safe and
  // lets both the correctly-encoded (%2B) and raw (+) forms of the link work.
  const secret = rawSecret?.replace(/ /g, '+') ?? rawSecret

  if (!process.env.PREVIEW_SECRET || secret !== process.env.PREVIEW_SECRET) {
    return NextResponse.json({ error: 'Invalid or missing preview secret' }, { status: 401 })
  }

  // Only allow redirecting within this site — a redirect target coming
  // from a query param is otherwise an open-redirect risk.
  const safePath = redirectPath.startsWith('/') && !redirectPath.startsWith('//') ? redirectPath : '/'

  const draft = await draftMode()
  draft.enable()

  return NextResponse.redirect(new URL(safePath, request.url))
}
