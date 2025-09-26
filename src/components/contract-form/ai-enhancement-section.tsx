"use client";

import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, FileText } from "lucide-react";
import { useState } from "react";

interface AiEnhancementSectionProps {
  control: Control<any>;
}

export function AiEnhancementSection({ control }: AiEnhancementSectionProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
    
    // Convert files to text content (for simple text files)
    files.forEach(file => {
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          const currentValue = field.value || [];
          field.onChange([...currentValue, content]);
        };
        reader.readAsText(file);
      }
    });
  };

  const removeFile = (index: number, field: any) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    
    const currentValue = field.value || [];
    const newValue = currentValue.filter((_: any, i: number) => i !== index);
    field.onChange(newValue);
  };

  return (
    <div className="space-y-6 p-1">
      <h3 className="text-lg font-semibold text-foreground border-b pb-2">
        7. AI Enhancement & Additional Details
      </h3>

      <FormField
        control={control}
        name="additionalRequirements"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Requirements</FormLabel>
            <FormDescription>
              Describe any specific requirements, clauses, or terms you want to include that aren't covered above.
            </FormDescription>
            <FormControl>
              <Textarea
                placeholder="e.g., specific compliance requirements, unique business terms, special conditions..."
                className="min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="specialInstructions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Special Instructions for AI</FormLabel>
            <FormDescription>
              Provide specific instructions for how you want the AI to enhance or modify the contract template.
            </FormDescription>
            <FormControl>
              <Textarea
                placeholder="e.g., make it more detailed, add specific industry clauses, emphasize certain aspects..."
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="supportingDocuments"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Supporting Documents</FormLabel>
            <FormDescription>
              Upload supporting documents (text files) that the AI can use as reference for generating the contract.
            </FormDescription>
            <FormControl>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept=".txt,.doc,.docx,.pdf"
                    multiple
                    onChange={(e) => handleFileUpload(e, field)}
                    className="hidden"
                    id="document-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('document-upload')?.click()}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Documents
                  </Button>
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Uploaded files:</p>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index, field)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}