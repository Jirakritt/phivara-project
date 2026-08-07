import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('th', 'en');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'medical-reviewer');
  CREATE TYPE "public"."enum_doctors_schedule_day" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  CREATE TYPE "public"."enum_doctors_specialty" AS ENUM('plastic', 'dermatology', 'longevity', 'wellness');
  CREATE TYPE "public"."enum_doctors_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__doctors_v_version_schedule_day" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  CREATE TYPE "public"."enum__doctors_v_version_specialty" AS ENUM('plastic', 'dermatology', 'longevity', 'wellness');
  CREATE TYPE "public"."enum__doctors_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__doctors_v_published_locale" AS ENUM('th', 'en');
  CREATE TYPE "public"."enum_programs_checkup_items_group" AS ENUM('all', 'male', 'female');
  CREATE TYPE "public"."enum_programs_category" AS ENUM('plastic', 'dermatology', 'longevity', 'wellness');
  CREATE TYPE "public"."enum_programs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__programs_v_version_checkup_items_group" AS ENUM('all', 'male', 'female');
  CREATE TYPE "public"."enum__programs_v_version_category" AS ENUM('plastic', 'dermatology', 'longevity', 'wellness');
  CREATE TYPE "public"."enum__programs_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__programs_v_published_locale" AS ENUM('th', 'en');
  CREATE TYPE "public"."enum_articles_category" AS ENUM('longevity', 'dermatology', 'plastic', 'wellness');
  CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_version_category" AS ENUM('longevity', 'dermatology', 'plastic', 'wellness');
  CREATE TYPE "public"."enum__articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_published_locale" AS ENUM('th', 'en');
  CREATE TYPE "public"."enum_leads_service" AS ENUM('plastic-surgery', 'longevity', 'dermatology', 'wellness', 'membership');
  CREATE TYPE "public"."enum_leads_status" AS ENUM('new', 'contacted', 'booked', 'closed');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "users_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"branches_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "branches_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "branches_gallery_locales" (
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "branches_facilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "branches_facilities_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "branches" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"name_th" varchar NOT NULL,
  	"name_en" varchar NOT NULL,
  	"phone" varchar,
  	"line_id" varchar DEFAULT '@phivara',
  	"map_url" varchar,
  	"hero_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "branches_locales" (
  	"tagline" varchar,
  	"description" varchar,
  	"address" varchar,
  	"hours" varchar,
  	"directions" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "branches_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"doctors_id" integer,
  	"programs_id" integer
  );
  
  CREATE TABLE "doctors_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "doctors_tags_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "doctors_credential_groups_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "doctors_credential_groups_items_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "doctors_credential_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "doctors_credential_groups_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "doctors_schedule" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" "enum_doctors_schedule_day",
  	"hours" varchar
  );
  
  CREATE TABLE "doctors_schedule_locales" (
  	"location_name" varchar,
  	"location_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "doctors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"name_th" varchar,
  	"name_en" varchar,
  	"branch_id" integer,
  	"specialty" "enum_doctors_specialty",
  	"portrait_id" integer,
  	"card_photo_id" integer,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_doctors_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "doctors_locales" (
  	"specialty_label" varchar,
  	"sub_note" varchar,
  	"hospital_title" varchar,
  	"board_certification" varchar,
  	"bio" jsonb,
  	"contact_intro" varchar,
  	"contact_fact" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_doctors_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_doctors_v_version_tags_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_doctors_v_version_credential_groups_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_doctors_v_version_credential_groups_items_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_doctors_v_version_credential_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_doctors_v_version_credential_groups_locales" (
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_doctors_v_version_schedule" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"day" "enum__doctors_v_version_schedule_day",
  	"hours" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_doctors_v_version_schedule_locales" (
  	"location_name" varchar,
  	"location_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_doctors_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_name_th" varchar,
  	"version_name_en" varchar,
  	"version_branch_id" integer,
  	"version_specialty" "enum__doctors_v_version_specialty",
  	"version_portrait_id" integer,
  	"version_card_photo_id" integer,
  	"version_seo_og_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__doctors_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__doctors_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_doctors_v_locales" (
  	"version_specialty_label" varchar,
  	"version_sub_note" varchar,
  	"version_hospital_title" varchar,
  	"version_board_certification" varchar,
  	"version_bio" jsonb,
  	"version_contact_intro" varchar,
  	"version_contact_fact" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "programs_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "programs_highlights_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "programs_purpose_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "programs_purpose_list_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "programs_audience_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "programs_audience_list_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "programs_checkup_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"group" "enum_programs_checkup_items_group" DEFAULT 'all'
  );
  
  CREATE TABLE "programs_checkup_items_locales" (
  	"name" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "programs_terms_of_service" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "programs_terms_of_service_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "programs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"code" varchar,
  	"category" "enum_programs_category",
  	"price" numeric,
  	"featured" boolean DEFAULT false,
  	"branch_id" integer,
  	"hero_image_id" integer,
  	"search_keywords" varchar,
  	"contact_override_phone" varchar,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_programs_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "programs_locales" (
  	"title" varchar,
  	"validity_note" varchar,
  	"tag" varchar,
  	"short_description" varchar,
  	"card_note" varchar,
  	"about_program" jsonb,
  	"contact_override_location" varchar,
  	"contact_override_hours" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_programs_v_version_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_version_highlights_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_programs_v_version_purpose_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_version_purpose_list_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_programs_v_version_audience_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_version_audience_list_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_programs_v_version_checkup_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"group" "enum__programs_v_version_checkup_items_group" DEFAULT 'all',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_version_checkup_items_locales" (
  	"name" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_programs_v_version_terms_of_service" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_version_terms_of_service_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_programs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_code" varchar,
  	"version_category" "enum__programs_v_version_category",
  	"version_price" numeric,
  	"version_featured" boolean DEFAULT false,
  	"version_branch_id" integer,
  	"version_hero_image_id" integer,
  	"version_search_keywords" varchar,
  	"version_contact_override_phone" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__programs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__programs_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_programs_v_locales" (
  	"version_title" varchar,
  	"version_validity_note" varchar,
  	"version_tag" varchar,
  	"version_short_description" varchar,
  	"version_card_note" varchar,
  	"version_about_program" jsonb,
  	"version_contact_override_location" varchar,
  	"version_contact_override_hours" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "articles_insight_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "articles_insight_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "articles_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"category" "enum_articles_category",
  	"branch_id" integer,
  	"cover_image_id" integer,
  	"published_date" timestamp(3) with time zone,
  	"read_time_minutes" numeric,
  	"popular" boolean DEFAULT false,
  	"author_avatar_id" integer,
  	"author_doctor_id" integer,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_articles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "articles_locales" (
  	"title" varchar,
  	"summary" varchar,
  	"category_label" varchar,
  	"body" jsonb,
  	"note_box_heading" varchar,
  	"note_box_text" varchar,
  	"author_name" varchar DEFAULT 'ทีมแพทย์ PHIVARA',
  	"author_role" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "articles_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"programs_id" integer,
  	"doctors_id" integer
  );
  
  CREATE TABLE "_articles_v_version_insight_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_articles_v_version_insight_steps_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_articles_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_category" "enum__articles_v_version_category",
  	"version_branch_id" integer,
  	"version_cover_image_id" integer,
  	"version_published_date" timestamp(3) with time zone,
  	"version_read_time_minutes" numeric,
  	"version_popular" boolean DEFAULT false,
  	"version_author_avatar_id" integer,
  	"version_author_doctor_id" integer,
  	"version_seo_og_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__articles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__articles_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_articles_v_locales" (
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_category_label" varchar,
  	"version_body" jsonb,
  	"version_note_box_heading" varchar,
  	"version_note_box_text" varchar,
  	"version_author_name" varchar DEFAULT 'ทีมแพทย์ PHIVARA',
  	"version_author_role" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_articles_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"programs_id" integer,
  	"doctors_id" integer
  );
  
  CREATE TABLE "awards" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "awards_locales" (
  	"caption" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"branch" varchar NOT NULL,
  	"service" "enum_leads_service" NOT NULL,
  	"notes" varchar,
  	"preferred_date" timestamp(3) with time zone,
  	"source_path" varchar,
  	"status" "enum_leads_status" DEFAULT 'new' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"branches_id" integer,
  	"doctors_id" integer,
  	"programs_id" integer,
  	"articles_id" integer,
  	"awards_id" integer,
  	"leads_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "membership_privileges" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "membership_privileges_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "membership_journey_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "membership_journey_steps_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "membership_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "membership_faq_locales" (
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "membership" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_hero_image_id" integer,
  	"promise_image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "membership_locales" (
  	"hero_kicker" varchar DEFAULT 'PHIVARA PRIVATE MEMBERSHIP',
  	"hero_headline" varchar NOT NULL,
  	"hero_lead" varchar,
  	"intro_overline" varchar,
  	"intro_heading" varchar,
  	"intro_body" varchar,
  	"promise_quote" varchar,
  	"promise_body" varchar,
  	"final_cta_overline" varchar,
  	"final_cta_heading" varchar,
  	"final_cta_body" varchar,
  	"final_cta_button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "ecosystem_disciplines_chips" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "ecosystem_disciplines_chips_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "ecosystem_disciplines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "ecosystem_disciplines_locales" (
  	"eyebrow" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"subtitle" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"doctor_link_label" varchar NOT NULL,
  	"program_link_label" varchar NOT NULL,
  	"article_link_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "ecosystem" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "ecosystem_locales" (
  	"hero_eyebrow" varchar DEFAULT 'THE PHIVARA ECOSYSTEM',
  	"hero_headline_line1" varchar NOT NULL,
  	"hero_headline_line2" varchar NOT NULL,
  	"hero_lead" varchar,
  	"closing_cta_eyebrow" varchar DEFAULT 'BEGIN YOUR JOURNEY',
  	"closing_cta_heading" varchar NOT NULL,
  	"closing_cta_body" varchar,
  	"closing_cta_button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "home_hero_background_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL
  );
  
  CREATE TABLE "home_hero" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_hero_locales" (
  	"eyebrow" varchar DEFAULT 'THE ART OF BEAUGEVITY',
  	"headline" varchar NOT NULL,
  	"lead" varchar,
  	"cta_label" varchar DEFAULT 'จองปรึกษาส่วนตัว',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_branches_fk" FOREIGN KEY ("branches_id") REFERENCES "public"."branches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "branches_gallery" ADD CONSTRAINT "branches_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branches_gallery" ADD CONSTRAINT "branches_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."branches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "branches_gallery_locales" ADD CONSTRAINT "branches_gallery_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."branches_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "branches_facilities" ADD CONSTRAINT "branches_facilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."branches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "branches_facilities_locales" ADD CONSTRAINT "branches_facilities_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."branches_facilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "branches" ADD CONSTRAINT "branches_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "branches_locales" ADD CONSTRAINT "branches_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."branches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "branches_rels" ADD CONSTRAINT "branches_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."branches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "branches_rels" ADD CONSTRAINT "branches_rels_doctors_fk" FOREIGN KEY ("doctors_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "branches_rels" ADD CONSTRAINT "branches_rels_programs_fk" FOREIGN KEY ("programs_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors_tags" ADD CONSTRAINT "doctors_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors_tags_locales" ADD CONSTRAINT "doctors_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."doctors_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors_credential_groups_items" ADD CONSTRAINT "doctors_credential_groups_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."doctors_credential_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors_credential_groups_items_locales" ADD CONSTRAINT "doctors_credential_groups_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."doctors_credential_groups_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors_credential_groups" ADD CONSTRAINT "doctors_credential_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors_credential_groups_locales" ADD CONSTRAINT "doctors_credential_groups_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."doctors_credential_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors_schedule" ADD CONSTRAINT "doctors_schedule_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors_schedule_locales" ADD CONSTRAINT "doctors_schedule_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."doctors_schedule"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors" ADD CONSTRAINT "doctors_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "doctors" ADD CONSTRAINT "doctors_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "doctors" ADD CONSTRAINT "doctors_card_photo_id_media_id_fk" FOREIGN KEY ("card_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "doctors" ADD CONSTRAINT "doctors_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "doctors_locales" ADD CONSTRAINT "doctors_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_doctors_v_version_tags" ADD CONSTRAINT "_doctors_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_doctors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_doctors_v_version_tags_locales" ADD CONSTRAINT "_doctors_v_version_tags_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_doctors_v_version_tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_doctors_v_version_credential_groups_items" ADD CONSTRAINT "_doctors_v_version_credential_groups_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_doctors_v_version_credential_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_doctors_v_version_credential_groups_items_locales" ADD CONSTRAINT "_doctors_v_version_credential_groups_items_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_doctors_v_version_credential_groups_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_doctors_v_version_credential_groups" ADD CONSTRAINT "_doctors_v_version_credential_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_doctors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_doctors_v_version_credential_groups_locales" ADD CONSTRAINT "_doctors_v_version_credential_groups_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_doctors_v_version_credential_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_doctors_v_version_schedule" ADD CONSTRAINT "_doctors_v_version_schedule_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_doctors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_doctors_v_version_schedule_locales" ADD CONSTRAINT "_doctors_v_version_schedule_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_doctors_v_version_schedule"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_doctors_v" ADD CONSTRAINT "_doctors_v_parent_id_doctors_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."doctors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_doctors_v" ADD CONSTRAINT "_doctors_v_version_branch_id_branches_id_fk" FOREIGN KEY ("version_branch_id") REFERENCES "public"."branches"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_doctors_v" ADD CONSTRAINT "_doctors_v_version_portrait_id_media_id_fk" FOREIGN KEY ("version_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_doctors_v" ADD CONSTRAINT "_doctors_v_version_card_photo_id_media_id_fk" FOREIGN KEY ("version_card_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_doctors_v" ADD CONSTRAINT "_doctors_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_doctors_v_locales" ADD CONSTRAINT "_doctors_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_doctors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_highlights" ADD CONSTRAINT "programs_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_highlights_locales" ADD CONSTRAINT "programs_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_purpose_list" ADD CONSTRAINT "programs_purpose_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_purpose_list_locales" ADD CONSTRAINT "programs_purpose_list_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_purpose_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_audience_list" ADD CONSTRAINT "programs_audience_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_audience_list_locales" ADD CONSTRAINT "programs_audience_list_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_audience_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_checkup_items" ADD CONSTRAINT "programs_checkup_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_checkup_items_locales" ADD CONSTRAINT "programs_checkup_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_checkup_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_terms_of_service" ADD CONSTRAINT "programs_terms_of_service_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_terms_of_service_locales" ADD CONSTRAINT "programs_terms_of_service_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_terms_of_service"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs" ADD CONSTRAINT "programs_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs" ADD CONSTRAINT "programs_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs" ADD CONSTRAINT "programs_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programs_locales" ADD CONSTRAINT "programs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_version_highlights" ADD CONSTRAINT "_programs_v_version_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_version_highlights_locales" ADD CONSTRAINT "_programs_v_version_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_version_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_version_purpose_list" ADD CONSTRAINT "_programs_v_version_purpose_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_version_purpose_list_locales" ADD CONSTRAINT "_programs_v_version_purpose_list_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_version_purpose_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_version_audience_list" ADD CONSTRAINT "_programs_v_version_audience_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_version_audience_list_locales" ADD CONSTRAINT "_programs_v_version_audience_list_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_version_audience_list"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_version_checkup_items" ADD CONSTRAINT "_programs_v_version_checkup_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_version_checkup_items_locales" ADD CONSTRAINT "_programs_v_version_checkup_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_version_checkup_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_version_terms_of_service" ADD CONSTRAINT "_programs_v_version_terms_of_service_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_version_terms_of_service_locales" ADD CONSTRAINT "_programs_v_version_terms_of_service_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_version_terms_of_service"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v" ADD CONSTRAINT "_programs_v_parent_id_programs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."programs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v" ADD CONSTRAINT "_programs_v_version_branch_id_branches_id_fk" FOREIGN KEY ("version_branch_id") REFERENCES "public"."branches"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v" ADD CONSTRAINT "_programs_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v" ADD CONSTRAINT "_programs_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_programs_v_locales" ADD CONSTRAINT "_programs_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_insight_steps" ADD CONSTRAINT "articles_insight_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_insight_steps_locales" ADD CONSTRAINT "articles_insight_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles_insight_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_tags" ADD CONSTRAINT "articles_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_author_avatar_id_media_id_fk" FOREIGN KEY ("author_avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_author_doctor_id_doctors_id_fk" FOREIGN KEY ("author_doctor_id") REFERENCES "public"."doctors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_locales" ADD CONSTRAINT "articles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_programs_fk" FOREIGN KEY ("programs_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_doctors_fk" FOREIGN KEY ("doctors_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_version_insight_steps" ADD CONSTRAINT "_articles_v_version_insight_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_version_insight_steps_locales" ADD CONSTRAINT "_articles_v_version_insight_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v_version_insight_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_version_tags" ADD CONSTRAINT "_articles_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_branch_id_branches_id_fk" FOREIGN KEY ("version_branch_id") REFERENCES "public"."branches"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_author_avatar_id_media_id_fk" FOREIGN KEY ("version_author_avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_author_doctor_id_doctors_id_fk" FOREIGN KEY ("version_author_doctor_id") REFERENCES "public"."doctors"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_locales" ADD CONSTRAINT "_articles_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_programs_fk" FOREIGN KEY ("programs_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_doctors_fk" FOREIGN KEY ("doctors_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "awards" ADD CONSTRAINT "awards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "awards_locales" ADD CONSTRAINT "awards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."awards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_branches_fk" FOREIGN KEY ("branches_id") REFERENCES "public"."branches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_doctors_fk" FOREIGN KEY ("doctors_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_programs_fk" FOREIGN KEY ("programs_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_awards_fk" FOREIGN KEY ("awards_id") REFERENCES "public"."awards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "membership_privileges" ADD CONSTRAINT "membership_privileges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."membership"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "membership_privileges_locales" ADD CONSTRAINT "membership_privileges_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."membership_privileges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "membership_journey_steps" ADD CONSTRAINT "membership_journey_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."membership"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "membership_journey_steps_locales" ADD CONSTRAINT "membership_journey_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."membership_journey_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "membership_faq" ADD CONSTRAINT "membership_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."membership"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "membership_faq_locales" ADD CONSTRAINT "membership_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."membership_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "membership" ADD CONSTRAINT "membership_hero_hero_image_id_media_id_fk" FOREIGN KEY ("hero_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "membership" ADD CONSTRAINT "membership_promise_image_id_media_id_fk" FOREIGN KEY ("promise_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "membership_locales" ADD CONSTRAINT "membership_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."membership"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ecosystem_disciplines_chips" ADD CONSTRAINT "ecosystem_disciplines_chips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ecosystem_disciplines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ecosystem_disciplines_chips_locales" ADD CONSTRAINT "ecosystem_disciplines_chips_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ecosystem_disciplines_chips"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ecosystem_disciplines" ADD CONSTRAINT "ecosystem_disciplines_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "ecosystem_disciplines" ADD CONSTRAINT "ecosystem_disciplines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ecosystem"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ecosystem_disciplines_locales" ADD CONSTRAINT "ecosystem_disciplines_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ecosystem_disciplines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "ecosystem_locales" ADD CONSTRAINT "ecosystem_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."ecosystem"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_hero_background_images" ADD CONSTRAINT "home_hero_background_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_hero_background_images" ADD CONSTRAINT "home_hero_background_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_hero_locales" ADD CONSTRAINT "home_hero_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_hero"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "users_rels_order_idx" ON "users_rels" USING btree ("order");
  CREATE INDEX "users_rels_parent_idx" ON "users_rels" USING btree ("parent_id");
  CREATE INDEX "users_rels_path_idx" ON "users_rels" USING btree ("path");
  CREATE INDEX "users_rels_branches_id_idx" ON "users_rels" USING btree ("branches_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "branches_gallery_order_idx" ON "branches_gallery" USING btree ("_order");
  CREATE INDEX "branches_gallery_parent_id_idx" ON "branches_gallery" USING btree ("_parent_id");
  CREATE INDEX "branches_gallery_image_idx" ON "branches_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "branches_gallery_locales_locale_parent_id_unique" ON "branches_gallery_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "branches_facilities_order_idx" ON "branches_facilities" USING btree ("_order");
  CREATE INDEX "branches_facilities_parent_id_idx" ON "branches_facilities" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "branches_facilities_locales_locale_parent_id_unique" ON "branches_facilities_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "branches_slug_idx" ON "branches" USING btree ("slug");
  CREATE INDEX "branches_hero_image_idx" ON "branches" USING btree ("hero_image_id");
  CREATE INDEX "branches_updated_at_idx" ON "branches" USING btree ("updated_at");
  CREATE INDEX "branches_created_at_idx" ON "branches" USING btree ("created_at");
  CREATE UNIQUE INDEX "branches_locales_locale_parent_id_unique" ON "branches_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "branches_rels_order_idx" ON "branches_rels" USING btree ("order");
  CREATE INDEX "branches_rels_parent_idx" ON "branches_rels" USING btree ("parent_id");
  CREATE INDEX "branches_rels_path_idx" ON "branches_rels" USING btree ("path");
  CREATE INDEX "branches_rels_doctors_id_idx" ON "branches_rels" USING btree ("doctors_id");
  CREATE INDEX "branches_rels_programs_id_idx" ON "branches_rels" USING btree ("programs_id");
  CREATE INDEX "doctors_tags_order_idx" ON "doctors_tags" USING btree ("_order");
  CREATE INDEX "doctors_tags_parent_id_idx" ON "doctors_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "doctors_tags_locales_locale_parent_id_unique" ON "doctors_tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "doctors_credential_groups_items_order_idx" ON "doctors_credential_groups_items" USING btree ("_order");
  CREATE INDEX "doctors_credential_groups_items_parent_id_idx" ON "doctors_credential_groups_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "doctors_credential_groups_items_locales_locale_parent_id_uni" ON "doctors_credential_groups_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "doctors_credential_groups_order_idx" ON "doctors_credential_groups" USING btree ("_order");
  CREATE INDEX "doctors_credential_groups_parent_id_idx" ON "doctors_credential_groups" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "doctors_credential_groups_locales_locale_parent_id_unique" ON "doctors_credential_groups_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "doctors_schedule_order_idx" ON "doctors_schedule" USING btree ("_order");
  CREATE INDEX "doctors_schedule_parent_id_idx" ON "doctors_schedule" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "doctors_schedule_locales_locale_parent_id_unique" ON "doctors_schedule_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "doctors_slug_idx" ON "doctors" USING btree ("slug");
  CREATE INDEX "doctors_branch_idx" ON "doctors" USING btree ("branch_id");
  CREATE INDEX "doctors_portrait_idx" ON "doctors" USING btree ("portrait_id");
  CREATE INDEX "doctors_card_photo_idx" ON "doctors" USING btree ("card_photo_id");
  CREATE INDEX "doctors_seo_seo_og_image_idx" ON "doctors" USING btree ("seo_og_image_id");
  CREATE INDEX "doctors_updated_at_idx" ON "doctors" USING btree ("updated_at");
  CREATE INDEX "doctors_created_at_idx" ON "doctors" USING btree ("created_at");
  CREATE INDEX "doctors__status_idx" ON "doctors" USING btree ("_status");
  CREATE UNIQUE INDEX "doctors_locales_locale_parent_id_unique" ON "doctors_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_doctors_v_version_tags_order_idx" ON "_doctors_v_version_tags" USING btree ("_order");
  CREATE INDEX "_doctors_v_version_tags_parent_id_idx" ON "_doctors_v_version_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_doctors_v_version_tags_locales_locale_parent_id_unique" ON "_doctors_v_version_tags_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_doctors_v_version_credential_groups_items_order_idx" ON "_doctors_v_version_credential_groups_items" USING btree ("_order");
  CREATE INDEX "_doctors_v_version_credential_groups_items_parent_id_idx" ON "_doctors_v_version_credential_groups_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_doctors_v_version_credential_groups_items_locales_locale_pa" ON "_doctors_v_version_credential_groups_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_doctors_v_version_credential_groups_order_idx" ON "_doctors_v_version_credential_groups" USING btree ("_order");
  CREATE INDEX "_doctors_v_version_credential_groups_parent_id_idx" ON "_doctors_v_version_credential_groups" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_doctors_v_version_credential_groups_locales_locale_parent_i" ON "_doctors_v_version_credential_groups_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_doctors_v_version_schedule_order_idx" ON "_doctors_v_version_schedule" USING btree ("_order");
  CREATE INDEX "_doctors_v_version_schedule_parent_id_idx" ON "_doctors_v_version_schedule" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_doctors_v_version_schedule_locales_locale_parent_id_unique" ON "_doctors_v_version_schedule_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_doctors_v_parent_idx" ON "_doctors_v" USING btree ("parent_id");
  CREATE INDEX "_doctors_v_version_version_slug_idx" ON "_doctors_v" USING btree ("version_slug");
  CREATE INDEX "_doctors_v_version_version_branch_idx" ON "_doctors_v" USING btree ("version_branch_id");
  CREATE INDEX "_doctors_v_version_version_portrait_idx" ON "_doctors_v" USING btree ("version_portrait_id");
  CREATE INDEX "_doctors_v_version_version_card_photo_idx" ON "_doctors_v" USING btree ("version_card_photo_id");
  CREATE INDEX "_doctors_v_version_seo_version_seo_og_image_idx" ON "_doctors_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_doctors_v_version_version_updated_at_idx" ON "_doctors_v" USING btree ("version_updated_at");
  CREATE INDEX "_doctors_v_version_version_created_at_idx" ON "_doctors_v" USING btree ("version_created_at");
  CREATE INDEX "_doctors_v_version_version__status_idx" ON "_doctors_v" USING btree ("version__status");
  CREATE INDEX "_doctors_v_created_at_idx" ON "_doctors_v" USING btree ("created_at");
  CREATE INDEX "_doctors_v_updated_at_idx" ON "_doctors_v" USING btree ("updated_at");
  CREATE INDEX "_doctors_v_snapshot_idx" ON "_doctors_v" USING btree ("snapshot");
  CREATE INDEX "_doctors_v_published_locale_idx" ON "_doctors_v" USING btree ("published_locale");
  CREATE INDEX "_doctors_v_latest_idx" ON "_doctors_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_doctors_v_locales_locale_parent_id_unique" ON "_doctors_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "programs_highlights_order_idx" ON "programs_highlights" USING btree ("_order");
  CREATE INDEX "programs_highlights_parent_id_idx" ON "programs_highlights" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "programs_highlights_locales_locale_parent_id_unique" ON "programs_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "programs_purpose_list_order_idx" ON "programs_purpose_list" USING btree ("_order");
  CREATE INDEX "programs_purpose_list_parent_id_idx" ON "programs_purpose_list" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "programs_purpose_list_locales_locale_parent_id_unique" ON "programs_purpose_list_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "programs_audience_list_order_idx" ON "programs_audience_list" USING btree ("_order");
  CREATE INDEX "programs_audience_list_parent_id_idx" ON "programs_audience_list" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "programs_audience_list_locales_locale_parent_id_unique" ON "programs_audience_list_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "programs_checkup_items_order_idx" ON "programs_checkup_items" USING btree ("_order");
  CREATE INDEX "programs_checkup_items_parent_id_idx" ON "programs_checkup_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "programs_checkup_items_locales_locale_parent_id_unique" ON "programs_checkup_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "programs_terms_of_service_order_idx" ON "programs_terms_of_service" USING btree ("_order");
  CREATE INDEX "programs_terms_of_service_parent_id_idx" ON "programs_terms_of_service" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "programs_terms_of_service_locales_locale_parent_id_unique" ON "programs_terms_of_service_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "programs_slug_idx" ON "programs" USING btree ("slug");
  CREATE INDEX "programs_branch_idx" ON "programs" USING btree ("branch_id");
  CREATE INDEX "programs_hero_image_idx" ON "programs" USING btree ("hero_image_id");
  CREATE INDEX "programs_seo_seo_og_image_idx" ON "programs" USING btree ("seo_og_image_id");
  CREATE INDEX "programs_updated_at_idx" ON "programs" USING btree ("updated_at");
  CREATE INDEX "programs_created_at_idx" ON "programs" USING btree ("created_at");
  CREATE INDEX "programs__status_idx" ON "programs" USING btree ("_status");
  CREATE UNIQUE INDEX "programs_locales_locale_parent_id_unique" ON "programs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_programs_v_version_highlights_order_idx" ON "_programs_v_version_highlights" USING btree ("_order");
  CREATE INDEX "_programs_v_version_highlights_parent_id_idx" ON "_programs_v_version_highlights" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_programs_v_version_highlights_locales_locale_parent_id_uniq" ON "_programs_v_version_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_programs_v_version_purpose_list_order_idx" ON "_programs_v_version_purpose_list" USING btree ("_order");
  CREATE INDEX "_programs_v_version_purpose_list_parent_id_idx" ON "_programs_v_version_purpose_list" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_programs_v_version_purpose_list_locales_locale_parent_id_un" ON "_programs_v_version_purpose_list_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_programs_v_version_audience_list_order_idx" ON "_programs_v_version_audience_list" USING btree ("_order");
  CREATE INDEX "_programs_v_version_audience_list_parent_id_idx" ON "_programs_v_version_audience_list" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_programs_v_version_audience_list_locales_locale_parent_id_u" ON "_programs_v_version_audience_list_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_programs_v_version_checkup_items_order_idx" ON "_programs_v_version_checkup_items" USING btree ("_order");
  CREATE INDEX "_programs_v_version_checkup_items_parent_id_idx" ON "_programs_v_version_checkup_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_programs_v_version_checkup_items_locales_locale_parent_id_u" ON "_programs_v_version_checkup_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_programs_v_version_terms_of_service_order_idx" ON "_programs_v_version_terms_of_service" USING btree ("_order");
  CREATE INDEX "_programs_v_version_terms_of_service_parent_id_idx" ON "_programs_v_version_terms_of_service" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_programs_v_version_terms_of_service_locales_locale_parent_i" ON "_programs_v_version_terms_of_service_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_programs_v_parent_idx" ON "_programs_v" USING btree ("parent_id");
  CREATE INDEX "_programs_v_version_version_slug_idx" ON "_programs_v" USING btree ("version_slug");
  CREATE INDEX "_programs_v_version_version_branch_idx" ON "_programs_v" USING btree ("version_branch_id");
  CREATE INDEX "_programs_v_version_version_hero_image_idx" ON "_programs_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_programs_v_version_seo_version_seo_og_image_idx" ON "_programs_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_programs_v_version_version_updated_at_idx" ON "_programs_v" USING btree ("version_updated_at");
  CREATE INDEX "_programs_v_version_version_created_at_idx" ON "_programs_v" USING btree ("version_created_at");
  CREATE INDEX "_programs_v_version_version__status_idx" ON "_programs_v" USING btree ("version__status");
  CREATE INDEX "_programs_v_created_at_idx" ON "_programs_v" USING btree ("created_at");
  CREATE INDEX "_programs_v_updated_at_idx" ON "_programs_v" USING btree ("updated_at");
  CREATE INDEX "_programs_v_snapshot_idx" ON "_programs_v" USING btree ("snapshot");
  CREATE INDEX "_programs_v_published_locale_idx" ON "_programs_v" USING btree ("published_locale");
  CREATE INDEX "_programs_v_latest_idx" ON "_programs_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_programs_v_locales_locale_parent_id_unique" ON "_programs_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "articles_insight_steps_order_idx" ON "articles_insight_steps" USING btree ("_order");
  CREATE INDEX "articles_insight_steps_parent_id_idx" ON "articles_insight_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "articles_insight_steps_locales_locale_parent_id_unique" ON "articles_insight_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "articles_tags_order_idx" ON "articles_tags" USING btree ("_order");
  CREATE INDEX "articles_tags_parent_id_idx" ON "articles_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE INDEX "articles_branch_idx" ON "articles" USING btree ("branch_id");
  CREATE INDEX "articles_cover_image_idx" ON "articles" USING btree ("cover_image_id");
  CREATE INDEX "articles_author_author_avatar_idx" ON "articles" USING btree ("author_avatar_id");
  CREATE INDEX "articles_author_author_doctor_idx" ON "articles" USING btree ("author_doctor_id");
  CREATE INDEX "articles_seo_seo_og_image_idx" ON "articles" USING btree ("seo_og_image_id");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "articles__status_idx" ON "articles" USING btree ("_status");
  CREATE UNIQUE INDEX "articles_locales_locale_parent_id_unique" ON "articles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "articles_rels_order_idx" ON "articles_rels" USING btree ("order");
  CREATE INDEX "articles_rels_parent_idx" ON "articles_rels" USING btree ("parent_id");
  CREATE INDEX "articles_rels_path_idx" ON "articles_rels" USING btree ("path");
  CREATE INDEX "articles_rels_programs_id_idx" ON "articles_rels" USING btree ("programs_id");
  CREATE INDEX "articles_rels_doctors_id_idx" ON "articles_rels" USING btree ("doctors_id");
  CREATE INDEX "_articles_v_version_insight_steps_order_idx" ON "_articles_v_version_insight_steps" USING btree ("_order");
  CREATE INDEX "_articles_v_version_insight_steps_parent_id_idx" ON "_articles_v_version_insight_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_articles_v_version_insight_steps_locales_locale_parent_id_u" ON "_articles_v_version_insight_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_articles_v_version_tags_order_idx" ON "_articles_v_version_tags" USING btree ("_order");
  CREATE INDEX "_articles_v_version_tags_parent_id_idx" ON "_articles_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_parent_idx" ON "_articles_v" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_version_slug_idx" ON "_articles_v" USING btree ("version_slug");
  CREATE INDEX "_articles_v_version_version_branch_idx" ON "_articles_v" USING btree ("version_branch_id");
  CREATE INDEX "_articles_v_version_version_cover_image_idx" ON "_articles_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_articles_v_version_author_version_author_avatar_idx" ON "_articles_v" USING btree ("version_author_avatar_id");
  CREATE INDEX "_articles_v_version_author_version_author_doctor_idx" ON "_articles_v" USING btree ("version_author_doctor_id");
  CREATE INDEX "_articles_v_version_seo_version_seo_og_image_idx" ON "_articles_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_articles_v_version_version_updated_at_idx" ON "_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_articles_v_version_version_created_at_idx" ON "_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_articles_v_version_version__status_idx" ON "_articles_v" USING btree ("version__status");
  CREATE INDEX "_articles_v_created_at_idx" ON "_articles_v" USING btree ("created_at");
  CREATE INDEX "_articles_v_updated_at_idx" ON "_articles_v" USING btree ("updated_at");
  CREATE INDEX "_articles_v_snapshot_idx" ON "_articles_v" USING btree ("snapshot");
  CREATE INDEX "_articles_v_published_locale_idx" ON "_articles_v" USING btree ("published_locale");
  CREATE INDEX "_articles_v_latest_idx" ON "_articles_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_articles_v_locales_locale_parent_id_unique" ON "_articles_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_articles_v_rels_order_idx" ON "_articles_v_rels" USING btree ("order");
  CREATE INDEX "_articles_v_rels_parent_idx" ON "_articles_v_rels" USING btree ("parent_id");
  CREATE INDEX "_articles_v_rels_path_idx" ON "_articles_v_rels" USING btree ("path");
  CREATE INDEX "_articles_v_rels_programs_id_idx" ON "_articles_v_rels" USING btree ("programs_id");
  CREATE INDEX "_articles_v_rels_doctors_id_idx" ON "_articles_v_rels" USING btree ("doctors_id");
  CREATE INDEX "awards_image_idx" ON "awards" USING btree ("image_id");
  CREATE INDEX "awards_updated_at_idx" ON "awards" USING btree ("updated_at");
  CREATE INDEX "awards_created_at_idx" ON "awards" USING btree ("created_at");
  CREATE UNIQUE INDEX "awards_locales_locale_parent_id_unique" ON "awards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_branches_id_idx" ON "payload_locked_documents_rels" USING btree ("branches_id");
  CREATE INDEX "payload_locked_documents_rels_doctors_id_idx" ON "payload_locked_documents_rels" USING btree ("doctors_id");
  CREATE INDEX "payload_locked_documents_rels_programs_id_idx" ON "payload_locked_documents_rels" USING btree ("programs_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_awards_id_idx" ON "payload_locked_documents_rels" USING btree ("awards_id");
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "membership_privileges_order_idx" ON "membership_privileges" USING btree ("_order");
  CREATE INDEX "membership_privileges_parent_id_idx" ON "membership_privileges" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "membership_privileges_locales_locale_parent_id_unique" ON "membership_privileges_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "membership_journey_steps_order_idx" ON "membership_journey_steps" USING btree ("_order");
  CREATE INDEX "membership_journey_steps_parent_id_idx" ON "membership_journey_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "membership_journey_steps_locales_locale_parent_id_unique" ON "membership_journey_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "membership_faq_order_idx" ON "membership_faq" USING btree ("_order");
  CREATE INDEX "membership_faq_parent_id_idx" ON "membership_faq" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "membership_faq_locales_locale_parent_id_unique" ON "membership_faq_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "membership_hero_hero_hero_image_idx" ON "membership" USING btree ("hero_hero_image_id");
  CREATE INDEX "membership_promise_promise_image_idx" ON "membership" USING btree ("promise_image_id");
  CREATE UNIQUE INDEX "membership_locales_locale_parent_id_unique" ON "membership_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ecosystem_disciplines_chips_order_idx" ON "ecosystem_disciplines_chips" USING btree ("_order");
  CREATE INDEX "ecosystem_disciplines_chips_parent_id_idx" ON "ecosystem_disciplines_chips" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "ecosystem_disciplines_chips_locales_locale_parent_id_unique" ON "ecosystem_disciplines_chips_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "ecosystem_disciplines_order_idx" ON "ecosystem_disciplines" USING btree ("_order");
  CREATE INDEX "ecosystem_disciplines_parent_id_idx" ON "ecosystem_disciplines" USING btree ("_parent_id");
  CREATE INDEX "ecosystem_disciplines_image_idx" ON "ecosystem_disciplines" USING btree ("image_id");
  CREATE UNIQUE INDEX "ecosystem_disciplines_locales_locale_parent_id_unique" ON "ecosystem_disciplines_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "ecosystem_locales_locale_parent_id_unique" ON "ecosystem_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_hero_background_images_order_idx" ON "home_hero_background_images" USING btree ("_order");
  CREATE INDEX "home_hero_background_images_parent_id_idx" ON "home_hero_background_images" USING btree ("_parent_id");
  CREATE INDEX "home_hero_background_images_image_idx" ON "home_hero_background_images" USING btree ("image_id");
  CREATE UNIQUE INDEX "home_hero_locales_locale_parent_id_unique" ON "home_hero_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "users_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "branches_gallery" CASCADE;
  DROP TABLE "branches_gallery_locales" CASCADE;
  DROP TABLE "branches_facilities" CASCADE;
  DROP TABLE "branches_facilities_locales" CASCADE;
  DROP TABLE "branches" CASCADE;
  DROP TABLE "branches_locales" CASCADE;
  DROP TABLE "branches_rels" CASCADE;
  DROP TABLE "doctors_tags" CASCADE;
  DROP TABLE "doctors_tags_locales" CASCADE;
  DROP TABLE "doctors_credential_groups_items" CASCADE;
  DROP TABLE "doctors_credential_groups_items_locales" CASCADE;
  DROP TABLE "doctors_credential_groups" CASCADE;
  DROP TABLE "doctors_credential_groups_locales" CASCADE;
  DROP TABLE "doctors_schedule" CASCADE;
  DROP TABLE "doctors_schedule_locales" CASCADE;
  DROP TABLE "doctors" CASCADE;
  DROP TABLE "doctors_locales" CASCADE;
  DROP TABLE "_doctors_v_version_tags" CASCADE;
  DROP TABLE "_doctors_v_version_tags_locales" CASCADE;
  DROP TABLE "_doctors_v_version_credential_groups_items" CASCADE;
  DROP TABLE "_doctors_v_version_credential_groups_items_locales" CASCADE;
  DROP TABLE "_doctors_v_version_credential_groups" CASCADE;
  DROP TABLE "_doctors_v_version_credential_groups_locales" CASCADE;
  DROP TABLE "_doctors_v_version_schedule" CASCADE;
  DROP TABLE "_doctors_v_version_schedule_locales" CASCADE;
  DROP TABLE "_doctors_v" CASCADE;
  DROP TABLE "_doctors_v_locales" CASCADE;
  DROP TABLE "programs_highlights" CASCADE;
  DROP TABLE "programs_highlights_locales" CASCADE;
  DROP TABLE "programs_purpose_list" CASCADE;
  DROP TABLE "programs_purpose_list_locales" CASCADE;
  DROP TABLE "programs_audience_list" CASCADE;
  DROP TABLE "programs_audience_list_locales" CASCADE;
  DROP TABLE "programs_checkup_items" CASCADE;
  DROP TABLE "programs_checkup_items_locales" CASCADE;
  DROP TABLE "programs_terms_of_service" CASCADE;
  DROP TABLE "programs_terms_of_service_locales" CASCADE;
  DROP TABLE "programs" CASCADE;
  DROP TABLE "programs_locales" CASCADE;
  DROP TABLE "_programs_v_version_highlights" CASCADE;
  DROP TABLE "_programs_v_version_highlights_locales" CASCADE;
  DROP TABLE "_programs_v_version_purpose_list" CASCADE;
  DROP TABLE "_programs_v_version_purpose_list_locales" CASCADE;
  DROP TABLE "_programs_v_version_audience_list" CASCADE;
  DROP TABLE "_programs_v_version_audience_list_locales" CASCADE;
  DROP TABLE "_programs_v_version_checkup_items" CASCADE;
  DROP TABLE "_programs_v_version_checkup_items_locales" CASCADE;
  DROP TABLE "_programs_v_version_terms_of_service" CASCADE;
  DROP TABLE "_programs_v_version_terms_of_service_locales" CASCADE;
  DROP TABLE "_programs_v" CASCADE;
  DROP TABLE "_programs_v_locales" CASCADE;
  DROP TABLE "articles_insight_steps" CASCADE;
  DROP TABLE "articles_insight_steps_locales" CASCADE;
  DROP TABLE "articles_tags" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "articles_locales" CASCADE;
  DROP TABLE "articles_rels" CASCADE;
  DROP TABLE "_articles_v_version_insight_steps" CASCADE;
  DROP TABLE "_articles_v_version_insight_steps_locales" CASCADE;
  DROP TABLE "_articles_v_version_tags" CASCADE;
  DROP TABLE "_articles_v" CASCADE;
  DROP TABLE "_articles_v_locales" CASCADE;
  DROP TABLE "_articles_v_rels" CASCADE;
  DROP TABLE "awards" CASCADE;
  DROP TABLE "awards_locales" CASCADE;
  DROP TABLE "leads" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "membership_privileges" CASCADE;
  DROP TABLE "membership_privileges_locales" CASCADE;
  DROP TABLE "membership_journey_steps" CASCADE;
  DROP TABLE "membership_journey_steps_locales" CASCADE;
  DROP TABLE "membership_faq" CASCADE;
  DROP TABLE "membership_faq_locales" CASCADE;
  DROP TABLE "membership" CASCADE;
  DROP TABLE "membership_locales" CASCADE;
  DROP TABLE "ecosystem_disciplines_chips" CASCADE;
  DROP TABLE "ecosystem_disciplines_chips_locales" CASCADE;
  DROP TABLE "ecosystem_disciplines" CASCADE;
  DROP TABLE "ecosystem_disciplines_locales" CASCADE;
  DROP TABLE "ecosystem" CASCADE;
  DROP TABLE "ecosystem_locales" CASCADE;
  DROP TABLE "home_hero_background_images" CASCADE;
  DROP TABLE "home_hero" CASCADE;
  DROP TABLE "home_hero_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_doctors_schedule_day";
  DROP TYPE "public"."enum_doctors_specialty";
  DROP TYPE "public"."enum_doctors_status";
  DROP TYPE "public"."enum__doctors_v_version_schedule_day";
  DROP TYPE "public"."enum__doctors_v_version_specialty";
  DROP TYPE "public"."enum__doctors_v_version_status";
  DROP TYPE "public"."enum__doctors_v_published_locale";
  DROP TYPE "public"."enum_programs_checkup_items_group";
  DROP TYPE "public"."enum_programs_category";
  DROP TYPE "public"."enum_programs_status";
  DROP TYPE "public"."enum__programs_v_version_checkup_items_group";
  DROP TYPE "public"."enum__programs_v_version_category";
  DROP TYPE "public"."enum__programs_v_version_status";
  DROP TYPE "public"."enum__programs_v_published_locale";
  DROP TYPE "public"."enum_articles_category";
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum__articles_v_version_category";
  DROP TYPE "public"."enum__articles_v_version_status";
  DROP TYPE "public"."enum__articles_v_published_locale";
  DROP TYPE "public"."enum_leads_service";
  DROP TYPE "public"."enum_leads_status";`)
}
