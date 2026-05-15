import { BaseTable } from "./base.table.js";

export interface UserSessionTable extends BaseTable {
    userId: number;
    token: string;
    expired_at: Date;
}