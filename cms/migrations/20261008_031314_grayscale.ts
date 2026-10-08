import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_grayscale_mode_level" AS ENUM('0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100');
  CREATE TABLE "grayscale_mode" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT false,
  	"level" "enum_grayscale_mode_level" DEFAULT '100' NOT NULL,
  	"start_at" timestamp(3) with time zone,
  	"end_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "grayscale_mode" CASCADE;
  DROP TYPE "public"."enum_grayscale_mode_level";`)
}
