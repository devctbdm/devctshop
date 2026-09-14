import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  char,
  cidr,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["USER", "ADMIN"]);

export const accountType = pgEnum("account_type", [
  "oauth",
  "oidc",
  "email",
  "webauthn",
]);

export const orderStatus = pgEnum("order_status", [
  "pending",
  "paid",
  "failed",
  "refunded",
  "cancelled",
]);

export const paymentStatus = pgEnum("payment_status", [
  "pending",
  "completed",
  "failed",
  "refunded",
  "cancelled",
]);

export const paymentMethod = pgEnum("payment_method", ["sslcommerz", "stripe"]);

export const couponStatus = pgEnum("coupon_status", [
  "active",
  "scheduled",
  "expired",
  "disabled",
]);

export const discountType = pgEnum("discount_type", ["percent", "fixed"]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    fullName: varchar("full_name", { length: 120 }).notNull(),
    passwordHash: varchar("password_hash", { length: 255 }),
    role: userRole("role").notNull().default("USER"),
    isEmailVerified: boolean("is_email_verified").notNull().default(false),
    avatarUrl: text("avatar_url"),
    isActive: boolean("is_active").notNull().default(true),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("users_role_idx").on(table.role)],
);

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: accountType("type").notNull(),
    provider: varchar("provider", { length: 50 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 50 }),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => [
    uniqueIndex("accounts_provider_account_uq").on(
      table.provider,
      table.providerAccountId,
    ),
    index("accounts_user_id_idx").on(table.userId),
  ],
);

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    email: varchar("email", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("password_reset_tokens_user_id_idx").on(table.userId),
    index("password_reset_tokens_expires_at_idx").on(table.expiresAt),
  ],
);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    email: varchar("email", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("verification_tokens_user_id_idx").on(table.userId),
    index("verification_tokens_expires_at_idx").on(table.expiresAt),
  ],
);

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    description: text("description"),
    icon: varchar("icon", { length: 60 }),
    position: integer("position").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("categories_name_idx").on(table.name)],
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    name: varchar("name", { length: 160 }).notNull(),
    slug: varchar("slug", { length: 180 }).notNull().unique(),
    tagline: varchar("tagline", { length: 200 }),
    description: text("description"),
    thumbnailUrl: text("thumbnail_url"),
    demoUrl: text("demo_url"),
    priceCents: integer("price_cents").notNull(),
    currency: char("currency", { length: 3 }).notNull().default("USD"),
    version: varchar("version", { length: 30 }).notNull().default("1.0.0"),
    tags: text("tags")
      .array()
      .notNull()
      .default(sql`'{}'`),
    techStack: text("tech_stack")
      .array()
      .notNull()
      .default(sql`'{}'`),
    featured: boolean("featured").notNull().default(false),
    isPublished: boolean("is_published").notNull().default(false),
    salesCount: integer("sales_count").notNull().default(0),
    ratingAvg: numeric("rating_avg", { precision: 3, scale: 2 })
      .notNull()
      .default("0"),
    ratingCount: integer("rating_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("products_category_id_idx").on(table.categoryId),
    index("products_slug_idx").on(table.slug),
    index("products_is_published_idx").on(table.isPublished),
    index("products_featured_idx").on(table.featured),
    index("products_price_cents_idx").on(table.priceCents),
  ],
);

