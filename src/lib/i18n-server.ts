import { cache } from 'react'

import { CONTENT_READY_LOCALES, DEFAULT_LOCALE } from './i18n'
import type { LocaleCode } from './i18n'
import { getPayloadClient } from './payload'

// Split out of src/lib/i18n.ts on purpose: this file imports payload.ts
// (Node-only — Payload's Local API, DB connections, etc.), which must never
// end up in src/middleware.ts's bundle. Middleware runs on the Edge
// runtime, and Edge can't load Node built-ins the way Payload's stack needs
// (confirmed the hard way — see the "node:console" build error this split
// fixes). middleware.ts only ever imports the pure, dependency-free half of
// i18n.ts (isLocaleCode/DEFAULT_LOCALE); everything here is safe to import
// from Server Components (layout.tsx, page.tsx, NotFoundContent.tsx,
// sitemap.ts) but must stay out of anything middleware.ts touches, even
// transitively.

/**
 * Locales an actual site visitor may currently reach — the intersection of
 * "content exists for this language" (CONTENT_READY_LOCALES) and "an Admin
 * has flipped publiclyLive on for it" (the `language-settings` Global, see
 * cms/globals/LanguageSettings.ts). Thai is always included: it has no
 * toggle and is the permanent fallback.
 *
 * Cached per-request (React `cache()`) — safe to call from layout.tsx,
 * page.tsx, and the language switcher without triggering duplicate Payload
 * queries for the same request.
 */
export const getPubliclyLiveLocales = cache(async (): Promise<LocaleCode[]> => {
  try {
    const payload = await getPayloadClient()
    const settings = (await payload.findGlobal({ slug: 'language-settings' })) as unknown as Record<
      string,
      { publiclyLive?: boolean } | undefined
    >
    const live = CONTENT_READY_LOCALES.filter(
      (code) => code === DEFAULT_LOCALE || settings?.[code]?.publiclyLive,
    )
    return live.length ? live : [DEFAULT_LOCALE]
  } catch {
    // Fails open to th+en (same safety behavior as filterAvailableLocales
    // in payload.config.ts) — a broken/unreachable LanguageSettings
    // document must never take the whole public site down.
    return CONTENT_READY_LOCALES
  }
})
