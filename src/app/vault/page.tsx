"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { ContractTable } from "@/components/contract-table"
import { UploadContractModal } from "@/components/upload-contract-modal"
import { formatUserRole } from "@/lib/role-utils"
import { useEffect, useState } from "react"




export default function VaultPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contracts, setContracts] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/contracts');
        
        if (!response.ok) {
          throw new Error('Failed to fetch contract statistics');
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
          setContracts(data.data);
          
          // Calculate stats from the contract data
          const contractData = data.data;
          const total = contractData.length;
        }
      } catch (err) {
        console.error('Error fetching contract stats:', err);
        setError(err instanceof Error ? err.message : 'Failed to load statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);
  
  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Smart Contract Vault</h1>
            <p className="text-muted-foreground mt-2">Manage, validate, and draft contracts with AI assistance</p>
          </div>
          <UploadContractModal />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contracts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contracts.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Contract Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Contracts</CardTitle>
            <CardDescription>Your most recently uploaded and modified contracts</CardDescription>
          </CardHeader>
          <CardContent>
            <ContractTable />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}