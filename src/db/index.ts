import "server-only";

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

import * as schema from "./schema";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env and fill it in.",
  );
}

const client = postgres(url, {
  max: 10,
  idle_timeout: 30,
  connect_timeout: 10,
  onnotice: () => {},
});

const db = drizzle(url, schema as any);

export { client, db, schema };
