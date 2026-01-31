import React from 'react';
import { GParagraph, GTextRun } from '../src/primitives';

export default function HelloWorld() {
  return (
    <GParagraph>
      <GTextRun content="Hello, World!" />
    </GParagraph>
  );
}

