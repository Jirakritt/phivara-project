import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Creates the table for the new DoctorDisplaySettings Global (2 plain
// upload/media relationship fields, no localized fields — see the file
// comment on cms/globals/DoctorDisplaySettings.ts) — mirrors the shape of
// other simple, non-localized Globals (a single row table, no _locales
// child table needed since nothing here is `localized: true`).
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "doctor_display_settings" (
    	"id" serial PRIMARY KEY NOT NULL,
    	"profile_background_id" integer,
    	"featured_background_id" integer,
    	"updated_at" timestamp(3) with time zone,
    	"created_at" timestamp(3) with time zone
    );

    DO $$ BEGIN
     ALTER TABLE "doctor_display_settings" ADD CONSTRAINT "doctor_display_settings_profile_background_id_media_id_fk" FOREIGN KEY ("profile_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
     WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
     ALTER TABLE "doctor_display_settings" ADD CONSTRAINT "doctor_display_settings_featured_background_id_media_id_fk" FOREIGN KEY ("featured_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
     WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "doctor_display_settings_profile_background_idx" ON "doctor_display_settings" USING btree ("profile_background_id");
    CREATE INDEX IF NOT EXISTS "doctor_display_settings_featured_background_idx" ON "doctor_display_settings" USING btree ("featured_background_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "doctor_display_settings" CASCADE;
  `)
}
