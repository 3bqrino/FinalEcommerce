export interface IAuthUser {
  _id: string;

  name: string;

  email: string;

  role: string;
}

export interface ILoginReq {
  email: string;

  password: string;
}

export interface ILoginRes {
  status: string;

  accessToken: string;

  data: {
    user: IAuthUser;
  };
}

export interface IProfile {
  _id: string;

  name: string;

  email: string;

  phone: string;

  nationalId: string;

  gender: "male" | "female";

  dateOfBirth: string | null;

  role: string;

  isActive: boolean;

  isBlocked: boolean;

  isDeleted: boolean;

  createdAt?: string;

  updatedAt?: string;
}

export type IUser = IAuthUser;
