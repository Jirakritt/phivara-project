import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds a `displayOrder` field to the `branches` collection
// (cms/collections/Branches.ts) so an editor can control the order branches
// appear in — homepage "PHIVARA DESTINATIONS" cards, the /contact grid, the
// footer, and the register/basic-info "preferred branch" dropdown all sort
// by this now (see src/lib/homeData.ts and src/lib/branchesData.ts, both
// changed from `sort: 'id'` to `sort: 'displayOrder,id'`). Not localized —
// order is the same across every locale.
//
// Backfills existing rows with their current `id`, so display order is
// unchanged immediately after this migration runs; editors can then
// renumber branches in the CMS whenever they want a different order.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "branches" ADD COLUMN IF NOT EXISTS "display_order" numeric DEFAULT 0;

  UPDATE "branches" SET "display_order" = "id" WHERE "display_order" = 0 OR "display_order" IS NULL;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "branches" DROP COLUMN IF EXISTS "display_order";
  `)
}
