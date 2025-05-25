import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/prismadb';

export async function POST(req: NextRequest) {
  try {
    const { email, username, name, password } = await req.json();

    console.log('Registration attempt:', { email, username, name });

    if (!email || !username || !name || !password) {
      console.log('Missing fields:', { email: !!email, username: !!username, name: !!name, password: !!password });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user with email already exists
    const existingUserEmail = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUserEmail) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }

    // Check if username is already taken
    const existingUsername = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username already taken' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    console.log('Creating user with data:', { email, username, name });
    
    const user = await prisma.user.create({
      data: {
        email,
        username,
        name,
        hashedPassword
      }
    });

    console.log('User created successfully:', user.id);
    
    return NextResponse.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Provide more specific error information
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'An error occurred while registering the user.',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
