import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "programs_price_variants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"price" numeric
  );
  
  CREATE TABLE "programs_price_variants_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_programs_v_version_price_variants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"price" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_programs_v_version_price_variants_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "programs_price_variants" ADD CONSTRAINT "programs_price_variants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programs_price_variants_locales" ADD CONSTRAINT "programs_price_variants_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programs_price_variants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_version_price_variants" ADD CONSTRAINT "_programs_v_version_price_variants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_programs_v_version_price_variants_locales" ADD CONSTRAINT "_programs_v_version_price_variants_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_programs_v_version_price_variants"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "programs_price_variants_order_idx" ON "programs_price_variants" USING btree ("_order");
  CREATE INDEX "programs_price_variants_parent_id_idx" ON "programs_price_variants" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "programs_price_variants_locales_locale_parent_id_unique" ON "programs_price_variants_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_programs_v_version_price_variants_order_idx" ON "_programs_v_version_price_variants" USING btree ("_order");
  CREATE INDEX "_programs_v_version_price_variants_parent_id_idx" ON "_programs_v_version_price_variants" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_programs_v_version_price_variants_locales_locale_parent_id_" ON "_programs_v_version_price_variants_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "programs_price_variants" CASCADE;
  DROP TABLE "programs_price_variants_locales" CASCADE;
  DROP TABLE "_programs_v_version_price_variants" CASCADE;
  DROP TABLE "_programs_v_version_price_variants_locales" CASCADE;`)
}
