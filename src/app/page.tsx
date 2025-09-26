"use client";

import { useEffect, useState } from "react";
import { MainLayout } from "@/components/layout/main-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText } from "lucide-react";
import { ContractTable } from "@/components/contract-table";
import { UploadContractModal } from "@/components/upload-contract-modal";

interface Contract {
  id: number;
  title: string;
  parties: string;
  category: string;
  status: string;
  value: number;
  startDate: string;
  endDate: string;
  uploadedAt: string;
  fileUrl: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}




export default function HomePage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContracts() {
      try {
        const res = await fetch("/api/contracts");
        const data = await res.json();
        if (data.success) {
          setContracts(data.data);
        } else {
          console.error("Failed to fetch contracts:", data.message);
        }
      } catch (err) {
        console.error("Error fetching contracts:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchContracts();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Smart Contract Vault
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage, validate, and draft contracts with AI assistance
            </p>
          </div>
          <UploadContractModal />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Contracts
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contracts.length}</div>
            </CardContent>
          </Card>
          {/* ... other cards, you can calculate valid, expiring, critical based on contracts */}
        </div>

        {/* Contract Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Contracts</CardTitle>
            <CardDescription>
              Your most recently uploaded and modified contracts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <ContractTable contracts={contracts} />
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
