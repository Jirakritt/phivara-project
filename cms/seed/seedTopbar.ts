// Additive, standalone seed for the `topbar` global only — sets its initial
// content to match what was previously hardcoded in SiteHeader.tsx. Safe to
// run once against a live site since `topbar` is a brand new field with no
// existing data yet. Like seedFooter.ts, there's no "clear first" step
// needed (a Global is a single doc, updateGlobal just overwrites it) — but
// that also means re-running this AFTER someone has edited topbar content in
// /admin will stomp their edits back to these defaults, so treat it as a
// one-time initial seed, not a repeatable maintenance script.
//
// Run with: npm run seed:topbar
import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../payload.config'
import { topbarData } from './data/topbar'

async function run() {
  const payload = await getPayload({ config })
  console.log('Seeding PHIVARA topbar content...')

  await payload.updateGlobal({
    slug: 'topbar',
    locale: 'th',
    data: {
      tagline: topbarData.tagline.th,
      hotlineText: topbarData.hotlineText.th,
      lineText: topbarData.lineText.th,
    },
  })
  await payload.updateGlobal({
    slug: 'topbar',
    locale: 'en',
    data: {
      tagline: topbarData.tagline.en,
      hotlineText: topbarData.hotlineText.en,
      lineText: topbarData.lineText.en,
    },
  })

  console.log('Done.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
