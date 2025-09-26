// src/components/ContractModal.tsx
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Contract } from "./contract-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Lightbulb,
  Loader2,
  FileText,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

const ContractPdfViewer = dynamic(() => import("./contract-pdf-viewer"), {
  ssr: false,
});

interface PreviewContractModalProps {
  contract: Contract | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface MandatoryElement {
  name: string;
  status: "present" | "missing";
}

interface Risk {
  id: string;
  severity: "high" | "medium" | "low";
  description: string;
  section: string;
}

interface ValidationData {
  riskPercentage: number;
  overallStatus: "VALID" | "WARNING" | "HIGH_RISK";
  mandatoryElems: any;
  missingElements: string[];
  presentElements: string[];
  riskDetected: any[];
  highRisks: number;
  mediumRisks: number;
  lowRisks: number;
  recommendations: string[];
  analysisDate: string;
}

interface ContractValidation {
  id: number;
  contractId: number;
  riskPercentage: number;
  overallStatus: string;
  mandatoryElems: any;
  riskDetected: any[];
  analysisDate: string;
  highRisks: number;
  mediumRisks: number;
  lowRisks: number;
  recommendations: string[];
  validationData: any;
  missingElements: string[];
  presentElements: string[];
}

export function PreviewContractModal({
  contract,
  open,
  onOpenChange,
}: PreviewContractModalProps) {
  const [validations, setValidations] = useState<ContractValidation[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  // Fetch validation history when modal opens
  useEffect(() => {
    if (open && contract?.id) {
      fetchValidationHistory();
    }
  }, [open, contract?.id]);

  const fetchValidationHistory = async () => {
    if (!contract?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/contract/validation/save?contractId=${contract.id}`);
      if (response.ok) {
        const data = await response.json();
        setValidations(data.data?.validations || []);
      }
    } catch (error) {
      console.error('Failed to fetch validation history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for validation display
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "VALID":
        return <ShieldCheck className="h-5 w-5 text-green-600" />;
      case "WARNING":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "HIGH_RISK":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <ShieldCheck className="h-5 w-5 text-gray-400" />;
    }
  };

  const getSeverityClass = (severity: "high" | "medium" | "low") => {
    switch (severity) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-gray-600";
      default:
        return "";
    }
  };

  const processValidationForDisplay = (validation: ContractValidation) => {
    // Convert mandatory elements to display format
    const mandatoryElements: MandatoryElement[] = [];
    
    // Handle mandatory elements from JSON object format
    if (validation.mandatoryElems && typeof validation.mandatoryElems === 'object') {
      Object.entries(validation.mandatoryElems as Record<string, string>).forEach(([key, value]) => {
        // Convert camelCase to readable text
        const readableName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        mandatoryElements.push({ 
          name: readableName, 
          status: value.toLowerCase() === "present" ? "present" : "missing" 
        });
      });
    } else {
      // Fallback to array format if needed
      // Add missing elements
      validation.missingElements?.forEach(element => {
        mandatoryElements.push({ name: element, status: "missing" });
      });
      
      // Add present elements
      validation.presentElements?.forEach(element => {
        mandatoryElements.push({ name: element, status: "present" });
      });
    }

    // Convert risks to display format
    const risks: Risk[] = (validation.riskDetected || []).map((risk: any, idx: number) => ({
      id: `risk-${idx}`,
      severity: (risk.severity || "low").toLowerCase() as "high" | "medium" | "low",
      description: risk.description || "",
      section: risk.section || "",
    }));

    return {
      mandatoryElements,
      risks,
      recommendations: validation.recommendations || [],
      riskPercentage: validation.riskPercentage || 0,
      overallStatus: validation.overallStatus,
      analysisDate: validation.analysisDate
    };
  };

  if (!contract) return null;

  const latestValidation = validations.length > 0 ? validations[0] : null;
  const processedValidation = latestValidation ? processValidationForDisplay(latestValidation) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[1000px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {contract.title}
          </DialogTitle>
          <DialogDescription>
            Contract details, validation results, and document preview.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex w-full gap-2">
            <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
            <TabsTrigger value="validation" className="flex-1 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Validation
              {latestValidation && (
          <span className="ml-1">
            {getStatusIcon(latestValidation.overallStatus)}
          </span>
              )}
            </TabsTrigger>
          </TabsList>

            <div className="mt-4 max-h-[70vh] overflow-auto w-full">
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contract.fileUrl ? (
                <div className="w-full min-w-0 max-h-[70vh] border rounded-lg">
                  <ContractPdfViewer fileUrl={contract.fileUrl} />
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No Document Available</p>
                  <p className="text-sm">No file URL found for this contract.</p>
                </div>
              )}
              
                <div className="grid grid-rows-2 gap-4">
                  <div className="space-y-3 p-4 border rounded-lg">
                    <h3 className="font-semibold text-lg">Contract Information</h3>
                    <div className="space-y-2">
                      <p><strong>Parties:</strong> {contract.parties}</p>
                      <p><strong>Category:</strong> {contract.category}</p>
                      <p><strong>Status:</strong> {contract.status}</p>
                      <p><strong>Value:</strong> {contract.value ? `$${contract.value.toLocaleString()}` : 'N/A'}</p>
                      <p><strong>Start Date:</strong> {new Date(contract.startDate).toLocaleDateString()}</p>
                      <p><strong>End Date:</strong> {new Date(contract.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 p-4 border rounded-lg">
                    <h3 className="font-semibold text-lg">Upload Information</h3>
                    <div className="space-y-2">
                      <p><strong>Uploaded By:</strong> {contract.user.username}</p>
                      <p><strong>User Role:</strong> {contract.user.role}</p>
                      <p><strong>Upload Date:</strong> {new Date(contract.uploadedAt).toLocaleDateString()}</p>
                      <p><strong>Validations:</strong> {validations.length} performed</p>
                    </div>
                    
                    {contract.fileUrl && (
                      <div className="mt-4">
                        <Button asChild variant="outline">
                          <a
                            href={contract.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Open Contract File
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="validation" className="space-y-4 p-5">
              {loading ? (
                <div className="flex items-center justify-center py-8 ">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Loading validation data...
                </div>
              ) : processedValidation ? (
                <div className="space-y-6">
                  {/* Overall Status Alert */}
                  <Alert className={cn(
                    latestValidation?.overallStatus === "VALID" && "border-green-200 bg-green-50",
                    latestValidation?.overallStatus === "WARNING" && "border-yellow-200 bg-yellow-50",
                    latestValidation?.overallStatus === "HIGH_RISK" && "border-red-200 bg-red-50"
                  )}>
                    {getStatusIcon(latestValidation?.overallStatus || "")}
                    <AlertTitle>Validation Status: {latestValidation?.overallStatus}</AlertTitle>
                    <AlertDescription>
                      Last analyzed on {new Date(processedValidation.analysisDate).toLocaleDateString()}
                    </AlertDescription>
                  </Alert>

                  {/* Risk Percentage Display */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">Overall Risk Level</h4>
                      <span className={cn(
                        "text-lg font-bold",
                        processedValidation.riskPercentage >= 70 && "text-red-600",
                        processedValidation.riskPercentage >= 30 && processedValidation.riskPercentage < 70 && "text-yellow-600",
                        processedValidation.riskPercentage < 30 && "text-green-600"
                      )}>
                        {processedValidation.riskPercentage}%
                      </span>
                    </div>
                    <Progress 
                      value={processedValidation.riskPercentage} 
                      className={cn(
                        "h-2",
                        processedValidation.riskPercentage >= 70 && "[&>div]:bg-red-600",
                        processedValidation.riskPercentage >= 30 && processedValidation.riskPercentage < 70 && "[&>div]:bg-yellow-600",
                        processedValidation.riskPercentage < 30 && "[&>div]:bg-green-600"
                      )}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Low Risk</span>
                      <span>High Risk</span>
                    </div>
                  </div>

                  {/* Risk Breakdown */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{latestValidation?.highRisks || 0}</div>
                      <div className="text-sm text-red-700">High Risks</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{latestValidation?.mediumRisks || 0}</div>
                      <div className="text-sm text-yellow-700">Medium Risks</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-600">{latestValidation?.lowRisks || 0}</div>
                      <div className="text-sm text-gray-700">Low Risks</div>
                    </div>
                  </div>

                  {/* Mandatory Elements */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Mandatory Elements</h3>
                    <ul className="space-y-2">
                      {processedValidation.mandatoryElements.map((element, index) => (
                        <li key={index} className="flex items-center gap-2">
                          {element.status === "present" ? (
                            <ShieldCheck className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className={element.status === "missing" ? "text-red-700" : "text-green-700"}>
                            {element.name}: {element.status === "present" ? "Present" : "Missing"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Identified Risks */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Identified Risks</h3>
                    {processedValidation.risks.length > 0 ? (
                      <ul className="space-y-2">
                        {processedValidation.risks.map((risk) => (
                          <li key={risk.id} className="p-3 border rounded-lg">
                            <div className="flex items-start gap-2">
                              <span className={cn("font-medium text-sm px-2 py-1 rounded", getSeverityClass(risk.severity))}>
                                {risk.severity.toUpperCase()}
                              </span>
                              <div className="flex-1">
                                <p className="font-medium">{risk.description}</p>
                                {risk.section && <p className="text-sm text-muted-foreground">Section: {risk.section}</p>}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">No significant risks identified.</p>
                    )}
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
                    {processedValidation.recommendations.length > 0 ? (
                      <ul className="space-y-2">
                        {processedValidation.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                            <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-blue-900">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground">No specific recommendations at this time.</p>
                    )}
                  </div>

                  {/* Validation History */}
                  {validations.length > 1 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Validation History</h3>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {validations.map((validation, index) => (
                          <div key={validation.id} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(validation.overallStatus)}
                              <span className="text-sm">
                                {new Date(validation.analysisDate).toLocaleDateString()} - Risk: {validation.riskPercentage}%
                              </span>
                            </div>
                            {index === 0 && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Latest</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No Validation Data</p>
                  <p className="text-sm">This contract hasn't been validated yet.</p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
