import { useState, useEffect } from 'react'

export interface Contract {
  id: string
  title: string
  parties: string
  category: string
  status: "Aktif" | "Akan Jatuh Tempo" | "Kedaluwarsa" | "Pending"
  value: number
  startDate: string
  endDate: string
  expiration: string // For backward compatibility
  uploadedAt: string
  fileUrl: string
  contractData: any
  user?: {
    username: string
    email: string
    role: 'MANAGEMENT' | 'LAW' | 'INTERNAL'
  }
}

export function useContracts() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchContracts()
  }, [])

  const fetchContracts = async () => {
    try {
      setLoading(true)
      setError(null)
      // API call to get contracts from Supabase via Prisma
      const response = await fetch('/api/contracts')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setContracts(data)
    } catch (err) {
      console.error('Error fetching contracts:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch contracts')
    } finally {
      setLoading(false)
    }
  }

  const addContract = async (contractData: Omit<Contract, 'id' | 'uploadedAt'>) => {
    try {
      const response = await fetch('/api/contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contractData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const newContract = await response.json()
      setContracts(prev => [newContract, ...prev])
      return newContract
    } catch (err) {
      console.error('Error adding contract:', err)
      throw err
    }
  }

  return { 
    contracts, 
    loading, 
    error, 
    refetch: fetchContracts,
    addContract
  }
}