export interface IAbout {
  _id: string;
  title: string;
  description: string;
  founderName: string;
  founderRole: string;
  manifesto: string;
  image: string | null;
  secondaryImage: string | null;
  founderImage: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
