import { createPool } from "mysql2";
import { Kysely, MysqlDialect } from 'kysely';
import 'dotenv/config';
const dialect = new MysqlDialect({
    // @ts-ignore
    pool: createPool({
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD || '',
        port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT) : 3306,
    }),
});
export const db = new Kysely({
    dialect,
    log: ['query', 'error'],
});
