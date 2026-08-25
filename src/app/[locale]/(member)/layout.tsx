import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { DEFAULT_LOCALE, isLocaleCode } from '@/lib/i18n'
import { getPubliclyLiveLocales } from '@/lib/i18n-server'
import type { LocaleCode } from '@/lib/i18n'

// Same publiclyLive-locale gate as (public)/layout.tsx — see that file's
// comment for the full rationale (notFound() has to be called below the
// root layout to resolve to the branded 404 correctly). Member/auth pages
// are just as real as any other page on the site and should 404 the same
// way for a locale the admin hasn't turned on yet.
function resolveLocale(raw: string): LocaleCode {
  return isLocaleCode(raw) ? raw : DEFAULT_LOCALE
}

export default async function MemberLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  const locale = resolveLocale(raw)

  const liveLocales = await getPubliclyLiveLocales()
  if (!liveLocales.includes(locale)) notFound()

  return children
}
