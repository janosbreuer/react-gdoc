import React from 'react';
import type { Request } from '../components/primitives/types';
import type {
  GTextRunProps,
  GPageBreakProps,
  GColumnBreakProps,
  GHorizontalRuleProps,
  GFootnoteReferenceProps,
  GEquationProps,
  GInlineObjectProps,
  GParagraphProps,
  GTableProps,
  GTableRowProps,
  GTableCellProps,
  GSectionBreakProps,
  GImageProps,
} from '../components/primitives';

export type VirtualNodeType =
  | 'GTextRun'
  | 'GPageBreak'
  | 'GColumnBreak'
  | 'GHorizontalRule'
  | 'GFootnoteReference'
  | 'GEquation'
  | 'GInlineObject'
  | 'GParagraph'
  | 'GList'
  | 'GTable'
  | 'GTableRow'
  | 'GTableCell'
  | 'GSectionBreak'
  | 'GImage'
  | 'GHeading1'
  | 'GHeading2'
  | 'GHeading3'
  | 'GHeading4'
  | 'GHeading5'
  | 'GHeading6'
  | 'Fragment'
  | 'GDocument';

export interface VirtualNode {
  type: VirtualNodeType;
  props: Record<string, any>;
  children?: VirtualNode[];
}


