import type { Generated } from "kysely";

export interface BaseTable {
    id: Generated<number>;
    createdAt: Date;
    updatedAt?: Date;
}