import { notFound } from "next/navigation";
import serverGetQuote from "~/lib/serverGetQuote";
import Quote from "./Quote";
import { Metadata } from "next";

const truncate = (str: string, length: number) => {
  if (str.length > length) {
    return `${str.slice(0, length - 1)}…`;
  }
  return str;
};

interface Params {
  slug: string;
}

export default async function QuotePage({ params }: { params: Params }) {
  const { slug } = params;

  const quote = await serverGetQuote(slug);
  if (!quote) notFound();

  return (
    <main className="pt-16 flex items-center justify-center px-4 min-h-screen">
      <Quote quote={quote} />
    </main>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = params;

  const quote = await serverGetQuote(slug);
  if (!quote) notFound();

  const title = truncate(quote.name, 40);
  const description = `“${truncate(quote.quote, 240)}”`;

  return {
    title: `“${truncate(quote.quote, 40)}” - ${truncate(quote.name, 40)}`,
    description,

    openGraph: {
      title,
      description,
      url: `https://givequote.vercel.app/quotes/${quote.slug}`,
      siteName: "Random Quote Machine",
      locale: "en-US",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
