import React from 'react';
import { GHeading2, GTextRun } from '../../../src/components/primitives';

export interface SectionProps {
  title: string;
  children?: React.ReactNode;
}

/**
 * Egy szerződési szakasz komponens.
 * Clause komponensekből épül fel, amelyek viszont primitívekből épülnek.
 * A beépített GHeading2 komponenst használja.
 */
export const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <>
      <GHeading2>
        <GTextRun content={title} />
      </GHeading2>
      {children}
    </>
  );
};

