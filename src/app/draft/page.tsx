"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { AiDraftingFormModular } from "@/components/ai-drafting-form-modular";
import { DraftVault } from "@/components/drafts/draft-vault";
import { Button } from "@/components/ui/button";
import { FileText, Archive } from "lucide-react";
import { SavedDraft } from "@/hooks/use-drafts";

export default function DraftPage() {
  const [activeView, setActiveView] = useState<'form' | 'vault'>('form');
  const [selectedDraft, setSelectedDraft] = useState<SavedDraft | null>(null);

  const handleLoadDraft = (draft: SavedDraft) => {
    setSelectedDraft(draft);
    setActiveView('form');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI Contract Drafting Assistant</h1>
            <p className="text-muted-foreground mt-2">
              Generate contract drafts with AI assistance and compliance checking
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={activeView === 'form' ? 'default' : 'outline'}
              onClick={() => setActiveView('form')}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              New Draft
            </Button>
            <Button
              variant={activeView === 'vault' ? 'default' : 'outline'}
              onClick={() => setActiveView('vault')}
              className="flex items-center gap-2"
            >
              <Archive className="h-4 w-4" />
              Saved Drafts
            </Button>
          </div>
        </div>

        {activeView === 'form' ? (
          <AiDraftingFormModular loadedDraft={selectedDraft} />
        ) : (
          <DraftVault onLoadDraft={handleLoadDraft} />
        )}
      </div>
    </MainLayout>
  );
}
