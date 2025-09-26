import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Helper function to determine contract status based on dates
function calculateContractStatus(status: 'ACTIVE' | 'EXPIRED' | 'PENDING', endDate: Date): 'Aktif' | 'Akan Jatuh Tempo' | 'Kedaluwarsa' | 'Pending' {
  const now = new Date()
  const timeDiff = endDate.getTime() - now.getTime()
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

  if (status === 'EXPIRED' || daysDiff < 0) {
    return 'Kedaluwarsa'
  }
  if (status === 'PENDING') {
    return 'Pending'
  }
  if (daysDiff <= 30) {
    return 'Akan Jatuh Tempo'
  }
  return 'Aktif'
}

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId)
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      )
    }

    // Fetch contracts for specific user from Supabase via Prisma
    const contracts = await prisma.contract.findMany({
      where: {
        userId: userId
      },
      include: {
        User: {
          select: {
            username: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        uploadedAt: 'desc'
      }
    })

    // Transform data to match frontend interface
    const transformedContracts = contracts.map(contract => ({
      id: contract.id.toString(),
      title: contract.title,
      parties: contract.parties,
      category: contract.category,
      status: calculateContractStatus(contract.status, contract.endDate),
      value: contract.value,
      startDate: contract.startDate.toISOString().split('T')[0],
      endDate: contract.endDate.toISOString().split('T')[0],
      expiration: contract.endDate.toISOString().split('T')[0], // For backward compatibility
      uploadedAt: contract.uploadedAt.toISOString().split('T')[0],
      fileUrl: contract.fileUrl,
      contractData: contract.contractData,
      user: contract.User
    }))

    return NextResponse.json(transformedContracts)
  } catch (error) {
    console.error('Error fetching user contracts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user contracts' },
      { status: 500 }
    )
  }
}