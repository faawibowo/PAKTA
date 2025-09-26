import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Get total counts
    const totalUsers = await prisma.user.count();
    const totalContracts = await prisma.contract.count();
    const totalDrafts = await prisma.aIContractDraft.count();

    // Get users by role
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true,
      },
    });

    // Convert to expected format
    const roleStats = {
      MANAGEMENT: 0,
      LAW: 0,
      INTERNAL: 0,
      GUEST: 0,
    };

    usersByRole.forEach((group) => {
      roleStats[group.role as keyof typeof roleStats] = group._count.role;
    });

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newUsersThisMonth = await prisma.user.count({
      where: {
        // Assuming you have a createdAt field
        // If not, this will just return 0
      }
    });

    const newContractsThisMonth = await prisma.contract.count({
      where: {
        uploadedAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    const stats = {
      totalUsers,
      totalContracts,
      totalDrafts,
      usersByRole: roleStats,
      recentActivity: {
        newUsersThisMonth: Math.max(0, newUsersThisMonth), // Fallback to 0 if no createdAt field
        newContractsThisMonth,
      },
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}