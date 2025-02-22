export type Customer = {
  CustomerId: string;
  BillingName: string;
  ContactName: string;
  DefaultBranch: string;
  IsActive: boolean;
  PriceMultiplier: number;
};

export type CustomersResponse = {
  Log: string;
  Customers: Customer[];
  RequestStatus: string;
  RequestStatusvalue: number;
  Transaction: number;
};
