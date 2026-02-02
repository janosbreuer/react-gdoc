import React from 'react';
import { GParagraph, GTextRun } from '../../../src/components/primitives';

export interface SubClauseProps {
  letter?: string;
  title?: string;
  children?: React.ReactNode;
}

/**
 * Egy alzáradék komponens.
 * A primitívek felhasználásával épül fel.
 */
export const SubClause: React.FC<SubClauseProps> = ({ letter, title, children }) => {
  return (
    <>
      <GParagraph style={{ 
        indentStart: { magnitude: 18, unit: 'PT' },
        spaceAbove: { magnitude: 12, unit: 'PT' },
        spaceBelow: { magnitude: 6, unit: 'PT' }
      }}>
        <GTextRun content={letter ? `${letter}) ` : ''} />
        {title && <GTextRun content={title} style={{ bold: true }} />}
      </GParagraph>
      {children}
    </>
  );
};

