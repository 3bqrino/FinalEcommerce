export interface IPromo {
  _id?: string;
  text: string;
  discount: number | null;
  link: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
