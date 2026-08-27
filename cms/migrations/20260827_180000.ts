import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds the localized `subSpecialty` field (cms/collections/Doctors.ts,
// "ข้อมูลพื้นฐาน" tab, right after specialtyLabel) — replaces the earlier
// (incorrect) reuse of `boardCertification` for the branch featured card's
// "ความชำนาญพิเศษเฉพาะทาง" fact. Localized text lives on doctors_locales /
// _doctors_v_locales, same shape as specialtyLabel/subNote.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "doctors_locales" ADD COLUMN IF NOT EXISTS "sub_specialty" varchar;
    ALTER TABLE "_doctors_v_locales" ADD COLUMN IF NOT EXISTS "version_sub_specialty" varchar;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "_doctors_v_locales" DROP COLUMN IF EXISTS "version_sub_specialty";
    ALTER TABLE "doctors_locales" DROP COLUMN IF EXISTS "sub_specialty";
  `)
}
