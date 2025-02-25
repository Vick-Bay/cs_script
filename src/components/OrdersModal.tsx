import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import type { OrderResponse } from "../types/orders";
import { format } from "date-fns";

type OrdersModalProps = {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderResponse | null;
  isLoading: boolean;
};

export function OrdersModal({
  isOpen,
  onClose,
  orders,
  isLoading,
}: OrdersModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 mb-4"
                >
                  Orders
                </Dialog.Title>

                {isLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                  </div>
                ) : orders?.Records &&
                  orders.Records.some((record) => record.Shipper.length > 0) ? (
                  <div className="space-y-8">
                    {orders.Records.map(
                      (record) =>
                        record.Shipper.length > 0 && (
                          <div key={record.$id} className="overflow-x-auto">
                            <h4 className="text-md font-medium text-gray-700 mb-4">
                              {record.Shipper[0].CustomerName} (
                              {record.CustomerCode})
                            </h4>
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order/Invoice
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer PO
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Dates
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Shipping
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {record.Shipper.map((order) => (
                                  <tr key={order.$id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                      <div>
                                        {order.OrderNumber || "Pending"}
                                      </div>
                                      <div className="text-gray-500">
                                        {order.InvoiceNumber || "No Invoice"}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {order.CustomerPo}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      <div>
                                        Ordered:{" "}
                                        {format(
                                          new Date(order.DateOrdered),
                                          "MMM d, yyyy"
                                        )}
                                      </div>
                                      <div>
                                        Requested:{" "}
                                        {format(
                                          new Date(order.DateRequested),
                                          "MMM d, yyyy"
                                        )}
                                      </div>
                                      {order["DateShipped "] !==
                                        "1900-01-01T12:00:00" && (
                                        <div>
                                          Shipped:{" "}
                                          {format(
                                            new Date(order["DateShipped "]),
                                            "MMM d, yyyy"
                                          )}
                                        </div>
                                      )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-900">
                                        {order.OrderStatus}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {order.InvoiceStatus}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      <div>{order.CarrierName}</div>
                                      {order.CarrierTracking && (
                                        <div className="text-blue-600 hover:text-blue-800">
                                          {order.CarrierTracking}
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">No orders found.</p>
                )}

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
