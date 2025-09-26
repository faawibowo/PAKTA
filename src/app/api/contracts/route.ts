import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma/client";

export async function GET(req: NextRequest) {
  try {
    const contracts = await prisma.contract.findMany({
      include: {
        user: true, // include user info if needed
        validations: true, // include contract validations if needed
      },
    });

    return NextResponse.json({ success: true, data: contracts });
  } catch (error) {
    console.error("Error fetching contracts:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch contracts" },
      { status: 500 },
    );
  }
}


export async function POST(request: NextRequest) {
  try {
    console.log('API: Received POST request to /api/contracts');
    
    const body = await request.json();
    console.log('API: Request body:', body);
    
    console.log('API: Creating contract in database...');
    
    const contract = await prisma.contract.create({
      data: {
        title: body.title,
        parties: body.parties,
        category: body.category,
        status: body.status || 'PENDING',
        value: body.value,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        fileUrl: body.fileUrl,
        contractData: body.contractData,
        userId: body.userId
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
    });

    console.log('API: Contract created successfully:', {
      id: contract.id,
      title: contract.title,
      status: contract.status
    });

    return NextResponse.json({
      success: true,
      contract
    });

  } catch (error) {
    console.error('API: Error creating contract:', error);
    console.error('API: Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: typeof error
    });
    
    let errorMessage = 'Failed to create contract';
    if (error instanceof Error) {
      if (error.message.includes('Foreign key constraint')) {
        errorMessage = 'User not found. Please ensure the user exists in the database.';
      } else if (error.message.includes('Unique constraint')) {
        errorMessage = 'A contract with this title already exists.';
      } else if (error.message.includes('connect ECONNREFUSED')) {
        errorMessage = 'Database connection failed. Please check your database connection.';
      }
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
