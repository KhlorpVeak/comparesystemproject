import { BaseTable } from "./base.table";

export interface UserSessionTable extends BaseTable {
    userId: number;
    token: string;
    expired_at: Date;
}