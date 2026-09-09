import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds the schema for the "branch inquiry notification email" feature:
// - Branches.notificationRecipients (array: name/email/active — none
//   localized, so only one child table, no "_locales" companion) — see
//   Branches.ts's "แจ้งเตือนอีเมล (Inquiry)" tab.
// - Leads.notificationStatus/notificationSentAt/notificationError — written
//   by Leads.ts's sendLeadNotification afterChange hook after every create.
// Neither Branches nor Leads has versions/drafts enabled, so unlike
// 20260827_160000's doctors_featured_highlights example there are no
// "_v"/"_version_" tables to mirror here.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_leads_notification_status" AS ENUM('pending', 'sent', 'failed', 'skipped');

    CREATE TABLE IF NOT EXISTS "branches_notification_recipients" (
    	"_order" integer NOT NULL,
    	"_parent_id" integer NOT NULL,
    	"id" varchar PRIMARY KEY NOT NULL,
    	"name" varchar,
    	"email" varchar NOT NULL,
    	"active" boolean DEFAULT true
    );

    DO $$ BEGIN
     ALTER TABLE "branches_notification_recipients" ADD CONSTRAINT "branches_notification_recipients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."branches"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
     WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "branches_notification_recipients_order_idx" ON "branches_notification_recipients" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "branches_notification_recipients_parent_id_idx" ON "branches_notification_recipients" USING btree ("_parent_id");

    ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "notification_status" "enum_leads_notification_status" DEFAULT 'pending';
    ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "notification_sent_at" timestamp(3) with time zone;
    ALTER TABLE "leads" ADD COLUMN IF NOT EXISTS "notification_error" varchar;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "leads" DROP COLUMN IF EXISTS "notification_error";
    ALTER TABLE "leads" DROP COLUMN IF EXISTS "notification_sent_at";
    ALTER TABLE "leads" DROP COLUMN IF EXISTS "notification_status";

    DROP TABLE IF EXISTS "branches_notification_recipients" CASCADE;

    DROP TYPE IF EXISTS "public"."enum_leads_notification_status";
  `)
}
