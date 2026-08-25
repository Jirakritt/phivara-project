import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds a display-order number field to each of the 4 "INTEGRATED EXPERTISE"
// tab categories (cms/globals/HomeHero.ts's Plastic/Longevity/Dermatology/
// Wellness collapsible groups) so an editor can reorder the tabs on the
// homepage without touching code. Not localized, so these columns live on
// the base `home_hero` table (not `home_hero_locales`) — see
// 20260807_034304.ts for that table split.
//
// Backfills the exact order the tabs have always rendered in (hardcoded in
// public/js/main.js until this change): plastic=1, longevity=2,
// dermatology=3, wellness=4 — so nothing visually changes immediately after
// this migration runs.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "home_hero" ADD COLUMN IF NOT EXISTS "expertise_plastic_order" numeric DEFAULT 1;
  ALTER TABLE "home_hero" ADD COLUMN IF NOT EXISTS "expertise_longevity_order" numeric DEFAULT 2;
  ALTER TABLE "home_hero" ADD COLUMN IF NOT EXISTS "expertise_dermatology_order" numeric DEFAULT 3;
  ALTER TABLE "home_hero" ADD COLUMN IF NOT EXISTS "expertise_wellness_order" numeric DEFAULT 4;

  UPDATE "home_hero" SET "expertise_plastic_order" = 1 WHERE "expertise_plastic_order" IS NULL;
  UPDATE "home_hero" SET "expertise_longevity_order" = 2 WHERE "expertise_longevity_order" IS NULL;
  UPDATE "home_hero" SET "expertise_dermatology_order" = 3 WHERE "expertise_dermatology_order" IS NULL;
  UPDATE "home_hero" SET "expertise_wellness_order" = 4 WHERE "expertise_wellness_order" IS NULL;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "home_hero" DROP COLUMN IF EXISTS "expertise_plastic_order";
  ALTER TABLE "home_hero" DROP COLUMN IF EXISTS "expertise_longevity_order";
  ALTER TABLE "home_hero" DROP COLUMN IF EXISTS "expertise_dermatology_order";
  ALTER TABLE "home_hero" DROP COLUMN IF EXISTS "expertise_wellness_order";
  `)
}
