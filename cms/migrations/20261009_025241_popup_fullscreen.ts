import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_popups_display_mode" AS ENUM('modal', 'fullscreen');
  ALTER TABLE "popups" ADD COLUMN "display_mode" "enum_popups_display_mode" DEFAULT 'modal' NOT NULL;
  ALTER TABLE "popups" ADD COLUMN "image_mobile_id" integer;
  ALTER TABLE "popups_locales" ADD COLUMN "button_label" varchar;
  ALTER TABLE "popups" ADD CONSTRAINT "popups_image_mobile_id_media_id_fk" FOREIGN KEY ("image_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "popups_image_mobile_idx" ON "popups" USING btree ("image_mobile_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "popups" DROP CONSTRAINT "popups_image_mobile_id_media_id_fk";
  
  DROP INDEX "popups_image_mobile_idx";
  ALTER TABLE "popups" DROP COLUMN "display_mode";
  ALTER TABLE "popups" DROP COLUMN "image_mobile_id";
  ALTER TABLE "popups_locales" DROP COLUMN "button_label";
  DROP TYPE "public"."enum_popups_display_mode";`)
}
