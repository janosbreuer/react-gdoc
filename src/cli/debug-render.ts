import { authenticate } from '../google/auth.js';
import { GoogleDocsClient } from '../google/client.js';

async function main() {
  const documentId = process.argv[2];
  if (!documentId) {
    console.error('Error: Document ID is required');
    process.exit(1);
  }

  console.log('Authenticating with Google...');
  const auth = await authenticate();
  const client = new GoogleDocsClient(auth);

  try {
    console.log(`Updating document: ${documentId}`);
    const document = await client.getDocument(documentId);
    const endIndex = document.body?.content?.[document.body.content.length - 1]?.endIndex;
    if (endIndex && endIndex > 2) {
      console.log('Clearing document content...');
      await client.batchUpdate(documentId, [{
        deleteContentRange: {
          range: {
            startIndex: 1,
            endIndex: endIndex - 1,
          },
        },
      }]);
    }

    await client.batchUpdate(documentId, [{
      insertText: {
        text: 'Hello, world!',
        location: { index: 1 },
      },
    }]);

    const documentUrl = `https://docs.google.com/document/d/${documentId}/edit`;
    console.log('Document updated successfully!');
    console.log(`View at: ${documentUrl}`);
  } catch (error) {
    console.error('Error rendering document:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});