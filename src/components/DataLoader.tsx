import { useQueries } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { getProducts, PRODUCTS_CACHE_KEY } from "../api/products";
import { getQuotes, QUOTES_CACHE_KEY } from "../api/quotes";
import { getCustomers, CUSTOMERS_CACHE_KEY } from "../api/customers";

type LoaderProps = {
  children: React.ReactNode;
};

export function DataLoader({ children }: LoaderProps) {
  const { auth } = useAuth();

  const results = useQueries({
    queries: [
      {
        queryKey: PRODUCTS_CACHE_KEY,
        queryFn: () => {
          if (!auth.apiKey) throw new Error("No API key");
          return getProducts(auth.apiKey);
        },
        enabled: !!auth.apiKey,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
      },
      {
        queryKey: QUOTES_CACHE_KEY,
        queryFn: () => getQuotes(auth.apiKey as string),
        enabled: !!auth.apiKey,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
      },
      {
        queryKey: CUSTOMERS_CACHE_KEY,
        queryFn: () => getCustomers(auth.apiKey as string),
        enabled: !!auth.apiKey,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: 2,
      },
    ],
  });

  const isLoading = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);
  const errors = results.map((result) => result.error).filter(Boolean);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Loading Data
          </h2>
          <p className="text-gray-500">
            Please wait while we fetch your dashboard data...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <div className="text-center max-w-lg mx-auto p-6">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Error Loading Data
          </h2>
          <div className="text-red-500 text-sm">
            {errors.map((error, index) => (
              <p key={index}>
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
