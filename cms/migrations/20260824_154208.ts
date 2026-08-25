import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds the "PHIVARA DESTINATIONS" branch-highlight section's eyebrow/
// heading (cms/globals/HomeHero.ts's fourth collapsible group) as real,
// editable columns on home_hero_locales. The branch cards themselves
// already come from the `branches` collection — nothing to touch there.
// Backfills both th and en rows with the exact text that was previously
// hardcoded in src/app/[locale]/(public)/page.tsx. Safe to re-run.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "destinations_eyebrow" varchar;
  ALTER TABLE "home_hero_locales" ADD COLUMN IF NOT EXISTS "destinations_headline" varchar;

  UPDATE "home_hero_locales" SET "destinations_eyebrow" = 'PHIVARA DESTINATIONS' WHERE "destinations_eyebrow" IS NULL;

  UPDATE "home_hero_locales" SET "destinations_headline" = CASE "_locale"
    WHEN 'th' THEN 'พื้นที่ดูแลที่ออกแบบมาเพื่อทุกเส้นทางของคุณ'
    WHEN 'en' THEN 'Distinctive spaces, designed around your journey'
  END WHERE "destinations_headline" IS NULL;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "destinations_eyebrow";
  ALTER TABLE "home_hero_locales" DROP COLUMN IF EXISTS "destinations_headline";
  `)
}
