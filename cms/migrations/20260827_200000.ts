import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds a `displayOrder` field to the `doctors` collection
// (cms/collections/Doctors.ts) so an editor can control the order doctors
// appear in — the /doctor listing and the branch page's regular doctor grid
// both sort by this now (see src/lib/doctorsData.ts and
// src/lib/homeData.ts, both changed from `sort: 'slug'` to
// `sort: ['displayOrder', 'id']`). Not localized — order is the same across
// every locale. Mirrors Branches.ts's identical displayOrder field/migration
// (20260825_115941).
//
// Backfills existing rows with their current `id`, so display order is
// unchanged immediately after this migration runs; editors can then
// renumber doctors in the CMS whenever they want a different order.
//
// Doctors has versions/drafts enabled (unlike Branches), so the column also
// needs to be mirrored onto `_doctors_v` as `version_display_order` —
// follows the exact pattern the `isBranchFeatured` migration
// (20260827_160000) used for its own `_doctors_v` column, backfilling from
// `_doctors_v.parent_id` (the FK back to `doctors.id`) instead of the
// version row's own `id`.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "doctors" ADD COLUMN IF NOT EXISTS "display_order" numeric DEFAULT 0;
  UPDATE "doctors" SET "display_order" = "id" WHERE "display_order" = 0 OR "display_order" IS NULL;

  ALTER TABLE "_doctors_v" ADD COLUMN IF NOT EXISTS "version_display_order" numeric DEFAULT 0;
  UPDATE "_doctors_v" SET "version_display_order" = "parent_id" WHERE "version_display_order" = 0 OR "version_display_order" IS NULL;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "_doctors_v" DROP COLUMN IF EXISTS "version_display_order";
  ALTER TABLE "doctors" DROP COLUMN IF EXISTS "display_order";
  `)
}
