import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma/client";
import { supabase } from '@/lib/supabase';


export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contractId = parseInt(params.id);

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