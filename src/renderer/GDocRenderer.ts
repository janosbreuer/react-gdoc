import React from 'react';
import { RequestBuilder } from './RequestBuilder';
import type { VirtualNode, VirtualNodeType } from './VirtualNode';
import type { Request, Document } from '../components/primitives/types';
import { docs_v1 } from 'googleapis';

type TextStyle = docs_v1.Schema$TextStyle;
type ParagraphStyle = docs_v1.Schema$ParagraphStyle;
type BatchUpdateFn = (requests: Request[]) => Promise<void>;
type GetDocumentFn = () => Promise<Document>;

interface QueuedTable {
  node: VirtualNode;
  startIndex: number;
}


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
}

interface ParagraphContext {
  textStyleUpdates: TextStyleUpdate[];
  cursorIndex: number;
}

export class GDocRenderer {

  private tableQueue: QueuedTable[] = [];
  constructor(
    private batchUpdate: BatchUpdateFn,
    private getDocument: GetDocumentFn
  ) {}

  // --- Renderelés ---
  async render(element: React.ReactElement, startIndex: number = 1): Promise<void> {
    
    const node = this.jsxToVirtualNode(element);
    if (!node) return;

    await this.renderNode(node, startIndex);
  }

  private async renderNode(node: VirtualNode, startIndex: number): Promise<void> {

    const requestBuilder = new RequestBuilder();
    const renderContext: RenderContext = {
      requestBuilder,
      startIndex,
      previousNodeWasParagraph: false,
      paragraphContext: null,
    };

    // 1. FÁZIS: Szövegek és üres táblázatok beszúrása
    this.renderInsertPhase(node, renderContext);
    const initialRequests = requestBuilder.getAllRequests();
    if (initialRequests.length > 0) {
      await this.batchUpdate(initialRequests);
    }

    // if (this.tableQueue.length === 0) return;

    // // 2. FÁZIS: Pontos indexek lekérése a dokumentumból
    // const doc = await this.getDocument();
    // const tableUpdateBuilder = new RequestBuilder();

    // // A táblázatokat sorrendben szúrtuk be, de a tartalommal hátulról előre kell tölteni
    // // a dokumentum indexstabilitása miatt.
    // for (let i = this.tableQueue.length - 1; i >= 0; i--) {
    //   const queued = this.tableQueue[i];
    //   // Megkeressük a táblázatot a lekért dokumentumban a mentett startIndex alapján
    //   const table = this.findTableAt(doc, queued.startIndex);
      
    //   if (table && table.tableRows) {
    //     this.fillTableContent(queued.node, table, { ...renderContext, requestBuilder: tableUpdateBuilder });
    //   }
    // }

    // const finalRequests = tableUpdateBuilder.getAllRequests();
    // if (finalRequests.length > 0) {
    //   await this.batchUpdate(finalRequests);
    // }
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
        // Csak üres vázat szúrunk be, és elmentjük a pozíciót
        // const rows = node.children?.length || 1;
        // const cols = node.children?.[0]?.children?.length || 1;
        // renderContext.requestBuilder.addInsertTable(rows, cols, renderContext.startIndex);
        // this.tableQueue.push({ node, startIndex: renderContext.startIndex });
        // length = 1;
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

    const effectiveStyle: ParagraphStyle =
      !rawStyle || Object.keys(rawStyle).length === 0
        ? { namedStyleType: 'NORMAL_TEXT' }
        : rawStyle;

    requestBuilder.addUpdateParagraphStyle(startIndex, paragraphContext.cursorIndex, effectiveStyle);
    
    for (const textStyleUpdate of paragraphContext.textStyleUpdates) {
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

  private fillTableContent(node: VirtualNode, table: docs_v1.Schema$Table, renderContext: RenderContext) {
    const vRows = node.children || [];
    
    // Végigmegyünk a táblázat sorain és celláin
    vRows.forEach((vRow, rIndex) => {
      const vCells = vRow.children || [];
      const docRow = table.tableRows?.[rIndex];

      vCells.forEach((vCell, cIndex) => {
        const docCell = docRow?.tableCells?.[cIndex];
        if (docCell && docCell.content && vCell.children) {
          // A Google Docs minden cellába tesz egy alapértelmezett üres paragrafust.
          // Ennek az indexe a cella kezdete.
          const cellContentStart = docCell.startIndex! + 1;
          
          // A cella tartalmát hátulról előre szúrjuk be
          [...vCell.children].reverse().forEach(child => {
            this.renderInsertPhase(child, { ...renderContext, startIndex: cellContentStart });
          });
        }
      });
    });
  }

  private findTableAt(doc: Document, index: number): docs_v1.Schema$Table | null {
    // Megkeressük a StructuralElement-et a megadott indexen
    const element = doc.body?.content?.find(el => el.startIndex === index);
    return element?.table || null;
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
