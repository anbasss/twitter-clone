import bcrypt from 'bcrypt';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/libs/prismadb';

export async function POST(req: NextRequest) {
  try {
    const { email, username, name, password } = await req.json();

    console.log('Registration attempt:', { email, username, name });

    // Validasi input fields
    if (!email || !username || !name || !password) {
      console.log('Missing fields:', { email: !!email, username: !!username, name: !!name, password: !!password });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validasi format email yang ketat
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validasi bahwa email bukan hanya string biasa (harus ada @ dan domain)
    if (!email.includes('@') || !email.includes('.') || email.split('@').length !== 2) {
      return NextResponse.json(
        { error: 'Email must be a valid email address with @ and domain' },
        { status: 400 }
      );
    }

    // Validasi panjang dan format password
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validasi username (hanya alphanumeric dan underscore)
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { error: 'Username must be 3-20 characters long and contain only letters, numbers, and underscores' },
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
