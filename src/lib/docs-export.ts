import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

interface DocxExportOptions {
  title?: string;
  filename?: string;
}

export async function exportToDocx(htmlContent: string, options: DocxExportOptions = {}) {
  const { title = 'Contract Document', filename = 'contract.docx' } = options;

  try {
    // Parse HTML content and convert to docx elements
    const paragraphs = parseHtmlToDocxParagraphs(htmlContent);

    // Create the document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Title
            new Paragraph({
              children: [
                new TextRun({
                  text: title,
                  bold: true,
                  size: 32, // 16pt
                }),
              ],
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: {
                after: 400, // 20pt spacing after
              },
            }),
            // Content paragraphs
            ...paragraphs,
          ],
        },
      ],
    });

    // Generate docx file
    const buffer = await Packer.toBuffer(doc);
    
    // Save the file
    const uint8Array = new Uint8Array(buffer);
    saveAs(new Blob([uint8Array]), filename);
    
    return true;
  } catch (error) {
    console.error('Error exporting to docx:', error);
    throw new Error('Failed to export document');
  }
}

function parseHtmlToDocxParagraphs(htmlContent: string): Paragraph[] {
  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;

  const paragraphs: Paragraph[] = [];

  // Process each element
  const elements = tempDiv.children;
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const paragraph = convertElementToParagraph(element);
    if (paragraph) {
      paragraphs.push(paragraph);
    }
  }

  // If no paragraphs were created, fall back to text content
  if (paragraphs.length === 0) {
    const textContent = tempDiv.textContent || htmlContent;
    const lines = textContent.split('\n').filter(line => line.trim());
    
    for (const line of lines) {
      if (line.trim()) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line.trim(),
                size: 22, // 11pt
              }),
            ],
            spacing: {
              after: 200, // 10pt spacing after
            },
          })
        );
      }
    }
  }

  return paragraphs;
}

function convertElementToParagraph(element: Element): Paragraph | null {
  const tagName = element.tagName.toLowerCase();
  const textContent = element.textContent || '';
  
  if (!textContent.trim()) {
    return null;
  }

  let textRuns: TextRun[] = [];
  
  // Handle different HTML elements
  switch (tagName) {
    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      return new Paragraph({
        children: [
          new TextRun({
            text: textContent,
            bold: true,
            size: getHeadingSize(tagName),
          }),
        ],
        heading: getHeadingLevel(tagName),
        spacing: {
          before: 400, // 20pt spacing before
          after: 200,  // 10pt spacing after
        },
      });

    case 'p':
      textRuns = parseInlineElements(element);
      return new Paragraph({
        children: textRuns.length > 0 ? textRuns : [
          new TextRun({
            text: textContent,
            size: 22, // 11pt
          }),
        ],
        spacing: {
          after: 200, // 10pt spacing after
        },
      });

    case 'strong':
    case 'b':
      return new Paragraph({
        children: [
          new TextRun({
            text: textContent,
            bold: true,
            size: 22,
          }),
        ],
        spacing: {
          after: 200,
        },
      });

    case 'br':
      return new Paragraph({
        children: [
          new TextRun({
            text: '',
            size: 22,
          }),
        ],
        spacing: {
          after: 100,
        },
      });

    default:
      // For div, span, and other elements, treat as paragraph
      textRuns = parseInlineElements(element);
      if (textRuns.length > 0 || textContent.trim()) {
        return new Paragraph({
          children: textRuns.length > 0 ? textRuns : [
            new TextRun({
              text: textContent,
              size: 22,
            }),
          ],
          spacing: {
            after: 200,
          },
        });
      }
      return null;
  }
}

function parseInlineElements(element: Element): TextRun[] {
  const textRuns: TextRun[] = [];
  
  // If element has no children, just return the text content
  if (element.children.length === 0) {
    const text = element.textContent || '';
    if (text.trim()) {
      textRuns.push(
        new TextRun({
          text: text,
          size: 22,
          bold: ['strong', 'b'].includes(element.tagName.toLowerCase()),
          italics: ['em', 'i'].includes(element.tagName.toLowerCase()),
          underline: ['u'].includes(element.tagName.toLowerCase()) ? {} : undefined,
        })
      );
    }
    return textRuns;
  }

  // Process child nodes
  const childNodes = element.childNodes;
  for (let i = 0; i < childNodes.length; i++) {
    const node = childNodes[i];
    
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      if (text.trim()) {
        textRuns.push(
          new TextRun({
            text: text,
            size: 22,
          })
        );
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const childElement = node as Element;
      const childText = childElement.textContent || '';
      const tagName = childElement.tagName.toLowerCase();
      
      if (childText.trim()) {
        textRuns.push(
          new TextRun({
            text: childText,
            size: 22,
            bold: ['strong', 'b'].includes(tagName),
            italics: ['em', 'i'].includes(tagName),
            underline: ['u'].includes(tagName) ? {} : undefined,
          })
        );
      }
    }
  }
  
  return textRuns;
}

function getHeadingSize(tagName: string): number {
  switch (tagName) {
    case 'h1': return 32; // 16pt
    case 'h2': return 28; // 14pt
    case 'h3': return 26; // 13pt
    case 'h4': return 24; // 12pt
    case 'h5': return 22; // 11pt
    case 'h6': return 20; // 10pt
    default: return 22;   // 11pt
  }
}

function getHeadingLevel(tagName: string): typeof HeadingLevel[keyof typeof HeadingLevel] {
  switch (tagName) {
    case 'h1': return HeadingLevel.HEADING_1;
    case 'h2': return HeadingLevel.HEADING_2;
    case 'h3': return HeadingLevel.HEADING_3;
    case 'h4': return HeadingLevel.HEADING_4;
    case 'h5': return HeadingLevel.HEADING_5;
    case 'h6': return HeadingLevel.HEADING_6;
    default: return HeadingLevel.HEADING_1;
  }
}