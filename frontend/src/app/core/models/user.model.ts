import { IAddress } from "./address.model";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  nationalId: string;
  dateOfBirth?: string | null;
  gender: string;
  address: IAddress[];
  role: "user" | "admin" | string;
  isActive: boolean;
  isBlocked: boolean;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICreateAdmin {
  name: string;
  email: string;
  password: string;
  phone: string;
  nationalId: string;
  gender: "male" | "female";
  dateOfBirth?: string | null;
}

export interface IUserHistory {
  user: Pick<IUser, "_id" | "name" | "email" | "role">;
  history: {
    orders: any[];
    refunds: any[];
    testimonials: any[];
  };
}
