import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds the "WHY PHIVARA EXISTS" homepage section (cms/globals/HomeHero.ts's
// new collapsible group) as real, editable columns on home_hero_locales,
// instead of the hardcoded brand copy that used to live directly in
// src/app/[locale]/(public)/page.tsx. Backfills both th and en rows with the
// exact text that was previously hardcoded, so the live site's content
// doesn't change the moment this migration runs — staff can then edit it
// from the CMS going forward. Safe to re-run (IF NOT EXISTS / WHERE ... IS
// NULL guards throughout).
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "intro_eyebrow" varchar;
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "intro_quote" varchar;
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "intro_body1" varchar;
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "intro_body2" varchar;
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "intro_tagline" varchar;
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "diagram_label_tl" varchar;
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "diagram_label_tr" varchar;
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "diagram_label_bl" varchar;
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "diagram_label_br" varchar;

  UPDATE "home_hero_locales" SET "intro_eyebrow" = 'WHY PHIVARA EXISTS' WHERE "intro_eyebrow" IS NULL;

  UPDATE "home_hero_locales" SET "intro_quote" = CASE "_locale"
    WHEN 'th' THEN '“ความงามที่แท้จริง เริ่มต้นจากสุขภาพที่ดีจากภายใน ไม่ใช่การไล่ตามความเยาว์วัย”'
    WHEN 'en' THEN '“True beauty begins with good health from within — not the pursuit of youth.”'
  END WHERE "intro_quote" IS NULL;

  UPDATE "home_hero_locales" SET "intro_body1" = CASE "_locale"
    WHEN 'th' THEN 'Beaugevity คือแก่นความเชื่อของ PHIVARA ที่หลอมรวมศาสตร์ความงามและเวชศาสตร์อายุยืนยาวเข้าไว้ด้วยกันบนพื้นฐานทางการแพทย์ ทุกการดูแลเริ่มต้นจากการตรวจวินิจฉัยและประเมินสุขภาพเชิงลึกโดยแพทย์เฉพาะทาง ก่อนออกแบบแผนการดูแลเฉพาะบุคคลที่ผสานศัลยกรรมตกแต่ง ผิวหนัง และเวชศาสตร์ชะลอวัยไว้ในทีมเดียว'
    WHEN 'en' THEN 'Beaugevity is the core belief behind PHIVARA — the fusion of beauty and longevity medicine, grounded in clinical practice. Every treatment begins with in-depth diagnostics and health assessment by specialist physicians, followed by a personalized care plan that integrates plastic surgery, dermatology, and longevity medicine under one team.'
  END WHERE "intro_body1" IS NULL;

  UPDATE "home_hero_locales" SET "intro_body2" = CASE "_locale"
    WHEN 'th' THEN 'ดำเนินการภายใต้มาตรฐานความปลอดภัยระดับโรงพยาบาล และทีมสหสาขาวิชาชีพที่ติดตามผลลัพธ์อย่างต่อเนื่อง เพื่อผลลัพธ์ที่ปลอดภัย แม่นยำ และยั่งยืน'
    WHEN 'en' THEN 'Delivered under hospital-grade safety standards, with a multidisciplinary team monitoring outcomes at every step — for results that are safe, precise, and built to last.'
  END WHERE "intro_body2" IS NULL;

  UPDATE "home_hero_locales" SET "intro_tagline" = '— The Art of Beaugevity' WHERE "intro_tagline" IS NULL;

  UPDATE "home_hero_locales" SET "diagram_label_tl" = CASE "_locale"
    WHEN 'th' THEN 'เวชศาสตร์อายุยืนยาว' WHEN 'en' THEN 'Anti-Aging & Longevity' END
    WHERE "diagram_label_tl" IS NULL;
  UPDATE "home_hero_locales" SET "diagram_label_tr" = CASE "_locale"
    WHEN 'th' THEN 'ผิวหนัง' WHEN 'en' THEN 'Dermatology' END
    WHERE "diagram_label_tr" IS NULL;
  UPDATE "home_hero_locales" SET "diagram_label_bl" = CASE "_locale"
    WHEN 'th' THEN 'สุขภาวะเชิงความงาม' WHEN 'en' THEN 'Aesthetic Wellness' END
    WHERE "diagram_label_bl" IS NULL;
  UPDATE "home_hero_locales" SET "diagram_label_br" = CASE "_locale"
    WHEN 'th' THEN 'ศัลยกรรมตกแต่ง' WHEN 'en' THEN 'Plastic Surgery' END
    WHERE "diagram_label_br" IS NULL;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "intro_eyebrow";
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "intro_quote";
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "intro_body1";
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "intro_body2";
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "intro_tagline";
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "diagram_label_tl";
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "diagram_label_tr";
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "diagram_label_bl";
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "diagram_label_br";
  `)
}