export const productFiles = pgTable(
  "product_files",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 200 }).notNull(),
    path: text("path").notNull(),
    sizeBytes: bigint("size_bytes", { mode: "number" }).notNull(),
    mimeType: varchar("mime_type", { length: 100 }),
    checksum: varchar("checksum", { length: 64 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("product_files_product_id_idx").on(table.productId),
    uniqueIndex("product_files_product_name_uq").on(
      table.productId,
      table.name,
    ),
  ],
);

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderNumber: varchar("order_number", { length: 30 }).notNull().unique(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    status: orderStatus("status").notNull().default("pending"),
    currency: char("currency", { length: 3 }).notNull().default("USD"),
    subtotalCents: integer("subtotal_cents").notNull(),
    discountCents: integer("discount_cents").notNull().default(0),
    couponId: uuid("coupon_id").references(() => coupons.id, {
      onDelete: "set null",
    }),
    totalCents: integer("total_cents").notNull(),
    billingEmail: varchar("billing_email", { length: 255 }).notNull(),
    billingName: varchar("billing_name", { length: 120 }),
    shippingAddress: jsonb("shipping_address"),
    customerNote: text("customer_note"),
    ipAddr: cidr("ip_addr"),
    placedAt: timestamp("placed_at", { withTimezone: true }),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    refundedAt: timestamp("refunded_at", { withTimezone: true }),
    cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("orders_user_id_idx").on(table.userId),
    index("orders_status_idx").on(table.status),
    index("orders_created_at_idx").on(table.createdAt),
    index("orders_coupon_id_idx").on(table.couponId),
    index("orders_paid_at_idx").on(table.paidAt),
  ],
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: uuid("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    productName: varchar("product_name", { length: 160 }).notNull(),
    productSlug: varchar("product_slug", { length: 180 }),
    quantity: integer("quantity").notNull().default(1),
    unitPriceCents: integer("unit_price_cents").notNull(),
    discountCents: integer("discount_cents").notNull().default(0),
    totalCents: integer("total_cents").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("order_items_order_id_idx").on(table.orderId),
    index("order_items_product_id_idx").on(table.productId),
  ],
);

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "restrict" }),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    gateway: paymentMethod("gateway").notNull().default("sslcommerz"),
    status: paymentStatus("status").notNull().default("pending"),
    transactionId: varchar("transaction_id", { length: 100 }).unique(),
    validationId: varchar("validation_id", { length: 100 }).unique(),
    bankTransactionId: varchar("bank_transaction_id", { length: 100 }),
    sessionKey: varchar("session_key", { length: 100 }),
    amountCents: integer("amount_cents").notNull(),
    currency: char("currency", { length: 3 }).notNull().default("USD"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    rawResponse: jsonb("raw_response"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("payments_order_id_idx").on(table.orderId),
    uniqueIndex("payments_order_id_uq").on(table.orderId),
    index("payments_user_id_idx").on(table.userId),
    index("payments_status_idx").on(table.status),
    index("payments_created_at_idx").on(table.createdAt),
  ],
);

export const downloads = pgTable(
  "downloads",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productSlug: varchar("product_slug", { length: 180 }).notNull(),
    productVersion: varchar("product_version", { length: 30 }).notNull(),
    productFileId: uuid("product_file_id").references(() => productFiles.id, {
      onDelete: "set null",
    }),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    ipAddr: cidr("ip_addr"),
    userAgent: text("user_agent"),
    downloadCount: integer("download_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("downloads_order_id_idx").on(table.orderId),
    index("downloads_user_id_idx").on(table.userId),
    index("downloads_product_file_id_idx").on(table.productFileId),
    index("downloads_product_slug_idx").on(table.productSlug),
    uniqueIndex("downloads_user_order_product_uq").on(table.userId, table.orderId, table.productSlug),
    index("downloads_created_at_idx").on(table.createdAt),
  ],
);

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    title: varchar("title", { length: 160 }),
    body: text("body"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("reviews_product_id_idx").on(table.productId),
    index("reviews_user_id_idx").on(table.userId),
    uniqueIndex("reviews_product_user_uq").on(table.productId, table.userId),
    index("reviews_rating_idx").on(table.rating),
  ],
);

export const wishlist = pgTable(
  "wishlist",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }),
    productSlug: varchar("product_slug", { length: 180 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.productSlug] }),
    index("wishlist_product_id_idx").on(table.productId),
  ],
);

export const coupons = pgTable(
  "coupons",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: varchar("code", { length: 40 }).notNull().unique(),
    description: text("description"),
    discountType: discountType("discount_type").notNull().default("percent"),
    discountValue: integer("discount_value").notNull(),
    maxDiscountCents: integer("max_discount_cents"),
    minOrderCents: integer("min_order_cents").notNull().default(0),
    usageLimit: integer("usage_limit"),
    usageCount: integer("usage_count").notNull().default(0),
    perUserLimit: integer("per_user_limit").notNull().default(1),
    status: couponStatus("status").notNull().default("active"),
    validFrom: timestamp("valid_from", { withTimezone: true }).notNull(),
    validUntil: timestamp("valid_until", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("coupons_code_idx").on(table.code),
    index("coupons_status_idx").on(table.status),
  ],
);
