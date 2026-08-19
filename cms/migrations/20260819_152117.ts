import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "branches" DROP COLUMN "name_th";
  ALTER TABLE "branches" DROP COLUMN "name_en";
  ALTER TABLE "doctors" DROP COLUMN "name_th";
  ALTER TABLE "doctors" DROP COLUMN "name_en";
  ALTER TABLE "_doctors_v" DROP COLUMN "version_name_th";
  ALTER TABLE "_doctors_v" DROP COLUMN "version_name_en";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "branches" ADD COLUMN "name_th" varchar NOT NULL;
  ALTER TABLE "branches" ADD COLUMN "name_en" varchar NOT NULL;
  ALTER TABLE "doctors" ADD COLUMN "name_th" varchar;
  ALTER TABLE "doctors" ADD COLUMN "name_en" varchar;
  ALTER TABLE "_doctors_v" ADD COLUMN "version_name_th" varchar;
  ALTER TABLE "_doctors_v" ADD COLUMN "version_name_en" varchar;`)
}
