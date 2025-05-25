import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import prisma from "@/libs/prismadb";

export async function GET(req: NextRequest) {
  // No authentication needed for fetching posts
  try {
    // Verify database connection first
    try {
      await prisma.$connect();
    } catch (e) {
      console.error('Database connection failed:', e);
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
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
    });    // Transform the likes array to a likedIds array for easier frontend handling
    const formattedPosts = posts.map((post: any) => ({
      ...post,
      likedIds: post.likes.map((like: { userId: string }) => like.userId)
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
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
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
