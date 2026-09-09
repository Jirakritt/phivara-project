import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Adds Leads.internalRemarks — the staff-only progress-note timeline on a
// Lead (see Leads.ts's field comment + the stampInternalRemarks
// beforeChange hook, which is the only thing that ever writes
// author_name/created_at). Not localized, so just one child table, no
// "_locales" companion (same shape as branches_notification_recipients from
// 20260909_120000).
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "leads_internal_remarks" (
    	"_order" integer NOT NULL,
    	"_parent_id" integer NOT NULL,
    	"id" varchar PRIMARY KEY NOT NULL,
    	"note" varchar NOT NULL,
    	"author_name" varchar,
    	"created_at" timestamp(3) with time zone
    );

    DO $$ BEGIN
     ALTER TABLE "leads_internal_remarks" ADD CONSTRAINT "leads_internal_remarks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
     WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "leads_internal_remarks_order_idx" ON "leads_internal_remarks" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "leads_internal_remarks_parent_id_idx" ON "leads_internal_remarks" USING btree ("_parent_id");
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "leads_internal_remarks" CASCADE;
  `)
}
