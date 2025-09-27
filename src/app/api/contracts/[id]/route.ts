import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma/client";
import { supabase } from '@/lib/supabase';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Await params first
    const contractId = parseInt(id);
    
    if (isNaN(contractId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid contract ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { fileUrl, contractData, ...updateData } = body;

    // Prepare update data
    const dataToUpdate: any = {};
    
    if (fileUrl) {
      dataToUpdate.fileUrl = fileUrl;
    }
    
    if (contractData) {
      dataToUpdate.contractData = contractData;
    }
    
    // Add any other update fields
    Object.assign(dataToUpdate, updateData);

    // Update the contract
    const updatedContract = await prisma.contract.update({
      where: { id: contractId },
      data: dataToUpdate,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      contract: updatedContract,
    });

  } catch (error) {
    console.error('Error updating contract:', error);
    
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Contract not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update contract' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Await params first
    const contractId = parseInt(id);

    const contract = await prisma.contract.findUnique({
      where: { id: contractId }
    });

    if (!contract) {
      return NextResponse.json(
        { error: 'Contract not found' },
        { status: 404 }
      );
    }

    const contractData = contract.contractData as any;
    if (contractData?.uploadPath) {
      const { error: fileError } = await supabase
        .storage
        .from('contract')
        .remove([contractData.uploadPath]);
      
      if (fileError) {
        console.error('Error deleting file:', fileError);
      }
    }

    await prisma.contractValidation.deleteMany({
      where: { contractId: contractId }
    });

    await prisma.contract.delete({
      where: { id: contractId }
    });

    return NextResponse.json({
      success: true,
      message: 'Contract and file deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting contract:', error);
    return NextResponse.json(
      { error: 'Failed to delete contract' },
      { status: 500 }
    );
  }
}