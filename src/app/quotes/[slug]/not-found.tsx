import Quote from "./Quote";

export default function NotFound() {
  return (
    <main className="pt-16 flex items-center justify-center px-4 min-h-screen">
      <Quote
        quote={{
          name: "Random Quote Machine",
          quote: "The quote you were looking for doesn't exist.",
          slug: "not-found",
          source:
            "https://github.com/lukadev-0/random-quote-machine/blob/main/src/app/quotes/[slug]/not-found.tsx",
        }}
      />
    </main>
  );
}
