import type { Generated } from 'kysely';

export interface BaseTable {
  id: Generated<number>;
  created_at?: Date;
  updated_at?: Date;
}
