import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds the `honeypot` spam-trap column to `leads` — see the field comment
// on Leads.ts. Nullable text, no backfill needed (existing rows never had
// this field, and an empty/null value is exactly what a legitimate
// submission should have).
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "honeypot" varchar;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "leads" DROP COLUMN IF EXISTS "honeypot";
  `)
}
