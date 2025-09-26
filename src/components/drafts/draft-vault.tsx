'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Archive, 
  FileText, 
  Calendar, 
  Building2, 
  Trash2, 
  Edit, 
  Loader2,
  Search,
  Filter
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDrafts, SavedDraft } from '@/hooks/use-drafts';
import { ContractFormData } from '@/lib/contract-form-schema';
import { toast } from 'sonner';

interface DraftVaultProps {
  onLoadDraft?: (draft: SavedDraft) => void;
}

export function DraftVault({ onLoadDraft }: DraftVaultProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // For demo purposes, using userId = 1. In real app, get from auth context
  const userId = 1;
  const { drafts, isLoading, error, fetchDrafts, deleteDraft } = useDrafts(userId);

  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  const handleDeleteDraft = async (id: number, companyName: string) => {
    if (window.confirm(`Are you sure you want to delete the draft for "${companyName}"?`)) {
      const success = await deleteDraft(id);
      if (success) {
        toast.success('Draft deleted successfully!');
      } else {
        toast.error('Failed to delete draft. Please try again.');
      }
    }
  };

  const filteredDrafts = drafts.filter(draft => {
    const matchesSearch = draft.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         draft.contractType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || draft.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Error loading drafts: {error}</p>
            <Button onClick={fetchDrafts} className="mt-2">
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
            <Archive className="h-6 w-6" />
            Contract Drafts Vault
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage your saved contract drafts and continue working on incomplete forms
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {filteredDrafts.length} draft{filteredDrafts.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Search and Filter Controls */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search drafts by company or contract type..."
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
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

      {/* Drafts List */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="ml-2 text-muted-foreground">Loading drafts...</span>
              </div>
            ) : filteredDrafts.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                <Archive className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No drafts found</p>
                <p className="text-sm">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria'
                    : 'Start creating contract drafts to see them here'
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredDrafts.map((draft) => (
                  <div key={draft.id} className="p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Building2 className="h-5 w-5 text-muted-foreground" />
                          <h3 className="font-semibold text-foreground">
                            {draft.companyName}
                          </h3>
                          <Badge variant={draft.status === 'DRAFT' ? 'secondary' : 'default'}>
                            {draft.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {draft.contractType}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Duration: {draft.duration} months
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          Draft ID: #{draft.id}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {onLoadDraft && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onLoadDraft(draft)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Continue
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDraft(draft.id, draft.companyName)}
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