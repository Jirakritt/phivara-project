import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds the "THE JOURNAL" article-grid section's eyebrow/heading
// (cms/globals/HomeHero.ts's sixth collapsible group) as real, editable
// columns on home_hero_locales. The article cards themselves already come
// from the `articles` collection — nothing to touch there. Backfills both
// th and en rows with the exact text that was previously hardcoded in
// src/app/[locale]/(public)/page.tsx. Safe to re-run.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "journal_eyebrow" varchar;
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "journal_headline" varchar;

  UPDATE "home_hero_locales" SET "journal_eyebrow" = 'THE JOURNAL' WHERE "journal_eyebrow" IS NULL;

  UPDATE "home_hero_locales" SET "journal_headline" = CASE "_locale"
    WHEN 'th' THEN 'สาระความงามจากผู้เชี่ยวชาญ'
    WHEN 'en' THEN 'Insights From Our Specialists'
  END WHERE "journal_headline" IS NULL;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "journal_eyebrow";
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "journal_headline";
  `)
}
