import type { BaseTable } from './base.table.js';

export interface UserTable extends BaseTable {
    email?: string;
    phoneNumber?: string;
    password: string;
    type: number;
    socialId?: string;
    socialToken?: string;
    loginType?: number;
    point?: number;
}