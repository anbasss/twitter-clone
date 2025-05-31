import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import prisma from "@/libs/prismadb";

export async function GET(req: NextRequest) {
  try {
    console.log('GET /api/users - Starting request');
    
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        username: true,
        profileImage: true
      },
      take: 4
    });

    if (!users) {
      return NextResponse.json({ error: "No users found" }, { status: 404 });
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error in GET /api/users:', error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  console.log('PATCH /api/users - Request started');
  
  try {
    const session = await getServerSession(authOptions);
    console.log('Session retrieved:', !!session);

    if (!session?.user?.email) {
      console.log('No session or email found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, username, bio, profileImage, coverImage } = body;

    console.log('PATCH /api/users - Received data:', { name, username, bio, profileImage: !!profileImage, coverImage: !!coverImage });

    // Find the current user
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if the username is already taken by another user
    if (username && username !== currentUser.username) {
      const existingUser = await prisma.user.findUnique({
        where: {
          username
        }
      });

      if (existingUser && existingUser.id !== currentUser.id) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
      }
    }

    // Prepare update data
    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name;
    if (username !== undefined) updateData.username = username;
    if (bio !== undefined) updateData.bio = bio;
    if (profileImage !== undefined) updateData.profileImage = profileImage;
    if (coverImage !== undefined) updateData.coverImage = coverImage;

    console.log('Update data:', updateData);

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id
      },
      data: updateData
    });    console.log('User updated successfully:', updatedUser.id);
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error in PATCH /api/users:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
