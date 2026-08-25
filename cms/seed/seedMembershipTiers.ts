// Additive, idempotent seed for the `membership-tiers` collection
// (cms/collections/MembershipTiers.ts) — creates the 3 tiers that used to
// be the fixed "silver/gold/diamond" enum values, with the same gradient
// colors the old hardcoded `.mcard--gold/silver/diamond` CSS classes had
// (see src/components/member/ProfileDashboard.tsx's tierCardGradient()).
//
// Uses the Local API (payload.create/find) rather than raw SQL — unlike
// this project's other seed scripts, this one exists specifically as a
// safety net for when the schema migration (cms/migrations/20260824_110000.ts)
// couldn't fully seed data itself (e.g. if it had to be re-run after an
// earlier attempt errored partway through). Safe to run multiple times:
// skips any slug that already exists instead of creating duplicates.
//
// Run with: npm run seed:membership-tiers
import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../payload.config'

const SEED_TIERS = [
  { slug: 'silver', order: 1, gradientStart: '#26282B', gradientMid: '#C7C9C6', gradientEnd: '#26282B', labelTh: 'Silver', labelEn: 'Silver' },
  { slug: 'gold', order: 2, gradientStart: '#2C2313', gradientMid: '#C7A76B', gradientEnd: '#2C2313', labelTh: 'Gold', labelEn: 'Gold' },
  { slug: 'diamond', order: 3, gradientStart: '#152233', gradientMid: '#8FB0CC', gradientEnd: '#152233', labelTh: 'Diamond', labelEn: 'Diamond' },
]

async function run() {
  const payload = await getPayload({ config })
  console.log('Seeding PHIVARA membership tiers...')

  const { docs: existing } = await payload.find({ collection: 'membership-tiers', limit: 100, depth: 0 })
  const existingSlugs = new Set(existing.map((d) => d.slug))

  for (const tier of SEED_TIERS) {
    if (existingSlugs.has(tier.slug)) {
      console.log(`  skip "${tier.slug}" — already exists`)
      continue
    }
    const created = await payload.create({
      collection: 'membership-tiers',
      locale: 'th',
      data: {
        slug: tier.slug,
        order: tier.order,
        gradientStart: tier.gradientStart,
        gradientMid: tier.gradientMid,
        gradientEnd: tier.gradientEnd,
        label: tier.labelTh,
      },
    })
    await payload.update({
      collection: 'membership-tiers',
      id: created.id,
      locale: 'en',
      data: { label: tier.labelEn },
    })
    console.log(`  created "${tier.slug}" (id ${created.id})`)
  }

  console.log('Done.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
