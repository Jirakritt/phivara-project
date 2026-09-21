import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_branches_notification_recipients_recipient_type" AS ENUM('to', 'cc', 'bcc');
  CREATE TYPE "public"."enum_leads_notification_status" AS ENUM('pending', 'sent', 'failed', 'skipped');
  CREATE TYPE "public"."enum_doctor_display_settings_multi_branch_label_style" AS ENUM('pills', 'list');
  CREATE TYPE "public"."enum_doctor_display_settings_branch_label_position" AS ENUM('top', 'bottom');
  CREATE TABLE "branches_notification_recipients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"email" varchar NOT NULL,
  	"recipient_type" "enum_branches_notification_recipients_recipient_type" DEFAULT 'to' NOT NULL,
  	"active" boolean DEFAULT true
  );
  
  CREATE TABLE "doctors_featured_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "doctors_featured_highlights_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_doctors_v_version_featured_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_doctors_v_version_featured_highlights_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "leads_internal_remarks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"note" varchar NOT NULL,
  	"author_name" varchar,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "doctor_display_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"profile_background_id" integer,
  	"featured_background_id" integer,
  	"group_doctors_by_branch" boolean DEFAULT true,
  	"multi_branch_label_style" "enum_doctor_display_settings_multi_branch_label_style" DEFAULT 'list',
  	"branch_label_position" "enum_doctor_display_settings_branch_label_position" DEFAULT 'top',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "leads" ALTER COLUMN "service" SET DATA TYPE text;
  DROP TYPE "public"."enum_leads_service";
  CREATE TYPE "public"."enum_leads_service" AS ENUM('wellness', 'longevity', 'plastic-surgery', 'dermatology', 'membership');
  ALTER TABLE "leads" ALTER COLUMN "service" SET DATA TYPE "public"."enum_leads_service" USING "service"::"public"."enum_leads_service";
  ALTER TABLE "ecosystem_locales" ALTER COLUMN "hero_lead" SET DATA TYPE jsonb;
  ALTER TABLE "branches" ADD COLUMN "line_url" varchar;
  ALTER TABLE "doctors" ADD COLUMN "display_order" numeric DEFAULT 0;
  ALTER TABLE "doctors" ADD COLUMN "is_branch_featured" boolean DEFAULT false;
  ALTER TABLE "doctors" ADD COLUMN "featured_photo_id" integer;
  ALTER TABLE "doctors_locales" ADD COLUMN "sub_specialty" varchar;
  ALTER TABLE "doctors_locales" ADD COLUMN "quote" varchar;
  ALTER TABLE "_doctors_v" ADD COLUMN "version_display_order" numeric DEFAULT 0;
  ALTER TABLE "_doctors_v" ADD COLUMN "version_is_branch_featured" boolean DEFAULT false;
  ALTER TABLE "_doctors_v" ADD COLUMN "version_featured_photo_id" integer;
  ALTER TABLE "_doctors_v_locales" ADD COLUMN "version_sub_specialty" varchar;
  ALTER TABLE "_doctors_v_locales" ADD COLUMN "version_quote" varchar;
  ALTER TABLE "leads" ADD COLUMN "honeypot" varchar;
  ALTER TABLE "leads" ADD COLUMN "notification_status" "enum_leads_notification_status" DEFAULT 'pending';
  ALTER TABLE "leads" ADD COLUMN "notification_sent_at" timestamp(3) with time zone;
  ALTER TABLE "leads" ADD COLUMN "notification_error" varchar;
  ALTER TABLE "branches_notification_recipients" ADD CONSTRAINT "branches_notification_recipients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."branches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors_featured_highlights" ADD CONSTRAINT "doctors_featured_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors_featured_highlights_locales" ADD CONSTRAINT "doctors_featured_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."doctors_featured_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_doctors_v_version_featured_highlights" ADD CONSTRAINT "_doctors_v_version_featured_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_doctors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_doctors_v_version_featured_highlights_locales" ADD CONSTRAINT "_doctors_v_version_featured_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_doctors_v_version_featured_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leads_internal_remarks" ADD CONSTRAINT "leads_internal_remarks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctor_display_settings" ADD CONSTRAINT "doctor_display_settings_profile_background_id_media_id_fk" FOREIGN KEY ("profile_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "doctor_display_settings" ADD CONSTRAINT "doctor_display_settings_featured_background_id_media_id_fk" FOREIGN KEY ("featured_background_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "branches_notification_recipients_order_idx" ON "branches_notification_recipients" USING btree ("_order");
  CREATE INDEX "branches_notification_recipients_parent_id_idx" ON "branches_notification_recipients" USING btree ("_parent_id");
  CREATE INDEX "doctors_featured_highlights_order_idx" ON "doctors_featured_highlights" USING btree ("_order");
  CREATE INDEX "doctors_featured_highlights_parent_id_idx" ON "doctors_featured_highlights" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "doctors_featured_highlights_locales_locale_parent_id_unique" ON "doctors_featured_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_doctors_v_version_featured_highlights_order_idx" ON "_doctors_v_version_featured_highlights" USING btree ("_order");
  CREATE INDEX "_doctors_v_version_featured_highlights_parent_id_idx" ON "_doctors_v_version_featured_highlights" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_doctors_v_version_featured_highlights_locales_locale_parent" ON "_doctors_v_version_featured_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "leads_internal_remarks_order_idx" ON "leads_internal_remarks" USING btree ("_order");
  CREATE INDEX "leads_internal_remarks_parent_id_idx" ON "leads_internal_remarks" USING btree ("_parent_id");
  CREATE INDEX "doctor_display_settings_profile_background_idx" ON "doctor_display_settings" USING btree ("profile_background_id");
  CREATE INDEX "doctor_display_settings_featured_background_idx" ON "doctor_display_settings" USING btree ("featured_background_id");
  ALTER TABLE "doctors" ADD CONSTRAINT "doctors_featured_photo_id_media_id_fk" FOREIGN KEY ("featured_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_doctors_v" ADD CONSTRAINT "_doctors_v_version_featured_photo_id_media_id_fk" FOREIGN KEY ("version_featured_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "doctors_featured_photo_idx" ON "doctors" USING btree ("featured_photo_id");
  CREATE INDEX "_doctors_v_version_version_featured_photo_idx" ON "_doctors_v" USING btree ("version_featured_photo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "branches_notification_recipients" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "doctors_featured_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "doctors_featured_highlights_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_doctors_v_version_featured_highlights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_doctors_v_version_featured_highlights_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "leads_internal_remarks" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "doctor_display_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "branches_notification_recipients" CASCADE;
  DROP TABLE "doctors_featured_highlights" CASCADE;
  DROP TABLE "doctors_featured_highlights_locales" CASCADE;
  DROP TABLE "_doctors_v_version_featured_highlights" CASCADE;
  DROP TABLE "_doctors_v_version_featured_highlights_locales" CASCADE;
  DROP TABLE "leads_internal_remarks" CASCADE;
  DROP TABLE "doctor_display_settings" CASCADE;
  ALTER TABLE "doctors" DROP CONSTRAINT "doctors_featured_photo_id_media_id_fk";
  
  ALTER TABLE "_doctors_v" DROP CONSTRAINT "_doctors_v_version_featured_photo_id_media_id_fk";
  
  ALTER TABLE "leads" ALTER COLUMN "service" SET DATA TYPE text;
  DROP TYPE "public"."enum_leads_service";
  CREATE TYPE "public"."enum_leads_service" AS ENUM('plastic-surgery', 'longevity', 'dermatology', 'wellness', 'membership');
  ALTER TABLE "leads" ALTER COLUMN "service" SET DATA TYPE "public"."enum_leads_service" USING "service"::"public"."enum_leads_service";
  DROP INDEX "doctors_featured_photo_idx";
  DROP INDEX "_doctors_v_version_version_featured_photo_idx";
  ALTER TABLE "ecosystem_locales" ALTER COLUMN "hero_lead" SET DATA TYPE varchar;
  ALTER TABLE "branches" DROP COLUMN "line_url";
  ALTER TABLE "doctors" DROP COLUMN "display_order";
  ALTER TABLE "doctors" DROP COLUMN "is_branch_featured";
  ALTER TABLE "doctors" DROP COLUMN "featured_photo_id";
  ALTER TABLE "doctors_locales" DROP COLUMN "sub_specialty";
  ALTER TABLE "doctors_locales" DROP COLUMN "quote";
  ALTER TABLE "_doctors_v" DROP COLUMN "version_display_order";
  ALTER TABLE "_doctors_v" DROP COLUMN "version_is_branch_featured";
  ALTER TABLE "_doctors_v" DROP COLUMN "version_featured_photo_id";
  ALTER TABLE "_doctors_v_locales" DROP COLUMN "version_sub_specialty";
  ALTER TABLE "_doctors_v_locales" DROP COLUMN "version_quote";
  ALTER TABLE "leads" DROP COLUMN "honeypot";
  ALTER TABLE "leads" DROP COLUMN "notification_status";
  ALTER TABLE "leads" DROP COLUMN "notification_sent_at";
  ALTER TABLE "leads" DROP COLUMN "notification_error";
  DROP TYPE "public"."enum_branches_notification_recipients_recipient_type";
  DROP TYPE "public"."enum_leads_notification_status";
  DROP TYPE "public"."enum_doctor_display_settings_multi_branch_label_style";
  DROP TYPE "public"."enum_doctor_display_settings_branch_label_position";`)
}
