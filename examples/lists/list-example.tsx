import React from 'react';
import { Ol, Li, Ul, S, P } from '@react-gdoc/shortcuts';
import { Heading4 } from '@react-gdoc/headings';

export default function OrderedListExample() {
  return (
    <>
      <Heading4>Simple ordered list</Heading4>
      <Ol>
        <Li>First item</Li>
        <Li nestingLevel={1}>Second item</Li>
        <Li>Third <S className="font-bold">bold</S> item</Li>
      </Ol>

      <Heading4>Simple unordered list</Heading4>
      <Ul>
        <Li>First item</Li>
        <Li nestingLevel={1}>Second item</Li>
        <Li>Third <S className="font-bold">bold</S> item</Li>
      </Ul>
    </>
  );
}

