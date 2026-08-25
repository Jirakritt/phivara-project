import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Pure data migration — renames the 5 branch slugs to short internal codes
// per user request. No schema change, so no matching .json snapshot (same
// pattern as 20260824_110000.ts).
//
// Only `branches.slug` is touched. Doctors.branch / Programs.branch /
// Articles.branch / Users.assignedBranches are Payload `relationship`
// fields stored by numeric id, so they're unaffected by this rename.
// Leads.branch is a plain text field (not a relationship — see comment on
// that field in Leads.ts) that stores whatever slug was selected in the
// booking modal at submission time; existing Lead rows deliberately keep
// their old slug value here as a historical record of what the visitor
// picked, and are NOT rewritten by this migration.
//
// Hardcoded slug references outside the CMS (public/js/site-shell.js,
// public/js/branch-detail.js, public/css/branch-detail.css) are updated in
// the same change set as this migration — see those files' diffs.
const RENAMES: Array<[string, string]> = [
  ['sriayudhaya', 'pt1'],
  ['sanampao', 'pt2'],
  ['petchakasem', 'pt3'],
  ['phaholyothin', 'ptp'],
  ['sriracha', 'pts'],
]

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  for (const [oldSlug, newSlug] of RENAMES) {
    await db.execute(sql`
      UPDATE "branches" SET "slug" = ${newSlug} WHERE "slug" = ${oldSlug};
    `)
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  for (const [oldSlug, newSlug] of RENAMES) {
    await db.execute(sql`
      UPDATE "branches" SET "slug" = ${oldSlug} WHERE "slug" = ${newSlug};
    `)
  }
}
