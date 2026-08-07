// Additive, standalone seed for the `footer` global only — sets its initial
// content to match what was previously hardcoded in SiteFooter.tsx. Safe to
// run once against a live site since `footer` is a brand new field with no
// existing data yet. Unlike seedAwards.ts, there's no "clear first" step
// needed (a Global is a single doc, updateGlobal just overwrites it) — but
// that also means re-running this AFTER someone has edited footer content in
// /admin will stomp their edits back to these defaults, so treat it as a
// one-time initial seed, not a repeatable maintenance script.
//
// Run with: npm run seed:footer
import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../payload.config'
import { footerData } from './data/footer'

async function run() {
  const payload = await getPayload({ config })
  console.log('Seeding PHIVARA footer content...')

  await payload.updateGlobal({
    slug: 'footer',
    locale: 'th',
    data: {
      tagline: footerData.tagline.th,
      linkGroups: footerData.linkGroups.map((group) => ({
        heading: group.heading.th,
        links: group.links.map((link) => ({ label: link.label.th, url: link.url })),
      })),
      copyrightText: footerData.copyrightText.th,
      socialLinks: footerData.socialLinks,
    },
  })
  await payload.updateGlobal({
    slug: 'footer',
    locale: 'en',
    data: {
      tagline: footerData.tagline.en,
      linkGroups: footerData.linkGroups.map((group) => ({
        heading: group.heading.en,
        links: group.links.map((link) => ({ label: link.label.en, url: link.url })),
      })),
      copyrightText: footerData.copyrightText.en,
    },
  })

  console.log('Done.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
