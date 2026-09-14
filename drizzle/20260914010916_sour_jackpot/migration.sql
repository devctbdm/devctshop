ALTER TABLE "wishlist" DROP CONSTRAINT "wishlist_user_id_product_id_pk";--> statement-breakpoint
ALTER TABLE "downloads" ADD COLUMN "product_slug" varchar(180) NOT NULL;--> statement-breakpoint
ALTER TABLE "downloads" ADD COLUMN "product_version" varchar(30) NOT NULL;--> statement-breakpoint
ALTER TABLE "downloads" ADD COLUMN "download_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "wishlist" ADD COLUMN "product_slug" varchar(180);--> statement-breakpoint
ALTER TABLE "wishlist" ADD PRIMARY KEY ("user_id","product_slug");--> statement-breakpoint
ALTER TABLE "wishlist" ALTER COLUMN "product_id" DROP NOT NULL;--> statement-breakpoint
CREATE INDEX "downloads_product_slug_idx" ON "downloads" ("product_slug");