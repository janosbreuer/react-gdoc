# react-gdoc

![react-gdoc turns JSX into an editable Google Doc](docs/assets/react-gdoc-hero.png)

Write an editable Google Doc in JSX.

react-gdoc walks a React component tree and sends the Google Docs `batchUpdate` requests for you, including the index bookkeeping the API requires.

## Examples

### Rich text

![A short project update with a bold phrase and a blue date](docs/assets/rich-text-example.png)

```tsx
<Heading1 className="mb-2">Project update</Heading1>
<P className="mb-6 text-slate-600">Lumen Market · 13 October 2026</P>

<Heading2>This week</Heading2>
<P className="mb-4">
  Discovery is complete. Design is <S className="font-bold">in progress</S>, and the
  next review is <S className="text-blue-800">Thursday, 16 October</S>.
</P>
```

Source: [`examples/readme/rich-text.tsx`](examples/readme/rich-text.tsx)

### Document logic

![An offer letter whose probation sentence comes from a TypeScript condition](docs/assets/document-logic-example.png)

```tsx
const probationMonths = 3;
const onProbation = probationMonths > 0;

{onProbation ? (
  <P>
    The first <S className="font-bold">{probationMonths} months</S> are a probationary period.
    During that time, either party may end the employment with one week of notice.
  </P>
) : (
  <P>
    This offer includes no probationary period. Notice follows the employment agreement.
  </P>
)}
```

Source: [`examples/readme/offer.tsx`](examples/readme/offer.tsx)

### Tables from data

![A fee schedule generated from an array](docs/assets/table-example.png)

```tsx
const lines = [
  ['Discovery', 3, 2400],
  ['Design', 8, 6400],
  ['Handoff', 2, 1600],
] as const;

{lines.map(([work, days, fee]) => (
  <TRow key={work}>
    <TCell><P>{work}</P></TCell>
    <TCell><P className="text-right">{days}</P></TCell>
    <TCell><P className="text-right">{usd(fee)}</P></TCell>
  </TRow>
))}
```

Source: [`examples/readme/fee-schedule.tsx`](examples/readme/fee-schedule.tsx)

## Quickstart

Install the library from GitHub. Your application supplies Google authentication. react-gdoc does not open a browser or read a credentials file.

```bash
npm install github:janosbreuer/react-gdoc
```

```tsx
import { google } from 'googleapis';
import { Heading1, P, S, renderDocument } from 'react-gdoc';

const auth = new google.auth.OAuth2(clientId, clientSecret);
auth.setCredentials({ access_token: accessToken, refresh_token: refreshToken });

const { documentId } = await renderDocument(
  <>
    <Heading1>Project update</Heading1>
    <P>
      Design is <S className="font-bold">in progress</S>.
    </P>
  </>,
  { auth, title: 'Project update' }
);
```

Pass `documentId` instead of `title` to replace the body of a document that already exists.

To try the command-line renderer, clone this repository, add a Desktop OAuth client as `credentials.json`, and run:

```bash
npm install
npm run render -- examples/readme/rich-text.tsx --title="Project update"
```

Authentication, components, and styling are documented in [docs/USAGE.md](docs/USAGE.md).

## What you can render

- Headings, paragraphs, and inline text
- Bold, italic, underline, strike, color, font, size, and alignment through a small Tailwind-like `className` set
- Ordered and unordered lists, including `nestingLevel`
- Tables built from components or from `.map()`, including cell background and alignment
- Named styles passed to `GDocument`, applied as direct formatting
- A new Google Doc, or a full replacement of an existing body

## Limitations

Page breaks, images, equations, footnotes, horizontal rules, and section breaks have component files, but the renderer does not emit them. Use `<Br />` for a line break. `className` covers a subset of utilities, and unknown classes are ignored.

The HTML preview (`npm run preview`) is a local approximation. It does not call the Docs API.

The examples under `examples/legal/` use fictional parties and are not legal advice.

## License

MIT. Copyright Janos Breuer.
