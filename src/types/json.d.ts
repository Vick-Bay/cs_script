declare module "*.json" {
  const value: {
    products: import("./product").Product[];
  };
  export default value;
}
