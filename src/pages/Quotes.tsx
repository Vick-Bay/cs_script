import { useState } from "react";
import { useQuotes } from "../hooks/useQuotes";
import { TableLayout } from "../components/ui/TableLayout";
import { FilterDropdown } from "../components/ui/FilterDropdown";
import { Table, Thead, Tbody, Tr, Th, Td } from "../components/ui/Table";
import { SearchInput } from "../components/ui/SearchInput";
import { Pagination } from "../components/ui/Pagination";
import { useSort } from "../hooks/useSort";
import type { Quote } from "../types/quote";

const ITEMS_PER_PAGE = 10;

export function Quotes() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const { data: quotes, isLoading, error } = useQuotes();

  // Sort quotes
  const {
    sortedItems: sortedQuotes,
    sortBy,
    sortConfig,
  } = useSort(quotes || [], {
    key: null,
    direction: null,
  });

  // Filter quotes
  const filteredQuotes = sortedQuotes.filter(
    (quote) =>
      (!filter || quote.Status === filter) &&
      (quote.Customer.toLowerCase().includes(search.toLowerCase()) ||
        quote.ItemNumber.toLowerCase().includes(search.toLowerCase()))
  );

  // Paginate quotes
  const paginatedQuotes = filteredQuotes.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  if (isLoading) {
    return (
      <TableLayout title="Quotes">
        <div className="flex justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      </TableLayout>
    );
  }

  if (error) {
    return (
      <TableLayout title="Quotes">
        <div className="text-red-500 p-4">Failed to load quotes</div>
      </TableLayout>
    );
  }

  return (
    <TableLayout
      title="Quotes"
      description="View and manage customer quotes"
      filters={
        <div className="space-y-4">
          <SearchInput
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="Search by customer or item number..."
          />
          <FilterDropdown
            label="Status"
            value={filter}
            onChange={(value) => {
              setFilter(value);
              setPage(1);
            }}
            options={["Active", "Expired", "Pending"]}
          />
        </div>
      }
    >
      <Table>
        <Thead>
          <tr>
            <Th
              sortable
              sortDirection={
                sortConfig.key === "Customer" ? sortConfig.direction : null
              }
              onClick={() => sortBy("Customer")}
            >
              Customer
            </Th>
            <Th
              sortable
              sortDirection={
                sortConfig.key === "ItemNumber" ? sortConfig.direction : null
              }
              onClick={() => sortBy("ItemNumber")}
            >
              Item Number
            </Th>
            <Th
              sortable
              sortDirection={
                sortConfig.key === "ItemPrice" ? sortConfig.direction : null
              }
              onClick={() => sortBy("ItemPrice")}
            >
              Price
            </Th>
            <Th
              sortable
              sortDirection={
                sortConfig.key === "ExpirationDate"
                  ? sortConfig.direction
                  : null
              }
              onClick={() => sortBy("ExpirationDate")}
            >
              Expiration Date
            </Th>
            <Th
              sortable
              sortDirection={
                sortConfig.key === "Status" ? sortConfig.direction : null
              }
              onClick={() => sortBy("Status")}
            >
              Status
            </Th>
          </tr>
        </Thead>
        <Tbody>
          {paginatedQuotes.map((quote, index) => (
            <Tr key={`${quote.Customer}-${quote.ItemNumber}-${index}`}>
              <Td>{quote.Customer}</Td>
              <Td>{quote.ItemNumber}</Td>
              <Td>${quote.ItemPrice.toLocaleString()}</Td>
              <Td>{quote.ExpirationDate || "N/A"}</Td>
              <Td>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    quote.Status === "Active"
                      ? "bg-green-100 text-green-800"
                      : quote.Status === "Expired"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {quote.Status || "Pending"}
                </span>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Pagination
        currentPage={page}
        totalItems={filteredQuotes.length}
        pageSize={ITEMS_PER_PAGE}
        onPageChange={setPage}
      />
    </TableLayout>
  );
}
