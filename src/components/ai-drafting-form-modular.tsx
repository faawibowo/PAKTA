'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Form } from './ui/form';
import { ScrollArea } from './ui/scroll-area';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  AlertCircle, 
  Bot, 
  FileText, 
  Save, 
  Settings, 
  Users, 
  PenTool, 
  Loader2,
  Eye,
  Code,
  Edit3,
  Archive,
  Download,
  FileDown
} from 'lucide-react';

// Import modular components
import { PartiesIdentificationSection } from './contract-form/parties-identification-section';
import { ScopeOfWorkSection } from './contract-form/scope-of-work-section';
import { CommercialTermsSection } from './contract-form/commercial-terms-section';
import { DurationTerminationSection } from './contract-form/duration-termination-section';
import { OperationalTermsSection } from './contract-form/operational-terms-section';
import { LegalComplianceSection } from './contract-form/legal-compliance-section';
import { AiEnhancementSection } from './contract-form/ai-enhancement-section';
import { ProgressNavigation } from './contract-form/progress-navigation';

// Import shared schema and utilities
import { contractFormSchema, ContractFormData } from '@/lib/contract-form-schema';
import { generateContractDraft } from '@/lib/contract-generator';
import { calculateSectionProgress } from '@/lib/form-progress-tracker';
import { useDrafts, SavedDraft } from '@/hooks/use-drafts';
import { exportToDocx } from '@/lib/docs-export';
import { exportToPdf } from '@/lib/pdf-export';
import { toast } from 'sonner';

interface AiDraftingFormModularProps {
  loadedDraft?: SavedDraft | null;
}

