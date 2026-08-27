// One-off: wires up the new doctor-image-composite feature's sample/test
// assets (phivara-design-html/New-Doctor-Image/) so it can be reviewed with
// real images instead of blank backgrounds, without hand-uploading through
// the admin UI for all 30 doctors one at a time. Uploads the 3 sample files
// once via Media, sets them as the Doctor Display Settings global's room
// backgrounds, and points every doctor's portrait/cardPhoto/featuredPhoto
// at the same sample cutout.
//
// NOT final content — this is purely for visual QA of the compositing
// (room background + transparent PNG cutout layering) before real
// per-doctor cutout photos exist. Re-run any time to re-point everything
// back at the sample files (e.g. after a doctor's fields get overwritten
// during testing) — getOrCreateMedia (cms/seed/lib/media.ts) dedupes by
// source path, so re-running does not create duplicate Media docs.
//
// Run with: npx tsx cms/scripts/setSampleDoctorPhotos.ts
// (requires your local Postgres — same DATABASE_URI your dev server uses —
// to be reachable, so run this on your own machine, not in a sandbox. Fine
// to run while `npm run dev` is also running — this only talks to Postgres
// and disk, it doesn't start its own server.)
import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../payload.config'
import { getOrCreateMedia } from '../seed/lib/media'

async function main() {
  const payload = await getPayload({ config })

  // The Postgres adapter uses numeric (serial) IDs — see the type-safety
  // note on getOrCreateMedia (cms/seed/lib/media.ts) — so these casts match
  // what's actually returned, just narrowed for payload.update()'s typed
  // `data` (unlike seed.ts, which builds up an untyped Record instead).
  const doctorCutoutId = (await getOrCreateMedia(payload, 'New-Doctor-Image/doctor.png', {
    th: 'ตัวอย่างรูปแพทย์ตัดพื้นหลัง (ทดสอบ)',
    en: 'Sample doctor cutout (test)',
  })) as number
  const profileBackgroundId = (await getOrCreateMedia(payload, 'New-Doctor-Image/BG_profile.jpg', {
    th: 'ตัวอย่างพื้นหลังห้อง — โปรไฟล์ (ทดสอบ)',
    en: 'Sample room background — profile (test)',
  })) as number
  const featuredBackgroundId = (await getOrCreateMedia(payload, 'New-Doctor-Image/BG_feature.jpg', {
    th: 'ตัวอย่างพื้นหลังห้อง — featured (ทดสอบ)',
    en: 'Sample room background — featured (test)',
  })) as number

  await payload.updateGlobal({
    slug: 'doctor-display-settings',
    data: {
      profileBackground: profileBackgroundId,
      featuredBackground: featuredBackgroundId,
    },
  })
  console.log('[sample-doctor-photos] Doctor Display Settings updated.')

  const { docs } = await payload.find({
    collection: 'doctors',
    limit: 1000,
    depth: 0,
    // draft: true so unpublished doctors get the sample photo too, same as
    // backfillLocalizedNames.ts.
    draft: true,
    overrideAccess: true,
  })

  let updated = 0
  for (const doc of docs) {
    // eslint-disable-next-line no-await-in-loop
    await payload.update({
      collection: 'doctors',
      id: doc.id,
      data: {
        portrait: doctorCutoutId,
        cardPhoto: doctorCutoutId,
        featuredPhoto: doctorCutoutId,
      },
      overrideAccess: true,
      draft: false,
    })
    updated += 1
  }
  console.log(`[sample-doctor-photos] doctors: updated ${updated}/${docs.length} record(s)`)
  console.log('[sample-doctor-photos] done.')
  process.exit(0)
}

main().catch((err) => {
  console.error('[sample-doctor-photos] failed:', err)
  process.exit(1)
})
