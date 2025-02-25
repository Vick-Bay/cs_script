export type ShipperOrder = {
  $id: string;
  OrderNumber: string;
  InvoiceNumber: string;
  ShipperId: string;
  CustomerName: string;
  DateOrdered: string;
  "DateShipped ": string; // Note the space in the property name
  DateRequested: string;
  CustomerPo: string;
  CarrierName: string;
  CarrierTracking: string;
  InvoiceStatus: string;
  OrderStatus: string;
};

export type CustomerOrderRecord = {
  $id: string;
  Shipper: ShipperOrder[];
  CustomerCode: string;
  Log: string;
  Transaction: number;
  RequestStatusvalue: number;
  RequestStatus: string;
};

export type OrderResponse = {
  $id: string;
  Records: CustomerOrderRecord[];
  Log: string;
  Transaction: number;
  RequestStatusvalue: number;
  RequestStatus: string;
};
