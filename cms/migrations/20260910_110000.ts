import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds the admin-only "branch label position" field to the existing
// DoctorDisplaySettings global (see that file's comment) — controls whether
// the branch label(s) on every /doctor card sit right under the photo
// (top, current behavior) or just above the "ดูประวัติแพทย์" button
// (bottom), site-wide.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
     CREATE TYPE "public"."enum_doctor_display_settings_branch_label_position" AS ENUM('top', 'bottom');
    EXCEPTION
     WHEN duplicate_object THEN null;
    END $$;

    ALTER TABLE "doctor_display_settings" ADD COLUMN IF NOT EXISTS "branch_label_position" "public"."enum_doctor_display_settings_branch_label_position" DEFAULT 'top';
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "doctor_display_settings" DROP COLUMN IF EXISTS "branch_label_position";
    DROP TYPE IF EXISTS "public"."enum_doctor_display_settings_branch_label_position";
  `)
}
