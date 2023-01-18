import type { NextApiRequest, NextApiResponse } from "next";
import { stringify } from "yaml";
import serverGetQuote from "../../../util/serverGetQuote";

const notFound = (res: NextApiResponse) => {
  return res.status(404).json({ message: "Not Found" });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, exclude } = req.query as { name: string; exclude?: string };
  const match = name.match(/^(.*)\.(\w+)$/);
  if (!match) return notFound(res);

  const slug = match[1];
  const extension = match[2];

  const isYaml = extension === "yaml" || extension === "yml";
  const isJson = extension === "json";
  if (!isYaml && !isJson) return notFound(res);

  const quote = await serverGetQuote(slug, exclude);
  if (!quote) return notFound(res);

  if (isJson) return res.json(quote);

  const yaml = stringify(quote);
  return res.setHeader("Content-Type", "application/x-yaml").end(yaml);
}
