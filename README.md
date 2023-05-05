# Random Quote Machine

A website built with the Next.js 13 app directory. It has quotes!

## Adding your own quote

You can add your own quote by editing the [`quotes.yaml`](https://github.com/lukadev-0/random-quote-machine/blob/main/data/quotes.yaml)
file.

At the end of the file, add your quote with the following format:

```yaml
- name: John Doe
  quote: "Hello, World!"
```

Afterwards, submit a [pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests)
and wait for your request to be reviewed. Once it is merged, your quote will be available within a minute!

## Using the API

The API can be accessed from `https://lukadev-randomquotes.vercel.app/api`.
The API allows you to get a specific quote, get a random quote, or get a
quote image.

### Get a quote

**GET** `/api/quotes/[slug].[ext]`

`[slug]` is the slug of the quote, such as `talk-is-cheap-show-me-the-code-8a97f957`, the slug
is the quote slugififed with a hash appended onto it.

`[ext]` can either be `.json`, `.yaml` or `.yml`.

#### Response

```ts
interface Response {
  // The URL which points to the location within `quotes.yaml` where this
  // quote is defined.
  source: string;

  // This quote's slug
  slug: string;

  // The name on the quote
  name: string;

  // The quote itself
  quote: string;
}
```

**Example:** https://lukadev-randomquotes.vercel.app/api/quotes/talk-is-cheap-show-me-the-code-8a97f957.json

### Get a random quote

Same as above, but with the slug `random`.

**Example:** https://lukadev-randomquotes.vercel.app/api/quotes/random.json

### OG Image

> **Note**
> This used to be available through `/api/og/quote` but has been moved in order to use
> Next.js's new file metadata API.

**GET** `/quotes/[slug]/opengraph-image`

**Example:** https://lukadev-randomquotes.vercel.app/quotes/if-debugging-is-the-process-of-removing-software-08b16211/opengraph-image
