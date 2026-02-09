import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { authenticate } from '../google/auth.js';
import { GoogleDocsClient } from '../google/client.js';
import React from 'react';
import { docs_v1 } from 'googleapis';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const rawArgs = process.argv.slice(2);
  const documentId = rawArgs[0];
  if (!documentId) {
    console.error('Error: Document ID is required');
    process.exit(1);
  }

  console.log('Authenticating with Google...');
  const auth = await authenticate();
  const client = new GoogleDocsClient(auth);

  try {
    console.log(`Updating document: ${documentId}`);

    console.log('Clearing document content...');
    await client.clearDocument(documentId);

    let requests: docs_v1.Schema$Request[] = [
      {
        updateTextStyle: {
          range: {
            startIndex: 1,
            endIndex: 2,
          },
          textStyle: {
            weightedFontFamily: {
              fontFamily: 'Times New Roman',
              weight: 400,
            },
          },
          fields: 'weightedFontFamily',
        },
      },
      {
        insertText: {
          text: 'Hello, world!',
          location: {
            index: 1,
          },
        },
      },
    ];

    console.log(`Applying ${requests.length} requests...`);
    await client.batchUpdate(documentId, requests);

    console.log('Fetching document...');
    const document = await client.getDocument(documentId);

    const documentUrl = `https://docs.google.com/document/d/${documentId}/edit`;
    console.log(`\nDocument updated successfully!`);
    console.log(`View at: ${documentUrl}`);
  } catch (error) {
    console.error('Error rendering document:', error);
    process.exit(1);
  }
}

main().catch(console.error);
