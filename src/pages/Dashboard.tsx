import { useProducts } from "../hooks/useProducts";
import { useCustomers } from "../hooks/useCustomers";
import { useQuotes } from "../hooks/useQuotes";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useState } from "react";
import {
  calculateTotalQuotesValue,
  summarizeQuotesByCustomer,
} from "../api/quotes";
import { Customer } from "../types/customer";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
];

type TabType = "overview" | "products" | "customers" | "quotes";

export function Dashboard() {
  const { data: products = [] } = useProducts();
  const { data: customers = [] } = useCustomers();
  const { data: quotes = [] } = useQuotes();
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Ensure we have arrays before processing
  const customersArray = Array.isArray(customers) ? customers : [];
  const productsArray = Array.isArray(products) ? products : [];
  const quotesArray = Array.isArray(quotes) ? quotes : [];

  // Add null checks and default values
  const totalProducts = productsArray.length;
  const totalValue = productsArray.reduce((sum, p) => sum + p.ListPrice, 0);

  // Customer Analytics with null checks
  const customerStats = {
    totalCustomers: customersArray.length,
    activeCustomers: customersArray.filter((c) => c.IsActive).length,
    branchDistribution: customersArray.reduce((acc, customer) => {
      if (customer.DefaultBranch) {
        acc[customer.DefaultBranch] = (acc[customer.DefaultBranch] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>),
    priceMultiplierRanges: customersArray.reduce((acc, customer) => {
      const range = Math.floor((customer.PriceMultiplier * 100) / 10) * 10;
      const key = `${range}%`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  // Product categories with null checks
  const productCategories = productsArray.reduce((acc, product) => {
    const category = product.Description.split(" ")[0];
    if (!acc[category]) {
      acc[category] = {
        name: category,
        value: 0,
        totalProducts: 0,
        totalQuantity: 0,
      };
    }
    acc[category].value += product.ListPrice;
    acc[category].totalProducts++;
    acc[category].totalQuantity += product.Branches.reduce(
      (sum, b) => sum + b.Quantity,
      0
    );
    return acc;
  }, {} as Record<string, { name: string; value: number; totalProducts: number; totalQuantity: number }>);

  const topCategories = Object.values(productCategories)
    .sort((a, b) => b.value - a.value)
    .slice(0, 7);

  const tabContent = {
    overview: (
      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm">Total Customers</h3>
            <p className="text-3xl font-semibold">
              {customerStats.totalCustomers.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm">Active Customers</h3>
            <p className="text-3xl font-semibold">
              {customerStats.activeCustomers.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm">Total Products</h3>
            <p className="text-3xl font-semibold">
              {totalProducts.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm">States Covered</h3>
            <p className="text-3xl font-semibold">
              {Object.keys(customerStats.branchDistribution).length}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Distribution by State */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm mb-4">
              Customer Distribution by State
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.entries(
                    customersArray.reduce((acc, customer) => {
                      const state = customer.ShippingState || "Unknown";
                      acc[state] = (acc[state] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  )
                    .map(([state, count]) => ({
                      state,
                      count,
                    }))
                    .sort((a, b) => b.count - a.count)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="state"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" name="Customers" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Price Multiplier Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm mb-4">
              Price Multiplier Distribution
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(customerStats.priceMultiplierRanges)
                      .map(([range, count]) => ({
                        name: range,
                        value: count,
                      }))
                      .sort((a, b) => b.value - a.value)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {Object.entries(customerStats.priceMultiplierRanges).map(
                      ([range, count], index) => (
                        <Cell
                          key={`cell-${range}-${count}-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Customer Table */}
          <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2">
            <h3 className="text-gray-500 text-sm mb-4">Recent Customers</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Name</th>
                    <th className="text-left py-2">Location</th>
                    <th className="text-right py-2">Price Multiplier</th>
                    <th className="text-right py-2">Branch</th>
                  </tr>
                </thead>
                <tbody>
                  {customersArray?.slice(0, 10).map((customer, index) => (
                    <tr
                      key={`customer-${customer.CustomerId}-${index}`}
                      className="border-b"
                    >
                      <td className="py-2">{customer.BillingName}</td>
                      <td className="py-2">
                        {customer.DefaultBranch || "N/A"}
                      </td>
                      <td className="text-right">
                        {(customer.PriceMultiplier * 100).toFixed(0)}%
                      </td>
                      <td className="text-right">{customer.DefaultBranch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    ),
    products: (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm">Total Products</h3>
            <p className="text-3xl font-semibold">
              {totalProducts.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm">Total Inventory Value</h3>
            <p className="text-3xl font-semibold">
              ${totalValue.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm">Total Quantity</h3>
            <p className="text-3xl font-semibold">
              {(
                productsArray?.reduce(
                  (sum, product) =>
                    sum +
                    product.Branches.reduce((sum, b) => sum + b.Quantity, 0),
                  0
                ) || 0
              ).toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm">Avg Product Value</h3>
            <p className="text-3xl font-semibold">
              ${(totalValue / totalProducts || 0).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm mb-4">
              Top Products by Value
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={productsArray
                    ?.sort((a, b) => b.ListPrice - a.ListPrice)
                    .slice(0, 10)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="Description"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => `$${Number(value).toLocaleString()}`}
                  />
                  <Bar dataKey="ListPrice" fill="#8884d8" name="Total Value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Product Categories Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm mb-4">
              Product Categories Distribution
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {topCategories.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `$${Number(value).toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products Table */}
          <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2">
            <h3 className="text-gray-500 text-sm mb-4">Top Products Details</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left py-3 px-4 bg-gray-50 font-medium text-gray-700 border-b">
                      Description
                    </th>
                    <th className="text-right py-3 px-4 bg-gray-50 font-medium text-gray-700 border-b">
                      Unit Price
                    </th>
                    <th className="text-right py-3 px-4 bg-gray-50 font-medium text-gray-700 border-b">
                      Total Quantity
                    </th>
                    <th className="text-right py-3 px-4 bg-gray-50 font-medium text-gray-700 border-b">
                      Total Value
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {productsArray
                    ?.sort((a, b) => b.ListPrice - a.ListPrice)
                    .slice(0, 10)
                    .map((product, index) => {
                      const totalQuantity = product.Branches.reduce(
                        (sum, b) => sum + b.Quantity,
                        0
                      );
                      return (
                        <tr
                          key={`product-${product.ItemNumber}-${index}`}
                          className="transition-colors duration-150 hover:bg-blue-50/80 hover:shadow-sm cursor-pointer group"
                        >
                          <td className="py-3 px-4 group-hover:text-blue-700">
                            {product.Description}
                          </td>
                          <td className="text-right py-3 px-4 text-gray-600">
                            ${product.ListPrice.toLocaleString()}
                          </td>
                          <td className="text-right py-3 px-4 text-gray-600">
                            {totalQuantity.toLocaleString()}
                          </td>
                          <td className="text-right py-3 px-4 font-medium text-gray-700">
                            $
                            {(
                              product.ListPrice * totalQuantity
                            ).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    ),
    customers: (
      <div className="space-y-6">
        {/* Customer Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm">Total Customers</h3>
            <p className="text-3xl font-semibold">
              {customerStats.totalCustomers.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm">Active Customers</h3>
            <p className="text-3xl font-semibold">
              {customerStats.activeCustomers.toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm">Avg Price Multiplier</h3>
            <p className="text-3xl font-semibold">
              {(
                ((customersArray?.reduce(
                  (sum, c) => sum + c.PriceMultiplier,
                  0
                ) || 0) /
                  (customersArray?.length || 1)) *
                100
              ).toFixed(1)}
              %
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm">States Covered</h3>
            <p className="text-3xl font-semibold">
              {
                new Set(
                  customersArray?.map((c) => c.ShippingState).filter(Boolean)
                ).size
              }
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Distribution by Branch */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm mb-4">Customers by Branch</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.entries(customerStats.branchDistribution)
                    .map(([branch, count]) => ({
                      branch,
                      count,
                    }))
                    .sort((a, b) => b.count - a.count)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="branch"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" name="Customers" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Geographic Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm mb-4">
              Geographic Distribution
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Object.entries(
                      customersArray?.reduce((acc, customer) => {
                        if (customer.ShippingState) {
                          acc[customer.ShippingState] =
                            (acc[customer.ShippingState] || 0) + 1;
                        }
                        return acc;
                      }, {} as Record<string, number>) || {}
                    )
                      .map(([state, count]) => ({
                        name: state || "Unknown",
                        value: count,
                      }))
                      .sort((a, b) => b.value - a.value)
                      .slice(0, 10)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {Array(10)
                      .fill(0)
                      .map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Price Multiplier Distribution */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm mb-4">
              Price Multiplier Ranges
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.entries(customerStats.priceMultiplierRanges)
                    .map(([range, count]) => ({
                      range,
                      count,
                    }))
                    .sort(
                      (a, b) =>
                        Number(a.range.replace("%", "")) -
                        Number(b.range.replace("%", ""))
                    )}
                  margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#82ca9d" name="Customers" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Customer Table */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm mb-4">Customer Details</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Customer Name</th>
                    <th className="text-left py-2">Location</th>
                    <th className="text-right py-2">Price Multiplier</th>
                    <th className="text-right py-2">Branch</th>
                    <th className="text-right py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customersArray
                    .sort((a, b) => b.PriceMultiplier - a.PriceMultiplier)
                    .slice(0, 10)
                    .map((customer, index) => (
                      <tr
                        key={`customer-${customer.CustomerId}-${index}`}
                        className="border-b"
                      >
                        <td className="py-2">{customer.BillingName}</td>
                        <td className="py-2">
                          {customer.DefaultBranch || "N/A"}
                        </td>
                        <td className="text-right">
                          {(customer.PriceMultiplier * 100).toFixed(0)}%
                        </td>
                        <td className="text-right">{customer.DefaultBranch}</td>
                        <td className="text-right">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              customer.IsActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {customer.IsActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    ),
    quotes: (
      <div className="space-y-6">
        {/* Quote Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm">Total Quote Items</h3>
            <p className="text-3xl font-semibold">
              {quotesArray?.length.toLocaleString() || "0"}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm">Total Value</h3>
            <p className="text-3xl font-semibold">
              ${calculateTotalQuotesValue(quotesArray || []).toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm">Unique Customers</h3>
            <p className="text-3xl font-semibold">
              {new Set(quotesArray?.map((q) => q.Customer)).size}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm">Avg Item Price</h3>
            <p className="text-3xl font-semibold">
              $
              {(
                calculateTotalQuotesValue(quotesArray || []) /
                (quotesArray?.length || 1)
              ).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Quote Values */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm mb-4">
              Top Customers by Quote Value
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.values(summarizeQuotesByCustomer(quotesArray))
                    .sort((a, b) => b.totalValue - a.totalValue)
                    .slice(0, 10)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="customer"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => `$${Number(value).toLocaleString()}`}
                  />
                  <Bar dataKey="totalValue" fill="#82ca9d" name="Quote Value" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Items per Customer */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-gray-500 text-sm mb-4">Items per Customer</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.values(summarizeQuotesByCustomer(quotesArray))
                    .sort((a, b) => b.itemCount - a.itemCount)
                    .slice(0, 10)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="customer"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    interval={0}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="itemCount"
                    fill="#8884d8"
                    name="Number of Items"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Quotes Table */}
          <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2">
            <h3 className="text-gray-500 text-sm mb-4">Recent Quote Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Customer</th>
                    <th className="text-left py-2">Item Number</th>
                    <th className="text-right py-2">Price</th>
                    <th className="text-right py-2">Expiration</th>
                    <th className="text-right py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {quotesArray?.slice(0, 10).map((quote, index) => (
                    <tr
                      key={`quote-${quote.Customer}-${quote.ItemNumber}-${index}`}
                      className="border-b"
                    >
                      <td className="py-2">{quote.Customer}</td>
                      <td className="py-2">{quote.ItemNumber}</td>
                      <td className="text-right">
                        ${quote.ItemPrice.toLocaleString()}
                      </td>
                      <td className="text-right">
                        {quote.ExpirationDate || "N/A"}
                      </td>
                      <td className="text-right">{quote.Status || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex space-x-4">
          {(["overview", "products", "customers", "quotes"] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg ${
                  activeTab === tab
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            )
          )}
        </div>
      </div>

      {tabContent[activeTab]}
    </div>
  );
}
