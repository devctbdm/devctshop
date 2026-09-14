ALTER TABLE "payments" ADD COLUMN "validation_id" varchar(100);--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "bank_transaction_id" varchar(100);--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "session_key" varchar(100);--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_validation_id_key" UNIQUE("validation_id");--> statement-breakpoint
CREATE UNIQUE INDEX "payments_order_id_uq" ON "payments" ("order_id");