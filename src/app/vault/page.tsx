import { MainLayout } from "@/components/layout/main-layout";
import { DraftVault } from "@/components/drafts/draft-vault";
import { ContractVault } from "@/components/contracts/contract-vault";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function VaultPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vault</h1>
          <p className="text-muted-foreground mt-2">
            Manage your draft contracts and final saved contracts
          </p>
        </div>
        
        <Tabs defaultValue="contracts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="contracts">Final Contracts</TabsTrigger>
            <TabsTrigger value="drafts">Draft Assistance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="contracts" className="space-y-6">
            <ContractVault />
          </TabsContent>
          
          <TabsContent value="drafts" className="space-y-6">
            <DraftVault />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}