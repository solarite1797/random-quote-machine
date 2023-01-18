import { readdir, readFile } from "fs/promises";
import type { NextApiRequest, NextApiResponse } from "next";
import { resolve } from "path";
import { stringify } from "yaml";

const dataTempPath = resolve("./data/tmp");

const notFound = (res: NextApiResponse) => {
  return res.status(404).json({ message: "Not Found" });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query as { slug: string };
  const match = slug.match(/^(.*)\.(\w+)$/);
  if (!match) return notFound(res);

  const name = match[1];
  const extension = match[2];

  const isYaml = extension === "yaml" || extension === "yml";
  const isJson = extension === "json";
  if (!isYaml && !isJson) return notFound(res);

  let filePath: string;
  if (name === "random") {
    const excludeSlug = req.query.exclude;
    const paths = await readdir(dataTempPath);
    let randomPath;
    while (!randomPath) {
      const path = paths[Math.floor(Math.random() * paths.length)];
      const match = path.match(/^(.*)\.(\w+)$/);
      if (!match) continue;
      if (match[1] === excludeSlug) continue;
      randomPath = path;
    }
    filePath = resolve(dataTempPath, randomPath);
  } else {
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=300"
    );

    filePath = resolve(dataTempPath, `${name}.json`);
  }

  const fileContents = await readFile(filePath)
    .then((file) => file.toString())
    .catch((err) => {
      if (err.code === "ENOENT") return undefined;
      throw err;
    });

  if (!fileContents) return notFound(res);

  if (isJson)
    return res.setHeader("Content-Type", "application/json").end(fileContents);

  const parsedData = JSON.parse(fileContents);
  const yaml = stringify(parsedData);
  return res.setHeader("Content-Type", "application/x-yaml").end(yaml);
}
