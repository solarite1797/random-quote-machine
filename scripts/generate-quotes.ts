import { join, resolve } from "path";
import { Document, parseDocument, YAMLMap, YAMLSeq } from "yaml";
import slugify from "slugify";
import { BinaryLike, BinaryToTextEncoding, createHash } from "crypto";
import { mkdir, readFile, rm, writeFile } from "fs/promises";
import { z } from "zod";
import lineColumn from "line-column";
import { fromZodError } from "zod-validation-error";
import chalk from "chalk";
import ms from "ms";

const QUOTES_FILE_GITHUB_URL =
  "https://github.com/lukadev-0/random-quote-machine/blob/main/data/quotes.yaml";
const DATA_DIR = resolve("./data");
const TMP_DATA_DIR = join(DATA_DIR, "tmp");
const QUOTES_FILE = join(DATA_DIR, "quotes.yaml");
const TRUNCATE_REGEX = /^(.{40}[^\s]*).*/;

const quoteSchema = z.object({
  name: z.string(),
  quote: z.string(),
});

type Quote = z.infer<typeof quoteSchema>;
type LineColumnFinder = ReturnType<typeof lineColumn>;

async function generateQuotes() {
  const startTime = Date.now();

  await rm(TMP_DATA_DIR, { recursive: true });
  await mkdir(TMP_DATA_DIR, { recursive: true });

  const { lineColumnFinder, yamlDocument } = await readQuotes();
  const result = parseQuotes(lineColumnFinder, yamlDocument);

  if (!result.success) {
    console.error(chalk.gray("Validation for quotes.yaml failed with error:"));
    console.error(`  ${result.error}\n`);
    console.error(chalk.red("Failed to generate quotes: Error in quotes.yaml"));

    process.exit(1);
  }

  for (const quote of result.quotes) {
    const slug = getQuoteSlug(quote);
    const fileName = `${slug}.json`;
    const filePath = join(TMP_DATA_DIR, fileName);

    const json = JSON.stringify({
      source: result.quoteSourceURLs.get(quote) ?? QUOTES_FILE_GITHUB_URL,
      slug,
      ...quote,
    });

    await writeFile(filePath, json);
    console.log(`${chalk.gray("Wrote")} ${fileName}`);
  }

  const timeElapsed = Date.now() - startTime;

  console.log("");
  console.log(`Successfully wrote ${chalk.green(result.quotes.length)} quotes`);
  console.log(`Done in ${ms(timeElapsed)}`);
}

async function readQuotes(): Promise<{
  lineColumnFinder: LineColumnFinder;
  yamlDocument: Document;
}> {
  const quotesYamlFile = (await readFile(QUOTES_FILE)).toString();
  const lineColumnFinder = lineColumn(quotesYamlFile);
  const yamlDocument = parseDocument(quotesYamlFile);

  return { lineColumnFinder, yamlDocument };
}

function parseQuotes(
  lineColumnFinder: LineColumnFinder,
  yamlDocument: Document
):
  | { success: true; quotes: Quote[]; quoteSourceURLs: Map<Quote, string> }
  | { success: false; error: string } {
  if (!(yamlDocument.contents instanceof YAMLSeq)) {
    return {
      success: false,
      error: `Root should be a YAMLSeq, found ${getType(
        yamlDocument.contents
      )}`,
    };
  }

  let quotes: Quote[] = [];
  const quoteSourceURLs = new Map<Quote, string>();

  for (const item of yamlDocument.contents.items) {
    if (!(item instanceof YAMLMap)) {
      return {
        success: false,
        error: `${getLineColumnStringFromNode(
          lineColumnFinder,
          item
        )}: Expected YAMLMap, found ${getType(item)}`,
      };
    }

    const result = quoteSchema.safeParse({
      name: item.get("name"),
      quote: item.get("quote"),
    });

    if (!result.success)
      return {
        success: false,
        error: fromZodError(result.error, {
          issueSeparator: "\n    ",
          prefixSeparator: "\n    ",
          prefix: `Validation error at ${getLineColumnStringFromNode(
            lineColumnFinder,
            item
          )}`,
        }).toString(),
      };
    quotes.push(result.data);

    const itemLine =
      item.range && lineColumnFinder.fromIndex(item.range[0])?.line;
    const sourceURL = `${QUOTES_FILE_GITHUB_URL}${
      itemLine ? `#L${itemLine}` : ""
    }`;
    quoteSourceURLs.set(result.data, sourceURL);
  }

  return {
    success: true,
    quotes,
    quoteSourceURLs,
  };
}

function getQuoteSlug(quote: Quote) {
  const hash = hashMd5(JSON.stringify(quote), "hex", 8);
  const slug = slugify(quote.quote, {
    trim: false,
    replacement: " ",
    remove: /[^\w ]/g,
    lower: true,
  })
    .replace(TRUNCATE_REGEX, "$1")
    .trim()
    .replace(/ /g, "-");

  return `${slug}-${hash}`;
}

function getLineColumnStringFromNode(
  lineColumnFinder: LineColumnFinder,
  node: unknown
) {
  const isObject = node && typeof node === "object";
  const hasRange = isObject && "range" in node;
  if (!hasRange || !Array.isArray(node.range)) return "data/quotes.yaml";

  const lineColumn = lineColumnFinder.fromIndex(node.range[0]);
  if (!lineColumn) return "data/quotes.yaml";

  return `data/quotes.yaml:${lineColumn.line}:${lineColumn.col}`;
}

function getType(value: unknown) {
  const typeString = typeof value;
  if (!value || typeString !== "object") {
    return typeString;
  }

  const prototype = Object.getPrototypeOf(value);
  if (prototype === Object) return typeString;
  return prototype.name;
}

function hashMd5(
  data: BinaryLike,
  encoding: BinaryToTextEncoding = "hex",
  length: number = -1
) {
  const hash = createHash("md5");
  hash.update(data);
  return hash.digest(encoding).slice(0, length);
}

generateQuotes().catch((err) => {
  console.error(err);
  console.error(chalk.red("\nFailed to generate quotes"));
});

export {};
