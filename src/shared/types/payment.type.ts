export interface Payment {
    key?: number;
    _id?: string;
    name: string;
    payment: number;
    paid: boolean;
    type: string;
    budgetId: string;
}