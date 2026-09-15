ALTER TABLE "general_settings" ADD COLUMN "default_currency" char(3) DEFAULT 'USD' NOT NULL;--> statement-breakpoint
ALTER TABLE "general_settings" ADD COLUMN "supported_currencies" text[] DEFAULT ARRAY['USD', 'BDT']::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "general_settings" ADD COLUMN "usd_to_bdt_rate" numeric(12,4) DEFAULT '120.00' NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "base_amount_cents" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "base_currency" char(3) DEFAULT 'USD';--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "exchange_rate" numeric(12,4);