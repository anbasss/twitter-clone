import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

import prisma from "@/libs/prismadb";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { postId } = await req.json();

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId
      }
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check if the user has already liked this post
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId
        }
      }
    });

    if (existingLike) {
      // User has already liked this post, so unlike it
      await prisma.like.delete({
        where: {
          id: existingLike.id
        }
      });

      return NextResponse.json({ message: 'Like removed', liked: false });
    } else {
      // User hasn't liked this post, so like it
      const like = await prisma.like.create({
        data: {
          userId: user.id,
          postId
        }
      });

      // Create a notification if the post is not by the current user
      if (post.userId !== user.id) {
        await prisma.notification.create({
          data: {
            body: 'Someone liked your tweet!',
            userId: post.userId
          }
        });

        // Update the user's notification status
        await prisma.user.update({
          where: {
            id: post.userId
          },
          data: {
            hasNotification: true
          }
        });
      }

      return NextResponse.json({ ...like, liked: true }, { status: 201 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find and delete the like
    await prisma.like.deleteMany({
      where: {
        postId,
        userId: user.id
      }
    });

    return NextResponse.json({ message: 'Like removed', liked: false });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
