import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

import prisma from "@/libs/prismadb";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        profileImage: true,
        coverImage: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
        hasNotification: true,
        following: {
          select: {
            followingId: true
          }
        }
      }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Transform the following relation to a simple array of IDs for compatibility
    const userWithFollowingIds = {
      ...currentUser,
      followingIds: currentUser.following.map(f => f.followingId)
    };

    // Remove the original following array since we've transformed it
    delete (userWithFollowingIds as any).following;

    return NextResponse.json(userWithFollowingIds);
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
