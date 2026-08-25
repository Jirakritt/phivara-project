import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds the "AWARDS & RECOGNITION" carousel section's eyebrow/heading
// (cms/globals/HomeHero.ts's seventh collapsible group) as real, editable
// columns on home_hero_locales. The award cards themselves already come
// from the `awards` collection — nothing to touch there. Backfills both
// th and en rows with the exact text that was previously hardcoded in
// src/app/[locale]/(public)/page.tsx. Safe to re-run.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "awards_eyebrow" varchar;
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "awards_headline" varchar;

  UPDATE "home_hero_locales" SET "awards_eyebrow" = 'AWARDS & RECOGNITION' WHERE "awards_eyebrow" IS NULL;

  UPDATE "home_hero_locales" SET "awards_headline" = CASE "_locale"
    WHEN 'th' THEN 'ความไว้วางใจที่สั่งสมมาอย่างยาวนาน'
    WHEN 'en' THEN 'A Legacy of Trust and Recognition'
  END WHERE "awards_headline" IS NULL;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "awards_eyebrow";
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "awards_headline";
  `)
}
