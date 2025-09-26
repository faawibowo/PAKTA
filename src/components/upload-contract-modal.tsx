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
import { Upload, FileText } from "lucide-react"

export function UploadContractModal() {
  const [file, setFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState("")

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0])
      setFileName(event.target.files[0].name)
    }
  }

  const handleUpload = () => {
    if (file) {
      console.log("[v0] Uploading file:", file.name)
      // For now, just clear the file and close the modal
      setFile(null)
      setFileName("")
      alert("File uploaded successfully (simulated)!")
    } else {
      alert("Please select a file to upload.")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload Contract
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Contract</DialogTitle>
          <DialogDescription>Upload your Docx/PDF contract files here.</DialogDescription>
        </DialogHeader>
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
        </div>
        <div className="flex justify-end">
          <Button type="submit" onClick={handleUpload} disabled={!file}>
            Upload
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
