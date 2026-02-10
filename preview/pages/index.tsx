import Link from 'next/link';

const examples = [
  { id: 'example-nda', label: 'Example NDA' },
  { id: 'very-long-document-test', label: 'Very Long Document Test' },
];

export default function IndexPage() {
  return (
    <div className="gdoc-document">
      <h1 className="text-2xl font-bold mb-4">React-GDoc Preview</h1>
      <p className="mb-4">
        Válassz egy példadokumentumot az alábbi listából, és megnézheted böngészőben, nagyjából úgy,
        ahogy a Google Docs-ban is kinézne.
      </p>
      <ul className="list-disc ml-6 space-y-2">
        {examples.map((ex) => (
          <li key={ex.id}>
            <Link href={`/doc/${ex.id}`} className="text-blue-600 underline">
              {ex.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}


