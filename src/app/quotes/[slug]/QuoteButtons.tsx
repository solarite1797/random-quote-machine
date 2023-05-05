"use client";

import { Dialog } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import getQuote, { Quote } from "~/lib/getQuote";
import { ClipboardIcon, XMarkIcon } from "@heroicons/react/24/outline";

export interface Props {
  quote: Quote;
}

function ShareModal({
  open,
  onClose,
  quoteSlug,
}: {
  open: boolean;
  onClose: () => void;
  quoteSlug: string;
}) {
  const url = `https://givequote.vercel.app/quotes/${quoteSlug}`;

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full rounded-lg bg-white p-6 dark:bg-gray-800">
          <div className="flex items-center mb-4">
            <Dialog.Title className="font-semibold text-lg text-gray-800 dark:text-gray-300">
              Share
            </Dialog.Title>
            <button
              title="Close"
              className="ml-auto text-gray-600 dark:text-gray-400"
              onClick={onClose}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="w-full flex">
            <input
              aria-label="URL"
              className="rounded-l border-l border-y border-gray-400 dark:border-gray-700 dark:text-gray-300 w-full pl-3 py-2 bg-transparent overflow-ellipsis"
              readOnly
              value={url}
              title={url}
            />
            <button
              className="rounded-r p-2 text-white bg-sky-600 hover:bg-sky-700 transition"
              title="Copy"
              onClick={() => navigator.clipboard.writeText(url)}
            >
              <ClipboardIcon className="w-6 h-6" />
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default function QuoteButtons({ quote }: Props) {
  const router = useRouter();
  const [isBusy, setIsBusy] = useState(false);
  const randomQuoteRef = useRef<Promise<Quote>>();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const fetchRandomQuote = useCallback(() => {
    if (!randomQuoteRef.current) {
      const promise = getQuote("random", quote.slug);
      randomQuoteRef.current = promise;
      return promise;
    }

    return randomQuoteRef.current;
  }, [quote.slug]);

  const handleRandomQuoteClicked = () => {
    setIsBusy(true);
    fetchRandomQuote().then((quote) => {
      router.push(`/quotes/${quote.slug}`);
    });
  };

  useEffect(() => {
    fetchRandomQuote();
  }, [fetchRandomQuote]);

  return (
    <div className="flex items-center border-t border-gray-200 dark:border-gray-700 py-3 px-3">
      <ShareModal
        open={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        quoteSlug={quote.slug}
      />

      <button
        className="btn btn-gray"
        onClick={() => setIsShareModalOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M13 4.5a2.5 2.5 0 11.702 1.737L6.97 9.604a2.518 2.518 0 010 .792l6.733 3.367a2.5 2.5 0 11-.671 1.341l-6.733-3.367a2.5 2.5 0 110-3.475l6.733-3.366A2.52 2.52 0 0113 4.5z" />
        </svg>
        <span className="sr-only sm:not-sr-only !ml-2">Share</span>
      </button>

      <a className="btn btn-gray ml-2" href={quote.source}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M6.28 5.22a.75.75 0 010 1.06L2.56 10l3.72 3.72a.75.75 0 01-1.06 1.06L.97 10.53a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0zm7.44 0a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L17.44 10l-3.72-3.72a.75.75 0 010-1.06zM11.377 2.011a.75.75 0 01.612.867l-2.5 14.5a.75.75 0 01-1.478-.255l2.5-14.5a.75.75 0 01.866-.612z"
            clipRule="evenodd"
          />
        </svg>
        <span className="sr-only sm:not-sr-only !ml-2">Source</span>
      </a>

      <button
        className="ml-auto btn btn-primary"
        onClick={handleRandomQuoteClicked}
        disabled={isBusy}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path
            fillRule="evenodd"
            d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
            clipRule="evenodd"
          />
        </svg>
        <span className="sr-only sm:not-sr-only !ml-2">Random Quote</span>
      </button>
    </div>
  );
}
