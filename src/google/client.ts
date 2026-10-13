import { google, Auth } from 'googleapis';
import type { BatchUpdateRequest, Request, Document } from '../components/primitives/types.js';

export type GoogleDocsAuth = Auth.OAuth2Client | Auth.GoogleAuth;

export interface DocsClient {
  createDocument(title: string): Promise<string>;
  batchUpdate(documentId: string, requests: Request[]): Promise<void>;
  getDocument(documentId: string): Promise<Document>;
}

export class GoogleDocsClient implements DocsClient {
  private docs: ReturnType<typeof google.docs>;

  constructor(auth: GoogleDocsAuth) {
    this.docs = google.docs({ version: 'v1', auth });
  }

  async createDocument(title: string): Promise<string> {
    const response = await this.docs.documents.create({
      requestBody: {
        title: title,
      },
    });

    if (!response.data.documentId) {
      throw new Error('Failed to create document');
    }

    return response.data.documentId;
  }

  async batchUpdate(documentId: string, requests: Request[]): Promise<void> {
    const request: BatchUpdateRequest = {
      requests: requests,
    };

    await this.docs.documents.batchUpdate({
      documentId: documentId,
      requestBody: request,
    });
  }

  async getDocument(documentId: string): Promise<Document> {
    const response = await this.docs.documents.get({
      documentId: documentId,
    });

    if (!response.data) {
      throw new Error('Failed to get document');
    }

    return response.data;
  }
}

export function createDocsClient(auth: GoogleDocsAuth): GoogleDocsClient {
  return new GoogleDocsClient(auth);
}
