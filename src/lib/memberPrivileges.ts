import type { LocaleCode } from './i18n'
import { DEFAULT_LOCALE } from './i18n'
import { normalizeTierRef } from './membershipTiers'
import { getPayloadClient } from './payload'

// Same locale-fallback shape as src/lib/homeData.ts's getMembershipTeaser
// (target locale -> en -> th) — kept as a local const here rather than
// importing one, since homeData.ts doesn't export it.
const EN_LOCALE: LocaleCode = 'en'

export type PrivilegeIcon = 'discount' | 'priority' | 'doctor' | 'gift' | 'star' | 'heart' | 'diamond' | 'badge'

export interface PrivilegeCard {
  title: string
  description: string
  icon: PrivilegeIcon
  // Ids of cms/collections/MembershipTiers.ts rows this card is scoped to
  // (that field used to be a fixed silver/gold/diamond select; now it's a
  // relationship, so this is normalized down to plain numeric ids via
  // normalizeTierRef — see that function's comment for why the raw value
  // isn't already just a number).
  tiers: number[]
}

// Powers the "สิทธิพิเศษ" tab on the member profile page (see
// src/components/member/ProfileDashboard.tsx) — reads the `member-privileges`
// Global (cms/globals/MemberPrivileges.ts), which staff manage entirely from
// the CMS. Each card is filtered down to the viewing member's own tier by
// the caller (ProfileDashboard), not here — this just returns every card
// with its full `tiers` list intact.
export async function getMemberPrivileges(locale: LocaleCode): Promise<PrivilegeCard[]> {
  const payload = await getPayloadClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let [target, en, th] = (await Promise.all([
    payload.findGlobal({ slug: 'member-privileges', locale, fallbackLocale: false }),
    payload.findGlobal({ slug: 'member-privileges', locale: EN_LOCALE, fallbackLocale: false }),
    payload.findGlobal({ slug: 'member-privileges', locale: DEFAULT_LOCALE }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ])) as [any, any, any]
  // Requesting th when locale is already th returns the same document 3x —
  // matches homeData.ts's own fix for the identical situation.
  if (locale === DEFAULT_LOCALE) {
    en = target
    th = target
  }

  // `icon`/`tiers` aren't localized fields, so they only ever need to come
  // from th (the one fetch guaranteed to exist via its own fallbackLocale).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const thCards = (th?.cards || []) as any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const targetCards = (target?.cards || []) as any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const enCards = (en?.cards || []) as any[]

  return thCards.map((card, i) => ({
    title: targetCards[i]?.title || enCards[i]?.title || card.title || '',
    description: targetCards[i]?.description || enCards[i]?.description || card.description || '',
    icon: (card.icon || 'star') as PrivilegeIcon,
    tiers: ((card.tiers || []) as unknown[]).map(normalizeTierRef).filter((id): id is number => id !== null),
  }))
}
