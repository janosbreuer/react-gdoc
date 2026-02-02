import React from 'react';
import { GParagraph, GTextRun } from '@react-gdoc/primitives';

export default function HelloWorld() {
  return (
    <GParagraph>
      <GTextRun content="Hello, World!" />
    </GParagraph>
  );
}

