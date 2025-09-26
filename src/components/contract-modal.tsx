// src/components/ContractModal.tsx
"use client";

import dynamic from "next/dynamic";
import { Contract } from "./contract-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const ContractPdfViewer = dynamic(() => import("./contract-pdf-viewer"), {
  ssr: false,
});

interface PreviewContractModalProps {
  contract: Contract | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PreviewContractModal({
  contract,
  open,
  onOpenChange,
}: PreviewContractModalProps) {
  if (!contract) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{contract.title}</DialogTitle>
          <DialogDescription>
            Preview contract details and download file if needed.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6 mt-4">
          {contract.fileUrl && (
            <div className="w-full min-w-0 max-h-[80vh] overflow-auto">
              <ContractPdfViewer fileUrl={contract.fileUrl} />
            </div>
          )}

          <div className="w-full min-w-0 space-y-3 overflow-auto p-2 border rounded">
            <p>
              <strong>Parties:</strong> {contract.parties}
            </p>
            <p>
              <strong>Category:</strong> {contract.category}
            </p>
            <p>
              <strong>Status:</strong> {contract.status}
            </p>
            <p>
              <strong>Uploaded By:</strong> {contract.user.username} (
              {contract.user.role})
            </p>

            {contract.fileUrl && (
              <div className="mt-4">
                <a
                  href={contract.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Open Contract File
                </a>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
