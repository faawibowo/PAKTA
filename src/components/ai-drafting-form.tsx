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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, PenTool, Save, Eye } from "lucide-react"

const formSchema = z.object({
  // Parties & Identification
  contractTitle: z.string().min(2, { message: "Contract title must be at least 2 characters." }),
  partyAName: z.string().min(2, { message: "Party A name must be at least 2 characters." }),
  partyAAddress: z.string().min(5, { message: "Party A address must be at least 5 characters." }),
  partyBName: z.string().min(2, { message: "Party B name must be at least 2 characters." }),
  partyBAddress: z.string().min(5, { message: "Party B address must be at least 5 characters." }),
  partyARepresentative: z.string().min(2, { message: "Representative name is required." }),
  partyBRepresentative: z.string().min(2, { message: "Representative name is required." }),
  
  // Scope of Work
  serviceType: z.string().min(1, { message: "Service type is required." }),
  goodsCommodities: z.string().min(2, { message: "Goods/commodities description is required." }),
  serviceLocations: z.string().min(5, { message: "Service locations must be specified." }),
  
  // Commercial Terms
  contractValue: z.string().min(1, { message: "Contract value is required." }),
  currency: z.string().min(1, { message: "Currency is required." }),
  paymentTerms: z.string().min(1, { message: "Payment terms are required." }),
  penaltyFees: z.string().optional(),
  
  // Duration & Termination
  contractDuration: z.string().min(1, { message: "Duration is required." }),
  startDate: z.string().min(1, { message: "Start date is required." }),
  endDate: z.string().optional(),
  terminationClause: z.string().min(5, { message: "Termination clause must be specified." }),
  
  // Operational Terms
  serviceLevel: z.string().min(5, { message: "Service level requirements must be specified." }),
  insuranceRequirements: z.string().min(5, { message: "Insurance requirements must be specified." }),
  liabilityIndemnity: z.string().min(5, { message: "Liability and indemnity terms must be specified." }),
  forceMajeure: z.string().optional(),
  
  // Legal & Compliance
  governingLaw: z.string().min(1, { message: "Governing law is required." }),
  confidentiality: z.string().optional(),
  disputeResolution: z.string().min(1, { message: "Dispute resolution method is required." }),
})

