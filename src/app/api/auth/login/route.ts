import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email dan password wajib diisi' },
        { status: 400 }
      );
    }

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { 
        email: email.toLowerCase().trim() 
      }
    });

    if (!user) {
      return NextResponse.json(
        { 
          error: 'Email tidak terdaftar',
          field: 'email'
        },
        { status: 401 }
      );
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { 
          error: 'Password salah',
          field: 'password'
        },
        { status: 401 }
      );
    }

    // Return user info tanpa password
    return NextResponse.json({
      success: true,
      message: 'Login berhasil',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    }, { status: 200 });

  } catch (error) {
    console.error('LOGIN ERROR:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan internal' },
      { status: 500 }
    );
  }
}