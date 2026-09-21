import type { PayloadHandler } from 'payload'

import { LOCALE_META } from '../admin/localeMeta'

// Backing handler for the "copy preview link" button on the Language
// Management screen (cms/admin/components/LanguageSettingsGrid.tsx) —
// registered as GET /api/globals/language-settings/preview-links.
//
// Exists so a CMS admin — who typically has no SSH/server access at all —
// can hand a native-speaker reviewer a working /api/preview link (see
// src/app/api/preview/route.ts) for a not-yet-live locale without ever
// needing to read PREVIEW_SECRET out of production .env themselves. The
// secret stays server-side the whole time: this only ever returns the
// finished, ready-to-share URL, and only to a logged-in admin (same
// business-decision access level as the publiclyLive/cmsEditable toggles
// themselves — see LanguageSettings.ts's access.update).
export const getPreviewLinksHandler: PayloadHandler = async (req) => {
  const { user, payload } = req

  if (!user || user.collection !== 'users' || user.role !== 'admin') {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const secret = process.env.PREVIEW_SECRET
  if (!secret) {
    // Nothing to build a link with yet — the UI shows a "not set up" hint
    // instead of a button in this case.
    return Response.json({ configured: false, links: [] })
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const settings = (await payload.findGlobal({ slug: 'language-settings' })) as any

  const links = LOCALE_META.filter(({ code }) => {
    const group = settings?.[code] as { cmsEditable?: boolean; publiclyLive?: boolean } | undefined
    // Only locales actively being drafted (visible in CMS, not yet public)
    // are worth a reviewer link — a live locale is already reachable
    // directly, and a fully-off locale has nothing to review yet.
    return Boolean(group?.cmsEditable) && !group?.publiclyLive
  }).map(({ code, label }) => ({
    code,
    label,
    url: `${siteUrl}/api/preview?secret=${encodeURIComponent(secret)}&redirect=/${code}`,
  }))

  return Response.json({ configured: true, links })
}
