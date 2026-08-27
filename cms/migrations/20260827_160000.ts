import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds the 3 new "แพทย์หลักประจำสาขา" fields on Doctors (see the tab comment
// on Doctors.ts): isBranchFeatured (checkbox), quote (localized text,
// lives in doctors_locales), featuredHighlights (array, localized text
// per row — mirrors the existing `tags` array's table shape). Doctors has
// versions/drafts enabled, so every column/table is mirrored on the
// _doctors_v* draft-preview tables, following the exact pattern the
// original 20260807_034304 migration used for `tags`.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "doctors" ADD COLUMN IF NOT EXISTS "is_branch_featured" boolean DEFAULT false;
    ALTER TABLE "doctors_locales" ADD COLUMN IF NOT EXISTS "quote" varchar;

    CREATE TABLE IF NOT EXISTS "doctors_featured_highlights" (
    	"_order" integer NOT NULL,
    	"_parent_id" integer NOT NULL,
    	"id" varchar PRIMARY KEY NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "doctors_featured_highlights_locales" (
    	"text" varchar,
    	"id" serial PRIMARY KEY NOT NULL,
    	"_locale" "_locales" NOT NULL,
    	"_parent_id" varchar NOT NULL
    );

    DO $$ BEGIN
     ALTER TABLE "doctors_featured_highlights" ADD CONSTRAINT "doctors_featured_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
     WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
     ALTER TABLE "doctors_featured_highlights_locales" ADD CONSTRAINT "doctors_featured_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."doctors_featured_highlights"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
     WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "doctors_featured_highlights_order_idx" ON "doctors_featured_highlights" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "doctors_featured_highlights_parent_id_idx" ON "doctors_featured_highlights" USING btree ("_parent_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "doctors_featured_highlights_locales_locale_parent_id_unique" ON "doctors_featured_highlights_locales" USING btree ("_locale","_parent_id");

    ALTER TABLE "_doctors_v" ADD COLUMN IF NOT EXISTS "version_is_branch_featured" boolean DEFAULT false;
    ALTER TABLE "_doctors_v_locales" ADD COLUMN IF NOT EXISTS "version_quote" varchar;

    CREATE TABLE IF NOT EXISTS "_doctors_v_version_featured_highlights" (
    	"_order" integer NOT NULL,
    	"_parent_id" integer NOT NULL,
    	"id" serial PRIMARY KEY NOT NULL,
    	"_uuid" varchar
    );

    CREATE TABLE IF NOT EXISTS "_doctors_v_version_featured_highlights_locales" (
    	"text" varchar,
    	"id" serial PRIMARY KEY NOT NULL,
    	"_locale" "_locales" NOT NULL,
    	"_parent_id" integer NOT NULL
    );

    DO $$ BEGIN
     ALTER TABLE "_doctors_v_version_featured_highlights" ADD CONSTRAINT "_doctors_v_version_featured_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_doctors_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
     WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
     ALTER TABLE "_doctors_v_version_featured_highlights_locales" ADD CONSTRAINT "_doctors_v_version_featured_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_doctors_v_version_featured_highlights"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
     WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "_doctors_v_version_featured_highlights_order_idx" ON "_doctors_v_version_featured_highlights" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "_doctors_v_version_featured_highlights_parent_id_idx" ON "_doctors_v_version_featured_highlights" USING btree ("_parent_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "_doctors_v_version_featured_highlights_locales_locale_parent_id_unique" ON "_doctors_v_version_featured_highlights_locales" USING btree ("_locale","_parent_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "_doctors_v_version_featured_highlights_locales" CASCADE;
    DROP TABLE IF EXISTS "_doctors_v_version_featured_highlights" CASCADE;
    ALTER TABLE "_doctors_v_locales" DROP COLUMN IF EXISTS "version_quote";
    ALTER TABLE "_doctors_v" DROP COLUMN IF EXISTS "version_is_branch_featured";

    DROP TABLE IF EXISTS "doctors_featured_highlights_locales" CASCADE;
    DROP TABLE IF EXISTS "doctors_featured_highlights" CASCADE;
    ALTER TABLE "doctors_locales" DROP COLUMN IF EXISTS "quote";
    ALTER TABLE "doctors" DROP COLUMN IF EXISTS "is_branch_featured";
  `)
}
