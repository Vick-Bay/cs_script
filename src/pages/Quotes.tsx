import { QuoteList } from "../components/QuoteList";
import { useQuotes } from "../hooks/useQuotes";
import { TableSkeleton } from "../components/ui/TableSkeleton";

export function Quotes() {
  const { data, isLoading, error } = useQuotes();

  if (isLoading) {
    return <TableSkeleton loadingText="Loading quotes..." />;
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error loading quotes:{" "}
        {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  return <QuoteList quotes={data} />;
}
