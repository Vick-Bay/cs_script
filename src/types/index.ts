export type Customer = {
  id: number;
  name: string;
  email: string;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
};

export type QuoteProduct = {
  productId: number;
  quantity: number;
  price: number;
};

export type Quote = {
  id: number;
  customerId: number;
  status: "pending" | "approved";
  date: string;
  products: QuoteProduct[];
  total: number;
};
