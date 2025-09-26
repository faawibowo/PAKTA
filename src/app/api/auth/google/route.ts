import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

interface GoogleUserInfo {
  id: string
  email: string
  name: string
  picture?: string
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    // Verify Google token and get user info
    const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`)
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Invalid Google token' }, { status: 400 })
    }

    const googleUser: GoogleUserInfo = await response.json()

    if (!googleUser.email) {
      return NextResponse.json({ error: 'Email not provided by Google' }, { status: 400 })
    }

    // Check if user exists in database
    let user = await prisma.user.findUnique({
      where: { email: googleUser.email }
    })

    if (user) {
      // User exists, return user data
      return NextResponse.json({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      })
    } else {
      // User doesn't exist, create new user
      // Generate a secure random password for Google OAuth users (they won't use it for login)
      const randomPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      const hashedPassword = await bcrypt.hash(randomPassword, 12)
      
      user = await prisma.user.create({
        data: {
          username: googleUser.name, // Use Google name as username
          email: googleUser.email,
          password: hashedPassword, // Hashed random password (not used for login)
          oauthProvider: 'google',
          oauthId: googleUser.id,
          role: 'INTERNAL' // Default role
        }
      })

      return NextResponse.json({
        message: 'Registration successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      })
    }
  } catch (error) {
    console.error('Google auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}