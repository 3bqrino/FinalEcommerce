export interface ITopProduct {
  _id: string;

  name: string;

  image: string;

  category: string;

  slug: string;

  sold: number;

  revenue: number;
}

export interface ITopUser {
  _id: string;

  name: string;

  email: string;

  orders: number;

  totalSpent: number;
}

export interface ISalesMonth {
  month: string;

  label: string;

  revenue: number;

  orders: number;

  itemsSold: number;
}

export interface IStoreReport {
  totalUsers: number;

  totalProducts: number;

  totalOrders: number;

  totalSales: number;

  totalItemsSold: number;

  averageOrderValue: number;

  pendingOrders: number;

  confirmedOrders: number;

  processingOrders: number;

  shippedOrders: number;

  deliveredOrders: number;

  cancelledOrders: number;

  refundedOrders: number;

  topUsers: ITopUser[];

  topProducts: ITopProduct[];

  salesByMonth6: ISalesMonth[];

  salesByMonth12: ISalesMonth[];
}
