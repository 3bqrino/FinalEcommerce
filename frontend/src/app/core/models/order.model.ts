export interface IOrderItem {
  product: string;

  name: string;

  image: string;

  quantity: number;

  price: number;

  totalPrice: number;
}

export interface IShippingAddress {
  name: string;

  governorate: string;

  city: string;

  street: string;

  building: string;
}

export interface IOrder {
  _id: string;

  user: {
    _id: string;
    name: string;
    email: string;
  };

  items: IOrderItem[];

  shippingAddress: IShippingAddress;

  subtotal: number;

  deliveryFee: number;

  totalAmount: number;

  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";

  createdAt?: string;

  updatedAt?: string;
}
