CREATE TABLE "panels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"comic_id" uuid,
	"image" text NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text) NOT NULL,
	"user_id" uuid DEFAULT auth.uid() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "panels" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "panels" ADD CONSTRAINT "panels_comic_id_fkey" FOREIGN KEY ("comic_id") REFERENCES "public"."comics"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "panels" ADD CONSTRAINT "panels_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER POLICY "Enable insert for all users only" ON "reports" RENAME TO "Enable insert for all users";--> statement-breakpoint
CREATE POLICY "Enable delete for users based on user_id" ON "series" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "Enable update for users based on user_id" ON "series" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable insert for authenticated users only" ON "tags" AS PERMISSIVE FOR INSERT TO "authenticated";--> statement-breakpoint
CREATE POLICY "Enable insert for authenticated users only" ON "panels" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "Enable delete for users based on user_id" ON "panels" AS PERMISSIVE FOR DELETE TO "authenticated";--> statement-breakpoint
CREATE POLICY "Enable update for users based on user_id" ON "panels" AS PERMISSIVE FOR UPDATE TO "authenticated" WITH CHECK (true);--> statement-breakpoint
ALTER POLICY "Enable delete for users based on user_id" ON "collections" TO authenticated;--> statement-breakpoint
ALTER POLICY "Enable update for users based on user_id" ON "collections" TO authenticated;--> statement-breakpoint
ALTER POLICY "Enable delete for users based on user_id" ON "comic_bookmarks" TO public USING (true);--> statement-breakpoint
ALTER POLICY "Enable read access for users to their bookmarks" ON "comic_bookmarks" TO authenticated USING (true);--> statement-breakpoint
ALTER POLICY "Enable delete for users based on user_id" ON "comic_comments" TO authenticated USING (true);--> statement-breakpoint
ALTER POLICY "Enable update for users based on user_id" ON "comic_comments" TO authenticated USING (true) WITH CHECK (true);--> statement-breakpoint
ALTER POLICY "Enable delete for users based on user_id" ON "comics" TO authenticated;--> statement-breakpoint
ALTER POLICY "Enable update for users based on user_id" ON "comics" TO authenticated;--> statement-breakpoint
ALTER POLICY "Enable read access for reciepent user_id" ON "notifications" TO authenticated USING (true);