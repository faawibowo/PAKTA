"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import { AiDraftingForm } from "@/components/ai-drafting-form";
import { AiDraftingFormModular } from "@/components/ai-drafting-form-modular";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, List } from "lucide-react";

export default function DraftPage() {
  const [useModular, setUseModular] = useState(false);

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI Contract Drafting Assistant</h1>
            <p className="text-muted-foreground mt-2">
              Generate contract drafts with AI assistance and compliance checking
            </p>
          </div>
          <div className="flex items-center gap-2">
          </div>
        </div>
        <AiDraftingFormModular />
      </div>
    </MainLayout>
  );
}
