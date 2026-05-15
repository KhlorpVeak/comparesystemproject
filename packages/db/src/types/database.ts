import { ProfileTable } from './tables/profile.table.js';
import type { UserTable } from './tables/user.table.js';
import type { UserSessionTable } from './tables/user_session.table.js';

export interface Database {
  users: UserTable;
  profile: ProfileTable;
  user_session: UserSessionTable;
}
