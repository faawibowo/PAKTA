"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, Loader2 } from "lucide-react"
import { uploadFileAndSaveContract } from '@/lib/fileService'
import { extractTextFromFile } from "@/lib/documentParser"


export function UploadContractModal() {
  const [formData, setFormData] = useState({
    title: '',
    parties: '',
    category: '',
    value: 0,
    startDate: '',
    endDate: '',
    file: null as File | null
  })
  const [fileName, setFileName] = useState("")
  const [uploading, setUploading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0]
      setFormData({ ...formData, file: selectedFile })
      setFileName(selectedFile.name)
    }
  }

  const handleUpload = async () => {
    if (!formData.file) {
      alert("Please select a file to upload.")
      return
    }

    // Validate required fields
    if (!formData.title || !formData.parties || !formData.category || !formData.startDate || !formData.endDate) {
      alert("Please fill in all required fields.")
      return
    }

    setUploading(true)
    
    try {
      const result = await uploadFileAndSaveContract(formData.file, {
        title: formData.title,
        parties: formData.parties,
        category: formData.category,
        value: formData.value,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        userId: 1 
      })
      const text = await extractTextFromFile(formData.file);


      const res = await fetch("/api/contract/validation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text,
          fileName: formData.file.name,     
          fileType: formData.file.type      
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to validate contract");
      }

      const data = await res.json();

      const validate = await fetch("/api/contract/validation/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractId: result?.contract.id,
          fileName: formData.file.name,
          fileType: formData.file.type,
          validationResults: data, // Full validation data from Gemini
          riskPercentage: data.riskPercentage || 0,
          mandatoryElements: data.mandatoryElements || {},
          risks: data.identifiedRisks || [],
          recommendations: data.recommendations || []
        }),
      });

      if (!validate.ok) {
        const err = await validate.json();
        throw new Error(err.error || "Failed to save validation results");
      }


      if (result) {
        alert('Contract uploaded and saved successfully!')
        console.log('File URL:', result.fileResult.publicUrl)
        console.log('Contract ID:', result.contract.id)
        
        // Reset form and close modal
        setFormData({
          title: '',
          parties: '',
          category: '',
          value: 0,
          startDate: '',
          endDate: '',
          file: null
        })
        setFileName("")
        setOpen(false)
      } else {
        alert('Failed to upload contract')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Error uploading contract')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload Contract
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Contract</DialogTitle>
          <DialogDescription>Fill in contract details and upload your Docx/PDF contract files here.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Title */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title *
            </Label>
            <Input 
              id="title" 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="col-span-3" 
              placeholder="Contract title"
              required
            />
          </div>

          {/* Parties */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="parties" className="text-right">
              Parties *
            </Label>
            <Input 
              id="parties" 
              value={formData.parties}
              onChange={(e) => setFormData({ ...formData, parties: e.target.value })}
              className="col-span-3" 
              placeholder="Company A, Company B"
              required
            />
          </div>

          {/* Category */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category *
            </Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Service Agreement">Service Agreement</SelectItem>
                <SelectItem value="Purchase Order">Purchase Order</SelectItem>
                <SelectItem value="Employment">Employment</SelectItem>
                <SelectItem value="Partnership">Partnership</SelectItem>
                <SelectItem value="Licensing">Licensing</SelectItem>
                <SelectItem value="Non-Disclosure">Non-Disclosure</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Value */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="value" className="text-right">
              Value
            </Label>
            <div className="col-span-3 flex items-center">
              <span className="mr-2 text-gray-600">Rp</span>
              <Input 
                id="value" 
                type="number"
                value={formData.value === 0 ? '' : formData.value}
                onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                className="flex-1" 
                min="0"
                step="0.01"
                placeholder="0"
              />
            </div>
          </div>

          {/* Start Date */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startDate" className="text-right">
              Start Date *
            </Label>
            <Input 
              id="startDate" 
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="col-span-3" 
              required
            />
          </div>

          {/* End Date */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endDate" className="text-right">
              End Date *
            </Label>
            <Input 
              id="endDate" 
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="col-span-3" 
              required
            />
          </div>

          {/* File Upload */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="text-right">
              File *
            </Label>
            <Input 
              id="file" 
              type="file" 
              accept=".txt,.docx,.pdf" 
              className="col-span-3" 
              onChange={handleFileChange} 
            />
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
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={uploading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleUpload} 
            disabled={!formData.file || uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Contract
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
