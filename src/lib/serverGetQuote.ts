import { readdir, readFile } from "fs/promises";
import { join, resolve } from "path";
import { Quote } from "./getQuote";

const TMP_DATA_DIR = resolve("./data/tmp");

async function getRandomSlug(exclude?: string) {
  const names = await readdir(TMP_DATA_DIR);

  while (true) {
    const name = names[Math.floor(Math.random() * names.length)];
    const slug = name.slice(0, -".json".length);
    if (slug === exclude) continue;

    return slug;
  }
}

export default async function serverGetQuote(
  slug: "random",
  exclude?: string
): Promise<Quote>;

export default async function serverGetQuote(
  slug: string,
  exclude?: string
): Promise<Quote | undefined>;

export default async function serverGetQuote(
  slug: string,
  exclude?: string
): Promise<Quote | undefined> {
  const filePath = join(
    TMP_DATA_DIR,
    `${slug === "random" ? await getRandomSlug(exclude) : slug}.json`
  );

  const fileContents = await readFile(filePath)
    .then((file) => file.toString())
    .catch((err) => {
      if (err.code === "ENOENT") return undefined;
      throw err;
    });

  if (!fileContents) return undefined;
  return JSON.parse(fileContents);
}
