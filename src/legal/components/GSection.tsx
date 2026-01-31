import React from 'react';
import { GHeading2, GTextRun } from '../../primitives';

export interface GSectionProps {
  title: string;
  children?: React.ReactNode;
}

/**
 * Egy szerződési szakasz komponens.
 * GClause komponensekből épül fel, amelyek viszont primitívekből épülnek.
 * A beépített GHeading2 komponenst használja.
 */
export const GSection: React.FC<GSectionProps> = ({ title, children }) => {
  return (
    <>
      <GHeading2>
        <GTextRun content={title} />
      </GHeading2>
      {children}
    </>
  );
};

