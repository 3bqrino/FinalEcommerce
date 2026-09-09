export interface IFooterLink {
  _id?: string;
  label: string;
  link: string;
}

export interface IFooter {
  _id?: string;

  newsletterTitle: string;
  newsletterDescription: string;
  newsletterNote: string;

  brandName: string;
  brandDescription: string;

  instagram: string;
  tiktok: string;
  twitter: string;
  youtube: string;

  shopLinks: IFooterLink[];
  brandLinks: IFooterLink[];
  supportLinks: IFooterLink[];

  shippingBadgeNumber: string;
  shippingBadgeTitle: string;
  shippingBadgeText: string;

  copyrightText: string;
  rightsText: string;

  privacyLink: string;
  privacyLabel: string;

  termsLink: string;
  termsLabel: string;

  isActive: boolean;

  createdAt?: string;
  updatedAt?: string;
}
