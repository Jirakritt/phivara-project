import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds the 2 admin-only "doctor listing grouping" fields to the existing
// DoctorDisplaySettings global (see that file's comment) — a boolean toggle
// for whether the /doctor listing merges same-name doctors across branches,
// and a select for which visual style the merged card's branch label uses.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
     CREATE TYPE "public"."enum_doctor_display_settings_multi_branch_label_style" AS ENUM('pills', 'list');
    EXCEPTION
     WHEN duplicate_object THEN null;
    END $$;

    ALTER TABLE "doctor_display_settings" ADD COLUMN IF NOT EXISTS "group_doctors_by_branch" boolean DEFAULT true;
    ALTER TABLE "doctor_display_settings" ADD COLUMN IF NOT EXISTS "multi_branch_label_style" "public"."enum_doctor_display_settings_multi_branch_label_style" DEFAULT 'list';
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "doctor_display_settings" DROP COLUMN IF EXISTS "group_doctors_by_branch";
    ALTER TABLE "doctor_display_settings" DROP COLUMN IF EXISTS "multi_branch_label_style";
    DROP TYPE IF EXISTS "public"."enum_doctor_display_settings_multi_branch_label_style";
  `)
}
