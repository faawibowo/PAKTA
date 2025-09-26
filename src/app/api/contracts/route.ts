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
