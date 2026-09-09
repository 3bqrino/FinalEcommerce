export interface ICartProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  slug: string;
}

export interface ICartItem {
  product: ICartProduct;
  quantity: number;
  priceAtAdd: number;
  priceChanged: boolean;
}

export interface ICart {
  _id?: string;
  user?: string;
  items: ICartItem[];
  createdAt?: string;
  updatedAt?: string;
}
