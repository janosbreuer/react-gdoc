import React from 'react';
import {
  GParagraph,
  GTextRun,
  GHeading1,
  GHeading2,
  GHeading3,
  GListItem,
  GPageBreak,
} from '@react-gdoc/primitives';

export default function AdvancedExample() {
  return (
    <>
      <GHeading1>
        <GTextRun content="Advanced React-GDoc Example" />
      </GHeading1>

      <GParagraph>
        <GTextRun content="This document demonstrates various formatting options, headers, lists, and custom styles." />
      </GParagraph>

      <GPageBreak />

      <GHeading2>
        <GTextRun content="Text Formatting" />
      </GHeading2>

      <GParagraph>
        <GTextRun content="You can use " />
        <GTextRun content="bold text" style={{ bold: true }} />
        <GTextRun content=", " />
        <GTextRun content="italic text" style={{ italic: true }} />
        <GTextRun content=", " />
        <GTextRun content="underlined text" style={{ underline: true }} />
        <GTextRun content=", and " />
        <GTextRun content="strikethrough text" style={{ strikethrough: true }} />
        <GTextRun content="." />
      </GParagraph>

      <GParagraph>
        <GTextRun content="You can also combine formats: " />
        <GTextRun content="bold and italic" style={{ bold: true, italic: true }} />
        <GTextRun content=", or " />
        <GTextRun content="bold and underlined" style={{ bold: true, underline: true }} />
        <GTextRun content="." />
      </GParagraph>

      <GHeading2>
        <GTextRun content="Named Styles" />
      </GHeading2>

      <GParagraph style={{ namedStyleType: 'TITLE' }}>
        <GTextRun content="This paragraph uses the TITLE named style." />
      </GParagraph>

      <GParagraph style={{ namedStyleType: 'SUBTITLE' }}>
        <GTextRun content="This paragraph uses the SUBTITLE named style." />
      </GParagraph>

      <GParagraph style={{ namedStyleType: 'HEADING_1' }}>
        <GTextRun content="This paragraph uses HEADING_1 named style (alternative to GHeading1)." />
      </GParagraph>

      <GHeading3>
        <GTextRun content="Custom Paragraph Styles" />
      </GHeading3>

      <GParagraph style={{ alignment: 'CENTER' }}>
        <GTextRun content="This paragraph is centered." />
      </GParagraph>

      <GParagraph style={{ alignment: 'END' }}>
        <GTextRun content="This paragraph is right-aligned." />
      </GParagraph>

      <GParagraph style={{ alignment: 'JUSTIFIED' }}>
        <GTextRun content="This paragraph is justified. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
      </GParagraph>

      <GHeading2>
        <GTextRun content="Lists" />
      </GHeading2>

      <GParagraph>
        <GTextRun content="Unordered list items:" />
      </GParagraph>

      <GListItem nestingLevel={0} ordered={false}>
        <GParagraph>
          <GTextRun content="First item" />
        </GParagraph>
      </GListItem>

      <GListItem nestingLevel={0} ordered={false}>
        <GParagraph>
          <GTextRun content="Second item with " />
          <GTextRun content="bold text" style={{ bold: true }} />
        </GParagraph>
      </GListItem>

      <GListItem nestingLevel={0} ordered={false}>
        <GParagraph>
          <GTextRun content="Third item" />
        </GParagraph>
      </GListItem>

      <GListItem nestingLevel={1} ordered={false}>
        <GParagraph>
          <GTextRun content="Nested item (level 1)" />
        </GParagraph>
      </GListItem>

      <GListItem nestingLevel={1} ordered={false}>
        <GParagraph>
          <GTextRun content="Another nested item" />
        </GParagraph>
      </GListItem>

      <GListItem nestingLevel={0} ordered={false}>
        <GParagraph>
          <GTextRun content="Back to top level" />
        </GParagraph>
      </GListItem>

      <GParagraph>
        <GTextRun content="Ordered list items:" />
      </GParagraph>

      <GListItem nestingLevel={0} ordered={true}>
        <GParagraph>
          <GTextRun content="First numbered item" />
        </GParagraph>
      </GListItem>

      <GListItem nestingLevel={0} ordered={true}>
        <GParagraph>
          <GTextRun content="Second numbered item" />
        </GParagraph>
      </GListItem>

      <GListItem nestingLevel={1} ordered={true}>
        <GParagraph>
          <GTextRun content="Nested numbered item (level 1)" />
        </GParagraph>
      </GListItem>

      <GListItem nestingLevel={1} ordered={true}>
        <GParagraph>
          <GTextRun content="Another nested numbered item" />
        </GParagraph>
      </GListItem>

      <GListItem nestingLevel={0} ordered={true}>
        <GParagraph>
          <GTextRun content="Back to top level numbered" />
        </GParagraph>
      </GListItem>

      <GHeading2>
        <GTextRun content="Custom Text Styles" />
      </GHeading2>

      <GParagraph>
        <GTextRun content="Custom font size: " />
        <GTextRun content="Large text" style={{ fontSize: { magnitude: 18, unit: 'PT' } }} />
        <GTextRun content=" and " />
        <GTextRun content="Small text" style={{ fontSize: { magnitude: 8, unit: 'PT' } }} />
        <GTextRun content="." />
      </GParagraph>

      <GParagraph>
        <GTextRun content="Custom colors: " />
        <GTextRun 
          content="Red text" 
          style={{ 
            foregroundColor: { 
              color: { rgbColor: { red: 1, green: 0, blue: 0 } } 
            } 
          }} 
        />
        <GTextRun content=", " />
        <GTextRun 
          content="Blue text" 
          style={{ 
            foregroundColor: { 
              color: { rgbColor: { red: 0, green: 0, blue: 1 } } 
            } 
          }} 
        />
        <GTextRun content=", and " />
        <GTextRun 
          content="Green background" 
          style={{ 
            backgroundColor: { 
              color: { rgbColor: { red: 0, green: 1, blue: 0 } } 
            } 
          }} 
        />
        <GTextRun content="." />
      </GParagraph>

      <GHeading2>
        <GTextRun content="Paragraph Spacing" />
      </GHeading2>

      <GParagraph style={{ spaceAbove: { magnitude: 12, unit: 'PT' } }}>
        <GTextRun content="This paragraph has extra space above." />
      </GParagraph>

      <GParagraph style={{ spaceBelow: { magnitude: 12, unit: 'PT' } }}>
        <GTextRun content="This paragraph has extra space below." />
      </GParagraph>

      <GParagraph>
        <GTextRun content="Normal spacing paragraph." />
      </GParagraph>

      <GHeading2>
        <GTextRun content="Conclusion" />
      </GHeading2>

      <GParagraph>
        <GTextRun content="This example demonstrates the flexibility of the React-GDoc framework. You can combine " />
        <GTextRun content="various formatting options" style={{ bold: true, italic: true }} />
        <GTextRun content=", use " />
        <GTextRun content="named styles" style={{ foregroundColor: { color: { rgbColor: { red: 0.2, green: 0.4, blue: 0.8 } } } }} />
        <GTextRun content=", and create " />
        <GTextRun content="custom styles" style={{ fontSize: { magnitude: 14, unit: 'PT' }, underline: true }} />
        <GTextRun content=" to create professional documents." />
      </GParagraph>
    </>
  );
}

