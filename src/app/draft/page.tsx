import { MainLayout } from "@/components/layout/main-layout"
import { AiDraftingForm } from "@/components/ai-drafting-form"

export default function DraftPage() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Contract Drafting Assistant</h1>
          <p className="text-muted-foreground mt-2">
            Generate contract drafts with AI assistance and compliance checking
          </p>
        </div>
        <AiDraftingForm />
      </div>
    </MainLayout>
  )
}
