import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "popups" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"image_id" integer NOT NULL,
  	"start_at" timestamp(3) with time zone NOT NULL,
  	"end_at" timestamp(3) with time zone NOT NULL,
  	"reshow_interval_minutes" numeric DEFAULT 15 NOT NULL,
  	"link_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "popups_locales" (
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "popups_id" integer;
  ALTER TABLE "popups" ADD CONSTRAINT "popups_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "popups_locales" ADD CONSTRAINT "popups_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."popups"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "popups_image_idx" ON "popups" USING btree ("image_id");
  CREATE INDEX "popups_updated_at_idx" ON "popups" USING btree ("updated_at");
  CREATE INDEX "popups_created_at_idx" ON "popups" USING btree ("created_at");
  CREATE UNIQUE INDEX "popups_locales_locale_parent_id_unique" ON "popups_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_popups_fk" FOREIGN KEY ("popups_id") REFERENCES "public"."popups"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_popups_id_idx" ON "payload_locked_documents_rels" USING btree ("popups_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "popups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "popups_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "popups" CASCADE;
  DROP TABLE "popups_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_popups_fk";
  
  DROP INDEX "payload_locked_documents_rels_popups_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "popups_id";`)
}
