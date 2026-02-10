import React from 'react';
import type { GTableRowProps } from '../../src/components/primitives/GTableRow';

export const GTableRow: React.FC<GTableRowProps> = ({ children }) => {
  return <tr>{children}</tr>;
};


