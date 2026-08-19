// HISTORICAL / OBSOLETE — already run. Originally a one-off backfill that
// copied the flat `nameTh`/`nameEn` fields on Doctors and Branches into the
// new localized `name` field. Those flat fields have since been removed
// from Doctors.ts/Branches.ts entirely (name is now the only source), so
// re-running this script today is a no-op (it'll find nameTh/nameEn
// undefined on every doc and skip them) — kept only for history, not part
// of any current workflow.
//
// Run with: npx tsx cms/scripts/backfillLocalizedNames.ts
// (requires your local Postgres — same DATABASE_URI your dev server uses —
// to be reachable, so run this on your own machine, not in a sandbox.)
import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../payload.config'

async function backfillCollection(payload: Awaited<ReturnType<typeof getPayload>>, collection: 'doctors' | 'branches') {
  const { docs } = await payload.find({
    collection,
    locale: 'th',
    limit: 1000,
    depth: 0,
    // draft: true so unpublished doctors/programs still get backfilled too.
    draft: true,
    overrideAccess: true,
  })

  let updated = 0
  for (const doc of docs) {
    const nameTh = (doc as unknown as Record<string, unknown>).nameTh as string | undefined
    const nameEn = (doc as unknown as Record<string, unknown>).nameEn as string | undefined
    if (!nameTh && !nameEn) continue

    // eslint-disable-next-line no-await-in-loop
    if (nameTh) {
      await payload.update({
        collection,
        id: doc.id,
        locale: 'th',
        data: { name: nameTh },
        overrideAccess: true,
        // Skip the medical-review draft workflow for this backfill — it's
        // not new editorial content, just copying an existing value into a
        // new field, so it shouldn't create a fresh draft revision to review.
        draft: false,
      })
    }
    // eslint-disable-next-line no-await-in-loop
    if (nameEn) {
      await payload.update({
        collection,
        id: doc.id,
        locale: 'en',
        data: { name: nameEn },
        overrideAccess: true,
        draft: false,
      })
    }
    updated += 1
  }

  console.log(`[backfill] ${collection}: updated ${updated}/${docs.length} record(s)`)
}

async function main() {
  const payload = await getPayload({ config })
  await backfillCollection(payload, 'doctors')
  await backfillCollection(payload, 'branches')
  console.log('[backfill] done.')
  process.exit(0)
}

main().catch((err) => {
  console.error('[backfill] failed:', err)
  process.exit(1)
})
