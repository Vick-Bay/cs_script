import { useState, useMemo } from "react";
import type { Quote } from "../types/quote";
import { Table, Thead, Tbody, Tr, Th, Td } from "./ui/Table";
import { TableLayout } from "./ui/TableLayout";
import { SearchInput } from "./ui/SearchInput";
import { FilterDropdown } from "./ui/FilterDropdown";
import { Pagination } from "./ui/Pagination";
import { useSort } from "../hooks/useSort";

const ITEMS_PER_PAGE = 10;

type QuoteListProps = {
  quotes?: Quote[];
};

export function QuoteList({ quotes = [] }: QuoteListProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Get unique statuses for filter
  const statuses = useMemo(() => {
    return [...new Set(quotes.map((q) => q.Status || "Unknown"))].sort();
  }, [quotes]);

  // Memoize filtered quotes
  const filteredQuotes = useMemo(() => {
    return quotes.filter(
      (quote) =>
        (!statusFilter || quote.Status === statusFilter) &&
        quote.Customer.toLowerCase().includes(search.toLowerCase())
    );
  }, [quotes, statusFilter, search]);

  // Sort quotes
  const {
    sortedItems: sortedQuotes,
    sortBy,
    sortConfig,
  } = useSort<Quote>(filteredQuotes, {
    key: null as keyof Quote | null,
    direction: null,
  });

  // Calculate pagination
  const paginatedQuotes = sortedQuotes.slice(
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
        placeholder="Search by customer..."
      />
      <FilterDropdown
        label="Status"
        value={statusFilter}
        options={statuses}
        onChange={(value) => {
          setStatusFilter(value);
          setPage(1);
        }}
      />
    </>
  );

  return (
    <TableLayout
      title="Quotes"
      description={`Showing ${paginatedQuotes.length} of ${filteredQuotes.length} quotes`}
      filters={filters}
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
              Expiration
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
          {paginatedQuotes.map((quote) => (
            <Tr key={quote.QuoteId}>
              <Td>{quote.Customer}</Td>
              <Td>${quote.ItemPrice.toLocaleString()}</Td>
              <Td>{quote.ExpirationDate || "N/A"}</Td>
              <Td>{quote.Status || "N/A"}</Td>
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
