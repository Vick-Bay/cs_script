export type ProductBranch = {
  Branch: string;
  Quantity: number;
  Location?: string;
};

export type Product = {
  ItemNumber: string;
  Description: string;
  ProductType: string;
  MetalFinish: string;
  ListPrice: number;
  Branches: ProductBranch[];
  IsActive: boolean;
};

export type ProductsResponse = {
  Products: Product[];
  Log: string;
  RequestStatus: string;
  RequestStatusValue: number;
  Transaction: number;
};
