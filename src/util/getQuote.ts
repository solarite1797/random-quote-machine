const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export interface Quote {
  source: string;
  slug: string;
  name: string;
  quote: string;
}

export default async function getQuote(slug: string, query?: string) {
  const res = await fetch(
    `${getBaseUrl()}/api/quotes/${slug}.json${query ?? ""}`
  );
  return res.json() as Promise<Quote>;
}
