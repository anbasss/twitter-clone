import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

import prisma from "@/libs/prismadb";

export async function GET(req: NextRequest) {
  try {
    // Ensure DATABASE_URL is available
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL environment variable is missing');
      return NextResponse.json({ 
        error: "Database configuration error" 
      }, { status: 500 });
    }

    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            profileImage: true,
          }
        },
        comments: {
          select: {
            id: true, // Only get count, not full comments
          }
        },
        likes: {
          select: {
            userId: true,
          }
        },
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50, // Limit to 50 posts for better performance
    });// Transform the likes array to a likedIds array for easier frontend handling
    const formattedPosts = posts.map((post: any) => ({
      ...post,
      likedIds: post.likes.map((like: { userId: string }) => like.userId)
    }));    return NextResponse.json(formattedPosts, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59'
      }
    });  } catch (error: any) {
    console.error('❌ Error fetching posts:', error);
    return NextResponse.json({ 
      error: "Failed to fetch posts",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { body } = await req.json();

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const post = await prisma.post.create({
      data: {
        body,
        userId: user.id
      }
    });    return NextResponse.json(post, { status: 201 });  } catch (error: any) {
    console.error('❌ Error creating post:', error);
    return NextResponse.json({ 
      error: "Failed to create post",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
