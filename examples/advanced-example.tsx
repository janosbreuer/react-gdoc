import React from 'react';
import {
  GListItem,
  GPageBreak,
  Heading1,
  Heading2,
  Heading3,
} from '@react-gdoc/primitives';
import { P, S } from '@react-gdoc/shortcuts';

export default function AdvancedExample() {
  return (
    <>
      <Heading1>
        Advanced React-GDoc Example
      </Heading1>

      <P>
        This document demonstrates various formatting options, headers, lists, and custom styles.
      </P>

      <GPageBreak />

      <Heading2>
        Text Formatting
      </Heading2>

      <P>
        You can use{' '}
        <S className="font-bold">bold text</S>
        ,{' '}
        <S className="italic">italic text</S>
        ,{' '}
        <S className="underline">underlined text</S>
        , and{' '}
        <S className="line-through">strikethrough text</S>
        .
      </P>

      <P>
        You can also combine formats:{' '}
        <S className="font-bold italic">bold and italic</S>
        , or{' '}
        <S className="font-bold underline">bold and underlined</S>
        .
      </P>

      <Heading3>
        Nested S Components
      </Heading3>

      <P>
        Simple nesting test:{' '}
        <S className="font-bold">bold</S>
        {' '}and{' '}
        <S className="italic">italic</S>
        .
      </P>

      <P>
        Nested S components merge styles:{' '}
        <S className="font-bold">
          bold text with{' '}
          <S className="italic">nested italic</S>
          {' '}and{' '}
          <S className="text-red-500 underline">nested red underlined</S>
        </S>
        .
      </P>

      <P>
        Multiple levels of nesting:{' '}
        <S className="text-blue-500">
          blue text with{' '}
          <S className="font-bold">
            bold and{' '}
            <S className="italic">bold italic</S>
          </S>
        </S>
        .
      </P>

      <P>
        Complex nesting with text between:{' '}
        <S className="font-bold">
          Start bold{' '}
          <S className="text-red-500">red inside bold</S>
          {' '}end bold
        </S>
        .
      </P>

      <Heading2>
        Named Styles
      </Heading2>

      <P style={{ namedStyleType: 'TITLE' }}>
        This paragraph uses the TITLE named style.
      </P>

      <P style={{ namedStyleType: 'SUBTITLE' }}>
        This paragraph uses the SUBTITLE named style.
      </P>

      <P style={{ namedStyleType: 'HEADING_1' }}>
        This paragraph uses HEADING_1 named style (alternative to GHeading1).
      </P>

      <Heading3>
        Custom Paragraph Styles
      </Heading3>

      <P className="text-center">
        This paragraph is centered.
      </P>

      <P className="text-right">
        This paragraph is right-aligned.
      </P>

      <P className="text-justify">
        This paragraph is justified. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </P>

      <Heading2>
        Lists
      </Heading2>

      <P>
        Unordered list items:
      </P>

      <GListItem nestingLevel={0} ordered={false}>
        <P>
          First item
        </P>
      </GListItem>

      <GListItem nestingLevel={0} ordered={false}>
        <P>
          Second item with{' '}
          <S className="font-bold">bold text</S>
        </P>
      </GListItem>

      <GListItem nestingLevel={0} ordered={false}>
        <P>
          Third item
        </P>
      </GListItem>

      <GListItem nestingLevel={1} ordered={false}>
        <P>
          Nested item (level 1)
        </P>
      </GListItem>

      <GListItem nestingLevel={1} ordered={false}>
        <P>
          Another nested item
        </P>
      </GListItem>

      <GListItem nestingLevel={0} ordered={false}>
        <P>
          Back to top level
        </P>
      </GListItem>

      <P>
        Ordered list items:
      </P>

      <GListItem nestingLevel={0} ordered={true}>
        <P>
          First numbered item
        </P>
      </GListItem>

      <GListItem nestingLevel={0} ordered={true}>
        <P>
          Second numbered item
        </P>
      </GListItem>

      <GListItem nestingLevel={1} ordered={true}>
        <P>
          Nested numbered item (level 1)
        </P>
      </GListItem>

      <GListItem nestingLevel={1} ordered={true}>
        <P>
          Another nested numbered item
        </P>
      </GListItem>

      <GListItem nestingLevel={0} ordered={true}>
        <P>
          Back to top level numbered
        </P>
      </GListItem>

      <Heading2>
        Custom Text Styles
      </Heading2>

      <P>
        Custom font size:{' '}
        <S className="text-xl">Large text</S>
        {' '}and{' '}
        <S className="text-xs">Small text</S>
        .
      </P>

      <P>
        Custom colors:{' '}
        <S className="text-red-500">Red text</S>
        ,{' '}
        <S className="text-blue-500">Blue text</S>
        , and{' '}
        <S className="bg-green-500">Green background</S>
        .
      </P>

      <Heading2>
        Paragraph Spacing
      </Heading2>

      <P style={{ spaceAbove: { magnitude: 12, unit: 'PT' } }}>
        This paragraph has extra space above.
      </P>

      <P style={{ spaceBelow: { magnitude: 12, unit: 'PT' } }}>
        This paragraph has extra space below.
      </P>

      <P>
        Normal spacing paragraph.
      </P>

      <Heading2>
        Conclusion
      </Heading2>

      <P>
        This example demonstrates the flexibility of the React-GDoc framework. You can combine{' '}
        <S className="font-bold italic">various formatting options</S>
        , use{' '}
        <S className="text-blue-600">named styles</S>
        , and create{' '}
        <S className="text-base underline">custom styles</S>
        {' '}to create professional documents.
      </P>
    </>
  );
}

