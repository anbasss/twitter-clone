import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

import prisma from "@/libs/prismadb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user posts
    const posts = await prisma.post.findMany({
      where: {
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            profileImage: true,
          }
        },
        comments: true,
        likes: {
          select: {
            userId: true,
          }
        },
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the likes array to a likedIds array for easier frontend handling
    const formattedPosts = posts.map(post => ({
      ...post,
      likedIds: post.likes.map(like => like.userId)
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
