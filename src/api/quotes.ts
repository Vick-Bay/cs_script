import type { Quote, QuotesResponse } from "../types/quote";

// Cache key for quotes
export const QUOTES_CACHE_KEY = ["quotes"] as const;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getQuotes(): Promise<Quote[]> {
  const response = await fetch(
    "https://prod-19.centralus.logic.azure.com/workflows/0e4953b745d04b13973d5d6652dc99d7/triggers/manual/paths/invoke/CustomerQuotes?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=mUwBbcwCRWjaYCvpfr5uydn47aoRQxAAcZmim1oNmZU"
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data: QuotesResponse = await response.json();
  return data.CustomerQuotes || [];
}

export async function getQuoteById(
  quoteId: string
): Promise<Quote | undefined> {
  const quotes = await getQuotes();
  return quotes.find((q: Quote) => q.Id === quoteId);
}

export async function getQuotesByCustomerId(
  customerId: string
): Promise<Quote[]> {
  const quotes = await getQuotes();
  return quotes.filter((q: Quote) => q.Customer === customerId);
}

export async function getQuoteStats() {
  const quotes = await getQuotes();

  const activeQuotes = quotes.filter(
    (q: Quote) => !q.ExpirationDate || new Date(q.ExpirationDate) > new Date()
  );

  return {
    totalQuotes: quotes.length,
    activeQuotes: activeQuotes.length,
    totalValue: activeQuotes.reduce(
      (sum: number, q: Quote) => sum + q.ItemPrice,
      0
    ),
    customers: [...new Set(quotes.map((q: Quote) => q.Customer))],
  };
}

// Helper function to get quotes summary by customer
export function summarizeQuotesByCustomer(quotes: Quote[]) {
  return quotes.reduce(
    (acc, quote) => {
      if (!acc[quote.Customer]) {
        acc[quote.Customer] = {
          customer: quote.Customer,
          d365Customer: quote.CustomerId,
          itemCount: 0,
          totalValue: 0,
        };
      }
      acc[quote.Customer].itemCount++;
      acc[quote.Customer].totalValue += quote.ItemPrice;
      return acc;
    },
    {} as Record<
      string,
      {
        customer: string;
        d365Customer: string;
        itemCount: number;
        totalValue: number;
      }
    >
  );
}

// Helper function to get total quotes value
export function calculateTotalQuotesValue(quotes: Quote[]): number {
  return quotes.reduce((sum, quote) => sum + quote.ItemPrice, 0);
}
