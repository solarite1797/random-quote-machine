import { NextRequest, NextResponse } from "next/server";
import { stringify } from "yaml";
import serverGetQuote from "~/lib/serverGetQuote";

type Params = {
  name: string;
};

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const { name } = params;

  const { searchParams } = new URL(req.url);
  const exclude = searchParams.get("exclude");

  const match = name.match(/^(.*)\.(\w+)$/);
  if (!match)
    return NextResponse.json({ message: "Not Found" }, { status: 404 });

  const slug = match[1];
  const extension = match[2];

  const isYaml = extension === "yaml" || extension === "yml";
  const isJson = extension === "json";
  if (!isYaml && !isJson)
    return NextResponse.json({ message: "Not Found" }, { status: 404 });

  const quote = await serverGetQuote(slug, exclude ?? undefined);
  if (!quote)
    return NextResponse.json({ message: "Not Found" }, { status: 404 });

  if (isJson) return NextResponse.json(quote);

  const yaml = stringify(quote);
  return new Response(yaml, {
    headers: { "Content-Type": "application/x-yaml" },
  });
}
