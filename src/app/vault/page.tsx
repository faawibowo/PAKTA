import { MainLayout } from "@/components/layout/main-layout";
import { DraftVault } from "@/components/drafts/draft-vault";

export default function VaultPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <DraftVault />
      </div>
    </MainLayout>
  );
}