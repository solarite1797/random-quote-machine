import { notFound } from "next/navigation";
import serverGetQuote from "../../../util/serverGetQuote";
import Quote from "./Quote";

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
