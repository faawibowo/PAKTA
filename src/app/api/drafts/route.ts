import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

// GET - Retrieve all drafts for a user (including contracts with generated content)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // First, get contracts from this user
    const allContracts = await prisma.contract.findMany({
      where: {
        userId: parseInt(userId)
      },
      orderBy: {
        id: 'desc'
      },
      include: {
        user: true
      }
    });

    // Filter contracts that have generated content (from draft assistant)
    const contractsWithContent = allContracts.filter(contract => {
      const contractData = contract.contractData as any;
      return contractData && contractData.generatedContent && contractData.formData;
    });

    // Then get pure drafts (form data only)
    const pureDrafts = await prisma.aIContractDraft.findMany({
      where: {
        userId: parseInt(userId)
      },
      orderBy: {
        id: 'desc'
      }
    });

    // Transform contracts to match the draft interface
    const contractDrafts = contractsWithContent.map(contract => {
      const contractData = contract.contractData as any;
      return {
        id: contract.id,
        companyName: contract.title,
        contractType: contract.category,
        duration: 12, // Default duration
        content: contractData.formData || {},
        status: 'COMPLETED', // Mark as completed since it has generated content
        userId: contract.userId,
        generatedContent: contractData.generatedContent, // Include the generated content
        generatedAt: contractData.generatedAt,
        contractId: contract.id, // Mark this as coming from contract table
        type: 'contract' // Distinguish from pure drafts
      };
    });

    // Transform pure drafts
    const formDrafts = pureDrafts.map(draft => ({
      ...draft,
      type: 'draft' // Distinguish from contracts
    }));

    // Combine and sort by ID (most recent first)
    const allDrafts = [...contractDrafts, ...formDrafts].sort((a, b) => b.id - a.id);

    return NextResponse.json({ drafts: allDrafts });
  } catch (error) {
    console.error('Error fetching drafts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drafts' },
      { status: 500 }
    );
  }
}

// POST - Save a new draft
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      companyName, 
      contractType, 
      duration, 
      content, 
      status = 'DRAFT',
      userId 
    } = body;

    if (!companyName || !contractType || !content || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const draft = await prisma.aIContractDraft.create({
      data: {
        companyName,
        contractType,
        duration: parseInt(duration) || 0,
        content,
        status,
        userId: parseInt(userId)
      }
    });

    return NextResponse.json({ 
      message: 'Draft saved successfully', 
      draft 
    });
  } catch (error) {
    console.error('Error saving draft:', error);
    return NextResponse.json(
      { error: 'Failed to save draft' },
      { status: 500 }
    );
  }
}

// PUT - Update an existing draft
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      id,
      companyName, 
      contractType, 
      duration, 
      content, 
      status,
      userId 
    } = body;

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'Draft ID and User ID are required' },
        { status: 400 }
      );
    }

    const draft = await prisma.aIContractDraft.update({
      where: {
        id: parseInt(id),
        userId: parseInt(userId) // Ensure user can only update their own drafts
      },
      data: {
        companyName,
        contractType,
        duration: parseInt(duration) || 0,
        content,
        status
      }
    });

    return NextResponse.json({ 
      message: 'Draft updated successfully', 
      draft 
    });
  } catch (error) {
    console.error('Error updating draft:', error);
    return NextResponse.json(
      { error: 'Failed to update draft' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a draft
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!id || !userId) {
      return NextResponse.json(
        { error: 'Draft ID and User ID are required' },
        { status: 400 }
      );
    }

    await prisma.aIContractDraft.delete({
      where: {
        id: parseInt(id),
        userId: parseInt(userId) // Ensure user can only delete their own drafts
      }
    });

    return NextResponse.json({ 
      message: 'Draft deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting draft:', error);
    return NextResponse.json(
      { error: 'Failed to delete draft' },
      { status: 500 }
    );
  }
}