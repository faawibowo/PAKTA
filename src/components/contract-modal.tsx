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

// Disable SSR supaya hanya render di browser
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
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>{contract.title}</DialogTitle>
          <DialogDescription>
            Preview contract details and download file if needed.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 mt-4">
          {contract.fileUrl && <ContractPdfViewer fileUrl={contract.fileUrl} />}

          <div className="w-1/2 space-y-2">
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
