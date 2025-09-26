"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Edit3, FileText, Code, Save, Download, FileDown } from "lucide-react";
import { exportToDocx } from "@/lib/docs-export";
import { exportToPdf } from "@/lib/pdf-export";
import { toast } from "sonner";

interface DraftPreviewProps {
  draft: string | null;
  isEditing: boolean;
  viewMode: "preview" | "html";
  contractTitle?: string;
  onEditToggle: () => void;
  onSaveDraft: (content?: string) => void;
  onCancelEdit: () => void;
  onViewModeChange: (mode: "preview" | "html") => void;
}

export function DraftPreview({
  draft,
  isEditing,
  viewMode,
  contractTitle,
  onEditToggle,
  onSaveDraft,
  onCancelEdit,
  onViewModeChange,
}: DraftPreviewProps) {
  const [mounted, setMounted] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleExportDocx = async () => {
    if (!draft) {
      toast.error('No draft available to export');
      return;
    }

    try {
      const title = contractTitle || 'Contract Document';
      const filename = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.docx`;
      
      await exportToDocx(draft, {
        title: title,
        filename: filename
      });
      
      toast.success('Contract exported to DOCX successfully!');
    } catch (error) {
      console.error('Error exporting to DOCX:', error);
      toast.error('Failed to export contract. Please try again.');
    }
  };

  const handleExportPdf = async () => {
    if (!draft) {
      toast.error('No draft available to export');
      return;
    }

    try {
      const title = contractTitle || 'Contract Document';
      const filename = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      await exportToPdf(draft, {
        title: title,
        filename: filename
      });
      
      toast.success('Contract exported to PDF successfully!');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast.error('Failed to export contract. Please try again.');
    }
  };
  const quillRef = useRef<any>(null);

  useEffect(() => setMounted(true), []);

  // Initialize Quill editor when editing mode is activated
  useEffect(() => {
    if (isEditing && editorRef.current && mounted) {
      // Completely clear the editor container first
      editorRef.current.innerHTML = '';
      
      // If there's already a Quill instance, destroy it first
      if (quillRef.current) {
        quillRef.current = null;
      }

      const Quill = require('quill').default;
      
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            ["link"],
            [{ align: [] }],
            ["clean"],
          ],
        },
        formats: [
          "header",
          "bold",
          "italic",
          "underline",
          "strike",
          "list",
          "indent",
          "link",
          "align",
        ]
      });

      // Set initial content from current draft
      if (draft) {
        quillRef.current.root.innerHTML = draft;
      }
    }

    // Cleanup function - runs when component unmounts or dependencies change
    return () => {
      if (!isEditing && quillRef.current) {
        try {
          quillRef.current.disable();
          quillRef.current.off('text-change');
          if (editorRef.current) {
            // Find and remove toolbar element
            const toolbar = editorRef.current.parentNode?.querySelector('.ql-toolbar');
            if (toolbar) {
              toolbar.remove();
            }
            editorRef.current.innerHTML = '';
          }
        } catch (error) {
          console.warn('Error cleaning up Quill in useEffect:', error);
        }
        quillRef.current = null;
      }
    };
  }, [isEditing, mounted, draft]);

  const handleSaveDraft = () => {
    let content = draft || "";
    
    // Get content from Quill editor if it exists
    if (quillRef.current) {
      content = quillRef.current.root.innerHTML;
      
      // Properly destroy Quill instance
      try {
        quillRef.current.disable();
        quillRef.current.off('text-change');
        if (editorRef.current) {
          // Find and remove toolbar element
          const toolbar = editorRef.current.parentNode?.querySelector('.ql-toolbar');
          if (toolbar) {
            toolbar.remove();
          }
          // Clear the entire container
          editorRef.current.innerHTML = '';
        }
      } catch (error) {
        console.warn('Error cleaning up Quill:', error);
      }
      quillRef.current = null;
    }
    
    onSaveDraft(content);
  };

  const handleCancelEdit = () => {
    // Properly destroy Quill instance
    if (quillRef.current) {
      try {
        quillRef.current.disable();
        quillRef.current.off('text-change');
        if (editorRef.current) {
          // Find and remove toolbar element
          const toolbar = editorRef.current.parentNode?.querySelector('.ql-toolbar');
          if (toolbar) {
            toolbar.remove();
          }
          // Clear the entire container
          editorRef.current.innerHTML = '';
        }
      } catch (error) {
        console.warn('Error cleaning up Quill:', error);
      }
      quillRef.current = null;
    }
    
    onCancelEdit();
  };

  if (!draft) {
    return null;
  }

  return (
    <div className="space-y-2">
      {!isEditing ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Preview Mode
                </span>
              </div>
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === "preview" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewModeChange("preview")}
                  className="rounded-r-none"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button
                  variant={viewMode === "html" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onViewModeChange("html")}
                  className="rounded-l-none"
                >
                  <Code className="h-4 w-4 mr-1" />
                  HTML
                </Button>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onEditToggle}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>

          {viewMode === "preview" ? (
            <div className="prose dark:prose-invert max-w-none text-foreground pr-4">
              <div dangerouslySetInnerHTML={{ __html: draft }} />
            </div>
          ) : (
            <div className="p-4 bg-muted rounded-md">
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap overflow-auto max-h-96">
                {draft}
              </pre>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              <span className="text-sm font-medium">Edit Mode</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveDraft}>
                Save Changes
              </Button>
            </div>
          </div>
          <div className="border rounded-md overflow-hidden">
            <div 
              ref={editorRef}
              className="min-h-[400px] bg-white"
              style={{ height: '400px' }}
            />
          </div>
        </>
      )}

      <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
        <Button variant="outline" onClick={handleExportPdf}>
          <FileDown className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
        <Button variant="outline" onClick={handleExportDocx}>
          <Download className="h-4 w-4 mr-2" />
          Export DOCX
        </Button>
      </div>
    </div>
  );
}