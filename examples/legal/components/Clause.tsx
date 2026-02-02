import React from 'react';
import { GParagraph, GTextRun, GHeading3 } from '@react-gdoc/primitives';

export interface ClauseProps {
  number?: number;
  title?: string;
  children?: React.ReactNode;
}

/**
 * Egy szerződési záradék komponens.
 * A primitívek (GParagraph, GTextRun) felhasználásával épül fel.
 */
export const Clause: React.FC<ClauseProps> = ({ number, title, children }) => {
  return (
    <>
      <GHeading3>
        <GTextRun content={number ? `${number}. ` : ''} />
        {title && <GTextRun content={title} />}
      </GHeading3>
      {children}
    </>
  );
};

