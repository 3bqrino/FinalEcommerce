export interface ITestimonial {
  _id: string;

  user: {
    _id: string;
    name: string;
    email?: string;
  };

  name: string;

  comment: string;

  rating: number;

  status: "pending" | "accepted" | "rejected";

  isDeleted: boolean;

  createdAt?: string;

  updatedAt?: string;
}
