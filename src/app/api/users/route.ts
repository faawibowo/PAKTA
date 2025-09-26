import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Fetch all users
export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        oauthProvider: true,
        _count: {
          select: {
            aiDrafts: true,
            contracts: true,
          }
        }
      },
      orderBy: {
        id: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST - Create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password, role } = body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { email: email }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return NextResponse.json(
          { success: false, error: 'Username already exists', field: 'username' },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          { success: false, error: 'Email already exists', field: 'email' },
          { status: 400 }
        );
      }
    }

    // Hash password (you should implement proper password hashing)
    const hashedPassword = password; // TODO: Implement proper password hashing

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role || 'INTERNAL'
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        oauthProvider: true,
      }
    });

    return NextResponse.json({
      success: true,
      user: newUser
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
