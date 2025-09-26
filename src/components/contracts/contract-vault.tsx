'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Calendar, 
  Building2, 
  Trash2, 
  Eye, 
  Loader2,
  Search,
  Filter,
  DollarSign,
  Users
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useContracts, SavedContract } from '@/hooks/use-contracts';
import { toast } from 'sonner';

interface ContractVaultProps {
  onViewContract?: (contract: SavedContract) => void;
}

export function ContractVault({ onViewContract }: ContractVaultProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // For demo purposes, using userId = 1. In real app, get from auth context
  const userId = 1;
  const { contracts, isLoading, error, fetchContracts, deleteContract } = useContracts(userId);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const handleDeleteContract = async (id: number, title: string) => {
    if (window.confirm(`Are you sure you want to delete the contract "${title}"?`)) {
      const success = await deleteContract(id);
      if (success) {
        toast.success('Contract deleted successfully!');
      } else {
        toast.error('Failed to delete contract. Please try again.');
      }
    }
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.parties.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contract.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Error loading contracts: {error}</p>
            <Button onClick={fetchContracts} className="mt-2">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Contract Vault
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your saved contracts and generated drafts
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {filteredContracts.length} contract{filteredContracts.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search contracts by title, parties, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contracts List */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading contracts...</span>
              </div>
            ) : filteredContracts.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No contracts found</p>
                <p className="text-sm">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Start generating contracts to see them here'
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredContracts.map((contract) => (
                  <div key={contract.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <h3 className="font-semibold text-foreground">
                            {contract.title}
                          </h3>
                          <Badge 
                            variant="secondary" 
                            className={getStatusColor(contract.status)}
                          >
                            {contract.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span className="truncate">{contract.parties}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {contract.category}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {formatCurrency(contract.value)}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Start: {formatDate(contract.startDate)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            End: {formatDate(contract.endDate)}
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          Contract ID: #{contract.id} • Created: {formatDate(contract.uploadedAt)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {onViewContract && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewContract(contract)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteContract(contract.id, contract.title)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}