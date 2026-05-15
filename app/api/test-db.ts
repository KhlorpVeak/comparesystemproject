import { db } from './src/libs/db.js';
import { sql } from 'kysely';

export const testDbConnection = async () => {
  try {
    const result = await sql`SELECT 1 as is_alive`.execute(db);
  } catch (err) {
    console.error("Database connection failed:", err);
  }
};

testDbConnection().finally(() => process.exit(0));
