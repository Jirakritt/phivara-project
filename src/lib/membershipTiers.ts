import type { LocaleCode } from './i18n'
import { DEFAULT_LOCALE } from './i18n'
import { getPayloadClient } from './payload'
import type { MembershipTierInfo } from './membershipTierUtils'

// Server-only data fetching lives here (imports the Payload Local API).
// Client-safe types/helpers (MembershipTierInfo, normalizeTierRef) live in
// ./membershipTierUtils and are re-exported below for existing server-side
// importers — but any 'use client' component must import directly from
// ./membershipTierUtils instead of this file, or its whole import graph
// (including Payload's Node-only internals) gets bundled for the browser.
export type { MembershipTierInfo }
export { normalizeTierRef } from './membershipTierUtils'

// Ordered list of every staff-managed tier (cms/collections/MembershipTiers.ts)
// — powers both the member profile page's own tier card (matched by id
// against the member's membershipTier) and the "เปรียบเทียบ tier" comparison
// grid (src/components/member/ProfileDashboard.tsx), which used to be a
// fixed 3-card loop over hardcoded Silver/Gold/Diamond constants and is now
// just however many tiers currently exist. Deliberately no discount-%% or
// description field here — a tier's own benefits are just its normal
// MemberPrivileges cards scoped to it (see that global's header comment).
export async function getMembershipTiers(locale: LocaleCode): Promise<MembershipTierInfo[]> {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'membership-tiers',
    sort: 'order',
    limit: 100,
    locale,
    fallbackLocale: DEFAULT_LOCALE,
    depth: 0,
  })
  return docs.map((d) => ({
    id: d.id,
    slug: d.slug,
    label: d.label || d.slug,
    order: d.order ?? 0,
    gradientStart: d.gradientStart,
    gradientMid: d.gradientMid,
    gradientEnd: d.gradientEnd,
  }))
}
