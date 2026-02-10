import React from 'react';
import type { GListProps } from '../../src/components/primitives/GList';

const isOrderedPreset = (preset?: string): boolean => {
  if (!preset) return false;
  return preset.startsWith('NUMBERED');
};

export const GList: React.FC<GListProps> = ({ bulletPreset, children }) => {
  const ordered = isOrderedPreset(bulletPreset);
  const ListTag = ordered ? 'ol' : 'ul';

  return (
    <ListTag className="ml-6 list-inside">
      {React.Children.map(children, (child, index) => (
        <li key={index}>{child}</li>
      ))}
    </ListTag>
  );
};


