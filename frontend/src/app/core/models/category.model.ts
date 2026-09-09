export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}
