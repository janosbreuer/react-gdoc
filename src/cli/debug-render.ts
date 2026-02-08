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

    let requests: docs_v1.Schema$Request[] = [
      {
        deleteParagraphBullets: {
          range: {
            startIndex: 1,
            endIndex: 2,
          },
        },
      },
      
      {
        insertText: {
          location: {
            index: 1,
          },
          text: 'Second item',
        },
      },
      {
        updateParagraphStyle: {
          range: {
            startIndex: 1,
            endIndex: 12,
          },
          paragraphStyle: {
            namedStyleType: 'NORMAL_TEXT',
          },
          fields: 'namedStyleType',
        },
      },
      {
        insertText: {
          location: {
            index: 1,
          },
          text: '\t',
        },
      },
      {
        insertText: {
          location: {
            index: 1,
          },
          text: '\n',
        },
      },
      {
        insertText: {
          location: {
            index: 1,
          },
          text: 'First item',
        },
      },
      {
        updateParagraphStyle: {
          range: {
            startIndex: 1,
            endIndex: 11,
          },
          paragraphStyle: {
            namedStyleType: 'NORMAL_TEXT',
          },
          fields: 'namedStyleType',
        },
      },
      {
        createParagraphBullets: {
          range: {
            startIndex: 1,
            endIndex: 16,
          },
          bulletPreset: 'NUMBERED_DECIMAL_NESTED',
        },
      },
      // {
      //   createParagraphBullets: {
      //     range: {
      //       startIndex: 15,
      //       endIndex: 16,
      //     },
      //     bulletPreset: 'NUMBERED_DECIMAL_NESTED',
      //   },
      // },
      // {
      //   insertText: {
      //     location: {
      //       index: 1,
      //     },
      //     text: '\n',
      //   },
      // },
      // {
      //   insertText: {
      //     location: {
      //       index: 1,
      //     },
      //     text: 'First item',
      //   },
      // },
      // {
      //   updateParagraphStyle: {
      //     range: {
      //       startIndex: 1,
      //       endIndex: 11,
      //     },
      //     paragraphStyle: {
      //       namedStyleType: 'NORMAL_TEXT',
      //     },
      //     fields: 'namedStyleType',
      //   },
      // },
      // {
      //   createParagraphBullets: {
      //     range: {
      //       startIndex: 1,
      //       endIndex: 11,
      //     },
      //     bulletPreset: 'NUMBERED_DECIMAL_NESTED',
      //   },
      // },
      
      



      // {
      //   deleteParagraphBullets: {
      //     range: { startIndex: 1, endIndex: 2 },
      //   },
      // },
      // {
      //   insertText: {
      //     text: '\tLine 1\n\t\tLine 2\nLine 3',
      //     location: { index: 1 },
      //   }
      // },
      // {
      //   createParagraphBullets: {
      //     range: { startIndex: 1, endIndex: 22 },
      //     bulletPreset: 'NUMBERED_DECIMAL_NESTED' //'BULLET_DISC_CIRCLE_SQUARE'
      //   },
      // },
      // {
      //   deleteParagraphBullets: {
      //     range: { startIndex: 1, endIndex: 22 },
      //   },
      // },
    ];

    if (requests.length === 0) {
      console.warn('Warning: No requests generated.');
    }

    console.log(`Updating document: ${documentId}`);

    console.log('Clearing document content...');
    await client.clearDocument(documentId);

    console.log(`Applying ${requests.length} requests...`);
    await client.batchUpdate(documentId, requests);

    const documentUrl = `https://docs.google.com/document/d/${documentId}/edit`;
    console.log('Document updated successfully!');
    console.log(`View at: ${documentUrl}`);
  } catch (error) {
    console.error('Error rendering document:', error);
    process.exit(1);
  }
}

main().catch(console.error);
