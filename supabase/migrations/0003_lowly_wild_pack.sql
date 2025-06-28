CREATE TYPE "public"."panel_layout" AS ENUM('grid', 'custom');--> statement-breakpoint
CREATE TYPE "public"."reading_mode" AS ENUM('leftToRight', 'rightToLeft');--> statement-breakpoint
CREATE TABLE "comic_panel_count" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"length" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "comic_panel_count" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "languages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"flag" text NOT NULL,
	"is_rtl" boolean DEFAULT false NOT NULL,
	CONSTRAINT "languages_code_key" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "languages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "comics" RENAME COLUMN "language" TO "language_id";--> statement-breakpoint
ALTER TABLE "collections" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "collections" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "comic_bookmarks" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "comic_comment_history" ALTER COLUMN "edited_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "comic_comments" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "comic_comments" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "comics" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "comics" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "comics" ALTER COLUMN "visibility" SET DATA TYPE content_visibility;--> statement-breakpoint
ALTER TABLE "comics" ALTER COLUMN "visibility" SET DEFAULT 'public';--> statement-breakpoint
ALTER TABLE "genres" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "genres" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "notifications" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "panels" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "panels" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "profiles" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "reactions" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "reports" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "series" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "series" ALTER COLUMN "updatet_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "series_bookmarks" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "tags" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "comic_comments" ADD COLUMN "row_number" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "comic_comments" ADD COLUMN "column_number" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "comics" ADD COLUMN "collection_id" uuid;--> statement-breakpoint
ALTER TABLE "comics" ADD COLUMN "panel_count" smallint;--> statement-breakpoint
ALTER TABLE "comics" ADD COLUMN "columns" smallint NOT NULL;--> statement-breakpoint
ALTER TABLE "comics" ADD COLUMN "border_width" smallint;--> statement-breakpoint
ALTER TABLE "comics" ADD COLUMN "rounded_corners" boolean;--> statement-breakpoint
ALTER TABLE "comics" ADD COLUMN "gap_row" smallint DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "comics" ADD COLUMN "background_color" text DEFAULT '#ffffff' NOT NULL;--> statement-breakpoint
ALTER TABLE "comics" ADD COLUMN "reading_mode" "reading_mode" DEFAULT 'leftToRight';--> statement-breakpoint
ALTER TABLE "comics" ADD COLUMN "options" jsonb DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "comics" ADD CONSTRAINT "comics_series_id_fkey" FOREIGN KEY ("series_id") REFERENCES "public"."series"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "comics" ADD CONSTRAINT "comics_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "comics" ADD CONSTRAINT "comics_panel_count_id_fkey" FOREIGN KEY ("panel_count") REFERENCES "public"."comic_panel_count"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "comics" ADD CONSTRAINT "comics_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "public"."languages"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "comics" ADD CONSTRAINT "comics_panel_count_min_check" CHECK (panel_count > 0);--> statement-breakpoint
ALTER TABLE "comics" ADD CONSTRAINT "comics_panel_columns_min_check" CHECK (panel_columns > 0);--> statement-breakpoint
ALTER TABLE "comics" ADD CONSTRAINT "comics_panel_columns_max_check" CHECK (panel_columns <= $1);--> statement-breakpoint
ALTER TABLE "comics" ADD CONSTRAINT "comics_panel_count_max_check" CHECK (panel_count <= $1);--> statement-breakpoint
ALTER TABLE "public"."comics" ALTER COLUMN "visibility" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."content_visibility";--> statement-breakpoint
CREATE TYPE "public"."content_visibility" AS ENUM('public', 'private', 'followers only');--> statement-breakpoint
ALTER TABLE "public"."comics" ALTER COLUMN "visibility" SET DATA TYPE "public"."content_visibility" USING "visibility"::"public"."content_visibility";--> statement-breakpoint
CREATE POLICY "Enable select for all users" ON "comic_panel_count" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "Enable read access for all users" ON "languages" AS PERMISSIVE FOR SELECT TO public USING (true);