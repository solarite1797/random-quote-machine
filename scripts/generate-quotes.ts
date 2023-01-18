import { readFileSync } from "fs";
import { resolve } from "path";
import { parseDocument, YAMLMap, YAMLSeq } from "yaml";
import slugify from "slugify";
import { createHash } from "crypto";
import { writeFile } from "fs/promises";
import { ensureDirSync } from "fs-extra";
import { z } from "zod";
import lineColumn from "line-column";
import { fromZodError } from "zod-validation-error";

const QUOTES_YAML_GITHUB_URL =
  "https://github.com/lukadev-0/random-quote-machine/blob/main/data/quotes.yaml";

const schema = z.object({
  name: z.string(),
  quote: z.string(),
});

const dataPath = resolve("./data");
const quotesYamlPath = resolve(dataPath, "quotes.yaml");

console.log(`Reading quotes from ${quotesYamlPath}`);
const quotesYamlFile = readFileSync(quotesYamlPath).toString();
const quotesYaml = parseDocument(quotesYamlFile);

const lineColumnFinder = lineColumn(quotesYamlFile);

ensureDirSync(resolve(dataPath, "tmp"));

const yamlContents = quotesYaml.contents;
if (!(yamlContents instanceof YAMLSeq))
  throw new SyntaxError("Invalid quotes.yaml: root is not a YAMLSeq");

const nodeLineColumn = (node: { range?: [number, number, number] }) => {
  if (!node.range) return "?:?";
  const lineColumn = lineColumnFinder.fromIndex(node.range[0]);
  if (!lineColumn) return "?:?";
  return `${lineColumn.line}:${lineColumn.col}`;
};

const promises = yamlContents.items.map(async (map) => {
  if (!(map instanceof YAMLMap))
    throw new SyntaxError(
      `Invalid quotes.yaml at ${nodeLineColumn(map)}: not a YAMLMap`
    );

  const parseResult = schema.safeParse({
    name: map.get("name"),
    quote: map.get("quote"),
  });

  if (!parseResult.success)
    throw new SyntaxError(
      `Invalid quotes.yaml at ${nodeLineColumn(map)}: ${
        fromZodError(parseResult.error).message
      }`
    );

  const { data: quote } = parseResult;

  const hash = createHash("md5");
  hash.update(`${quote.name}-${quote.quote}`);
  const digest = hash.digest("hex").slice(0, 8);

  const slug = slugify(quote.quote, {
    trim: false,
    replacement: " ",
    remove: /[^\w ]/g,
    lower: true,
  })
    .slice(0, 120)
    .trim()
    .replace(/ /g, "-");

  const fullSlug = `${digest}-${slug}`;
  const filePath = `tmp/${fullSlug}.json`;

  const line = map.range && lineColumnFinder.fromIndex(map.range[0])?.line;
  const source = `${QUOTES_YAML_GITHUB_URL}${line ? `#L${line}` : ""}`;

  const json = JSON.stringify({
    source,
    slug: fullSlug,
    name: quote.name,
    quote: quote.quote,
  });

  console.log(`Writing ${filePath}`);
  await writeFile(resolve(dataPath, filePath), json);
});

Promise.all(promises)
  .then(() => console.log("Successfuly generated quotes"))
  .catch((err) => {
    console.error(`Failed to generate qoutes: ${err}`);
  });

export {};
