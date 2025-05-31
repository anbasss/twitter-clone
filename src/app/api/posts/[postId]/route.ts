import { NextRequest, NextResponse } from "next/server";

import prisma from "@/libs/prismadb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;

    if (!postId || typeof postId !== 'string') {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId
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
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                profileImage: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        likes: {
          select: {
            userId: true,
          }
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Transform the likes array to a likedIds array for easier frontend handling
    const formattedPost = {
      ...post,
      likedIds: post.likes.map(like => like.userId)
    };

    return NextResponse.json(formattedPost);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
