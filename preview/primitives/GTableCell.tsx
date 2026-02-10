import React from 'react';
import type { GTableCellProps } from '../../src/components/primitives/GTableCell';

export const GTableCell: React.FC<GTableCellProps> = ({
  rowSpan,
  columnSpan,
  className,
  children,
}) => {
  return (
    <td rowSpan={rowSpan} colSpan={columnSpan} className={className}>
      {children}
    </td>
  );
};


