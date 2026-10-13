import React from 'react';
import { GDocRenderer } from '../src/renderer/GDocRenderer.js';
import type { Document, Request } from '../src/components/primitives/types.js';

export async function collectRequests(element: React.ReactElement): Promise<Request[]> {
  const batches: Request[][] = [];
  const renderer = new GDocRenderer(
    async (requests) => {
      batches.push(requests);
    },
    async () => documentFromRequests(batches.flat())
  );
  await renderer.render(element);
  return batches.flat();
}

export function insertedText(requests: Request[]): string[] {
  return requests.flatMap((request) => request.insertText?.text ? [request.insertText.text] : []);
}

function documentFromRequests(requests: Request[]): Document {
  const tables = requests.filter((request) => request.insertTable);
  return {
    body: {
      content: tables.map((request, index) => {
        const rows = request.insertTable?.rows || 1;
        const columns = request.insertTable?.columns || 1;
        return {
          startIndex: 1 + index,
          endIndex: 80 + index,
          table: {
            rows,
            columns,
            tableRows: Array.from({ length: rows }, (_, rowIndex) => ({
              tableCells: Array.from({ length: columns }, (_, columnIndex) => ({
                startIndex: 100 + index * 1000 + rowIndex * 40 + columnIndex * 8,
                endIndex: 104 + index * 1000 + rowIndex * 40 + columnIndex * 8,
              })),
            })),
          },
        };
      }),
    },
  };
}
