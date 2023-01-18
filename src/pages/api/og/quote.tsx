import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import getQuote from "../../../util/getQuote";

export const config = {
  runtime: "edge",
};

const fontRegular = fetch(
  new URL("../../../../fonts/Inter-Regular.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

const fontMedium = fetch(
  new URL("../../../../fonts/Inter-Medium.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

export default async function OG(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) return new Response("No slug", { status: 400 });

  const quote = await getQuote(slug);
  if (!quote) return new Response("Not found", { status: 404 });

  return new ImageResponse(
    (
      <div
        tw="w-full h-full bg-zinc-900 text-white flex flex-col items-center text-center p-16"
        style={{ fontFamily: "'Inter'" }}
      >
        <div tw="flex items-center text-3xl text-zinc-300 font-medium">
          <svg
            viewBox="0 0 41 41"
            aria-hidden="true"
            fill="#0094FF"
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
          >
            <path d="M0.725479 20.1943V16.2881C0.725479 15.1017 0.935447 13.8431 1.35538 12.512C1.7898 11.1666 2.41247 9.87171 3.22338 8.6275C4.04877 7.36881 5.04069 6.27651 6.19913 5.35059L8.9794 7.60753C8.06713 8.90961 7.2707 10.2696 6.59011 11.6874C5.924 13.0907 5.59095 14.5954 5.59095 16.2013V20.1943H0.725479ZM11.8466 20.1943V16.2881C11.8466 15.1017 12.0565 13.8431 12.4765 12.512C12.9109 11.1666 13.5335 9.87171 14.3445 8.6275C15.1698 7.36881 16.1618 6.27651 17.3202 5.35059L20.1005 7.60753C19.1882 8.90961 18.3918 10.2696 17.7112 11.6874C17.0451 13.0907 16.712 14.5954 16.712 16.2013V20.1943H11.8466Z" />
            <path d="M40.7255 20.1943V24.1006C40.7255 25.2869 40.5155 26.5456 40.0956 27.8766C39.6612 29.2221 39.0385 30.5169 38.2276 31.7611C37.4022 33.0198 36.4103 34.1121 35.2518 35.0381L32.4716 32.7811C33.3838 31.479 34.1803 30.1191 34.8608 28.7013C35.527 27.2979 35.86 25.7933 35.86 24.1874V20.1943H40.7255ZM29.6044 20.1943V24.1006C29.6044 25.2869 29.3944 26.5456 28.9745 27.8766C28.5401 29.2221 27.9174 30.5169 27.1065 31.7611C26.2811 33.0198 25.2892 34.1121 24.1307 35.0381L21.3505 32.7811C22.2628 31.479 23.0592 30.1191 23.7398 28.7013C24.4059 27.2979 24.7389 25.7933 24.7389 24.1874V20.1943H29.6044Z" />
          </svg>
          <span tw="ml-4">Random Quote Machine</span>
        </div>

        <div tw="flex flex-col items-center my-auto">
          <div tw="flex text-5xl max-w-4xl text-zinc-200 mb-3">
            &ldquo;{quote.quote}&rdquo;
          </div>
          <div tw="flex text-3xl text-zinc-400">— {quote.name}</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 600,
      fonts: [
        {
          name: "Inter",
          data: await fontRegular,
          style: "normal",
        },
        {
          name: "Inter",
          data: await fontMedium,
          style: "normal",
          weight: 500,
        },
      ],
    }
  );
}
