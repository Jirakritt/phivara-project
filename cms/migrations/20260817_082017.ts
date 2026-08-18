import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds the localized `name` field on Doctors and Branches (cms/collections/
// Doctors.ts, Branches.ts) — the schema change that replaced the flat
// nameTh/nameEn pair with a real per-locale field so doctor/branch listings
// can support strict per-locale filtering like Programs/Articles already do.
//
// This file was originally generated empty by `payload migrate:create`
// because the local dev database had already picked up the new column via
// Payload's dev-mode auto-push (schema push happens automatically on every
// dev-server restart) *before* the migration was generated — so drizzle-kit's
// diff against the already-synced dev DB came back empty. Filled in by hand
// afterward so a fresh database (staging/production, which never got the
// push) still receives this column when `payload migrate` runs.
//
// Doctors has `versions: { drafts: true }` (see Doctors.ts) so its localized
// fields are duplicated into a `_doctors_v_locales` version table with a
// `version_` prefix — same pattern as every other localized field already in
// that table (see 20260807_034304.ts's CREATE TABLE for _doctors_v_locales).
// Branches has no versions/drafts, so branches_locales is the only table
// that needs the column there.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "doctors_locales" ADD COLUMN "name" varchar;
  ALTER TABLE "_doctors_v_locales" ADD COLUMN "version_name" varchar;
  ALTER TABLE "branches_locales" ADD COLUMN "name" varchar;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "doctors_locales" DROP COLUMN "name";
  ALTER TABLE "_doctors_v_locales" DROP COLUMN "version_name";
  ALTER TABLE "branches_locales" DROP COLUMN "name";
  `)
}
