import { MainLayout } from "@/components/layout/main-layout"
import { ContractValidation } from "@/components/contract-validation"

export default function ValidationPage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contract Validation</h1>
          <p className="text-muted-foreground mt-2">Upload and validate contracts for compliance and legal issues</p>
        </div>
        <ContractValidation />
      </div>
    </MainLayout>
  )
}
