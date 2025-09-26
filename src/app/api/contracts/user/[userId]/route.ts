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

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching contracts from database...')
    
    // Fetch all contracts from database
    const contracts = await prisma.contract.findMany({
      include: {
        user: {  // Pastikan ini 'user' bukan 'User'
          select: {
            username: true,
            email: true,
            role: true
          }
        },
        validations: true
      },
      orderBy: {
        uploadedAt: "desc"
      }
    })

    console.log(`Found ${contracts.length} contracts`)

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
      uploadedAt: contract.uploadedAt.toISOString().split('T')[0],
      fileUrl: contract.fileUrl,
      contractData: contract.contractData,
      user: contract.user
    }))

    return NextResponse.json(transformedContracts)
  } catch (error) {
    console.error('Error fetching contracts:', error)
    
    // Return more detailed error information
    return NextResponse.json(
      { 
        error: 'Failed to fetch contracts',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Creating new contract:', body)
    
    const contract = await prisma.contract.create({
      data: {
        title: body.title,
        parties: body.parties,
        category: body.category,
        status: body.status || 'PENDING',
        value: body.value ? parseFloat(body.value) : null,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        fileUrl: body.fileUrl,
        contractData: body.contractData,
        userId: parseInt(body.userId)
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            role: true
          }
        },
        validations: true
      }
    })

    console.log('Contract created successfully:', contract.id)

    return NextResponse.json({
      id: contract.id.toString(),
      title: contract.title,
      parties: contract.parties,
      category: contract.category,
      status: calculateContractStatus(contract.status, contract.endDate),
      value: contract.value,
      startDate: contract.startDate.toISOString().split('T')[0],
      endDate: contract.endDate.toISOString().split('T')[0],
      uploadedAt: contract.uploadedAt.toISOString().split('T')[0],
      fileUrl: contract.fileUrl,
      contractData: contract.contractData,
      user: contract.user
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating contract:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create contract',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}