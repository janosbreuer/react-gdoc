import React from 'react';
import { GTable, GTableRow, GTableCell } from './primitives';
import type { TableCellStyle, TableRowStyle } from './primitives/types';

const mergeClassName = (parentClassName?: string, childClassName?: string): string | undefined => {
  if (!parentClassName && !childClassName) return undefined;
  if (!parentClassName) return childClassName;
  if (!childClassName) return parentClassName;
  return `${parentClassName} ${childClassName}`.trim();
};

export interface TableProps {
  className?: string;
  rows?: number;
  columns?: number;
  children?: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ className, children, ...props }) => {
  const processedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && className) {
      return React.cloneElement(child, {
        ...child.props,
        className: mergeClassName(className, child.props.className),
      } as any);
    }
    return child;
  });

  return (
    <GTable {...props}>
      {processedChildren}
    </GTable>
  );
};

export interface TRowProps {
  className?: string;
  style?: TableRowStyle;
  children?: React.ReactNode;
}

export const TRow: React.FC<TRowProps> = ({ className, style, children }) => {
  const processedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && className) {
      return React.cloneElement(child, {
        ...child.props,
        className: mergeClassName(className, child.props.className),
      } as any);
    }
    return child;
  });

  return (
    <GTableRow style={style}>
      {processedChildren}
    </GTableRow>
  );
};

export interface TCellProps {
  className?: string;
  rowSpan?: number;
  columnSpan?: number;
  style?: TableCellStyle;
  children?: React.ReactNode;
}

export const TCell: React.FC<TCellProps> = ({ className, style, children, ...props }) => {
  const processedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && className) {
      return React.cloneElement(child, {
        ...child.props,
        className: mergeClassName(className, child.props.className),
      } as any);
    }
    return child;
  });

  return (
    <GTableCell {...props} style={style}>
      {processedChildren}
    </GTableCell>
  );
};

