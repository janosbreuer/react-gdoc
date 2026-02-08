import React from 'react';

export interface GListProps {
  ordered?: boolean;
  nestingLevel?: number;
  children?: React.ReactNode;
}

export const GList: React.FC<GListProps> = ({ ordered, nestingLevel, children }) => {
  return <>{children}</>;
};

