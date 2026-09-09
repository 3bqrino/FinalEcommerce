export interface IProductRef {
  _id: string;
  name: string;
  slug: string;
}

export interface IProduct {
  _id: string;

  name: string;

  description: string;

  price: number;

  image: string;

  stock: number;

  slug: string;

  category: string | IProductRef;

  subCategory: string | IProductRef;

  rating: number;

  isActive: boolean;

  isNewArrival: boolean;

  isTopSeller: boolean;

  isDeleted: boolean;

  createdAt?: string;

  updatedAt?: string;
}
