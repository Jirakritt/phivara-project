import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "programs_price_variants_locales" ADD COLUMN "description" varchar;
  ALTER TABLE "_programs_v_version_price_variants_locales" ADD COLUMN "description" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "programs_price_variants_locales" DROP COLUMN "description";
  ALTER TABLE "_programs_v_version_price_variants_locales" DROP COLUMN "description";`)
}
