import { useQuery } from "@tanstack/react-query";
import { getQuotes } from "../api/quotes";
import type { Quote } from "../types/quote";

export function useQuotes() {
  return useQuery<Quote[]>({
    queryKey: ["quotes"],
    queryFn: getQuotes,
  });
}
