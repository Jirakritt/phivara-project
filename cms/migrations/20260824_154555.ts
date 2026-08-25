import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds the "OUR SPECIALISTS" doctor-carousel section's copy
// (cms/globals/HomeHero.ts's fifth collapsible group) as real, editable
// columns on home_hero_locales. The doctor cards themselves already come
// from the `doctors` collection — nothing to touch there. Backfills both
// th and en rows with the exact text that was previously hardcoded in
// src/app/[locale]/(public)/page.tsx. Safe to re-run.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "specialists_eyebrow" varchar;
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "specialists_headline" varchar;
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "specialists_lead" varchar;
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "specialists_link_label" varchar;

  UPDATE "home_hero_locales" SET "specialists_eyebrow" = 'OUR SPECIALISTS' WHERE "specialists_eyebrow" IS NULL;

  UPDATE "home_hero_locales" SET "specialists_headline" = CASE "_locale"
    WHEN 'th' THEN 'พบแพทย์และผู้เชี่ยวชาญของ PHIVARA'
    WHEN 'en' THEN 'Meet Our Specialists'
  END WHERE "specialists_headline" IS NULL;

  UPDATE "home_hero_locales" SET "specialists_lead" = CASE "_locale"
    WHEN 'th' THEN 'ทุกท่านยึดหลักฐานเชิงประจักษ์ มีคุณวุฒิรับรอง และทุ่มเทให้กับเส้นทางของคุณเป็นการส่วนตัว'
    WHEN 'en' THEN 'Evidence-based, credentialed, and personally invested in your journey.'
  END WHERE "specialists_lead" IS NULL;

  UPDATE "home_hero_locales" SET "specialists_link_label" = CASE "_locale"
    WHEN 'th' THEN 'ดูรายชื่อทีมแพทย์และผู้เชี่ยวชาญทั้งหมด'
    WHEN 'en' THEN 'View All Medical Specialists'
  END WHERE "specialists_link_label" IS NULL;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "specialists_eyebrow";
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "specialists_headline";
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "specialists_lead";
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "specialists_link_label";
  `)
}
