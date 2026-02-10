import React from 'react';
import type { GDocumentProps, NamedStyle } from '../../src/components/primitives/GDocument';

export type { NamedStyle } from '../../src/components/primitives/GDocument';

export const GDocument: React.FC<GDocumentProps> = ({ children }) => {
  return <div className="gdoc-document">{children}</div>;
};


