import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."_locales" ADD VALUE 'ja';
  ALTER TYPE "public"."_locales" ADD VALUE 'zh';
  ALTER TYPE "public"."_locales" ADD VALUE 'vi';
  ALTER TYPE "public"."_locales" ADD VALUE 'km';
  ALTER TYPE "public"."_locales" ADD VALUE 'ar';
  ALTER TYPE "public"."_locales" ADD VALUE 'ms';
  ALTER TYPE "public"."_locales" ADD VALUE 'id';
  ALTER TYPE "public"."_locales" ADD VALUE 'de';
  ALTER TYPE "public"."_locales" ADD VALUE 'ru';
  ALTER TYPE "public"."_locales" ADD VALUE 'lo';
  ALTER TYPE "public"."_locales" ADD VALUE 'ko';
  ALTER TYPE "public"."_locales" ADD VALUE 'fr';
  ALTER TYPE "public"."enum__doctors_v_published_locale" ADD VALUE 'ja';
  ALTER TYPE "public"."enum__doctors_v_published_locale" ADD VALUE 'zh';
  ALTER TYPE "public"."enum__doctors_v_published_locale" ADD VALUE 'vi';
  ALTER TYPE "public"."enum__doctors_v_published_locale" ADD VALUE 'km';
  ALTER TYPE "public"."enum__doctors_v_published_locale" ADD VALUE 'ar';
  ALTER TYPE "public"."enum__doctors_v_published_locale" ADD VALUE 'ms';
  ALTER TYPE "public"."enum__doctors_v_published_locale" ADD VALUE 'id';
  ALTER TYPE "public"."enum__doctors_v_published_locale" ADD VALUE 'de';
  ALTER TYPE "public"."enum__doctors_v_published_locale" ADD VALUE 'ru';
  ALTER TYPE "public"."enum__doctors_v_published_locale" ADD VALUE 'lo';
  ALTER TYPE "public"."enum__doctors_v_published_locale" ADD VALUE 'ko';
  ALTER TYPE "public"."enum__doctors_v_published_locale" ADD VALUE 'fr';
  ALTER TYPE "public"."enum__programs_v_published_locale" ADD VALUE 'ja';
  ALTER TYPE "public"."enum__programs_v_published_locale" ADD VALUE 'zh';
  ALTER TYPE "public"."enum__programs_v_published_locale" ADD VALUE 'vi';
  ALTER TYPE "public"."enum__programs_v_published_locale" ADD VALUE 'km';
  ALTER TYPE "public"."enum__programs_v_published_locale" ADD VALUE 'ar';
  ALTER TYPE "public"."enum__programs_v_published_locale" ADD VALUE 'ms';
  ALTER TYPE "public"."enum__programs_v_published_locale" ADD VALUE 'id';
  ALTER TYPE "public"."enum__programs_v_published_locale" ADD VALUE 'de';
  ALTER TYPE "public"."enum__programs_v_published_locale" ADD VALUE 'ru';
  ALTER TYPE "public"."enum__programs_v_published_locale" ADD VALUE 'lo';
  ALTER TYPE "public"."enum__programs_v_published_locale" ADD VALUE 'ko';
  ALTER TYPE "public"."enum__programs_v_published_locale" ADD VALUE 'fr';
  ALTER TYPE "public"."enum__articles_v_published_locale" ADD VALUE 'ja';
  ALTER TYPE "public"."enum__articles_v_published_locale" ADD VALUE 'zh';
  ALTER TYPE "public"."enum__articles_v_published_locale" ADD VALUE 'vi';
  ALTER TYPE "public"."enum__articles_v_published_locale" ADD VALUE 'km';
  ALTER TYPE "public"."enum__articles_v_published_locale" ADD VALUE 'ar';
  ALTER TYPE "public"."enum__articles_v_published_locale" ADD VALUE 'ms';
  ALTER TYPE "public"."enum__articles_v_published_locale" ADD VALUE 'id';
  ALTER TYPE "public"."enum__articles_v_published_locale" ADD VALUE 'de';
  ALTER TYPE "public"."enum__articles_v_published_locale" ADD VALUE 'ru';
  ALTER TYPE "public"."enum__articles_v_published_locale" ADD VALUE 'lo';
  ALTER TYPE "public"."enum__articles_v_published_locale" ADD VALUE 'ko';
  ALTER TYPE "public"."enum__articles_v_published_locale" ADD VALUE 'fr';
  CREATE TABLE "language_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"en_cms_editable" boolean DEFAULT true,
  	"en_publicly_live" boolean DEFAULT true,
  	"ja_cms_editable" boolean DEFAULT false,
  	"ja_publicly_live" boolean DEFAULT false,
  	"zh_cms_editable" boolean DEFAULT false,
  	"zh_publicly_live" boolean DEFAULT false,
  	"vi_cms_editable" boolean DEFAULT false,
  	"vi_publicly_live" boolean DEFAULT false,
  	"km_cms_editable" boolean DEFAULT false,
  	"km_publicly_live" boolean DEFAULT false,
  	"ar_cms_editable" boolean DEFAULT false,
  	"ar_publicly_live" boolean DEFAULT false,
  	"ms_cms_editable" boolean DEFAULT false,
  	"ms_publicly_live" boolean DEFAULT false,
  	"de_cms_editable" boolean DEFAULT false,
  	"de_publicly_live" boolean DEFAULT false,
  	"ru_cms_editable" boolean DEFAULT false,
  	"ru_publicly_live" boolean DEFAULT false,
  	"lo_cms_editable" boolean DEFAULT false,
  	"lo_publicly_live" boolean DEFAULT false,
  	"ko_cms_editable" boolean DEFAULT false,
  	"ko_publicly_live" boolean DEFAULT false,
  	"fr_cms_editable" boolean DEFAULT false,
  	"fr_publicly_live" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "language_settings" CASCADE;
  ALTER TABLE "media_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "branches_gallery_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "branches_facilities_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "branches_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "doctors_tags_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "doctors_credential_groups_items_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "doctors_credential_groups_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "doctors_schedule_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "doctors_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_doctors_v_version_tags_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_doctors_v_version_credential_groups_items_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_doctors_v_version_credential_groups_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_doctors_v_version_schedule_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_doctors_v_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "programs_highlights_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "programs_purpose_list_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "programs_audience_list_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "programs_checkup_items_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "programs_terms_of_service_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "programs_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_programs_v_version_highlights_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_programs_v_version_purpose_list_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_programs_v_version_audience_list_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_programs_v_version_checkup_items_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_programs_v_version_terms_of_service_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_programs_v_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "articles_insight_steps_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "articles_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_articles_v_version_insight_steps_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "_articles_v_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "awards_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "membership_privileges_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "membership_journey_steps_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "membership_faq_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "membership_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "ecosystem_disciplines_chips_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "ecosystem_disciplines_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "ecosystem_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "home_hero_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "footer_link_groups_links_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "footer_link_groups_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "footer_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  ALTER TABLE "topbar_locales" ALTER COLUMN "_locale" SET DATA TYPE text;
  DROP TYPE "public"."_locales";
  CREATE TYPE "public"."_locales" AS ENUM('th', 'en');
  ALTER TABLE "media_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "branches_gallery_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "branches_facilities_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "branches_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "doctors_tags_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "doctors_credential_groups_items_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "doctors_credential_groups_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "doctors_schedule_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "doctors_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_doctors_v_version_tags_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_doctors_v_version_credential_groups_items_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_doctors_v_version_credential_groups_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_doctors_v_version_schedule_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_doctors_v_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "programs_highlights_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "programs_purpose_list_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "programs_audience_list_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "programs_checkup_items_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "programs_terms_of_service_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "programs_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_programs_v_version_highlights_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_programs_v_version_purpose_list_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_programs_v_version_audience_list_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_programs_v_version_checkup_items_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_programs_v_version_terms_of_service_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_programs_v_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "articles_insight_steps_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "articles_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_articles_v_version_insight_steps_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_articles_v_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "awards_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "membership_privileges_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "membership_journey_steps_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "membership_faq_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "membership_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "ecosystem_disciplines_chips_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "ecosystem_disciplines_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "ecosystem_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "home_hero_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "footer_link_groups_links_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "footer_link_groups_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "footer_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "topbar_locales" ALTER COLUMN "_locale" SET DATA TYPE "public"."_locales" USING "_locale"::"public"."_locales";
  ALTER TABLE "_doctors_v" ALTER COLUMN "published_locale" SET DATA TYPE text;
  DROP TYPE "public"."enum__doctors_v_published_locale";
  CREATE TYPE "public"."enum__doctors_v_published_locale" AS ENUM('th', 'en');
  ALTER TABLE "_doctors_v" ALTER COLUMN "published_locale" SET DATA TYPE "public"."enum__doctors_v_published_locale" USING "published_locale"::"public"."enum__doctors_v_published_locale";
  ALTER TABLE "_programs_v" ALTER COLUMN "published_locale" SET DATA TYPE text;
  DROP TYPE "public"."enum__programs_v_published_locale";
  CREATE TYPE "public"."enum__programs_v_published_locale" AS ENUM('th', 'en');
  ALTER TABLE "_programs_v" ALTER COLUMN "published_locale" SET DATA TYPE "public"."enum__programs_v_published_locale" USING "published_locale"::"public"."enum__programs_v_published_locale";
  ALTER TABLE "_articles_v" ALTER COLUMN "published_locale" SET DATA TYPE text;
  DROP TYPE "public"."enum__articles_v_published_locale";
  CREATE TYPE "public"."enum__articles_v_published_locale" AS ENUM('th', 'en');
  ALTER TABLE "_articles_v" ALTER COLUMN "published_locale" SET DATA TYPE "public"."enum__articles_v_published_locale" USING "published_locale"::"public"."enum__articles_v_published_locale";`)
}
