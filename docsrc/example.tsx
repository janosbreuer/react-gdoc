import React from 'react';
import {
  GParagraph,
  GTextRun,
  GTable,
  GTableRow,
  GTableCell,
  GImage,
  GPageBreak,
  GHeading1,
  GHeading2,
} from '../src/primitives';

export default function ExampleDocument() {
  return (
    <>
      <GHeading1>
        <GTextRun content="React-GDoc Example Document" />
      </GHeading1>

      <GParagraph>
        <GTextRun content="This is an example document generated using the React-GDoc framework." />
      </GParagraph>

      <GHeading2>
        <GTextRun content="Introduction" />
      </GHeading2>

      <GParagraph>
        <GTextRun content="The React-GDoc framework allows you to create Google Docs documents using JSX syntax." />
      </GParagraph>

      <GParagraph>
        <GTextRun content="You can use various components like " />
        <GTextRun content="bold text" style={{ bold: true }} />
        <GTextRun content=", " />
        <GTextRun content="italic text" style={{ italic: true }} />
        <GTextRun content=", and more!" />
      </GParagraph>

      <GHeading2>
        <GTextRun content="Table Example" />
      </GHeading2>

      <GTable>
        <GTableRow>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Column 1" />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Column 2" />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Column 3" />
            </GParagraph>
          </GTableCell>
        </GTableRow>
        <GTableRow>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Row 1, Cell 1" />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Row 1, Cell 2" />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Row 1, Cell 3" />
            </GParagraph>
          </GTableCell>
        </GTableRow>
        <GTableRow>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Row 2, Cell 1" />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Row 2, Cell 2" />
            </GParagraph>
          </GTableCell>
          <GTableCell>
            <GParagraph>
              <GTextRun content="Row 2, Cell 3" />
            </GParagraph>
          </GTableCell>
        </GTableRow>
      </GTable>

      <GPageBreak />

      <GHeading2>
        <GTextRun content="Page Break Example" />
      </GHeading2>

      <GParagraph>
        <GTextRun content="The previous page break should have created a new page." />
      </GParagraph>
    </>
  );
}

