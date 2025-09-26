"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {deleteContractAndFile} from '@/lib/fileService';
import { MoreHorizontal, Search, Filter, Edit, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { PreviewContractModal } from "./contract-modal";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface Contract {
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
  userId: number;
  user: User;
  contractData?: {
    generatedContent?: string;
    formData?: any;
    generatedAt?: string;
  };
}

interface ContractTableProps {
  // Optional: if you want to pass contracts from parent
  contracts?: Contract[];
}

export function ContractTable({
  contracts: initialContracts,
}: ContractTableProps) {
  const router = useRouter();
  const [contracts, setContracts] = useState<Contract[]>(
    initialContracts || [],
  );
  const [loading, setLoading] = useState(!initialContracts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Function to handle editing contracts from draft assistant
  const handleEditContract = (contract: Contract) => {
    // Check if this contract was created via draft assistant (has contractData with formData and generatedContent)
    if (contract.contractData?.formData && contract.contractData?.generatedContent) {
      // Store the contract data in sessionStorage for the draft assistant to pick up
      sessionStorage.setItem('editingContract', JSON.stringify({
        id: contract.id,
        formData: contract.contractData.formData,
        generatedContent: contract.contractData.generatedContent,
        title: contract.title
      }));
      
      // Navigate to draft assistant page
      router.push('/draft?edit=true');
      toast.info('Loading contract in Draft Assistant...');
    } else {
      // For contracts not created via draft assistant, show a message
      toast.info('This contract was not created via Draft Assistant and cannot be edited here.');
    }
  };

  // Check if contract can be edited (created via draft assistant)
  const canEditContract = (contract: Contract) => {
    return contract.contractData?.formData && contract.contractData?.generatedContent;
  };
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch contracts if not provided via props
  useEffect(() => {
    if (!initialContracts) {
      async function fetchContracts() {
        setLoading(true);
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
    }
  }, [initialContracts]);

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.parties.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "all" ||
      contract.category.toLowerCase() === filterCategory.toLowerCase();
    const matchesStatus =
      filterStatus === "all" ||
      contract.status.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = (id: number) => {
    setContracts(contracts.filter((contract) => contract.id !== id));
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "valid":
        return "bg-success text-success-foreground";
      case "pending":
      case "warning":
        return "bg-warning text-warning-foreground";
      case "expired":
      case "error":
        return "bg-error text-error-foreground";
      case "draft":
        return "bg-muted text-muted-foreground";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <p className="text-center text-muted-foreground">Loading contracts...</p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search contracts by title, parties, or category..."
            className="w-full pl-10 pr-4 py-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <div className="p-2">
              <h4 className="font-medium mb-2">Category</h4>
              <div className="space-y-1">
                {["All", "Software", "Legal", "Services", "Business"].map(
                  (category) => (
                    <Button
                      key={category}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start",
                        filterCategory.toLowerCase() ===
                          category.toLowerCase() &&
                          "bg-accent text-accent-foreground",
                      )}
                      onClick={() => setFilterCategory(category)}
                    >
                      {category}
                    </Button>
                  ),
                )}
              </div>
              <h4 className="font-medium mt-4 mb-2">Status</h4>
              <div className="space-y-1">
                {["All", "Active", "Pending", "Expired", "Draft"].map(
                  (status) => (
                    <Button
                      key={status}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start",
                        filterStatus.toLowerCase() === status.toLowerCase() &&
                          "bg-accent text-accent-foreground",
                      )}
                      onClick={() => setFilterStatus(status)}
                    >
                      {status}
                    </Button>
                  ),
                )}
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Contract Title</TableHead>
              <TableHead>Parties Involved</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Preview</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContracts.length > 0 ? (
              filteredContracts.map((contract) => (
                <TableRow
                  key={contract.id}
                  onClick={() => {
                    setSelectedContract(contract);
                    setModalOpen(true);
                  }}
                >
                  <TableCell className="font-medium">
                    {contract.title}
                  </TableCell>
                  <TableCell>{contract.parties}</TableCell>
                  <TableCell>{contract.category}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeClass(contract.status)}>
                      {contract.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={contract.fileUrl}
                      className="text-primary hover:underline"
                      prefetch={false}
                    >
                      View
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {canEditContract(contract) ? (
                          <DropdownMenuItem
                            className="flex items-center gap-2"
                            onClick={() => handleEditContract(contract)}
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="flex items-center gap-2 opacity-50 cursor-not-allowed"
                            disabled
                          >
                            <Edit className="h-4 w-4" />
                            Edit (Not from Draft Assistant)
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          className="flex items-center gap-2"
                          onClick={async () => {
                          const success = await deleteContractAndFile(contract.id);
                          if (success) {
                            handleDelete(contract.id);
                            alert("Deleted successfully.");
                          } else {
                            alert("Failed to delete contract.");
                          }
                          }}
                        >
                          <Trash className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No contracts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {selectedContract && (
          <PreviewContractModal
            contract={selectedContract}
            open={modalOpen}
            onOpenChange={setModalOpen}
          />
        )}
      </div>
    </div>
  );
}
