import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Creates the `member-privileges` Global (cms/globals/MemberPrivileges.ts)
// — the per-tier "สิทธิพิเศษ" card list shown on a logged-in member's own
// profile page, editable from the CMS instead of being hardcoded JSX (see
// src/components/member/ProfileDashboard.tsx). Table shapes below mirror
// Payload's own drizzle-kit output exactly (array rows get a varchar id,
// locale rows get a serial id + unique (_locale, _parent_id), a `hasMany`
// select field like `tiers` gets its own order/parent_id/value join table)
// — verified against @payloadcms/drizzle's schema/traverseFields.js and the
// structurally identical `membership_privileges`/`membership_privileges_locales`
// tables already in this database (cms/globals/Membership.ts's own
// `privileges` array).
//
// Written by hand rather than via `payload migrate:create` — same reason as
// 20260817_082017.ts and 20260824_101500.ts: this sandbox has no network
// path to the dev Postgres instance, which only exists on the developer's
// machine. Uses `IF NOT EXISTS` guards throughout since Payload's dev-mode
// schema auto-push may have already created some/all of this on that
// machine before this migration ever runs there.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN
    CREATE TYPE "public"."enum_member_privileges_cards_icon" AS ENUM('discount', 'priority', 'doctor', 'gift', 'star', 'heart', 'diamond', 'badge');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_member_privileges_cards_tiers" AS ENUM('silver', 'gold', 'diamond');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;

  CREATE TABLE IF NOT EXISTS "member_privileges" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE IF NOT EXISTS "member_privileges_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "public"."enum_member_privileges_cards_icon" DEFAULT 'star' NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "member_privileges_cards_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "public"."_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "member_privileges_cards_tiers" (
  	"order" integer NOT NULL,
  	"parent_id" varchar NOT NULL,
  	"value" "public"."enum_member_privileges_cards_tiers" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL
  );

  ALTER TABLE "member_privileges_cards" ADD CONSTRAINT "member_privileges_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."member_privileges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "member_privileges_cards_locales" ADD CONSTRAINT "member_privileges_cards_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."member_privileges_cards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "member_privileges_cards_tiers" ADD CONSTRAINT "member_privileges_cards_tiers_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."member_privileges_cards"("id") ON DELETE cascade ON UPDATE no action;

  CREATE INDEX IF NOT EXISTS "member_privileges_cards_order_idx" ON "member_privileges_cards" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "member_privileges_cards_parent_id_idx" ON "member_privileges_cards" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "member_privileges_cards_locales_locale_parent_id_unique" ON "member_privileges_cards_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "member_privileges_cards_tiers_order_idx" ON "member_privileges_cards_tiers" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "member_privileges_cards_tiers_parent_idx" ON "member_privileges_cards_tiers" USING btree ("parent_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE IF EXISTS "member_privileges_cards_tiers" CASCADE;
  DROP TABLE IF EXISTS "member_privileges_cards_locales" CASCADE;
  DROP TABLE IF EXISTS "member_privileges_cards" CASCADE;
  DROP TABLE IF EXISTS "member_privileges" CASCADE;
  DROP TYPE IF EXISTS "public"."enum_member_privileges_cards_icon";
  DROP TYPE IF EXISTS "public"."enum_member_privileges_cards_tiers";
  `)
}
