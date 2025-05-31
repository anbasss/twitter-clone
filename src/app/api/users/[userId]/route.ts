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

    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId
      },
      include: {
        followedBy: {
          select: {
            followerId: true
          }
        },
        following: {
          select: {
            followingId: true
          }
        }
      }
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Convert the Follow objects to arrays of IDs for easier frontend handling
    const followingIds = existingUser.following.map(follow => follow.followingId);
    const followerIds = existingUser.followedBy.map(follow => follow.followerId);

    const formattedUser = {
      ...existingUser,
      followingIds,
      followerIds,
      followedBy: undefined,
      following: undefined,
      hashedPassword: undefined,
    };
    
    return NextResponse.json(formattedUser);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
