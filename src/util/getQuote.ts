declare const EdgeRuntime: string;

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

export default async function getQuote(
  slug: "random",
  exclude?: string
): Promise<Quote>;

export default async function getQuote(
  slug: string,
  exclude?: string
): Promise<Quote | undefined>;

export default async function getQuote(
  slug: string,
  exclude?: string
): Promise<Quote | undefined> {
  if (typeof window === "undefined" && typeof EdgeRuntime !== "string") {
    const { default: serverGetQuote } = await import("./serverGetQuote");
    return serverGetQuote(slug, exclude);
  }

  const queryString = exclude ? `?exclude=${encodeURIComponent(exclude)}` : "";

  const res = await fetch(
    `${getBaseUrl()}/api/quotes/${slug}.json${queryString}`
  );
  if (!res.ok) {
    if (res.status === 404) return undefined;
    throw new Error(`Failed to get quote`);
  }

  return res.json() as Promise<Quote>;
}
