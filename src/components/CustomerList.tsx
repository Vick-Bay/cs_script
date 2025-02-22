import { useState, useMemo } from "react";
import { useCustomers } from "../hooks/useCustomers";
import type { Customer } from "../types/customer";
import { useSort } from "../hooks/useSort";
import { Table, Thead, Tbody, Tr, Th, Td } from "./ui/Table";
import { FilterDropdown } from "./ui/FilterDropdown";
import { TableLayout } from "./ui/TableLayout";
import { SearchInput } from "./ui/SearchInput";
import { Pagination } from "./ui/Pagination";

const ITEMS_PER_PAGE = 10;

export function CustomerList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const { data: customers, isLoading } = useCustomers();

  // Get unique branches for filter
  const branches = useMemo(() => {
    if (!customers) return [];
    return Array.from(new Set(customers.map((c) => c.DefaultBranch))).sort();
  }, [customers]);

  // Filter customers
  const filteredCustomers =
    customers?.filter(
      (customer) =>
        (customer.BillingName.toLowerCase().includes(search.toLowerCase()) ||
          customer.ContactName.toLowerCase().includes(search.toLowerCase())) &&
        (!branchFilter || customer.DefaultBranch === branchFilter)
    ) || [];

  // Sort customers
  const {
    sortedItems: sortedCustomers,
    sortBy,
    sortConfig,
  } = useSort(filteredCustomers, {
    key: null,
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
        placeholder="Search by name or contact..."
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
    <TableLayout
      title="Customers"
      description="Manage and view all customer accounts"
      filters={filters}
    >
      <Table>
        <Thead>
          <tr>
            <Th
              sortable
              sortDirection={
                sortConfig.key === "BillingName" ? sortConfig.direction : null
              }
              onClick={() => sortBy("BillingName")}
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
                sortConfig.key === "DefaultBranch" ? sortConfig.direction : null
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
          </tr>
        </Thead>
        <Tbody>
          {paginatedCustomers.map((customer) => (
            <Tr key={customer.Code}>
              <Td>{customer.BillingName}</Td>
              <Td>{customer.ContactName}</Td>
              <Td>{customer.Phone}</Td>
              <Td>{customer.DefaultBranch}</Td>
              <Td>{(customer.PriceMultiplier * 100).toFixed(0)}%</Td>
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
  );
}
