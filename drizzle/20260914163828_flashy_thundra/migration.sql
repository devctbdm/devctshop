CREATE TABLE "general_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"shop_name" varchar(120) DEFAULT 'Devct Shop' NOT NULL,
	"tagline" varchar(180) DEFAULT 'Premium Digital Products for Developers' NOT NULL,
	"site_description" text DEFAULT 'Devct Shop is a digital marketplace for high-quality website source code, templates, UI kits, and ready-to-use development projects.' NOT NULL,
	"contact_email" varchar(255),
	"contact_phone" varchar(40),
	"address" text,
	"footer_description" text DEFAULT 'Devct Shop is a digital marketplace for developers, offering high-quality website source code, templates, UI kits, and ready-to-use development projects.' NOT NULL,
	"copyright_text" varchar(180) DEFAULT '© 2026 Devct Shop. All rights reserved.' NOT NULL,
	"facebook_url" text,
	"github_url" text,
	"youtube_url" text,
	"linkedin_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
