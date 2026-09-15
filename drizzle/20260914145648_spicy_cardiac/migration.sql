ALTER TABLE "products" ADD COLUMN "thumbnail_public_id" varchar(255);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "thumbnail_width" integer;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "thumbnail_height" integer;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "thumbnail_format" varchar(20);