import { Generated, ColumnType } from 'kysely';

export interface UserTable {
    id: Generated<number>;
    email: string;
    password?: string;
    login_type: number;
    created_at: Date;
    updated_at: Date;
}