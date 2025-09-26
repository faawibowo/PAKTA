'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Form } from './ui/form';
import { ScrollArea } from './ui/scroll-area';
import { useForm } from 'react-hook-form';
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
  Code
} from 'lucide-react';

// Import modular components
import { PartiesIdentificationSection } from './contract-form/parties-identification-section';
import { ScopeOfWorkSection } from './contract-form/scope-of-work-section';
import { CommercialTermsSection } from './contract-form/commercial-terms-section';
import { DurationTerminationSection } from './contract-form/duration-termination-section';
import { OperationalTermsSection } from './contract-form/operational-terms-section';
import { LegalComplianceSection } from './contract-form/legal-compliance-section';

// Import shared schema and utilities
import { contractFormSchema, ContractFormData } from '@/lib/contract-form-schema';
import { generateContractDraft } from '@/lib/contract-generator';

export function AiDraftingFormModular() {
  const [draft, setDraft] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'html'>('preview');

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
    },
  });

  async function onSubmit(values: ContractFormData) {
    setIsLoading(true);
    setDraft(null);

    // Simulate AI drafting
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const generatedDraft = generateContractDraft(values);
    setDraft(generatedDraft);
    setIsLoading(false);
  }

  const handleSaveDraft = () => {
    // Add logic to save to backend/vault here
    console.log('Saving draft to vault:', draft);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className={`h-fit ${draft ? 'lg:sticky lg:top-4 lg:self-start' : ''}`}>
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
            } pr-2`}
          >
            <div className="pr-4 space-y-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <Tabs defaultValue="parties" className="w-full">
                    <TabsList className="grid w-full h-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1">
                      <TabsTrigger value="parties" className="flex items-center gap-2 px-2 py-2 text-xs">
                        <Users className="h-4 w-4 shrink-0" />
                        <span className="hidden sm:inline truncate">Parties</span>
                      </TabsTrigger>
                      <TabsTrigger value="scope" className="flex items-center gap-2 px-2 py-2 text-xs">
                        <FileText className="h-4 w-4 shrink-0" />
                        <span className="hidden sm:inline truncate">Scope</span>
                      </TabsTrigger>
                      <TabsTrigger value="commercial" className="flex items-center gap-2 px-2 py-2 text-xs">
                        <Bot className="h-4 w-4 shrink-0" />
                        <span className="hidden sm:inline truncate">Commercial</span>
                      </TabsTrigger>
                      <TabsTrigger value="duration" className="flex items-center gap-2 px-2 py-2 text-xs">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span className="hidden sm:inline truncate">Duration</span>
                      </TabsTrigger>
                      <TabsTrigger value="operational" className="flex items-center gap-2 px-2 py-2 text-xs">
                        <Settings className="h-4 w-4 shrink-0" />
                        <span className="hidden sm:inline truncate">Operational</span>
                      </TabsTrigger>
                      <TabsTrigger value="legal" className="flex items-center gap-2 px-2 py-2 text-xs">
                        <Save className="h-4 w-4 shrink-0" />
                        <span className="hidden sm:inline truncate">Legal</span>
                      </TabsTrigger>
                    </TabsList>

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
                  </Tabs>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Generate Contract Draft
                    </Button>
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
            AI Generated Draft
          </CardTitle>
          <CardDescription>
            Review and edit the AI-generated contract draft below.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            {draft ? (
              <div className="space-y-4">
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

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button onClick={handleSaveDraft}>
                    <Save className="h-4 w-4 mr-2" />
                    Save to Vault
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