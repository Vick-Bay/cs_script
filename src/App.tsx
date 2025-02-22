import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Login } from "./pages/Login";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Products } from "./pages/Products";
import { Customers } from "./pages/Customers";
import { Quotes } from "./pages/Quotes";
import { Inventory } from "./pages/Inventory";
import { Reports } from "./pages/Reports";
import { DataLoader } from "./components/DataLoader";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      networkMode: "offlineFirst",
    },
  },
});

// Create a root component that includes both providers
function Root() {
  return (
    <AuthProvider>
      <DataLoader>
        <Outlet />
      </DataLoader>
    </AuthProvider>
  );
}

const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Login />,
        index: true,
      },
      {
        element: (
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/customers",
            element: <Customers />,
          },
          {
            path: "/products",
            element: <Products />,
          },
          {
            path: "/quotes",
            element: <Quotes />,
          },
          {
            path: "/inventory",
            element: <Inventory />,
          },
          {
            path: "/reports",
            element: <Reports />,
          },
        ],
      },
    ],
  },
]);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
