import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Navbar } from "./components/layout/Navbar";
import { Customers } from "./pages/Customers";
import { Products } from "./pages/Products";
import { Quotes } from "./pages/Quotes";
import { Layout } from "./components/layout/Layout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <div className="min-h-screen">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Customers />} />
                <Route path="/products" element={<Products />} />
                <Route path="/quotes" element={<Quotes />} />
              </Routes>
            </main>
          </div>
        </Layout>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
