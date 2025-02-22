export type Customer = {
  CustomerId: string;
  BillingName: string;
  ContactName: string;
  Phone: string;
  DefaultBranch: string;
  PriceMultiplier: number;
  IsActive: boolean;
  Code: string;
  D365CustomerCode: string;
};

export type CustomersResponse = {
  Customers: Customer[];
  Log: string;
  RequestStatus: string;
  RequestStatusValue: number;
  Transaction: number;
};
