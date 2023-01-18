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

Then submit a pull request and a reviewer will review and merge, your quote will then be available
in a minute!

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

**GET** `/api/og/quote?slug=[slug]`

`[slug]` is the slug of the quote, this can also be `random`.

**Example:** https://lukadev-randomquotes.vercel.app/api/og/quote?slug=random
