import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds a real, stored `member_number` column to `members` (cms/collections/
// Members.ts) — this used to be a `type: 'ui'` virtual field computed from
// `id` on the fly (see cms/admin/components/MemberNumber.tsx's git history),
// which meant staff could never search the CMS by a customer's "PHV 0002
// 0074"-style member number. Making it a real column is what makes
// `listSearchableFields: [..., 'memberNumber']` (Members.ts) work.
//
// Written by hand rather than via `payload migrate:create` — same situation
// as 20260817_082017.ts: this sandbox has no network path to the dev
// Postgres instance (it only exists on the developer's machine), so
// drizzle-kit's live-DB diff can't run here. The backfill UPDATE below uses
// the exact same "PHV {id padded to 4} {(id*37) % 10000 padded to 4}"
// formula as cms/lib/memberNumber.ts (shared with the new afterChange hook
// on Members that populates this column for every *new* member going
// forward) so pre-existing member rows get a matching value too.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "members" ADD COLUMN IF NOT EXISTS "member_number" varchar;
  UPDATE "members" SET "member_number" = 'PHV ' || lpad(id::text, 4, '0') || ' ' || lpad(((id * 37) % 10000)::text, 4, '0') WHERE "member_number" IS NULL;
  CREATE UNIQUE INDEX IF NOT EXISTS "members_member_number_idx" ON "members" USING btree ("member_number");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "members_member_number_idx";
  ALTER TABLE "members" DROP COLUMN IF EXISTS "member_number";
  `)
}
