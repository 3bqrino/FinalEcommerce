export interface ISubcategoryCategoryRef {
  _id: string;
  name: string;
  slug: string;
}

export interface ISubcategory {
  _id: string;
  name: string;
  slug: string;
  category: string | ISubcategoryCategoryRef;
  isActive: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
