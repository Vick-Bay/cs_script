import type { Quote, QuotesResponse } from "../types/quote";

// Cache key for quotes
export const QUOTES_CACHE_KEY = ["quotes"] as const;

export async function getQuotes(apiKey: string): Promise<Quote[]> {
  const response = await fetch(
    `https://prod-19.centralus.logic.azure.com/workflows/0e4953b745d04b13973d5d6652dc99d7/triggers/manual/paths/invoke/CustomerQuotes?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=${apiKey}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: QuotesResponse = await response.json();
  return data.CustomerQuotes || [];
}

export async function getQuoteById(
  apiKey: string,
  quoteId: string
): Promise<Quote | undefined> {
  const quotes = await getQuotes(apiKey);
  return quotes.find((q) => q.QuoteId === quoteId);
}

export async function getQuotesByCustomerId(
  apiKey: string,
  customerId: string
): Promise<Quote[]> {
  const quotes = await getQuotes(apiKey);
  return quotes.filter((q) => q.Customer === customerId);
}

export async function getQuoteStats(apiKey: string) {
  const quotes = await getQuotes(apiKey);

  const activeQuotes = quotes.filter(
    (q) => !q.ExpirationDate || new Date(q.ExpirationDate) > new Date()
  );

  return {
    totalQuotes: quotes.length,
    activeQuotes: activeQuotes.length,
    totalValue: activeQuotes.reduce((sum, q) => sum + q.ItemPrice, 0),
    customers: [...new Set(quotes.map((q) => q.Customer))],
  };
}

// Helper function to get quotes summary by customer
export function summarizeQuotesByCustomer(quotes: Quote[]) {
  return quotes.reduce(
    (acc, quote) => {
      if (!acc[quote.Customer]) {
        acc[quote.Customer] = {
          customer: quote.Customer,
          d365Customer: quote.Customer,
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
