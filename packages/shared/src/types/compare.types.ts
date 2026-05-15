export interface CompareItem {
    id: string;
    full_name: string;
    price: string;
    date: string;
}

export type CreateCompareDTO = {
    full_name: string;
    price: string;
    date: string;
}
