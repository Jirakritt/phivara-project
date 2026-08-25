// One-off repair — the footer global's `heading`/`label` fields (both
// localized, nested inside linkGroups/links arrays) are completely empty
// for the "th" locale in the live database, even though "en" still has its
// correct seeded text (Explore/Doctors/Company/Journal/etc). th is the
// DEFAULT locale, so this is why the site *looked* fine at a glance in
// earlier screenshots but debugFooter.ts's raw per-locale dump exposed the
// real gap — most likely collateral damage from one of today's several
// `npm run migrate` runs accepting Payload's dev-mode "data loss will
// occur" schema-push prompt, since Footer.ts's own config was never
// touched this session.
//
// This restores the exact th text that was originally seeded by
// cms/seed/data/footer.ts (still intact in en, used here as the source of
// truth for which link is which) — additive/idempotent: only fills in
// fields that are currently empty, so it won't stomp any manual edits made
// in the meantime. Matches th rows to the correct th text by array
// position (both locales share the same row order/ids — confirmed via
// debugFooter.ts, so this is safe).
//
// Run with: npx tsx cms/seed/fixFooterThaiText.ts
import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../payload.config'

// Original correct Thai text (source: cms/seed/data/footer.ts), keyed by
// group index -> { heading, link labels by index }.
const TH_TEXT = [
  { heading: 'สำรวจ', links: ['แพทย์ผู้เชี่ยวชาญ'] },
  { heading: 'บริษัท', links: ['คลังความรู้', 'ผู้ป่วยต่างชาติ', 'ร่วมงานกับเรา', 'ข่าวประชาสัมพันธ์'] },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>

async function run() {
  const payload = await getPayload({ config })
  console.log('Restoring footer Thai text...')

  const thCurrent = (await payload.findGlobal({ slug: 'footer', locale: 'th', fallbackLocale: false, depth: 0 })) as AnyRecord
  const groupsTh: AnyRecord[] = thCurrent.linkGroups || []

  let fixedCount = 0
  const nextGroups = groupsTh.map((group, i) => {
    const expected = TH_TEXT[i]
    if (!expected) return group
    const heading = group.heading || expected.heading
    if (!group.heading) fixedCount++
    const links = (group.links || []).map((link: AnyRecord, j: number) => {
      const expectedLabel = expected.links[j]
      const label = link.label || expectedLabel || link.label
      if (!link.label && expectedLabel) fixedCount++
      return { ...link, label }
    })
    return { ...group, heading, links }
  })

  if (!fixedCount) {
    console.log('  nothing to fix — th heading/label text already present.')
    process.exit(0)
  }

  await payload.updateGlobal({
    slug: 'footer',
    locale: 'th',
    data: { linkGroups: nextGroups },
  })

  console.log(`  restored ${fixedCount} field(s).`)
  console.log('Done. Now run `npm run add:footer-links` to add the new links.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
