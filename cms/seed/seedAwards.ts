// Additive, standalone seed for the `awards` collection only — deliberately
// separate from seed.ts, which clears and rewrites branches/doctors/
// programs/articles/media wholesale. Awards was added after the initial
// content migration, so re-running the full seed.ts here would wipe out any
// live edits made in the CMS since then. Safe to re-run: clears only the
// awards collection (not media, so existing uploaded images are reused via
// getOrCreateMedia's cache) before re-adding.
//
// Run with: npm run seed:awards
import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../payload.config'
import { awardsData } from './data/awards'
import { getOrCreateMedia } from './lib/media'

async function run() {
  const payload = await getPayload({ config })
  console.log('Seeding PHIVARA awards...')

  const { docs } = await payload.find({ collection: 'awards', limit: 1000, depth: 0 })
  for (const doc of docs) {
    await payload.delete({ collection: 'awards', id: doc.id })
  }
  if (docs.length) console.log(`  cleared ${docs.length} existing awards`)

  for (const a of awardsData) {
    const image = await getOrCreateMedia(payload, a.image, { th: a.captionTh, en: a.captionEn })
    // Same cast seed.ts uses elsewhere for upload-relation fields — Payload's
    // generated type wants the full Media object or a number, but the
    // Local API accepts (and this project always passes) just the id.
    const doc = await payload.create({
      collection: 'awards',
      data: { image, caption: a.captionTh } as never,
      locale: 'th',
    })
    await payload.update({
      collection: 'awards',
      id: doc.id,
      data: { caption: a.captionEn },
      locale: 'en',
    })
    console.log(`  award: ${a.captionEn} -> ${doc.id}`)
  }

  console.log('Done.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
