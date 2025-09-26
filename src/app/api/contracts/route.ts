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

export async function GET() {
  try {
    // Fetch contracts from Supabase via Prisma with related user data
    const contracts = await prisma.contract.findMany({
      include: {
        user: {
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
      id: contract.id, // Keep as number
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
      user: contract.user
    }))

    return NextResponse.json({
      success: true,
      data: transformedContracts
    })
  } catch (error) {
    console.error('Error fetching contracts:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contracts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      title, 
      parties, 
      category, 
      status = 'PENDING', 
      value, 
      startDate, 
      endDate, 
      fileUrl = '',
      contractData = {},
      userId 
    } = body

    // Validate required fields
    if (!title || !parties || !category || !startDate || !endDate || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, parties, category, startDate, endDate, userId' },
        { status: 400 }
      )
    }

    // Create new contract in Supabase
    const newContract = await prisma.contract.create({
      data: {
        title,
        parties,
        category,
        status: status as 'ACTIVE' | 'EXPIRED' | 'PENDING',
        value: parseFloat(value) || 0,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        fileUrl,
        contractData,
        userId: parseInt(userId)
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            role: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      contract: newContract
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating contract:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create contract' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contractId = searchParams.get('id')

    if (!contractId) {
      return NextResponse.json(
        { success: false, error: 'Contract ID is required' },
        { status: 400 }
      )
    }

    // Delete contract from database
    await prisma.contract.delete({
      where: {
        id: parseInt(contractId)
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Contract deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting contract:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete contract' },
      { status: 500 }
    )
  }
}