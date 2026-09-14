CREATE TABLE "product_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"product_id" uuid NOT NULL,
	"public_id" varchar(255) NOT NULL UNIQUE,
	"secure_url" text NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"format" varchar(20) NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "image_public_id" varchar(255);--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "image_width" integer;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "image_height" integer;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "image_format" varchar(20);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avatar_public_id" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avatar_width" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avatar_height" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "avatar_format" varchar(20);--> statement-breakpoint
CREATE INDEX "product_images_product_id_idx" ON "product_images" ("product_id");--> statement-breakpoint
CREATE INDEX "product_images_position_idx" ON "product_images" ("product_id","position");--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_products_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;