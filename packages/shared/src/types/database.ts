import type { UserTable } from './tables/user.table.js';
export interface Database {
  user: UserTable;
}