import QuoteButtons from "../../../components/QuoteButtons";
import getQuote from "../../../util/getQuote";

interface Params {
  slug: string;
}

export default async function QuotePage({ params }: { params: Params }) {
  const { slug } = params;

  const quote = await getQuote(slug);

  return (
    <main className="pt-16 flex items-center justify-center px-4 min-h-screen">
      <div className="w-full bg-white shadow-2xl dark:shadow-none dark:bg-gray-800 rounded-2xl overflow-hidden max-w-2xl">
        <figure className="px-6 py-8 sm:px-8 sm:py-10">
          <blockquote className="text-center text-2xl mb-3 text-gray-800 dark:text-gray-100">
            <p>&ldquo;{quote.quote}&rdquo;</p>
          </blockquote>
          <figcaption className="text-center text-lg text-gray-700  dark:text-gray-300">
            — {quote.name}
          </figcaption>
        </figure>

        <QuoteButtons quote={quote} />
      </div>
    </main>
  );
}
