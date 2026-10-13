import { authorize } from './auth.js';
import { renderStatusReport } from './render.js';

const auth = await authorize();
const { documentId } = await renderStatusReport({ auth });
console.log(`https://docs.google.com/document/d/${documentId}/edit`);