export function AiDraftingFormModular({ loadedDraft }: AiDraftingFormModularProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const [editableDraft, setEditableDraft] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'html'>('preview');
  const [mounted, setMounted] = useState(false);
  const [currentSection, setCurrentSection] = useState('parties');
  const [currentDraftId, setCurrentDraftId] = useState<number | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);

  // For demo purposes, using userId = 1. In real app, get from auth context
  const userId = 1;
  const { saveDraft, updateDraft } = useDrafts(userId);

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

      // Listen for changes
      quillRef.current.on('text-change', () => {
        const content = quillRef.current.root.innerHTML;
        setEditableDraft(content);
      });
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

  const form = useForm<ContractFormData>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      contractTitle: "",
      partyAName: "",
      partyAAddress: "",
      partyBName: "",
      partyBAddress: "",
      partyARepresentative: "",
      partyBRepresentative: "",
      serviceType: "",
      goodsCommodities: "",
      serviceLocations: "",
      contractValue: "",
      currency: "",
      paymentTerms: "",
      penaltyFees: "",
      contractDuration: "",
      startDate: "",
      endDate: "",
      terminationClause: "",
      serviceLevel: "",
      insuranceRequirements: "",
      liabilityIndemnity: "",
      forceMajeure: "",
      governingLaw: "",
      confidentiality: "",
      disputeResolution: "",
      additionalRequirements: "",
      specialInstructions: "",
      supportingDocuments: [],
    },
  });

  // Load draft data when a saved draft is provided
  useEffect(() => {
    if (loadedDraft?.content) {
      form.reset(loadedDraft.content);
      setCurrentDraftId(loadedDraft.id);
      
      // Show success message
      toast.success(`Loaded draft for ${loadedDraft.companyName}`);
    }
  }, [loadedDraft, form]);

  // Check for editing contract from sessionStorage (when navigating from vault)
  useEffect(() => {
    const editingContractData = sessionStorage.getItem('editingContract');
    if (editingContractData) {
      try {
        const parsedData = JSON.parse(editingContractData);
        
        // Populate form fields with the stored formData
        if (parsedData.formData) {
          form.reset(parsedData.formData);
          toast.success(`Loaded contract: ${parsedData.title}`);
        }
        
        // Populate generated content if available
        if (parsedData.generatedContent) {
          setDraft(parsedData.generatedContent);
        }
        
        // Clean up sessionStorage after loading
        sessionStorage.removeItem('editingContract');
        
      } catch (error) {
        console.error('Error parsing editing contract data:', error);
        toast.error('Failed to load contract data');
      }
    }
  }, [form]);

  // Watch form values for progress tracking
  const watchedValues = useWatch({ control: form.control });
  const sections = calculateSectionProgress(watchedValues);
  const sectionIds = sections.map(s => s.id);
  const currentSectionIndex = sectionIds.indexOf(currentSection);

  async function onSubmit(values: ContractFormData) {
    setIsLoading(true);
    setDraft(null);

    try {
      // Use the AI-enhanced contract generator
      const generatedDraft = await generateContractDraft(values);
      setDraft(generatedDraft);
    } catch (error) {
      console.error('Error generating contract:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  }

  const handleSaveDraft = async () => {
    if (!draft) {
      toast.error('No contract draft available to save');
      return;
    }

    try {
      const formValues = form.getValues();
      
      // Prepare contract data for the Contract schema
      const contractData = {
        title: formValues.contractTitle || 'Generated Contract',
        parties: `${formValues.partyAName} and ${formValues.partyBName}`,
        category: formValues.serviceType || 'General Contract',
        value: parseFloat(formValues.contractValue) || 0.0,
        startDate: formValues.startDate || new Date().toISOString(),
        endDate: formValues.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // Default 1 year
        fileUrl: '', // Generated contracts don't have file URLs
        contractData: {
          generatedContent: draft,
          formData: formValues,
          generatedAt: new Date().toISOString(),
        },
        userId: userId,
      };

      const response = await fetch('/api/contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contractData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Contract saved to vault successfully!');
        console.log('Contract saved:', result.contract);
      } else {
        throw new Error(result.error || 'Failed to save contract');
      }
    } catch (error) {
      console.error('Error saving contract to vault:', error);
      toast.error('Failed to save contract to vault. Please try again.');
    }
  };

  const handleExportDocx = async () => {
    if (!draft) {
      toast.error('No draft available to export');
      return;
    }

    try {
      const formValues = form.getValues();
      const contractTitle = formValues.contractTitle || 'Contract Document';
      const filename = `${contractTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.docx`;
      
      await exportToDocx(draft, {
        title: contractTitle,
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
      const formValues = form.getValues();
      const contractTitle = formValues.contractTitle || 'Contract Document';
      const filename = `${contractTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      await exportToPdf(draft, {
        title: contractTitle,
        filename: filename
      });
      
      toast.success('Contract exported to PDF successfully!');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast.error('Failed to export contract. Please try again.');
    }
  };

  const handleSaveFormDraft = async () => {
    const formValues = form.getValues();
    setIsSavingDraft(true);

    try {
      if (currentDraftId) {
        // Update existing draft
        const savedDraft = await updateDraft(
          currentDraftId,
          formValues,
          formValues.partyAName || 'Untitled Contract',
          formValues.serviceType || 'General Contract'
        );
        if (savedDraft) {
          toast.success('Draft updated successfully!');
        }
      } else {
        // Save new draft
        const savedDraft = await saveDraft(
          formValues,
          formValues.partyAName || 'Untitled Contract',
          formValues.serviceType || 'General Contract'
        );
        if (savedDraft) {
          setCurrentDraftId(savedDraft.id);
          toast.success('Draft saved successfully!');
        }
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft. Please try again.');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleEditToggle = () => {
    if (!isEditing) {
      // Entering edit mode - set editableDraft to current draft content
      setEditableDraft(draft || "");
    }
    setIsEditing(!isEditing);
  };

  const handleSaveEdit = () => {
    // Get content from Quill editor if it exists
    if (quillRef.current) {
      const content = quillRef.current.root.innerHTML;
      setEditableDraft(content);
      setDraft(content);
      
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
    } else {
      setDraft(editableDraft);
    }
    setIsEditing(false);
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
    setEditableDraft(draft || "");
    setIsEditing(false);
  };

  // Navigation functions
  const handleSectionChange = (sectionId: string) => {
    setCurrentSection(sectionId);
  };

  const handleNext = () => {
    const currentIndex = sectionIds.indexOf(currentSection);
    if (currentIndex < sectionIds.length - 1) {
      setCurrentSection(sectionIds[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const currentIndex = sectionIds.indexOf(currentSection);
    if (currentIndex > 0) {
      setCurrentSection(sectionIds[currentIndex - 1]);
    }
  };

  const canGoNext = currentSectionIndex < sectionIds.length - 1;
  const canGoPrevious = currentSectionIndex > 0;

  return (
    <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
      <Card className={`h-fit transition-all duration-300 ${draft ? 'lg:sticky lg:top-4 lg:self-start' : ''}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5" />
            Contract Information
          </CardTitle>
          <CardDescription>
            Provide comprehensive contract details across all key areas to
            generate a professional contract draft.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <ScrollArea
            className={`${
              draft ? 'h-[calc(100vh-16rem)]' : 'h-[calc(100vh-12rem)]'
            } px-2`}
          >
            <div className="pr-4 space-y-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  {/* Progress Navigation */}
                  <ProgressNavigation
                    sections={sections}
                    currentSection={currentSection}
                    onSectionChange={handleSectionChange}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                    canGoNext={canGoNext}
                    canGoPrevious={canGoPrevious}
                  />

                  <Tabs value={currentSection} onValueChange={setCurrentSection} className="w-full">
                    <TabsContent value="parties" className="space-y-6 mt-6">
                      <PartiesIdentificationSection control={form.control} />
                    </TabsContent>

                    <TabsContent value="scope" className="space-y-6 mt-6">
                      <ScopeOfWorkSection control={form.control} />
                    </TabsContent>

                    <TabsContent value="commercial" className="space-y-6 mt-6">
                      <CommercialTermsSection control={form.control} />
                    </TabsContent>

                    <TabsContent value="duration" className="space-y-6 mt-6">
                      <DurationTerminationSection control={form.control} />
                    </TabsContent>

                    <TabsContent value="operational" className="space-y-6 mt-6">
                      <OperationalTermsSection control={form.control} />
                    </TabsContent>

                    <TabsContent value="legal" className="space-y-6 mt-6">
                      <LegalComplianceSection control={form.control} />
                    </TabsContent>

                    <TabsContent value="ai-enhancement" className="space-y-6 mt-6">
                      <AiEnhancementSection control={form.control} />
                    </TabsContent>
                  </Tabs>

                  <div className="pt-4 space-y-3">
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleSaveFormDraft}
                        disabled={isSavingDraft}
                        className="flex-1"
                      >
                        {isSavingDraft && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        <Archive className="mr-2 h-4 w-4" />
                        {isSavingDraft ? 'Saving...' : currentDraftId ? 'Update Draft' : 'Save Draft'}
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1"
                        disabled={isLoading}
                      >
                        {isLoading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        <Bot className="mr-2 h-4 w-4" />
                        {isLoading ? 'Generating...' : 'Generate Contract'}
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generated Draft
          </CardTitle>
          <CardDescription>
            Review and edit the contract draft below.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            {draft ? (
              <div className="space-y-4">
                {!isEditing ? (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          <span className="text-sm font-medium">Preview Mode</span>
                        </div>
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant={viewMode === 'preview' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('preview')}
                            className="rounded-r-none"
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          <Button
                            variant={viewMode === 'html' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setViewMode('html')}
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
                        onClick={handleEditToggle}
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>

                    {viewMode === 'preview' ? (
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
                    <div className="flex justify-between items-center">
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
                        <Button size="sm" onClick={handleSaveEdit}>
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

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={handleExportPdf}>
                    <FileDown className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button variant="outline" onClick={handleExportDocx}>
                    <Download className="h-4 w-4 mr-2" />
                    Export DOCX
                  </Button>
                  <Button onClick={handleSaveDraft}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Contract to Vault
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground h-full flex flex-col justify-center">
                <PenTool className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No draft generated yet</p>
                <p className="text-sm">
                  Fill in the contract information and click "Generate Contract
                  Draft"
                </p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}