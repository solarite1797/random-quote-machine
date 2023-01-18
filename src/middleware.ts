import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import getQuote from "./util/getQuote";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const quote = await getQuote("random");
  const res = NextResponse.redirect(
    new URL(`/quotes/${quote.slug}`, request.url)
  );
  res.headers.set("Cache-Control", "no-store");

  return res;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/",
};
