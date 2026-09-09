export interface IRefundOrderRef {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt?: string;
}

export interface IRefundUserRef {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface IRefund {
  _id: string;

  order: string | IRefundOrderRef;

  user: string | IRefundUserRef;

  amount: number;

  reason: string;

  status: "pending" | "rejected" | "refunded";

  adminNote: string;

  processedAt?: string | null;

  createdAt?: string;

  updatedAt?: string;
}
