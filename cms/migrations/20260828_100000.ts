import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Changes `ecosystem.hero.lead` (cms/globals/Ecosystem.ts) from a plain
// `textarea` to `richText` — a plain textarea has no way to carry a bulleted
// list through to the frontend (HTML collapses newlines in a `<p>` by
// default), so staff typing a lead paragraph + a bullet list of the 4
// disciplines all rendered as one run-on paragraph (reported 2026-08-27).
// src/lib/ecosystemData.ts / the ecosystem page now walk this with
// parseRichTextBlocks() (src/lib/richText.ts) instead, same as
// privacyPolicyData.ts already does for its `body` richText field.
//
// `hero_lead` moves from `varchar` (plain string) to `jsonb` (Lexical
// document) — these aren't compatible types to cast between, and the field
// is intentionally not backfilled: the 4-discipline list was only ever
// stored as unstructured plain text (line breaks, no markup), so there is
// no reliable way to tell which lines should become a bullet item vs. a
// plain paragraph automatically. Content editors will re-enter this one
// field's copy directly in the new richText editor after this migration
// runs (single Global, not a per-row collection, so this is a one-time
// re-type, not a bulk data-loss concern).
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "ecosystem_locales" DROP COLUMN IF EXISTS "hero_lead";
    ALTER TABLE "ecosystem_locales" ADD COLUMN "hero_lead" jsonb;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "ecosystem_locales" DROP COLUMN IF EXISTS "hero_lead";
    ALTER TABLE "ecosystem_locales" ADD COLUMN "hero_lead" varchar;
  `)
}
