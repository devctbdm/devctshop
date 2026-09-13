import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

const migrationsFolder = process.env.MIGRATIONS_FOLDER ?? "./drizzle";

async function main() {
  const sql = postgres(process.env.DATABASE_URL!, { max: 1 });
  const db = drizzle({ client: sql });

  try {
    await migrate(db, { migrationsFolder });
    console.log("✓ Migrations applied successfully");
  } catch (error) {
    console.error("✗ Migration failed:", error);
    process.exitCode = 1;
  } finally {
    await sql.end();
  }
}

main();
