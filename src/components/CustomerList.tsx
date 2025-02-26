import { useState, useMemo } from "react";
import { useCustomers } from "../hooks/useCustomers";
import type { Customer } from "../types/customer";
import { useSort } from "../hooks/useSort";
import { Table, Thead, Tbody, Tr, Th, Td } from "./ui/Table";
import { FilterDropdown } from "./ui/FilterDropdown";
import { TableLayout } from "./ui/TableLayout";
import { SearchInput } from "./ui/SearchInput";
import { Pagination } from "./ui/Pagination";
import { OrdersModal } from "./OrdersModal";
import { MapModal } from "./MapModal";
import { getCustomerOrders } from "../api/dynamics";
import { useAuth } from "../context/AuthContext";
import type { OrderResponse } from "../types/orders";
import type { AuthResponse } from "../types/auth";

const ITEMS_PER_PAGE = 10;

export function CustomerList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [salesRepFilter, setSalesRepFilter] = useState("");
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [selectedMapCustomer, setSelectedMapCustomer] =
    useState<Customer | null>(null);
  const [orders, setOrders] = useState<OrderResponse | null>(null);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const { auth } = useAuth();
  const { data: customersData, isLoading } = useCustomers();

  async function handleViewAllOrders() {
    if (!auth.access_token) {
      console.log("No access token available");
      return;
    }

    setIsOrdersModalOpen(true);
    setIsLoadingOrders(true);
    try {
      const customerCodes = paginatedCustomers.map((c) => c.D365CustomerCode);
      console.log("Fetching orders with:", {
        token: auth.access_token,
        customerCodes,
      });
      const ordersData = await getCustomerOrders(
        { access_token: auth.access_token },
        customerCodes
      );
      console.log("Orders response:", ordersData);
      setOrders(ordersData);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoadingOrders(false);
    }
  }

  async function handleViewOrders(customerCode: string) {
    if (!auth.access_token) return;

    setSelectedCustomer(customerCode);
    setIsOrdersModalOpen(true);
    setIsLoadingOrders(true);
    try {
      const ordersData = await getCustomerOrders(
        { access_token: auth.access_token },
        [customerCode]
      );
      setOrders(ordersData);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoadingOrders(false);
    }
  }

  // Get unique branches and sales reps for filters
  const { branches, salesReps } = useMemo(() => {
    if (!customersData) return { branches: [], salesReps: [] };
    return {
      branches: Array.from(
        new Set(customersData.map((c) => c.DefaultBranch).filter(Boolean))
      ).sort(),
      salesReps: Array.from(
        new Set(customersData.map((c) => c.SalesRep).filter(Boolean))
      ).sort(),
    };
  }, [customersData]);

  // Filter customers
  const filteredCustomers =
    customersData?.filter(
      (customer) =>
        customer?.BillingName?.toLowerCase().includes(search.toLowerCase()) &&
        (!branchFilter ||
          (customer?.DefaultBranch &&
            customer.DefaultBranch === branchFilter)) &&
        (!salesRepFilter ||
          (customer?.SalesRep && customer.SalesRep === salesRepFilter))
    ) || [];

  // Sort customers
  const {
    sortedItems: sortedCustomers,
    sortBy,
    sortConfig,
  } = useSort<Customer>(filteredCustomers, {
    key: null as keyof Customer | null,
    direction: null,
  });

  // Paginate customers
  const paginatedCustomers = sortedCustomers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const filters = (
    <>
      <SearchInput
        value={search}
        onChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        placeholder="Search by name..."
      />
      <div className="flex flex-wrap gap-4">
        <FilterDropdown
          label="Branch"
          value={branchFilter}
          options={branches}
          onChange={(value) => {
            setBranchFilter(value);
            setPage(1);
          }}
        />
        <FilterDropdown
          label="Sales Rep"
          value={salesRepFilter}
          options={salesReps}
          onChange={(value) => {
            setSalesRepFilter(value);
            setPage(1);
          }}
        />
      </div>
    </>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <TableLayout
        title="Customers"
        description="Manage and view all customer accounts"
        filters={filters}
      >
        <div className="mb-4 flex justify-end mr-10">
          <button
            onClick={handleViewAllOrders}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            View All Orders
          </button>
        </div>
        <Table>
          <Thead>
            <tr>
              <Th
                sortable
                sortDirection={
                  sortConfig.key === "BillingName" ? sortConfig.direction : null
                }
                onClick={() => sortBy("BillingName")}
                className="w-96"
              >
                Name
              </Th>
              <Th
                sortable
                sortDirection={
                  sortConfig.key === "ContactName" ? sortConfig.direction : null
                }
                onClick={() => sortBy("ContactName")}
              >
                Contact
              </Th>
              <Th
                sortable
                sortDirection={
                  sortConfig.key === "Phone" ? sortConfig.direction : null
                }
                onClick={() => sortBy("Phone")}
              >
                Phone
              </Th>
              <Th
                sortable
                sortDirection={
                  sortConfig.key === "DefaultBranch"
                    ? sortConfig.direction
                    : null
                }
                onClick={() => sortBy("DefaultBranch")}
              >
                Branch
              </Th>
              <Th
                sortable
                sortDirection={
                  sortConfig.key === "PriceMultiplier"
                    ? sortConfig.direction
                    : null
                }
                onClick={() => sortBy("PriceMultiplier")}
              >
                Price Multiplier
              </Th>
              <Th
                sortable
                sortDirection={
                  sortConfig.key === "SalesRep" ? sortConfig.direction : null
                }
                onClick={() => sortBy("SalesRep")}
              >
                Sales Rep
              </Th>
              <Th>Map</Th>
              <Th>Actions</Th>
            </tr>
          </Thead>
          <Tbody>
            {paginatedCustomers.map((customer, index) => (
              <Tr
                key={`${customer.CustomerId}-${
                  customer.Code || customer.D365CustomerCode || index
                }`}
              >
                <Td className="w-96">
                  <div className="truncate" title={customer.BillingName}>
                    {customer.BillingName.length > 30
                      ? `${customer.BillingName.slice(0, 30)}...`
                      : customer.BillingName}
                  </div>
                </Td>
                <Td>{customer.ContactName}</Td>
                <Td>{customer.Phone}</Td>
                <Td>{customer.DefaultBranch}</Td>
                <Td>{(customer.PriceMultiplier * 100).toFixed(0)}%</Td>
                <Td>{customer.SalesRep}</Td>
                <Td>
                  <button
                    onClick={() => {
                      setSelectedMapCustomer(customer);
                      setIsMapModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Map it
                  </button>
                </Td>
                <Td>
                  <button
                    onClick={() => handleViewOrders(customer.D365CustomerCode)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Orders
                  </button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Pagination
          currentPage={page}
          totalItems={filteredCustomers.length}
          pageSize={ITEMS_PER_PAGE}
          onPageChange={setPage}
        />
      </TableLayout>

      <OrdersModal
        isOpen={isOrdersModalOpen}
        onClose={() => {
          setIsOrdersModalOpen(false);
          setSelectedCustomer(null);
          setOrders(null);
        }}
        orders={orders}
        isLoading={isLoadingOrders}
      />

      <MapModal
        isOpen={isMapModalOpen}
        onClose={() => {
          setIsMapModalOpen(false);
          setSelectedMapCustomer(null);
        }}
        customer={selectedMapCustomer}
      />
    </>
  );
}
