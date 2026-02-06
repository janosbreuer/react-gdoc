import React from 'react';
import { RequestBuilder } from './RequestBuilder';
import type { VirtualNode, VirtualNodeType } from './VirtualNode';
import type { Request, Document } from '../components/primitives/types';
import { docs_v1 } from 'googleapis';

type TextStyle = docs_v1.Schema$TextStyle;
type ParagraphStyle = docs_v1.Schema$ParagraphStyle;
type BatchUpdateFn = (requests: Request[]) => Promise<void>;
type GetDocumentFn = () => Promise<Document>;


const KNOWN_VIRTUAL_NODE_TYPES: VirtualNodeType[] = [
  'GTextRun', 'GParagraph', 'GPageBreak', 'GColumnBreak', 'GHorizontalRule',
  'GFootnoteReference', 'GEquation', 'GInlineObject', 'GTable', 'GTableRow',
  'GTableCell', 'GSectionBreak', 'GListItem', 'GImage'
];

interface TextStyleUpdate {
  startIndex: number;
  endIndex: number;
  style: TextStyle;
}

interface RenderContext {
  requestBuilder: RequestBuilder;
  startIndex: number;
  previousNodeWasParagraph: boolean;
  paragraphContext: ParagraphContext | null;
  tableNodesReversed: VirtualNode[];
}

interface ParagraphContext {
  textStyleUpdates: TextStyleUpdate[];
  cursorIndex: number;
}

export class GDocRenderer {

  constructor(
    private batchUpdate: BatchUpdateFn,
    private getDocument: GetDocumentFn
  ) {}

  // --- Renderelés ---
  async render(element: React.ReactElement, startIndex: number = 1): Promise<void> {
    
    const node = this.jsxToVirtualNode(element);
    if (!node) return;

    console.debug('Virtual Node Tree:', JSON.stringify(node, null, 2));

    await this.renderNode(node, startIndex);
  }

  private async renderNode(node: VirtualNode, startIndex: number): Promise<void> {

    const requestBuilder = new RequestBuilder();
    const renderContext: RenderContext = {
      requestBuilder,
      startIndex,
      previousNodeWasParagraph: false,
      paragraphContext: null,
      tableNodesReversed: [],
    };

    // 1. FÁZIS: Szövegek és üres táblázatok beszúrása
    this.renderInsertPhase(node, renderContext);
    const initialRequests = requestBuilder.getAllRequests();
    if (initialRequests.length > 0) {
      await this.batchUpdate(initialRequests);
    }

    if (renderContext.tableNodesReversed.length > 0) {
      // lekérjük a dokumentumot, hogy a táblázatcellák indexeit meg tudjuk határozni
      const doc = await this.getDocument();

      // felsoroljuk a táblázatokat a dokumentumban hátulról előre
      const content = doc.body?.content || [];
      const tablesReversed = content.filter(el => el.table).map(el => el.table!).reverse();
      if (tablesReversed.length !== renderContext.tableNodesReversed.length) {
        throw new Error('The number of tables in the document does not match the number of tables in the virtual tree');
      }
      const tableUpdateBuilder = new RequestBuilder();
      for (let i = 0; i < tablesReversed.length; i++) {
        const tableInDoc = tablesReversed[i];
        const tableNode = renderContext.tableNodesReversed[i];

        this.renderTableContent(tableNode, tableInDoc, tableUpdateBuilder);
      }
      const tableUpdateRequests = tableUpdateBuilder.getAllRequests();
      if (tableUpdateRequests.length > 0) {
        await this.batchUpdate(tableUpdateRequests);
      }
    }
  }

  private renderInsertPhase(node: VirtualNode, renderContext: RenderContext): number {
    let length = 0;
    let isParagraph = false;
    switch (node.type) {
      case 'GTextRun':
        length = this.handleTextRun(node, renderContext);
        break;
      case 'GParagraph':
        length = this.handleParagraph(node, renderContext);
        isParagraph = true;
        break;
      case 'GTable':
        // Csak üres táblázatot szúrunk be, és elmentjük a node-ot a táblázatok listájába
        const rows = node.children?.length || 1;
        const cols = node.children?.[0]?.children?.length || 1;
        renderContext.requestBuilder.addInsertTable(rows, cols, renderContext.startIndex);
        renderContext.tableNodesReversed.push(node);
        length = rows * cols;
        break;
      default:
        if (node.children) {
          [...node.children].reverse().forEach(child => {
            length += this.renderInsertPhase(child, renderContext);
          });
        }
        break;
    }
    renderContext.previousNodeWasParagraph = isParagraph;
    return length;
  }