export function AiDraftingForm() {
  const [draft, setDraft] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Parties & Identification
      contractTitle: "",
      partyAName: "",
      partyAAddress: "",
      partyBName: "",
      partyBAddress: "",
      partyARepresentative: "",
      partyBRepresentative: "",
      
      // Scope of Work
      serviceType: "",
      goodsCommodities: "",
      serviceLocations: "",
      
      // Commercial Terms
      contractValue: "",
      currency: "",
      paymentTerms: "",
      penaltyFees: "",
      
      // Duration & Termination
      contractDuration: "",
      startDate: "",
      endDate: "",
      terminationClause: "",
      
      // Operational Terms
      serviceLevel: "",
      insuranceRequirements: "",
      liabilityIndemnity: "",
      forceMajeure: "",
      
      // Legal & Compliance
      governingLaw: "",
      confidentiality: "",
      disputeResolution: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setDraft(null)

    // Simulate AI drafting
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const generatedDraft = `
      <p><strong>${values.contractTitle}</strong></p>
      <p>This Contract Agreement ("Agreement") is made and entered into on this ${new Date().toLocaleDateString()} by and between:</p>
      <p><strong>PARTY A (Client/Shipper):</strong> ${values.partyAName}<br/>
      Address: ${values.partyAAddress}<br/>
      Representative: ${values.partyARepresentative}</p>
      <p><strong>PARTY B (Provider/Carrier):</strong> ${values.partyBName}<br/>
      Address: ${values.partyBAddress}<br/>
      Representative: ${values.partyBRepresentative}</p>
      
      <p><strong>WHEREAS</strong>, Party A desires to engage Party B for the provision of ${values.serviceType} services, and Party B is willing to provide such services in accordance with the terms and conditions set forth herein.</p>
      
      <p><strong>NOW, THEREFORE</strong>, in consideration of the mutual covenants and agreements contained herein, the parties agree as follows:</p>
      
      <p><strong>1. SCOPE OF SERVICES:</strong></p>
      <p>Service Type: ${values.serviceType}</p>
      <p>Goods/Commodities Covered: ${values.goodsCommodities}</p>
      <p>Service Locations: ${values.serviceLocations}</p>
      
      <p><strong>2. COMMERCIAL TERMS:</strong></p>
      <p>Contract Value: ${values.contractValue} ${values.currency}</p>
      <p>Payment Terms: ${values.paymentTerms}</p>
      ${values.penaltyFees ? `<p>Penalty/Late Fees: ${values.penaltyFees}</p>` : ''}
      
      <p><strong>3. DURATION & TERMINATION:</strong></p>
      <p>Contract Duration: ${values.contractDuration}</p>
      <p>Start Date: ${values.startDate}</p>
      ${values.endDate ? `<p>End Date: ${values.endDate}</p>` : ''}
      <p>Termination: ${values.terminationClause}</p>
      
      <p><strong>4. OPERATIONAL TERMS:</strong></p>
      <p>Service Level/Performance Metrics: ${values.serviceLevel}</p>
      <p>Insurance Requirements: ${values.insuranceRequirements}</p>
      <p>Liability & Indemnity: ${values.liabilityIndemnity} <span class="text-error underline">Review liability terms carefully for fairness and enforceability.</span></p>
      ${values.forceMajeure ? `<p>Force Majeure: ${values.forceMajeure}</p>` : '<p>Force Majeure: Standard force majeure clause applies for unforeseeable circumstances. <span class="text-warning underline">Consider defining specific force majeure events.</span></p>'}
      
      <p><strong>5. LEGAL & COMPLIANCE:</strong></p>
      <p>Governing Law: ${values.governingLaw}</p>
      ${values.confidentiality ? `<p>Confidentiality: ${values.confidentiality}</p>` : ''}
      <p>Dispute Resolution: ${values.disputeResolution}</p>
      
      <p><strong>IN WITNESS WHEREOF</strong>, the parties have executed this Agreement as of the date first written above.</p>
      
      <p><strong>PARTY A:</strong> _________________________<br/>
      ${values.partyARepresentative}, ${values.partyAName}</p>
      
      <p><strong>PARTY B:</strong> _________________________<br/>
      ${values.partyBRepresentative}, ${values.partyBName}</p>
    `
    setDraft(generatedDraft)
    setIsLoading(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className={`h-fit ${draft ? 'lg:sticky lg:top-4 lg:self-start' : ''}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="h-5 w-5" />
            Contract Information
          </CardTitle>
          <CardDescription>Provide comprehensive contract details across all key areas to generate a professional contract draft.</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <ScrollArea className={`${draft ? 'h-[calc(100vh-16rem)]' : 'h-[calc(100vh-12rem)]'} pr-2`}>
            <div className="pr-4 space-y-6">
              <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Parties & Identification Section */}
              <div className="space-y-6 p-1">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">1. Parties & Identification</h3>
                
                <FormField
                  control={form.control}
                  name="contractTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contract Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Freight Forwarding Agreement" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="partyAName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Party A (Client/Shipper) - Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Corp" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="partyBName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Party B (Provider/Carrier) - Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Logistics Pro Ltd" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="partyAAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Party A Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="123 Business St, City, Country" className="min-h-[80px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="partyBAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Party B Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="456 Logistics Ave, City, Country" className="min-h-[80px]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="partyARepresentative"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Party A Representative</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe, CEO" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="partyBRepresentative"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Party B Representative</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane Smith, Operations Manager" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Scope of Work Section */}
              <div className="space-y-6 p-1">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">2. Scope of Work / Services</h3>
                
                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select service type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="freight-forwarding">Freight Forwarding</SelectItem>
                          <SelectItem value="transport">Transport Services</SelectItem>
                          <SelectItem value="warehousing">Warehousing</SelectItem>
                          <SelectItem value="cold-chain">Cold Chain Logistics</SelectItem>
                          <SelectItem value="last-mile">Last Mile Delivery</SelectItem>
                          <SelectItem value="3pl">Third Party Logistics (3PL)</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="goodsCommodities"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goods/Commodities Covered</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., electronics, perishables, hazardous materials" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="serviceLocations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Locations</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Origin, destination, warehouses, and other relevant locations..."
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Commercial Terms Section */}
              <div className="space-y-6 p-1">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">3. Commercial Terms</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contractValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contract Value</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 100,000 (fixed fee, per shipment, per km)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="IDR">IDR - Indonesian Rupiah</SelectItem>
                            <SelectItem value="SGD">SGD - Singapore Dollar</SelectItem>
                            <SelectItem value="MYR">MYR - Malaysian Ringgit</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="paymentTerms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Terms</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment terms" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="net-15">Net 15 days</SelectItem>
                          <SelectItem value="net-30">Net 30 days</SelectItem>
                          <SelectItem value="net-60">Net 60 days</SelectItem>
                          <SelectItem value="upfront">Upfront payment</SelectItem>
                          <SelectItem value="milestone">Milestone payments</SelectItem>
                          <SelectItem value="cod">Cash on Delivery</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="penaltyFees"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Penalty/Late Fees (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2% per month for late payment" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Duration & Termination Section */}
              <div className="space-y-6 p-1">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">4. Duration & Termination</h3>
                
                <FormField
                  control={form.control}
                  name="contractDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contract Duration</FormLabel>
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
                          <SelectItem value="3 years">3 Years</SelectItem>
                          <SelectItem value="indefinite">Indefinite (until terminated)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date (Optional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="terminationClause"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Termination Clause</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g., 30-day written notice, breach of contract conditions..."
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Operational Terms Section */}
              <div className="space-y-6 p-1">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">5. Operational Terms</h3>
                
                <FormField
                  control={form.control}
                  name="serviceLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Level / Performance Metrics</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g., delivery time, handling quality, on-time % target, liability cap..."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="insuranceRequirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance Requirements</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g., cargo insurance coverage, liability insurance requirements..."
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="liabilityIndemnity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Liability & Indemnity</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g., who bears loss/damage risk, liability limitations..."
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="forceMajeure"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Force Majeure (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g., unexpected events clause, specific force majeure events..."
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Legal & Compliance Section */}
              <div className="space-y-6 p-1">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">6. Legal & Compliance</h3>
                
                <FormField
                  control={form.control}
                  name="governingLaw"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Governing Law / Jurisdiction</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select governing law" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="indonesia">Indonesian Law</SelectItem>
                          <SelectItem value="singapore">Singapore Law</SelectItem>
                          <SelectItem value="malaysia">Malaysian Law</SelectItem>
                          <SelectItem value="international">International Maritime Law</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confidentiality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confidentiality / NDA (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="e.g., confidentiality requirements, non-disclosure terms..."
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="disputeResolution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dispute Resolution</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select dispute resolution method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="court">Court litigation</SelectItem>
                          <SelectItem value="arbitration">Arbitration</SelectItem>
                          <SelectItem value="mediation">Mediation</SelectItem>
                          <SelectItem value="mediation-then-arbitration">Mediation then Arbitration</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
            <Eye className="h-5 w-5" />
            AI Generated Draft
          </CardTitle>
          <CardDescription>Review the AI-generated contract draft below.</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <ScrollArea className="h-[calc(100vh-12rem)]">
            {draft ? (
              <div className="prose dark:prose-invert max-w-none text-foreground pr-4">
                <div dangerouslySetInnerHTML={{ __html: draft }} />
                <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
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
              <div className="text-center py-12 text-muted-foreground h-full flex flex-col justify-center">
                <PenTool className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No draft generated yet</p>
                <p className="text-sm">Fill in the contract information and click "Generate Contract Draft"</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
