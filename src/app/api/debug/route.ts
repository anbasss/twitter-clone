import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // This endpoint helps debug environment variables in production
    const envCheck = {
      timestamp: new Date().toISOString(),
      nodeEnv: process.env.NODE_ENV,
      hasDatabase: !!process.env.DATABASE_URL,
      databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 20) + '...',
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasNextAuthJwtSecret: !!process.env.NEXTAUTH_JWT_SECRET,
      nextAuthUrl: process.env.NEXTAUTH_URL,
    };

    // Test database connection
    let dbStatus = 'unknown';
    let dbError = null;
    
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_URL,
          },
        },
      });
      
      await prisma.$connect();
      const userCount = await prisma.user.count();
      dbStatus = `connected (${userCount} users)`;
      await prisma.$disconnect();    } catch (error: any) {
      dbStatus = 'failed';
      dbError = {
        code: error.code,
        message: error.message,
      };
    }

    return NextResponse.json({
      ...envCheck,
      databaseStatus: dbStatus,
      databaseError: dbError,
    });  } catch (error: any) {
    return NextResponse.json({
      error: 'Failed to check environment',
      details: error.message,
    }, { status: 500 });
  }
}
