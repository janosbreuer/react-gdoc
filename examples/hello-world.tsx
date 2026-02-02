import React from 'react';
import { GParagraph, GTextRun } from '../src/components/primitives';

export default function HelloWorld() {
  return (
    <GParagraph>
      <GTextRun content="Hello, World!" />
    </GParagraph>
  );
}

