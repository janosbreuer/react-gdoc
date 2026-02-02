import React from 'react';

export interface GListItemProps {
  nestingLevel?: number;
  listId?: string;
  ordered?: boolean;
  children?: React.ReactNode;
}

export const GListItem: React.FC<GListItemProps> = ({ nestingLevel, listId, ordered, children }) => {
  return null;
};

