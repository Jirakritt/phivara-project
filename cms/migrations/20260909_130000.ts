import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds Branches.notificationRecipients[].recipientType (to/cc/bcc) — see
// Branches.ts's field comment and Leads.ts's sendLeadNotification hook,
// which now buckets active recipients by this value before calling
// sendLeadNotificationEmail(). Runs after 20260909_120000, which created
// the "branches_notification_recipients" table this ALTERs.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_branches_notification_recipients_recipient_type" AS ENUM('to', 'cc', 'bcc');

    ALTER TABLE "branches_notification_recipients" ADD COLUMN IF NOT EXISTS "recipient_type" "enum_branches_notification_recipients_recipient_type" DEFAULT 'to' NOT NULL;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "branches_notification_recipients" DROP COLUMN IF EXISTS "recipient_type";
    DROP TYPE IF EXISTS "public"."enum_branches_notification_recipients_recipient_type";
  `)
}
