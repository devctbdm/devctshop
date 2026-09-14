ALTER TABLE "products" ADD COLUMN "sale_price_cents" integer;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "image_urls" text[] DEFAULT '{}'::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "features" text[] DEFAULT '{}'::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "requirements" text[] DEFAULT '{}'::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "license" varchar(80) DEFAULT 'Commercial License' NOT NULL;