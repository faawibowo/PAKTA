// Server-side PDF generation utility
import jsPDF from 'jspdf';

export async function generatePdfFromHtml(htmlContent: string, title: string = 'Contract Document'): Promise<Buffer> {
  try {
    // Create new jsPDF instance with same settings as client-side
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set up document properties
    pdf.setProperties({
      title: title,
      subject: 'Contract Document',
      author: 'PAKTA Contract System',
      creator: 'PAKTA'
    });

    // Clean and process HTML content (same as client-side)
    const cleanContent = cleanHtmlForPdf(htmlContent);
    
    // Parse HTML and add content to PDF (same as client-side)
    await addHtmlContentToPdf(pdf, cleanContent, title);
    
    // Convert PDF to buffer instead of downloading
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'));
    
    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF from HTML:', error);
    throw new Error('Failed to generate PDF document');
  }
}

function cleanHtmlForPdf(htmlContent: string): string {
  // Remove HTML tags and extract text content with basic formatting
  // (Exact same logic as client-side)
  let text = htmlContent;
  
  // Replace common HTML entities
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  
  // Convert HTML formatting to plain text markers
  text = text.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n\n**TITLE:$1**\n\n');
  text = text.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n\n**$1**\n\n');
  text = text.replace(/<h[3-6][^>]*>(.*?)<\/h[3-6]>/gi, '\n\n*$1*\n\n');
  text = text.replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**');
  text = text.replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**');
  text = text.replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*');
  text = text.replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*');
  
  // Handle lists
  text = text.replace(/<ul[^>]*>/gi, '\n');
  text = text.replace(/<\/ul>/gi, '\n');
  text = text.replace(/<ol[^>]*>/gi, '\n');
  text = text.replace(/<\/ol>/gi, '\n');
  text = text.replace(/<li[^>]*>(.*?)<\/li>/gi, '• $1\n');
  
  // Handle paragraphs
  text = text.replace(/<p[^>]*>/gi, '\n');
  text = text.replace(/<\/p>/gi, '\n');
  text = text.replace(/<br[^>]*>/gi, '\n');
  
  // Remove remaining HTML tags
  text = text.replace(/<[^>]*>/g, '');
  
  // Clean up extra whitespace
  text = text.replace(/\n\s*\n\s*\n/g, '\n\n');
  text = text.replace(/^\s+|\s+$/g, '');
  
  return text;
}

async function addHtmlContentToPdf(pdf: jsPDF, content: string, title: string) {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const lineHeight = 7;
  const maxWidth = pageWidth - (2 * margin);
  
  let currentY = margin;
  
  // Add title
  pdf.setFontSize(16);
  pdf.setFont('times', 'bold');
  const titleLines = pdf.splitTextToSize(title.toUpperCase(), maxWidth);
  pdf.text(titleLines, margin, currentY);
  currentY += titleLines.length * (lineHeight + 2);
  
  // Add a line under title
  pdf.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 10;
  
  // Process content
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    if (line === '') {
      currentY += 3;
      continue;
    }
    
    // Check if we need a new page
    if (currentY > pageHeight - margin - 20) {
      pdf.addPage();
      currentY = margin;
    }
    
    // Handle different formatting
    if (line.startsWith('**TITLE:') && line.endsWith('**')) {
      // Main title
      pdf.setFontSize(14);
      pdf.setFont('times', 'bold');
      line = line.replace(/\*\*TITLE:(.*)\*\*/, '$1');
    } else if (line.startsWith('**') && line.endsWith('**')) {
      // Bold heading
      pdf.setFontSize(12);
      pdf.setFont('times', 'bold');
      line = line.replace(/\*\*(.*)\*\*/, '$1');
    } else if (line.startsWith('*') && line.endsWith('*')) {
      // Italic heading
      pdf.setFontSize(11);
      pdf.setFont('times', 'italic');
      line = line.replace(/\*(.*)\*/, '$1');
    } else if (line.startsWith('•')) {
      // Bullet point
      pdf.setFontSize(10);
      pdf.setFont('times', 'normal');
    } else {
      // Regular text
      pdf.setFontSize(10);
      pdf.setFont('times', 'normal');
    }
    
    // Split long lines
    const textLines = pdf.splitTextToSize(line, maxWidth);
    
    // Add text to PDF
    pdf.text(textLines, margin, currentY);
    currentY += textLines.length * lineHeight;
    
    // Add extra space after headings
    if (line.match(/^\*\*.*\*\*$/) || line.match(/^\*.*\*$/)) {
      currentY += 3;
    }
  }
  
  // Add generation date at bottom
  const date = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  pdf.setFontSize(8);
  pdf.setFont('times', 'normal');
  pdf.text(`Generated on ${date}`, margin, pageHeight - 15);
}