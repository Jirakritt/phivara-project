import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds a dedicated `featuredPhoto` upload field for the "แพทย์หลักประจำสาขา"
// featured card (see the field comment on Doctors.ts) — deliberately
// separate from portrait/cardPhoto since the featured card uses it as a
// wide 16:9 background-image, not a portrait/square photo-frame. Mirrors
// the exact portrait_id/card_photo_id column+FK+index shape from the
// original 20260807_034304 migration, including the _doctors_v (drafts)
// version column.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "doctors" ADD COLUMN IF NOT EXISTS "featured_photo_id" integer;
    ALTER TABLE "_doctors_v" ADD COLUMN IF NOT EXISTS "version_featured_photo_id" integer;

    DO $$ BEGIN
     ALTER TABLE "doctors" ADD CONSTRAINT "doctors_featured_photo_id_media_id_fk" FOREIGN KEY ("featured_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
     WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
     ALTER TABLE "_doctors_v" ADD CONSTRAINT "_doctors_v_version_featured_photo_id_media_id_fk" FOREIGN KEY ("version_featured_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
     WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "doctors_featured_photo_idx" ON "doctors" USING btree ("featured_photo_id");
    CREATE INDEX IF NOT EXISTS "_doctors_v_version_version_featured_photo_idx" ON "_doctors_v" USING btree ("version_featured_photo_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "_doctors_v" DROP COLUMN IF EXISTS "version_featured_photo_id";
    ALTER TABLE "doctors" DROP COLUMN IF EXISTS "featured_photo_id";
  `)
}
