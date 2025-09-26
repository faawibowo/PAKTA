interface PdfExportOptions {
  title?: string;
  filename?: string;
}

export async function exportToPdf(htmlContent: string, options: PdfExportOptions = {}) {
  const {
    title = 'Contract Document',
    filename = 'contract.pdf',
  } = options;

  try {
    // Create a new window/tab for printing
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      throw new Error('Unable to open print window. Please allow popups and try again.');
    }

    // Create properly styled HTML for PDF
    const styledHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          @media print {
            @page {
              size: A4;
              margin: 1in;
            }
            
            body {
              font-family: 'Times New Roman', serif;
              font-size: 12pt;
              line-height: 1.6;
              color: #000;
              max-width: none;
              margin: 0;
              padding: 0;
            }
            
            h1 {
              font-size: 16pt;
              font-weight: bold;
              text-align: center;
              text-transform: uppercase;
              margin: 0 0 30pt 0;
              page-break-after: avoid;
            }
            
            h2 {
              font-size: 14pt;
              font-weight: bold;
              text-transform: uppercase;
              margin: 20pt 0 10pt 0;
              page-break-after: avoid;
            }
            
            h3, h4, h5, h6 {
              font-size: 12pt;
              font-weight: bold;
              margin: 15pt 0 8pt 0;
              page-break-after: avoid;
            }
            
            p {
              margin: 0 0 12pt 0;
              text-align: justify;
              orphans: 2;
              widows: 2;
            }
            
            strong, b {
              font-weight: bold;
            }
            
            em, i {
              font-style: italic;
            }
            
            ol, ul {
              margin: 0 0 12pt 0;
              padding-left: 30pt;
            }
            
            li {
              margin: 0 0 6pt 0;
            }
            
            .page-break {
              page-break-before: always;
            }
            
            .signature-section {
              margin-top: 40pt;
              page-break-inside: avoid;
            }
            
            .signature-line {
              border-bottom: 1pt solid #000;
              margin: 20pt 0 5pt 0;
              height: 20pt;
            }
          }
          
          @media screen {
            body {
              font-family: 'Times New Roman', serif;
              max-width: 800px;
              margin: 40px auto;
              padding: 20px;
              line-height: 1.6;
              background: white;
              box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            
            h1 {
              text-align: center;
              font-size: 18pt;
              font-weight: bold;
              margin-bottom: 30px;
              text-transform: uppercase;
            }
            
            h2 {
              font-size: 14pt;
              font-weight: bold;
              text-transform: uppercase;
              margin: 25px 0 15px 0;
            }
            
            h3, h4, h5, h6 {
              font-weight: bold;
              margin: 20px 0 10px 0;
            }
            
            p {
              margin-bottom: 12px;
              text-align: justify;
            }
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        ${htmlContent}
        
        <script>
          window.onload = function() {
            // Small delay to ensure fonts are loaded
            setTimeout(function() {
              window.print();
            }, 500);
          };
          
          // Close window after printing or canceling
          window.onafterprint = function() {
            window.close();
          };
        </script>
      </body>
      </html>
    `;

    // Write the content to the new window
    printWindow.document.write(styledHtml);
    printWindow.document.close();
    
    return true;

  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error('Failed to export document to PDF');
  }
}