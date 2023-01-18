import { notFound } from "next/navigation";
import getQuote from "../../../util/getQuote";

interface Params {
  slug: string;
}

const truncate = (str: string, length: number) => {
  if (str.length > length) {
    return `${str.slice(0, length - 1)}…`;
  }
  return str;
};

const getBaseUrl = () => {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export default async function Head({ params }: { params: Params }) {
  const { slug } = params;
  const quote = await getQuote(slug);
  if (!quote) return null;

  const title = truncate(quote.name, 40);
  const description = `“${truncate(quote.quote, 240)}”`;

  return (
    <>
      <title>
        {`“${truncate(quote.quote, 40)}” - ${truncate(quote.name, 40)}`}
      </title>

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="og:image" content={`/api/og/quote?slug=${quote.slug}`} />
      <meta name="og:image:alt" content={description} />
      <meta name="og:image:width" content="1200" />
      <meta name="og:image:height" content="600" />
      <meta name="og:site_name" content="Random Quote Machine" />
      <meta name="og:type" content="object" />
      <meta name="og:title" content={title} />
      <meta name="og:url" content={`${getBaseUrl()}/quotes/${quote.slug}`} />
      <meta name="og:description" content={description} />
    </>
  );
}
