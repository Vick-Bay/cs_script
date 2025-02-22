export type Branch = {
  Branch: string;
  Quantity: number;
};

export type Product = {
  Branches: Array<{
    Branch: string;
    Quantity: number;
  }>;
  Description: string;
  GlassType: string;
  HeightBegin: number;
  HeightEnd: number;
  ItemNumber: string;
  ListPrice: number;
  MetalFinish: string;
  ProductType: string;
  WidthBegin: number;
  WidthEnd: number;
};

export type ProductsResponse = {
  Log: string;
  Products: Product[];
  RequestStatus: string;
  RequestStatusvalue: number;
  Transaction: number;
};
