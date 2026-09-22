import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_doctors_schedule_by_branch_rows_day" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  CREATE TYPE "public"."enum__doctors_v_version_schedule_by_branch_rows_day" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
  CREATE TABLE "doctors_schedule_by_branch_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" "enum_doctors_schedule_by_branch_rows_day",
  	"hours" varchar
  );
  
  CREATE TABLE "doctors_schedule_by_branch_rows_locales" (
  	"location_name" varchar,
  	"location_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "doctors_schedule_by_branch" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"branch_id" integer
  );
  
  CREATE TABLE "doctors_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"branches_id" integer
  );
  
  CREATE TABLE "_doctors_v_version_schedule_by_branch_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"day" "enum__doctors_v_version_schedule_by_branch_rows_day",
  	"hours" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_doctors_v_version_schedule_by_branch_rows_locales" (
  	"location_name" varchar,
  	"location_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_doctors_v_version_schedule_by_branch" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"branch_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_doctors_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"branches_id" integer
  );
  
  ALTER TABLE "doctors" ADD COLUMN "main_branch_id" integer;
  ALTER TABLE "_doctors_v" ADD COLUMN "version_main_branch_id" integer;
  ALTER TABLE "doctors_schedule_by_branch_rows" ADD CONSTRAINT "doctors_schedule_by_branch_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."doctors_schedule_by_branch"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors_schedule_by_branch_rows_locales" ADD CONSTRAINT "doctors_schedule_by_branch_rows_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."doctors_schedule_by_branch_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors_schedule_by_branch" ADD CONSTRAINT "doctors_schedule_by_branch_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "doctors_schedule_by_branch" ADD CONSTRAINT "doctors_schedule_by_branch_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors_rels" ADD CONSTRAINT "doctors_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "doctors_rels" ADD CONSTRAINT "doctors_rels_branches_fk" FOREIGN KEY ("branches_id") REFERENCES "public"."branches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_doctors_v_version_schedule_by_branch_rows" ADD CONSTRAINT "_doctors_v_version_schedule_by_branch_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_doctors_v_version_schedule_by_branch"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_doctors_v_version_schedule_by_branch_rows_locales" ADD CONSTRAINT "_doctors_v_version_schedule_by_branch_rows_locales_parent_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_doctors_v_version_schedule_by_branch_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_doctors_v_version_schedule_by_branch" ADD CONSTRAINT "_doctors_v_version_schedule_by_branch_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_doctors_v_version_schedule_by_branch" ADD CONSTRAINT "_doctors_v_version_schedule_by_branch_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_doctors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_doctors_v_rels" ADD CONSTRAINT "_doctors_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_doctors_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_doctors_v_rels" ADD CONSTRAINT "_doctors_v_rels_branches_fk" FOREIGN KEY ("branches_id") REFERENCES "public"."branches"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "doctors_schedule_by_branch_rows_order_idx" ON "doctors_schedule_by_branch_rows" USING btree ("_order");
  CREATE INDEX "doctors_schedule_by_branch_rows_parent_id_idx" ON "doctors_schedule_by_branch_rows" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "doctors_schedule_by_branch_rows_locales_locale_parent_id_uni" ON "doctors_schedule_by_branch_rows_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "doctors_schedule_by_branch_order_idx" ON "doctors_schedule_by_branch" USING btree ("_order");
  CREATE INDEX "doctors_schedule_by_branch_parent_id_idx" ON "doctors_schedule_by_branch" USING btree ("_parent_id");
  CREATE INDEX "doctors_schedule_by_branch_branch_idx" ON "doctors_schedule_by_branch" USING btree ("branch_id");
  CREATE INDEX "doctors_rels_order_idx" ON "doctors_rels" USING btree ("order");
  CREATE INDEX "doctors_rels_parent_idx" ON "doctors_rels" USING btree ("parent_id");
  CREATE INDEX "doctors_rels_path_idx" ON "doctors_rels" USING btree ("path");
  CREATE INDEX "doctors_rels_branches_id_idx" ON "doctors_rels" USING btree ("branches_id");
  CREATE INDEX "_doctors_v_version_schedule_by_branch_rows_order_idx" ON "_doctors_v_version_schedule_by_branch_rows" USING btree ("_order");
  CREATE INDEX "_doctors_v_version_schedule_by_branch_rows_parent_id_idx" ON "_doctors_v_version_schedule_by_branch_rows" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_doctors_v_version_schedule_by_branch_rows_locales_locale_pa" ON "_doctors_v_version_schedule_by_branch_rows_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_doctors_v_version_schedule_by_branch_order_idx" ON "_doctors_v_version_schedule_by_branch" USING btree ("_order");
  CREATE INDEX "_doctors_v_version_schedule_by_branch_parent_id_idx" ON "_doctors_v_version_schedule_by_branch" USING btree ("_parent_id");
  CREATE INDEX "_doctors_v_version_schedule_by_branch_branch_idx" ON "_doctors_v_version_schedule_by_branch" USING btree ("branch_id");
  CREATE INDEX "_doctors_v_rels_order_idx" ON "_doctors_v_rels" USING btree ("order");
  CREATE INDEX "_doctors_v_rels_parent_idx" ON "_doctors_v_rels" USING btree ("parent_id");
  CREATE INDEX "_doctors_v_rels_path_idx" ON "_doctors_v_rels" USING btree ("path");
  CREATE INDEX "_doctors_v_rels_branches_id_idx" ON "_doctors_v_rels" USING btree ("branches_id");
  ALTER TABLE "doctors" ADD CONSTRAINT "doctors_main_branch_id_branches_id_fk" FOREIGN KEY ("main_branch_id") REFERENCES "public"."branches"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_doctors_v" ADD CONSTRAINT "_doctors_v_version_main_branch_id_branches_id_fk" FOREIGN KEY ("version_main_branch_id") REFERENCES "public"."branches"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "doctors_main_branch_idx" ON "doctors" USING btree ("main_branch_id");
  CREATE INDEX "_doctors_v_version_version_main_branch_idx" ON "_doctors_v" USING btree ("version_main_branch_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "doctors_schedule_by_branch_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "doctors_schedule_by_branch_rows_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "doctors_schedule_by_branch" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "doctors_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_doctors_v_version_schedule_by_branch_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_doctors_v_version_schedule_by_branch_rows_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_doctors_v_version_schedule_by_branch" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_doctors_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "doctors_schedule_by_branch_rows" CASCADE;
  DROP TABLE "doctors_schedule_by_branch_rows_locales" CASCADE;
  DROP TABLE "doctors_schedule_by_branch" CASCADE;
  DROP TABLE "doctors_rels" CASCADE;
  DROP TABLE "_doctors_v_version_schedule_by_branch_rows" CASCADE;
  DROP TABLE "_doctors_v_version_schedule_by_branch_rows_locales" CASCADE;
  DROP TABLE "_doctors_v_version_schedule_by_branch" CASCADE;
  DROP TABLE "_doctors_v_rels" CASCADE;
  ALTER TABLE "doctors" DROP CONSTRAINT "doctors_main_branch_id_branches_id_fk";
  
  ALTER TABLE "_doctors_v" DROP CONSTRAINT "_doctors_v_version_main_branch_id_branches_id_fk";
  
  DROP INDEX "doctors_main_branch_idx";
  DROP INDEX "_doctors_v_version_version_main_branch_idx";
  ALTER TABLE "doctors" DROP COLUMN "main_branch_id";
  ALTER TABLE "_doctors_v" DROP COLUMN "version_main_branch_id";
  DROP TYPE "public"."enum_doctors_schedule_by_branch_rows_day";
  DROP TYPE "public"."enum__doctors_v_version_schedule_by_branch_rows_day";`)
}
