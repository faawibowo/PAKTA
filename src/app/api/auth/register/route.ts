import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, role } = await request.json();

    // Validasi input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, dan password wajib diisi' },
        { status: 400 }
      );
    }

    // Cek apakah username sudah ada
    const existingUsername = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username sudah digunakan', field: 'username' },
        { status: 409 }
      );
    }

    // Cek apakah email sudah ada
    const existingEmail = await prisma.user.findUnique({
      where: { email }
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email sudah digunakan', field: 'email' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Buat user baru
    const user = await prisma.user.create({
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
        role: true
      }
    });

    return NextResponse.json({ 
      message: 'User berhasil dibuat',
      user 
    }, { status: 201 });

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan internal' },
      { status: 500 }
    );
  }
}