  private handleParagraph(node: VirtualNode, renderContext: RenderContext): number {
    const { requestBuilder, startIndex, previousNodeWasParagraph } = renderContext;
    if (renderContext.paragraphContext) {
      throw new Error('Paragraphs cannot be nested');
    }
    if (previousNodeWasParagraph) {
      requestBuilder.addInsertText('\n', renderContext.startIndex);
    }
    renderContext.paragraphContext = {
      textStyleUpdates: [],
      cursorIndex: startIndex
    };
    const paragraphContext = renderContext.paragraphContext;
    
    if (node.children) {
      [...node.children].forEach(child => {
        paragraphContext.cursorIndex += this.renderInsertPhase(child, renderContext);
      });
    }
    
    const rawStyle = (node.props.paragraphStyle || node.props.style) as ParagraphStyle | null | undefined;

    const effectiveStyle: ParagraphStyle = rawStyle || {};
    if (!effectiveStyle.namedStyleType) {
      effectiveStyle.namedStyleType = 'NORMAL_TEXT';
    }

    console.log('Effective style:', effectiveStyle);
    requestBuilder.addUpdateParagraphStyle(startIndex, paragraphContext.cursorIndex, effectiveStyle);
    
    for (const textStyleUpdate of paragraphContext.textStyleUpdates) {
      console.log('Text style update:', textStyleUpdate);
      requestBuilder.addUpdateTextStyle(textStyleUpdate.startIndex, textStyleUpdate.endIndex, textStyleUpdate.style);
    }

    const length = renderContext.paragraphContext.cursorIndex - renderContext.startIndex;
    renderContext.paragraphContext = null;
    return length;
  }

  private handleTextRun(node: VirtualNode, renderContext: RenderContext): number {
    const { requestBuilder, paragraphContext } = renderContext;
    if (!paragraphContext) {
      throw new Error('Text runs must be inside a paragraph');
    }
    const cursorIndex = paragraphContext.cursorIndex;
    const content = node.props.content || '';
    if (!content || content.length === 0) return 0;
    requestBuilder.addInsertText(content, cursorIndex);
    
    const style = node.props.style || node.props.textStyle;
    if (style) {
      paragraphContext.textStyleUpdates.push({ 
        startIndex: cursorIndex, 
        endIndex: cursorIndex + content.length, 
        style 
      });
    }
    return content.length;
  }

  private renderTableContent(node: VirtualNode, table: docs_v1.Schema$Table, requestBuilder: RequestBuilder) {

    // megyünk hátulról előre a táblázat celláin
    const rowNodesReversed = node.children?.reverse() || [];
    const rowsInDocReversed = table.tableRows?.reverse() || [];

    for (let i = 0; i < rowNodesReversed.length; i++) {
      const rowNode = rowNodesReversed[i];
      const rowInDoc = rowsInDocReversed[i];

      const cellNodesReversed = rowNode.children?.reverse() || [];
      const cellsInDocReversed = rowInDoc?.tableCells?.reverse() || [];

      for (let j = 0; j < cellNodesReversed.length; j++) {
        const cellNode = cellNodesReversed[j];
        const cellInDoc = cellsInDocReversed[j];

        console.log('Cell in doc structure:', {
          cellStartIndex: cellInDoc?.startIndex,
          cellEndIndex: cellInDoc?.endIndex
        });

        function getConcatenatedNodeContent(node: VirtualNode): string {
          if (node.type === 'GTextRun') {
            return node.props.content || '';
          }
          return node.children?.reduce((acc, child) => acc + getConcatenatedNodeContent(child), '') || '';
        }
        const concatenatedNodeContent = getConcatenatedNodeContent(cellNode);
        console.log('Node content:', concatenatedNodeContent);

        const renderContext: RenderContext = {
          requestBuilder,
          startIndex: cellInDoc.startIndex! + 1,
          previousNodeWasParagraph: false,
          paragraphContext: null,
          tableNodesReversed: [],
        };
        this.renderInsertPhase(cellNode, renderContext);
      }
    }
  }
  private jsxToVirtualNode(element: React.ReactElement | React.ReactNode): VirtualNode | null {
    if (!element || typeof element === 'boolean') return null;
    if (typeof element === 'string' || typeof element === 'number') {
      return { type: 'GTextRun', props: { content: String(element) }, children: [] };
    }
    if (Array.isArray(element)) {
      return { type: 'Fragment', props: {}, children: element.map(c => this.jsxToVirtualNode(c)).filter((n): n is VirtualNode => n !== null) };
    }
    if (React.isValidElement(element)) {
      const type = element.type as any;
      const typeName = this.getComponentTypeName(type);
      const props = element.props || {};
      if (typeof type === 'function' && typeName === 'Fragment') {
        try { return this.jsxToVirtualNode(type(props)); } catch (e) { return null; }
      }
      return {
        type: typeName,
        props: { ...props, children: undefined },
        children: React.Children.toArray(props.children).map(c => this.jsxToVirtualNode(c)).filter((n): n is VirtualNode => n !== null),
      };
    }
    return null;
  }

  private getComponentTypeName(type: any): VirtualNodeType {
    if (typeof type === 'string') return type as VirtualNodeType;
    const name = type.displayName || type.name;
    return KNOWN_VIRTUAL_NODE_TYPES.includes(name) ? name : 'Fragment';
  }
}
