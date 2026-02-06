import React from 'react';
import { Heading2 } from '@react-gdoc/primitives';

export interface SectionProps {
  title: string;
  children?: React.ReactNode;
}

/**
 * Egy szerződési szakasz komponens.
 * Clause komponensekből épül fel, amelyek viszont primitívekből épülnek.
 * A beépített Heading2 komponenst használja.
 */
export const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <>
      <Heading2>
        {title}
      </Heading2>
      {children}
    </>
  );
};

