import { BaseTable } from "./base.table.js";
export interface UserSessionTable extends BaseTable {
    userId: number;
    token: string;
    expired_at: Date;
}
//# sourceMappingURL=user_session.table.d.ts.map