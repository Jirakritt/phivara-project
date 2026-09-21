import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { DEFAULT_LOCALE, isLocaleCode } from '@/lib/i18n'
import { getPubliclyLiveLocales } from '@/lib/i18n-server'
import type { LocaleCode } from '@/lib/i18n'

// Publicly-live gate for every real page under [locale]/ — split out of
// [locale]/layout.tsx (the root layout) on purpose, after discovering a
// real bug: notFound() thrown from a ROOT layout (one that owns
// <html>/<body>) has no valid not-found.tsx to fall back to, because the
// only layout that could compose that fallback page is the very root
// layout that's already mid-throw. Confirmed live — visiting a
// syntactically valid but non-live locale (e.g. /de, /ar) rendered Next's
// bare unstyled built-in 404 instead of [locale]/not-found.tsx's branded
// PHIVARA 404 page, for every locale that isn't currently publiclyLive.
//
// This file is a route group layout (the `(public)` folder adds no URL
// segment), nested one level BELOW [locale]/layout.tsx — not a root
// layout itself — so notFound() called here resolves normally to the
// nearest not-found.tsx up the tree ([locale]/not-found.tsx), with a
// correct 404 HTTP status. [locale]/layout.tsx keeps owning html/body/
// fonts/consent-banner for every response, live or not.
function resolveLocale(raw: string): LocaleCode {
  return isLocaleCode(raw) ? raw : DEFAULT_LOCALE
}

export default async function PublicLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  const locale = resolveLocale(raw)

  const liveLocales = await getPubliclyLiveLocales()
  // A reviewer who visited /api/preview?secret=... (see that route's
  // comment) gets Next's own signed draft-mode cookie, which lets them
  // browse a not-yet-live locale to check UI copy — everyone else still
  // 404s here exactly as before.
  const { isEnabled: isPreview } = await draftMode()
  if (!liveLocales.includes(locale) && !isPreview) notFound()

  return children
}
