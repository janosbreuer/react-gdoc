import { sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { type DocsClient, type Request } from 'react-gdoc';
import { renderStatusReport, statusReport } from './render.js';

const resolvedPath = fileURLToPath(import.meta.resolve('react-gdoc'));
const marker = `${sep}node_modules${sep}react-gdoc${sep}`;
if (!resolvedPath.includes(marker)) {
  throw new Error(`react-gdoc resolved outside an installed package: ${resolvedPath}`);
}
if (resolvedPath.includes(`${sep}src${sep}index.ts`) || resolvedPath.includes(`${sep}src${sep}api${sep}`)) {
  throw new Error(`react-gdoc resolved to library source: ${resolvedPath}`);
}

const batches: Request[][] = [];
let createdTitle = '';
let sawGet = false;

const client: DocsClient = {
  async createDocument(title) {
    createdTitle = title;
    return 'consumer-doc';
  },
  async batchUpdate(_documentId, requests) {
    batches.push(requests);
  },
  async getDocument() {
    sawGet = true;
    const tables = batches.flat().filter((request) => request.insertTable);
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
  },
};

const { documentId } = await renderStatusReport({ client });
const text = batches.flat().flatMap((request) => request.insertText?.text ? [request.insertText.text] : []).join('\n');

if (documentId !== 'consumer-doc') throw new Error(`unexpected document id ${documentId}`);
if (createdTitle !== `Project status — ${statusReport.clientName}`) throw new Error(`unexpected title ${createdTitle}`);
if (!text.includes(statusReport.clientName)) throw new Error('dynamic client name was not rendered');
if (!text.includes(statusReport.reviewDate)) throw new Error('review date was not rendered');
if (!text.includes('In progress')) throw new Error('table status was not rendered');
if (!sawGet) throw new Error('table phase did not read the document');
if (!batches.flat().some((request) => request.insertTable)) throw new Error('table was not inserted');

let refused = false;
try {
  await renderStatusReport({});
} catch (error) {
  refused = error instanceof Error && /options\.client or options\.auth/.test(error.message);
}
if (!refused) throw new Error('missing auth should throw before any browser or credential read');

console.log('consumer mock ok', documentId);
