export interface Payment {
    _id?: string;
    name: string;
    payment: string;
    paid: boolean;
    budgetId: string;
}