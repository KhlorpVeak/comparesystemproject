import { BaseTable } from "./base.table.js";

export interface ProfileTable extends BaseTable {
    first_name?: string;
    last_name?: string;
    email?: string;
    userId?: number;
    created_at?: Date;
    updated_at?: Date;
}