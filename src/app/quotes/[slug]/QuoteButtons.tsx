"use client";

import { Dialog } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import getQuote, { Quote } from "~/lib/getQuote";
import { ClipboardIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {
  ShareIcon,
  CodeBracketIcon,
  ArrowPathIcon,
} from "@heroicons/react/20/solid";

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
        <ShareIcon className="w-5 h-5" />{" "}
        <span className="sr-only sm:not-sr-only !ml-2">Share</span>
      </button>

      <a className="btn btn-gray ml-2" href={quote.source}>
        <CodeBracketIcon className="w-5 h-5" />{" "}
        <span className="sr-only sm:not-sr-only !ml-2">Source</span>
      </a>

      <button
        className="ml-auto btn btn-primary"
        onClick={handleRandomQuoteClicked}
        disabled={isBusy}
      >
        <ArrowPathIcon className="w-5 h-5" />{" "}
        <span className="sr-only sm:not-sr-only !ml-2">Random Quote</span>
      </button>
    </div>
  );
}
