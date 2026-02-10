import React from 'react';
import type { GTableProps } from '../../src/components/primitives/GTable';

export const GTable: React.FC<GTableProps> = ({ children }) => {
  return (
    <table className="border-collapse">
      <tbody>{children}</tbody>
    </table>
  );
};


