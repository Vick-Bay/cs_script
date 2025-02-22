export type QuoteItem = {
  ItemNumber: string;
  Description: string;
  Quantity: number;
  UnitPrice: number;
  LineTotal: number;
  ProductType: string;
  GlassType: string;
  MetalFinish: string;
};

export type Quote = {
  Customer: string;
  D365Customer: string;
  ExpirationDate: string;
  ItemNumber: string;
  ItemPrice: number;
  Status?: string;
};

export type CustomerQuote = {
  Customer: string;
  D365Customer: string;
  ExpirationDate: string;
  ItemNumber: string;
  ItemPrice: number;
};

export type QuotesResponse = {
  CustomerQuotes: Quote[];
  Log: string;
  RequestStatus: string;
  RequestStatusvalue: number;
  Transaction: number;
};
