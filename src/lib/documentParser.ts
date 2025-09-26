// Dynamic imports to avoid SSR issues
let pdfjs: any = null;

// Initialize PDF.js only on client side
const initializePdfJs = async () => {
  if (typeof window !== 'undefined' && !pdfjs) {
    const reactPdf = await import('react-pdf');
    pdfjs = reactPdf.pdfjs;
    
    // Set worker source to local file to match react-pdf version
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  }
};

export async function extractTextFromFile(file: File): Promise<string> {
  // Only run on client side
  if (typeof window === 'undefined') {
    throw new Error('File parsing is only available on the client side');
  }

  const fileType = file.type;
  const fileName = file.name.toLowerCase();
  
  try {
    // Handle PDF files
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      await initializePdfJs();
      return await extractTextFromPDF(file);
    }
    
    // Handle plain text files
    if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      return await file.text();
    }
    
    // Handle DOCX files (basic approach)
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
      // For DOCX, you'd need a library like mammoth.js
      // For now, we'll throw an error
      throw new Error('DOCX files are not yet supported. Please convert to PDF or TXT.');
    }
    
    // Default fallback
    return await file.text();
    
  } catch (error) {
    console.error('Error extracting text from file:', error);
    throw new Error(`Failed to extract text from ${fileName}`);
  }
}

async function extractTextFromPDF(file: File): Promise<string> {
  if (!pdfjs) {
    throw new Error('PDF.js not initialized');
  }
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument(arrayBuffer).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    
    fullText += pageText + '\n';
  }

  return fullText.trim();
}