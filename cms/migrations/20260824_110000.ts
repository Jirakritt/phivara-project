import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Converts membership tiers from a fixed 3-value enum to a fully
// staff-managed collection (cms/collections/MembershipTiers.ts) — an admin
// can now add/remove/reorder tiers and set each one's card gradient colors
// from the CMS, none of which was possible when "silver/gold/diamond" was
// baked into a Postgres enum type + hardcoded JS constants
// (src/components/member/ProfileDashboard.tsx used to have
// TIER_LABEL/TIER_ORDER/TIER_DISCOUNT — all gone now, replaced by real
// data).
//
// This migration only handles Members.membershipTier (enum column ->
// relationship). MemberPrivileges.cards.tiers (select-hasMany ->
// relationship-hasMany) is deliberately NOT handled here — that field lives
// on an array nested inside a Global, and Payload's Postgres adapter
// bubbles nested relationship fields up into a single shared `_rels` table
// on the ROOT table (e.g. `member_privileges_rels`, not a per-array-table
// join table the way a `select, hasMany` field gets) using a `path`-based
// scheme this file can't reliably hand-author without a live database to
// verify against (this sandbox has no network path to the developer's
// local Postgres — confirmed empirically: a first attempt at hand-writing
// that table guessed the wrong shape entirely and had to be reverted).
// Payload's own dev-mode schema auto-push already creates that table
// correctly (verified live), and `npm run seed:member-privileges` re-seeds
// its data through the Local API either way, so nothing is lost by leaving
// it out of this migration. Before deploying to a database that never gets
// dev-mode auto-push (staging/production), run `payload migrate:create` on
// a machine with real DB access to generate the correct follow-up migration
// for that piece.
//
// Written by hand rather than via `payload migrate:create` for the same
// reason as every other hand-written migration in this file — no DB access
// from this sandbox. Uses `IF NOT EXISTS`/`WHERE NOT EXISTS` guards
// throughout so it's safe to re-run and safe to run after dev-mode
// auto-push has already created some of this.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "membership_tiers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"order" integer DEFAULT 0 NOT NULL,
  	"gradient_start" varchar NOT NULL,
  	"gradient_mid" varchar NOT NULL,
  	"gradient_end" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "membership_tiers_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "public"."_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );

  DO $$ BEGIN
    ALTER TABLE "membership_tiers_locales" ADD CONSTRAINT "membership_tiers_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."membership_tiers"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  CREATE UNIQUE INDEX IF NOT EXISTS "membership_tiers_slug_idx" ON "membership_tiers" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "membership_tiers_updated_at_idx" ON "membership_tiers" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "membership_tiers_created_at_idx" ON "membership_tiers" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "membership_tiers_locales_locale_parent_id_unique" ON "membership_tiers_locales" USING btree ("_locale","_parent_id");

  -- Seed the 3 tiers that used to be the fixed enum values, only for
  -- whichever slugs aren't already present (dev-mode auto-push or a prior
  -- partial run of this migration may have created the table already).
  INSERT INTO "membership_tiers" ("slug", "order", "gradient_start", "gradient_mid", "gradient_end")
    SELECT * FROM (VALUES
      ('silver', 1, '#26282B', '#C7C9C6', '#26282B'),
      ('gold', 2, '#2C2313', '#C7A76B', '#2C2313'),
      ('diamond', 3, '#152233', '#8FB0CC', '#152233')
    ) AS seed(slug, "order", gradient_start, gradient_mid, gradient_end)
    WHERE NOT EXISTS (SELECT 1 FROM "membership_tiers" WHERE "membership_tiers"."slug" = seed.slug);

  INSERT INTO "membership_tiers_locales" ("label", "_locale", "_parent_id")
    SELECT v.label, v.locale::"public"."_locales", mt.id FROM "membership_tiers" mt
    JOIN (VALUES
      ('silver', 'th', 'Silver'), ('silver', 'en', 'Silver'),
      ('gold', 'th', 'Gold'), ('gold', 'en', 'Gold'),
      ('diamond', 'th', 'Diamond'), ('diamond', 'en', 'Diamond')
    ) AS v(slug, locale, label) ON v.slug = mt.slug
    WHERE NOT EXISTS (
      SELECT 1 FROM "membership_tiers_locales" existing
      WHERE existing."_parent_id" = mt.id AND existing."_locale" = v.locale::"public"."_locales"
    );

  -- Members.membershipTier: add the new relationship column, backfill from
  -- the old enum by matching slug (only if that old column still exists —
  -- dev-mode auto-push may have already dropped it), then drop the old
  -- enum column + type.
  ALTER TABLE "members" ADD COLUMN IF NOT EXISTS "membership_tier_id" integer;

  DO $$ BEGIN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'members' AND column_name = 'membership_tier'
    ) THEN
      UPDATE "members" m SET "membership_tier_id" = mt.id
        FROM "membership_tiers" mt
        WHERE m."membership_tier_id" IS NULL
          AND m."membership_tier" IS NOT NULL
          AND m."membership_tier"::text <> 'none'
          AND mt.slug = m."membership_tier"::text;
      ALTER TABLE "members" DROP COLUMN "membership_tier";
    END IF;
  END $$;
  DROP TYPE IF EXISTS "public"."enum_members_membership_tier";

  DO $$ BEGIN
    ALTER TABLE "members" ADD CONSTRAINT "members_membership_tier_id_membership_tiers_id_fk" FOREIGN KEY ("membership_tier_id") REFERENCES "public"."membership_tiers"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  CREATE INDEX IF NOT EXISTS "members_membership_tier_idx" ON "members" USING btree ("membership_tier_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN
    CREATE TYPE "public"."enum_members_membership_tier" AS ENUM('none', 'silver', 'gold', 'diamond');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  ALTER TABLE "members" ADD COLUMN IF NOT EXISTS "membership_tier" "public"."enum_members_membership_tier" DEFAULT 'none' NOT NULL;
  UPDATE "members" m SET "membership_tier" = mt.slug::"public"."enum_members_membership_tier"
    FROM "membership_tiers" mt WHERE m."membership_tier_id" = mt.id;
  ALTER TABLE "members" DROP CONSTRAINT IF EXISTS "members_membership_tier_id_membership_tiers_id_fk";
  DROP INDEX IF EXISTS "members_membership_tier_idx";
  ALTER TABLE "members" DROP COLUMN IF EXISTS "membership_tier_id";

  DROP TABLE IF EXISTS "membership_tiers_locales" CASCADE;
  DROP TABLE IF EXISTS "membership_tiers" CASCADE;
  `)
}
