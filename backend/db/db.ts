import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
pool
  .connect()
  .then(() => {
    console.log("database running ✅✅");
  })
  .catch((err) => {
    console.error("database connection error ❌❌", err);
  });

export const db = drizzle(pool);
