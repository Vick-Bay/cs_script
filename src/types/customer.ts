export type Customer = {
  CustomerId: string;
  D365CustomerCode: string;
  BillingName: string;
  DefaultBranch: string;
  IsActive: boolean;
  PriceMultiplier: number;
  ShippingState: string;
};

export type CustomersResponse = {
  Log: string;
  Customers: Customer[];
  RequestStatus: string;
  RequestStatusvalue: number;
  Transaction: number;
};
