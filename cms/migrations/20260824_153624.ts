import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds the "INTEGRATED EXPERTISE" tabbed section (cms/globals/HomeHero.ts's
// third collapsible group) as real, editable columns on home_hero_locales —
// eyebrow/heading, plus each of the 4 tabs' label/tag/title. Category keys
// (plastic/longevity/dermatology/wellness) stay hardcoded in code (must
// match Programs.category's select options), only their display text moves
// here. Backfills both th and en rows with the exact text that was
// previously hardcoded across page.tsx and public/js/main.js (which had two
// separate copies of the same strings) — label/tag were always shown in
// English regardless of site locale, so both locale rows get the same
// English text; title was already properly localized, so it gets distinct
// th/en text. Safe to re-run (IF NOT EXISTS / WHERE ... IS NULL guards).
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "expertise_eyebrow" varchar;
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "expertise_headline" varchar;
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "expertise_plastic_label" varchar;
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "expertise_plastic_tag" varchar;
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "expertise_plastic_title" varchar;
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "expertise_longevity_label" varchar;
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "expertise_longevity_tag" varchar;
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "expertise_longevity_title" varchar;
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "expertise_dermatology_label" varchar;
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "expertise_dermatology_tag" varchar;
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "expertise_dermatology_title" varchar;
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "expertise_wellness_label" varchar;
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "expertise_wellness_tag" varchar;
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "expertise_wellness_title" varchar;

  UPDATE "home_hero_locales" SET "expertise_eyebrow" = 'INTEGRATED EXPERTISE' WHERE "expertise_eyebrow" IS NULL;

  UPDATE "home_hero_locales" SET "expertise_headline" = CASE "_locale"
    WHEN 'th' THEN 'หนึ่งทีม หนึ่งเส้นทาง เพื่อคุณโดยเฉพาะ'
    WHEN 'en' THEN 'One Team, One Journey — Built Around You'
  END WHERE "expertise_headline" IS NULL;

  UPDATE "home_hero_locales" SET "expertise_plastic_label" = 'Plastic Surgery' WHERE "expertise_plastic_label" IS NULL;
  UPDATE "home_hero_locales" SET "expertise_plastic_tag" = 'The Art of Form' WHERE "expertise_plastic_tag" IS NULL;
  UPDATE "home_hero_locales" SET "expertise_plastic_title" = CASE "_locale"
    WHEN 'th' THEN 'ศิลปะการจัดแต่งสัดส่วน' WHEN 'en' THEN 'The Art of Form' END
    WHERE "expertise_plastic_title" IS NULL;

  UPDATE "home_hero_locales" SET "expertise_longevity_label" = 'Anti-Aging & Longevity' WHERE "expertise_longevity_label" IS NULL;
  UPDATE "home_hero_locales" SET "expertise_longevity_tag" = 'The Art of Time' WHERE "expertise_longevity_tag" IS NULL;
  UPDATE "home_hero_locales" SET "expertise_longevity_title" = CASE "_locale"
    WHEN 'th' THEN 'ศิลปะแห่งกาลเวลา' WHEN 'en' THEN 'The Art of Time' END
    WHERE "expertise_longevity_title" IS NULL;

  UPDATE "home_hero_locales" SET "expertise_dermatology_label" = 'Dermatology' WHERE "expertise_dermatology_label" IS NULL;
  UPDATE "home_hero_locales" SET "expertise_dermatology_tag" = 'The Art of Glow' WHERE "expertise_dermatology_tag" IS NULL;
  UPDATE "home_hero_locales" SET "expertise_dermatology_title" = CASE "_locale"
    WHEN 'th' THEN 'ศิลปะแห่งผิวเปล่งประกาย' WHEN 'en' THEN 'The Art of Glow' END
    WHERE "expertise_dermatology_title" IS NULL;

  UPDATE "home_hero_locales" SET "expertise_wellness_label" = 'Aesthetic Wellness' WHERE "expertise_wellness_label" IS NULL;
  UPDATE "home_hero_locales" SET "expertise_wellness_tag" = 'The Art of Balance' WHERE "expertise_wellness_tag" IS NULL;
  UPDATE "home_hero_locales" SET "expertise_wellness_title" = CASE "_locale"
    WHEN 'th' THEN 'ศิลปะแห่งความสมดุล' WHEN 'en' THEN 'The Art of Balance' END
    WHERE "expertise_wellness_title" IS NULL;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "expertise_eyebrow";
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "expertise_headline";
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "expertise_plastic_label";
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "expertise_plastic_tag";
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "expertise_plastic_title";
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "expertise_longevity_label";
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "expertise_longevity_tag";
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "expertise_longevity_title";
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "expertise_dermatology_label";
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "expertise_dermatology_tag";
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "expertise_dermatology_title";
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "expertise_wellness_label";
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "expertise_wellness_tag";
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "expertise_wellness_title";
  `)
}
