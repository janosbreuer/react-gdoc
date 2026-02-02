import { google, Auth } from 'googleapis';
import type { BatchUpdateRequest, Request, Document } from '../components/primitives/types';

export class GoogleDocsClient {
  private docs: ReturnType<typeof google.docs>;
  private drive: ReturnType<typeof google.drive>;

  constructor(auth: Auth.OAuth2Client) {
    this.docs = google.docs({ version: 'v1', auth });
    this.drive = google.drive({ version: 'v3', auth });
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

  async clearDocument(documentId: string): Promise<void> {
    const doc = await this.getDocument(documentId);
    const endIndex = doc.body?.content?.[doc.body.content.length - 1]?.endIndex;
    
    if (!endIndex || endIndex <= 1) {
      return;
    }

    if (endIndex - 1 <= 1) {
      return;
    }

    const startIndex = 1;
    const deleteEndIndex = endIndex - 1;

    if (deleteEndIndex <= startIndex) {
      return;
    }

    await this.deleteRange(documentId, startIndex, deleteEndIndex);
  }

  async deleteRange(documentId: string, startIndex: number, endIndex: number): Promise<void> {
    if (endIndex <= startIndex) {
      return;
    }

    const deleteRequest: Request = {
      deleteContentRange: {
        range: {
          startIndex: startIndex,
          endIndex: endIndex,
        },
      },
    } as any;

    await this.batchUpdate(documentId, [deleteRequest]);
  }
}

