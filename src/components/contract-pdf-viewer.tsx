// src/components/ContractPdfViewer.tsx
"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "pdfjs-dist/web/pdf_viewer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

interface ContractPdfViewerProps {
  fileUrl: string;
}

export default function ContractPdfViewer({ fileUrl }: ContractPdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="w-1/2 h-[600px] overflow-auto border p-2">
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<p>Loading PDF...</p>}
      >
        {Array.from({ length: numPages ?? 0 }, (_, index) => (
          <Page
            renderTextLayer={false}
            renderAnnotationLayer={false}
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            width={400}
          />
        ))}
      </Document>
    </div>
  );
}
