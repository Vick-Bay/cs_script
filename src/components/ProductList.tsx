import { useState, useMemo } from "react";
import { useProducts } from "../hooks/useProducts";
import type { Product } from "../types/product";
import { useSort } from "../hooks/useSort";
import { Table, Thead, Tbody, Tr, Th, Td } from "./ui/Table";
import { FilterDropdown } from "./ui/FilterDropdown";
import { TableLayout } from "./ui/TableLayout";
import { SearchInput } from "./ui/SearchInput";
import { Pagination } from "./ui/Pagination";

const ITEMS_PER_PAGE = 10;

// Helper function to calculate total quantity
const getTotalQuantity = (product: Product) =>
  product.Branches.reduce((sum, branch) => sum + branch.Quantity, 0);

type ProductListProps = {
  products?: Product[];
};

export function ProductList({ products = [] }: ProductListProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [metalFinishFilter, setMetalFinishFilter] = useState("");
  const [productTypeFilter, setProductTypeFilter] = useState("");
  const { data: productsData, isLoading, error } = useProducts();

  if (isLoading) {
    return (
      <TableLayout title="Products">
        <div className="flex justify-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      </TableLayout>
    );
  }

  if (error) {
    return (
      <TableLayout title="Products">
        <div className="text-red-500 p-4">
          Failed to load products:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </div>
      </TableLayout>
    );
  }

  if (!productsData?.length) {
    return (
      <TableLayout title="Products">
        <div className="text-gray-500 p-4">No products found</div>
      </TableLayout>
    );
  }

  // Get unique options for filters
  const filterOptions = useMemo(() => {
    if (!productsData) return { metalFinishes: [], productTypes: [] };

    return {
      metalFinishes: Array.from(
        new Set(productsData.map((p) => p.MetalFinish))
      ).sort(),
      productTypes: Array.from(
        new Set(productsData.map((p) => p.ProductType))
      ).sort(),
    };
  }, [productsData]);

  // First, prepare products with computed total quantity
  const productsWithTotal = useMemo(() => {
    return (
      productsData?.map((product) => ({
        ...product,
        totalQuantity: getTotalQuantity(product),
      })) || []
    );
  }, [productsData]);

  // Then filter all products
  const filteredProducts = productsWithTotal.filter(
    (product) =>
      (product.Description.toLowerCase().includes(search.toLowerCase()) ||
        product.ItemNumber.toLowerCase().includes(search.toLowerCase())) &&
      (!metalFinishFilter || product.MetalFinish === metalFinishFilter) &&
      (!productTypeFilter || product.ProductType === productTypeFilter)
  );

  // Then sort the filtered products
  const {
    sortedItems: sortedProducts,
    sortBy,
    sortConfig,
  } = useSort(filteredProducts, {
    key: null,
    direction: null,
  });

  // Finally, paginate the sorted results
  const paginatedProducts = sortedProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const filters = (
    <>
      <SearchInput
        value={search}
        onChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        placeholder="Search by description or item number..."
      />
      <div className="flex flex-wrap gap-4">
        <FilterDropdown
          label="Metal Finish"
          value={metalFinishFilter}
          options={filterOptions.metalFinishes}
          onChange={(value) => {
            setMetalFinishFilter(value);
            setPage(1);
          }}
        />
        <FilterDropdown
          label="Product Type"
          value={productTypeFilter}
          options={filterOptions.productTypes}
          onChange={(value) => {
            setProductTypeFilter(value);
            setPage(1);
          }}
        />
      </div>
    </>
  );

  return (
    <TableLayout
      title="Products"
      description="Manage and view all products in the inventory"
      filters={filters}
    >
      <Table>
        <Thead>
          <tr>
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
                sortConfig.key === "Description" ? sortConfig.direction : null
              }
              onClick={() => sortBy("Description")}
            >
              Description
            </Th>
            <Th
              sortable
              sortDirection={
                sortConfig.key === "MetalFinish" ? sortConfig.direction : null
              }
              onClick={() => sortBy("MetalFinish")}
            >
              Metal Finish
            </Th>
            <Th
              sortable
              sortDirection={
                sortConfig.key === "ProductType" ? sortConfig.direction : null
              }
              onClick={() => sortBy("ProductType")}
            >
              Product Type
            </Th>
            <Th
              sortable
              sortDirection={
                sortConfig.key === "ListPrice" ? sortConfig.direction : null
              }
              onClick={() => sortBy("ListPrice")}
            >
              List Price
            </Th>
            <Th
              sortable
              sortDirection={
                sortConfig.key === "totalQuantity" ? sortConfig.direction : null
              }
              onClick={() => sortBy("totalQuantity")}
            >
              Total Quantity
            </Th>
          </tr>
        </Thead>
        <Tbody>
          {paginatedProducts.map((product) => (
            <Tr key={product.ItemNumber}>
              <Td>{product.ItemNumber}</Td>
              <Td>{product.Description}</Td>
              <Td>{product.MetalFinish}</Td>
              <Td>{product.ProductType}</Td>
              <Td>${product.ListPrice.toFixed(2)}</Td>
              <Td>{product.totalQuantity}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Pagination
        currentPage={page}
        totalItems={filteredProducts.length}
        pageSize={ITEMS_PER_PAGE}
        onPageChange={setPage}
      />
    </TableLayout>
  );
}
