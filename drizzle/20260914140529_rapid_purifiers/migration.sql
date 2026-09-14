ALTER TABLE "product_files" ADD COLUMN "version" varchar(30) DEFAULT '1.0.0' NOT NULL;--> statement-breakpoint
ALTER TABLE "product_files" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "product_type" varchar(10) DEFAULT 'PAID' NOT NULL;