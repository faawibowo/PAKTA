"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Upload, FileText, ShieldCheck, AlertTriangle, XCircle, Lightbulb, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ValidationResult {
  status: "valid" | "warning" | "error"
  message: string
  details: {
    mandatoryElements: { name: string; status: "present" | "missing" }[]
    risks: { id: string; description: string; severity: "high" | "medium" | "low"; section: string }[]
    recommendations: string[]
  }
}

export function ContractValidation() {
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0])
      setFileName(event.target.files[0].name)
      setValidationResult(null) // Clear previous results
    }
  }

  const handleUploadAndValidate = async () => {
    if (!file) {
      alert("Please select a file to upload.")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setValidationResult(null)

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      setUploadProgress(i)
    }

    // Simulate AI validation
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const simulatedResult: ValidationResult = {
      status: "warning",
      message: "Contract validated with some warnings.",
      details: {
        mandatoryElements: [
          { name: "Company Name", status: "present" },
          { name: "Contract Type", status: "present" },
          { name: "Contract Value", status: "missing" },
          { name: "Termination Clause", status: "present" },
        ],
        risks: [
          {
            id: "risk-1",
            description: "Ambiguous language in the 'Scope of Work' section.",
            severity: "high",
            section: "Section 2.1",
          },
          {
            id: "risk-2",
            description: "Indemnification clause is overly broad and favors one party.",
            severity: "medium",
            section: "Section 7",
          },
        ],
        recommendations: [
          "Clarify the deliverables and responsibilities in the 'Scope of Work'.",
          "Revise the indemnification clause to be more balanced and specific.",
          "Add a 'Dispute Resolution' clause to outline conflict resolution procedures.",
        ],
      },
    }

    setValidationResult(simulatedResult)
    setIsUploading(false)
  }

  const getStatusIcon = (status: ValidationResult["status"]) => {
    switch (status) {
      case "valid":
        return <ShieldCheck className="h-5 w-5 text-success" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-warning" />
      case "error":
        return <XCircle className="h-5 w-5 text-error" />
      default:
        return null
    }
  }

  const getSeverityClass = (severity: "high" | "medium" | "low") => {
    switch (severity) {
      case "high":
        return "text-error"
      case "medium":
        return "text-warning"
      case "low":
        return "text-muted-foreground"
      default:
        return ""
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Contract for Validation
          </CardTitle>
          <CardDescription>Upload your Docx/PDF contract files for AI-powered validation.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">
                File
              </Label>
              <Input id="file" type="file" accept=".docx,.pdf" className="col-span-3" onChange={handleFileChange} />
            </div>
            {fileName && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Selected</Label>
                <div className="col-span-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{fileName}</span>
                </div>
              </div>
            )}
            {isUploading && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Progress</Label>
                <div className="col-span-3">
                  <Progress value={uploadProgress} className="w-full" />
                  <span className="text-xs text-muted-foreground mt-1 block">{uploadProgress}% uploaded</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button onClick={handleUploadAndValidate} disabled={!file || isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Validate Contract
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {validationResult ? getStatusIcon(validationResult.status) : <ShieldCheck className="h-5 w-5" />}
            Validation Results
          </CardTitle>
          <CardDescription>AI-powered analysis of your contract.</CardDescription>
        </CardHeader>
        <CardContent>
          {validationResult ? (
            <div className="space-y-6">
              <Alert
                className={cn(
                  validationResult.status === "valid" && "border-success text-success",
                  validationResult.status === "warning" && "border-warning text-warning",
                  validationResult.status === "error" && "border-error text-error",
                )}
              >
                {getStatusIcon(validationResult.status)}
                <AlertTitle>{validationResult.message}</AlertTitle>
                <AlertDescription>
                  Review the details below for mandatory elements, identified risks, and recommendations.
                </AlertDescription>
              </Alert>

              <div>
                <h3 className="text-lg font-semibold mb-2">Mandatory Elements</h3>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  {validationResult.details.mandatoryElements.map((element, index) => (
                    <li key={index} className="flex items-center gap-2">
                      {element.status === "present" ? (
                        <ShieldCheck className="h-4 w-4 text-success" />
                      ) : (
                        <XCircle className="h-4 w-4 text-error" />
                      )}
                      <span>
                        {element.name}: {element.status === "present" ? "Present" : "Missing"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Identified Risks</h3>
                {validationResult.details.risks.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {validationResult.details.risks.map((risk) => (
                      <li key={risk.id}>
                        <span className={cn("font-medium", getSeverityClass(risk.severity))}>
                          {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)}:
                        </span>{" "}
                        {risk.description} ({risk.section})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No significant risks identified.</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
                {validationResult.details.recommendations.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {validationResult.details.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-primary mt-1" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No specific recommendations at this time.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <ShieldCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Upload a contract to validate</p>
              <p className="text-sm">Get AI-powered insights on compliance and risks</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
