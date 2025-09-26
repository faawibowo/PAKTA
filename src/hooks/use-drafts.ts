import { useState, useCallback } from 'react';
import { ContractFormData } from '@/lib/contract-form-schema';

export interface SavedDraft {
  id: number;
  companyName: string;
  contractType: string;
  duration: number;
  content: ContractFormData;
  status: string;
  userId: number;
  generatedContent?: string; // Optional: only present for contracts with generated content
  generatedAt?: string; // Optional: timestamp when content was generated
  contractId?: number; // Optional: reference to contract table
  type?: 'contract' | 'draft'; // Optional: distinguishes between contracts and pure drafts
}

export function useDrafts(userId: number) {
  const [drafts, setDrafts] = useState<SavedDraft[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDrafts = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/drafts?userId=${userId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch drafts');
      }
      
      setDrafts(data.drafts);
    } catch (error) {
      console.error('Error fetching drafts:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch drafts');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const saveDraft = useCallback(async (
    formData: ContractFormData,
    companyName?: string,
    contractType?: string
  ): Promise<SavedDraft | null> => {
    if (!userId) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/drafts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: companyName || formData.partyAName || 'Untitled Contract',
          contractType: contractType || formData.serviceType || 'General Contract',
          duration: 12, // Default duration
          content: formData,
          status: 'DRAFT',
          userId
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save draft');
      }
      
      // Refresh the drafts list
      await fetchDrafts();
      
      return data.draft;
    } catch (error) {
      console.error('Error saving draft:', error);
      setError(error instanceof Error ? error.message : 'Failed to save draft');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [userId, fetchDrafts]);

  const updateDraft = useCallback(async (
    id: number,
    formData: ContractFormData,
    companyName?: string,
    contractType?: string
  ): Promise<SavedDraft | null> => {
    if (!userId) return null;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/drafts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          companyName: companyName || formData.partyAName || 'Untitled Contract',
          contractType: contractType || formData.serviceType || 'General Contract',
          duration: 12,
          content: formData,
          status: 'DRAFT',
          userId
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update draft');
      }
      
      // Refresh the drafts list
      await fetchDrafts();
      
      return data.draft;
    } catch (error) {
      console.error('Error updating draft:', error);
      setError(error instanceof Error ? error.message : 'Failed to update draft');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [userId, fetchDrafts]);

  const deleteDraft = useCallback(async (id: number, type: string = 'draft'): Promise<boolean> => {
    if (!userId) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Use different API endpoints based on type
      const apiEndpoint = type === 'contract' ? `/api/contracts?id=${id}` : `/api/drafts?id=${id}&userId=${userId}`;
      
      const response = await fetch(apiEndpoint, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete draft');
      }
      
      // Refresh the drafts list
      await fetchDrafts();
      
      return true;
    } catch (error) {
      console.error('Error deleting draft:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete draft');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [userId, fetchDrafts]);

  return {
    drafts,
    isLoading,
    error,
    fetchDrafts,
    saveDraft,
    updateDraft,
    deleteDraft
  };
}