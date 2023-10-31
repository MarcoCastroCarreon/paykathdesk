import { Payment } from "./payment.type";

export type Budget = {
  _id?: string;
  date?: string;
  budget?: string;
  totalPayment?: string;
  remaining?: string;
  year?: string;
  paymentsList?: Payment[];
};
