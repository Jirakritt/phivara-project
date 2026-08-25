// Additive, standalone seed for the `member-privileges` global — restores
// the 6 privilege cards that used to be hardcoded in
// src/components/member/ProfileDashboard.tsx before that tab became
// CMS-driven (see cms/globals/MemberPrivileges.ts). Like seedPrivacyPolicy.ts,
// a Global is a single doc so this is a plain overwrite, not an
// upsert-by-id — safe to run once against a fresh/empty `cards` list, but
// re-running it after someone has edited cards in /admin will stomp those
// edits back to these defaults.
//
// Non-localized fields (icon, tiers) live on the SAME array row as the
// localized ones (title, description) — Payload only creates new array-row
// ids when a locale update doesn't reuse the existing ones, which would
// silently wipe icon/tiers back to nothing on the 2nd (en) pass. So exactly
// like seed.ts's Membership.privileges seeding, we seed `th` first, then
// re-attach the row ids `th` was given before seeding `en`.
//
// `tiers` used to be a fixed silver/gold/diamond select — now it's a
// relationship to cms/collections/MembershipTiers.ts, so this script first
// looks up those (seeded by the migration — see cms/migrations/20260824_110000.ts)
// tier docs by slug and resolves memberPrivilegeCards' slugs to real ids.
//
// Run with: npm run seed:member-privileges
import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../payload.config'
import { memberPrivilegeCards } from './data/memberPrivileges'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function attachRowIds(enValue: any, sourceValue: any): any {
  if (!Array.isArray(enValue) || !Array.isArray(sourceValue)) return enValue
  return enValue.map((item, i) => {
    const source = sourceValue[i]
    if (!source || typeof item !== 'object' || item === null) return item
    return { ...item, id: source.id }
  })
}

async function run() {
  const payload = await getPayload({ config })
  console.log('Seeding PHIVARA member privileges...')

  const { docs: tierDocs } = await payload.find({ collection: 'membership-tiers', limit: 100, depth: 0 })
  const tierIdBySlug = new Map(tierDocs.map((t) => [t.slug, t.id]))
  const missingSlugs = new Set(memberPrivilegeCards.flatMap((c) => c.tiers).filter((slug) => !tierIdBySlug.has(slug)))
  if (missingSlugs.size) {
    throw new Error(
      `membership-tiers is missing slug(s): ${[...missingSlugs].join(', ')} — run "npm run migrate" first (it seeds silver/gold/diamond), or add these tiers in the CMS before re-running this script.`,
    )
  }
  const tierIdsFor = (slugs: string[]) => slugs.map((slug) => tierIdBySlug.get(slug))

  const th = await payload.updateGlobal({
    slug: 'member-privileges',
    locale: 'th',
    data: {
      cards: memberPrivilegeCards.map((c) => ({
        title: c.title.th,
        description: c.description.th,
        icon: c.icon,
        tiers: tierIdsFor(c.tiers),
      })),
    },
  })

  await payload.updateGlobal({
    slug: 'member-privileges',
    locale: 'en',
    data: {
      cards: attachRowIds(
        memberPrivilegeCards.map((c) => ({
          title: c.title.en,
          description: c.description.en,
          icon: c.icon,
          tiers: tierIdsFor(c.tiers),
        })),
        th.cards,
      ),
    },
  })

  console.log(`  member-privileges global updated (${memberPrivilegeCards.length} cards)`)
  console.log('Done.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
