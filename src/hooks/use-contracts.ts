import { useState, useCallback } from 'react';

export interface SavedContract {
  id: number;
  title: string;
  parties: string;
  category: string;
  status: string;
  value: number;
  startDate: string;
  endDate: string;
  uploadedAt: string;
  contractData: {
    generatedContent?: string;
    formData?: any;
    generatedAt?: string;
  };
}

export function useContracts(userId: number) {
  const [contracts, setContracts] = useState<SavedContract[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContracts = useCallback(async () => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/contracts?userId=${userId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch contracts');
      }

      if (data.success && Array.isArray(data.contracts)) {
        setContracts(data.contracts);
      } else if (data.success && Array.isArray(data.data)) {
        // Handle different response format
        setContracts(data.data.filter((contract: any) => contract.userId === userId));
      } else {
        setContracts([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch contracts';
      setError(errorMessage);
      console.error('Error fetching contracts:', err);
      setContracts([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const saveContract = useCallback(async (
    title: string,
    parties: string,
    category: string,
    value: number,
    startDate: string,
    endDate: string,
    contractContent: string,
    formData: any
  ): Promise<SavedContract | null> => {
    setError(null);
    
    try {
      const contractData = {
        title,
        parties,
        category,
        value,
        startDate,
        endDate,
        fileUrl: '',
        contractData: {
          generatedContent: contractContent,
          formData: formData,
          generatedAt: new Date().toISOString(),
        },
        userId,
      };

      const response = await fetch('/api/contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contractData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save contract');
      }

      if (result.success && result.contract) {
        // Add to local state
        const newContract: SavedContract = {
          id: result.contract.id,
          title: result.contract.title,
          parties: result.contract.parties,
          category: result.contract.category,
          status: result.contract.status,
          value: result.contract.value,
          startDate: result.contract.startDate,
          endDate: result.contract.endDate,
          uploadedAt: result.contract.uploadedAt,
          contractData: contractData.contractData,
        };
        
        setContracts(prev => [newContract, ...prev]);
        return newContract;
      }
      
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save contract';
      setError(errorMessage);
      console.error('Error saving contract:', err);
      return null;
    }
  }, [userId]);

  const deleteContract = useCallback(async (contractId: number): Promise<boolean> => {
    setError(null);
    
    try {
      const response = await fetch(`/api/contracts?contractId=${contractId}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete contract');
      }

      if (result.success) {
        // Remove from local state
        setContracts(prev => prev.filter(contract => contract.id !== contractId));
        return true;
      }
      
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete contract';
      setError(errorMessage);
      console.error('Error deleting contract:', err);
      return false;
    }
  }, []);

  return {
    contracts,
    isLoading,
    error,
    fetchContracts,
    saveContract,
    deleteContract,
  };
}