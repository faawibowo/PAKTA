"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, PenTool, Save, Eye } from "lucide-react"

const formSchema = z.object({
  companyName: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  contractType: z.string().min(2, { message: "Contract type must be at least 2 characters." }),
  contractElements: z.string().min(10, { message: "Contract elements must be at least 10 characters." }),
  duration: z.string().min(1, { message: "Duration is required." }),
})

export function AiDraftingForm() {
  const [draft, setDraft] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      contractType: "",
      contractElements: "",
      duration: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setDraft(null)

    // Simulate AI drafting
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const generatedDraft = `
      <p><strong>CONTRACT AGREEMENT</strong></p>
      <p>This Contract Agreement ("Agreement") is made and entered into on this ${new Date().toLocaleDateString()} by and between <strong>${values.companyName}</strong> ("Company") and [Other Party Name] ("Other Party").</p>
      <p><strong>WHEREAS</strong>, the Company desires to engage the Other Party for the provision of ${values.contractType} services, and the Other Party is willing to provide such services in accordance with the terms and conditions set forth herein.</p>
      <p><strong>NOW, THEREFORE</strong>, in consideration of the mutual covenants and agreements contained herein, the parties agree as follows:</p>
      <p><strong>1. SCOPE OF SERVICES:</strong> The Other Party shall perform the following services: ${values.contractElements}.</p>
      <p><strong>2. TERM:</strong> The term of this Agreement shall commence on the Effective Date and continue for a period of ${values.duration}.</p>
      <p><strong>3. COMPENSATION:</strong> [Compensation details to be added].</p>
      <p><strong>4. CONFIDENTIALITY:</strong> Both parties agree to maintain the confidentiality of all proprietary and confidential information.</p>
      <p><strong>5. TERMINATION:</strong> This Agreement may be terminated by either party upon [notice period] written notice.</p>
      <p><strong>6. GOVERNING LAW:</strong> This Agreement shall be governed by and construed in accordance with the laws of [Jurisdiction].</p>
      <p><strong>7. INDEMNIFICATION:</strong> The Other Party shall indemnify and hold harmless the Company from and against any and all claims, damages, liabilities, costs, and expenses arising out of or in connection with the performance of the services under this Agreement. <span class="text-error underline">This clause may be too broad and could be challenged in court. Consider specifying types of claims.</span></p>
      <p><strong>8. FORCE MAJEURE:</strong> Neither party shall be liable for any failure or delay in performance under this Agreement due to circumstances beyond its reasonable control. <span class="text-warning underline">Ensure this clause clearly defines what constitutes a force majeure event.</span></p>
      <p><strong>IN WITNESS WHEREOF</strong>, the parties have executed this Agreement as of the date first written above.</p>
    `
    setDraft(generatedDraft)
    setIsLoading(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5" />
            Contract Information
          </CardTitle>
          <CardDescription>Provide basic details to generate your contract draft.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Corp" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contractType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Software Development Agreement" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contractElements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Elements</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the key elements and clauses you want to include..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="3 months">3 Months</SelectItem>
                        <SelectItem value="6 months">6 Months</SelectItem>
                        <SelectItem value="1 year">1 Year</SelectItem>
                        <SelectItem value="2 years">2 Years</SelectItem>
                        <SelectItem value="indefinite">Indefinite</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Generate Draft
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            AI Generated Draft
          </CardTitle>
          <CardDescription>Review the AI-generated contract draft below.</CardDescription>
        </CardHeader>
        <CardContent>
          {draft ? (
            <div className="prose dark:prose-invert max-w-none text-foreground">
              <div dangerouslySetInnerHTML={{ __html: draft }} />
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save to Vault
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <PenTool className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No draft generated yet</p>
              <p className="text-sm">Fill in the contract information and click "Generate Draft"</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
