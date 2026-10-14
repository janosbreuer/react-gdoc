# Using react-gdoc

react-gdoc is an ESM library for Node.js 20 or newer. It turns a React element into Google Docs `batchUpdate` requests and applies them with a Docs client you provide.

## Install from GitHub

```bash
npm install github:janosbreuer/react-gdoc
```

The package builds from TypeScript when npm installs it from Git. React 18 or newer is a peer dependency. `googleapis` is included.

`v0.1.0` pins this release:

```bash
npm install github:janosbreuer/react-gdoc#v0.1.0
```

## Render a document

```tsx
import { google } from 'googleapis';
import { GDocument, Heading1, P, S, renderDocument } from 'react-gdoc';

const auth = new google.auth.OAuth2(clientId, clientSecret);
auth.setCredentials({
  access_token: accessToken,
  refresh_token: refreshToken,
});

const { documentId } = await renderDocument(
  <GDocument>
    <Heading1 className="mb-2">Project update</Heading1>
    <P>
      Design is <S className="font-bold">in progress</S>.
    </P>
  </GDocument>,
  { auth, title: 'Project update' }
);
```

`renderDocument` returns `{ documentId }`. Errors from argument checks and from the Docs client are thrown. The function does not read `credentials.json`, does not open a browser, and does not prompt for a code.

To update an existing document, pass its id. The current body is deleted and written again. The document id you pass is the id you get back.

```tsx
await renderDocument(element, { auth, documentId: 'DOCUMENT_ID' });
```

### Supply a client instead of auth

Use this when the host already has a Docs client, or when tests need a fake.

```tsx
import { createDocsClient, renderDocument, type DocsClient } from 'react-gdoc';

const client = createDocsClient(auth);
await renderDocument(element, { client, title: 'Project update' });
```

A compatible client implements three methods:

```ts
interface DocsClient {
  createDocument(title: string): Promise<string>;
  batchUpdate(documentId: string, requests: Request[]): Promise<void>;
  getDocument(documentId: string): Promise<Document>;
}
```

`auth` accepts a `google.auth.OAuth2` client or a `google.auth.GoogleAuth` instance, including a service account configured with the `https://www.googleapis.com/auth/documents` scope. The host application decides which of those to use.

If both `client` and `auth` are set, `client` is used.

## Authentication for the CLI

The command-line tools in this repository are a local convenience. They are separate from the library API.

1. In [Google Cloud Console](https://console.cloud.google.com/), create a project and enable the **Google Docs API**.
2. Configure the OAuth consent screen. While the app is in testing, add your Google account as a test user.
3. Create an OAuth client of type **Desktop app**.
4. Download the JSON and save it as `credentials.json` in the repository root. The shape is in [`credentials.example.json`](../credentials.example.json). The file needs `client_id` and `client_secret` under `installed` or `web`.

`credentials.json` and `token.json` are gitignored. Do not commit them.

The CLI asks for one scope: `https://www.googleapis.com/auth/documents`.

On first run it listens on `127.0.0.1` at a free port, prints an authorization URL, and opens a browser. After you approve access, Google redirects to that local port and the CLI stores a token in `token.json`. Later runs reuse the token and refresh it when it expires.

Use a Desktop client. A Web client with one fixed redirect URL will not match the port chosen at runtime. If sign-in fails, the CLI includes Google's error and says to use a Desktop client.

```bash
npm install
npm run render -- examples/readme/rich-text.tsx --title="Project update"
npm run render -- examples/readme/offer.tsx DOCUMENT_ID
npm run render:watch -- examples/readme/fee-schedule.tsx DOCUMENT_ID
```

Omit the document id to create a Doc. Pass one to replace that Doc's body. `--title` applies only when creating. Everything after `--args` is forwarded to the default-exported component as `args`.

`npm run preview -- examples/readme/rich-text.tsx` serves a local HTML approximation. It does not call the Docs API, and it does not match every Docs detail.

## Components

Import the supported components from `react-gdoc`:

| Export | Role |
| --- | --- |
| `GDocument` | Optional root. `namedStyles` sets direct formatting for normal text and headings |
| `Heading1` … `Heading6` | Heading paragraphs |
| `P`, `S`, `Br` | Paragraph, styled span, line break |
| `Ul`, `Ol`, `Li` | Lists. `Li` accepts `nestingLevel` |
| `Table`, `TRow`, `TCell` | Tables. `TCell` accepts `tableCellStyle` |
| `GParagraph`, `GTextRun`, `GList`, `GTable`, `GTableRow`, `GTableCell` | The same structures without the shortcuts |

`className` maps a Tailwind-like subset onto Docs styles:

- Text: `font-bold`, `italic`, `underline`, `line-through`, `text-red-500`, `bg-yellow-200`, `text-lg`, `font-calibri`, `font-arial`, `font-georgia`, `font-times`
- Paragraph: `text-left`, `text-center`, `text-right`, `text-justify`, `mt-2`, `mb-4`, `indent-4`
- Table cells: `bg-slate-200`, `border-0`, `p-2`, `text-right`, `align-top`

Unknown classes are ignored. Paragraph spacing such as `mb-4` is points, not CSS pixels. Colors use a built-in palette, not your Tailwind config.

For a style the class list does not cover, pass `paragraphStyle` to `P` or `tableCellStyle` to `TCell`. These are Google Docs API style objects.

```tsx
<P paragraphStyle={{ namedStyleType: 'TITLE', alignment: 'CENTER' }}>
  Quarterly review
</P>
```

Named styles on `GDocument` are merged into each paragraph as direct formatting. They do not rewrite the document's named-style catalog.

```tsx
const namedStyles = [
  {
    namedStyleType: 'NORMAL_TEXT' as const,
    textStyle: { weightedFontFamily: { fontFamily: 'Calibri', weight: 400 } },
  },
];

<GDocument namedStyles={namedStyles}>
  <P>Body text in Calibri.</P>
</GDocument>
```

Lists are one `Ul` or `Ol`. A nested list component throws. Indent an item with `nestingLevel={1}` on `Li`.

Tables are inserted empty, then filled after `documents.get` returns the cell indexes. Build rows with `TRow` or with `.map()`.

## Troubleshooting

**`renderDocument requires options.client or options.auth`.** The library call did not include authentication. Pass `auth` or `client`.

**Credentials file not found.** The CLI looks for `credentials.json` in the current working directory. The library never reads that file.

**Desktop app.** If Google reports a redirect mismatch, the OAuth client is not a Desktop client, or the consent screen does not list your account as a test user.

**Saved token could not be refreshed.** Delete `token.json` and run the CLI again.

**`Invalid structural node type`.** The tree contains a component the renderer does not emit, such as a page break or an image. Remove it, or replace an HTML `<br />` with `<Br />`.

**A table cell is empty or the render throws about the number of tables.** The document changed between the insert and the follow-up read, or a table was nested inside another table. Nested tables are not supported.
