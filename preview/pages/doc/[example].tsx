import React from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import ExampleNDA from '../../../examples/legal/example-nda';
import VeryLongDocumentTest from '../../../examples/legal/very-long-document-test';

const EXAMPLES: Record<string, React.ComponentType<any>> = {
  'example-nda': ExampleNDA,
  'very-long-document-test': VeryLongDocumentTest,
};

interface DocPageProps {
  exampleId: string;
}

export default function DocPage({ exampleId }: DocPageProps) {
  const ExampleComponent = EXAMPLES[exampleId];

  if (!ExampleComponent) {
    return (
      <div className="gdoc-document">
        <h1 className="text-xl font-bold mb-4">Ismeretlen példa</h1>
        <p className="mb-2">Nincs ilyen példadokumentum: {exampleId}</p>
      </div>
    );
  }

  return <ExampleComponent />;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = Object.keys(EXAMPLES).map((id) => ({
    params: { example: id },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<DocPageProps> = async (ctx) => {
  const exampleId = ctx.params?.example as string;
  return {
    props: {
      exampleId,
    },
  };
};


