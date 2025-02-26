import type { Customer } from "../types/customer";

type MapModalProps = {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
};

export function MapModal({ isOpen, onClose, customer }: MapModalProps) {
  if (!isOpen || !customer) return null;

  const addressParts = [
    customer.ShippingAddress1,
    customer.ShippingAddress2,
    customer.ShippingCityState,
    customer.ShippingState,
    customer.ShippingZip,
  ].filter(Boolean);

  // Check if we have enough address parts for a valid address
  const hasValidAddress =
    addressParts.length >= 3 &&
    customer.ShippingAddress1 &&
    customer.ShippingState;

  const address = addressParts.join(", ");
  const encodedAddress = encodeURIComponent(address);
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyC8CD9QKZn2nDvuYUGDu1C6JhqB_SDH0Vo&q=${encodedAddress}&zoom=12`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-[1200px] max-w-[95vw] max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{customer.BillingName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        {hasValidAddress ? (
          <div className="aspect-[16/9] w-full">
            <iframe
              title="Google Maps"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={mapUrl}
            />
          </div>
        ) : (
          <div className="aspect-[16/9] w-full bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-lg mb-2">Invalid or incomplete address</p>
              <p className="text-sm">
                Please ensure the address has a street, city, and state.
              </p>
            </div>
          </div>
        )}
        <div className="mt-4 text-gray-600">
          <p>{customer.ShippingAddress1}</p>
          {customer.ShippingAddress2 && <p>{customer.ShippingAddress2}</p>}
          <p>
            {customer.ShippingCityState}, {customer.ShippingState}{" "}
            {customer.ShippingZip}
          </p>
        </div>
      </div>
    </div>
  );
}
