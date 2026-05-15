import type { Database } from './types/database.js';
import { Kysely } from 'kysely';
import 'dotenv/config';
export type DatabaseType = Kysely<Database>;
export declare const db: Kysely<Database>;
//# sourceMappingURL=db.d.ts.map