# react-gdoc

Write a Google Doc as React/JSX. A renderer walks the component tree and sends Google Docs `batchUpdate` requests, including the index bookkeeping the API requires.

This repo is a local tool. Clone it and run the CLI. It is not published as an npm package. Sample contracts under `examples/legal/` use fictional parties and are not legal advice.

## Setup

```bash
npm install
```

1. In [Google Cloud Console](https://console.cloud.google.com/), enable the **Google Docs API** and the **Google Drive API**.
2. Create an OAuth client of type **Desktop app**.
3. Download the client JSON, save it as `credentials.json` in the repo root. Shape: [`credentials.example.json`](credentials.example.json). The file needs `client_id` and `client_secret` under `installed` or `web`.

`credentials.json` and `token.json` are gitignored. Do not commit them.

The login flow hardcodes the out-of-band redirect `urn:ietf:wg:oauth:2.0:oob`. Google rejects that redirect on OAuth clients created after the deprecation. If the consent screen fails, this repo cannot finish login until the flow is switched to a loopback redirect.

## Render

```bash
npm run render examples/example.tsx --title="Example"
npm run render examples/legal/example-contract.tsx DOC_ID
npm run render examples/legal/example-nda.tsx DOC_ID --args "Acme Ltd" "1 Main St"
npm run render:watch examples/example.tsx DOC_ID
```

The first run opens a browser. Paste the auth code into the terminal. The token is stored in `token.json`.

Pass a document id to replace that doc's body. Omit it to create a new Doc in your Drive. `--title` applies only when creating. Everything after `--args` is forwarded to the default-exported component as `args`.

`npm run preview examples/example.tsx` serves a local HTML approximation. It does not call the Docs API.

## What renders

Shortcuts (preferred in examples):

- `P`, `S`, `Br` — paragraph, styled span, line break
- `Heading1`–`Heading6`
- `Ul`, `Ol`, `Li`
- `Table`, `TRow`, `TCell`
- `GDocument` — optional root; `namedStyles` overrides heading and normal-text styles

`className` maps a Tailwind-like subset onto Docs styles: `font-bold`, `italic`, `underline`, `line-through`, `text-red-500`, `bg-yellow-200`, `text-lg`, `font-arial`, `text-center`, `mt-2`, `indent-4`. Unknown classes are ignored.

Primitives underneath: `GParagraph`, `GTextRun`, `GList`, `GTable`, `GTableRow`, `GTableCell`.

## Declared, not wired

These components exist and `RequestBuilder` has matching request helpers, but `GDocRenderer` does not emit them. Using one throws or drops the node.

`GPageBreak`, `GColumnBreak`, `GHorizontalRule`, `GSectionBreak`, `GImage`, `GEquation`, `GFootnoteReference`, `GInlineObject`.

`GSectionBreak` throws `not implemented yet`.

## Layout

- `src/components/` — primitives, shortcuts, headings, tables
- `src/renderer/` — JSX tree to `batchUpdate`
- `src/google/` — OAuth and Docs client
- `src/cli/` — `render`, `render:watch`, `preview`, `debug-render`
- `examples/` — documents, including `examples/legal/`
- `docs/SPEC.md` — design notes, not a user guide
- `preview/` — local HTML preview of the same JSX
