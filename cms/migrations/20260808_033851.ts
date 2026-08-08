import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "topbar" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "topbar_locales" (
  	"tagline" varchar,
  	"hotline_text" varchar,
  	"line_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "topbar_locales" ADD CONSTRAINT "topbar_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."topbar"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "topbar_locales_locale_parent_id_unique" ON "topbar_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "topbar" CASCADE;
  DROP TABLE "topbar_locales" CASCADE;`)
}
