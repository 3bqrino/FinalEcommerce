export interface IMessage {
  _id: string;
  recipient: string;
  type:
    | "new_order"
    | "new_testimonial"
    | "order_status"
    | "refund_request"
    | "refund_approved"
    | "refund_rejected"
    | "refund_completed";
  title: string;
  message: string;
  isRead: boolean;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}
