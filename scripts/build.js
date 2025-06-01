#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Starting build process...');

try {
  // Check if Prisma schema exists
  const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
  if (!fs.existsSync(schemaPath)) {
    throw new Error('Prisma schema not found at prisma/schema.prisma');
  }

  // Check environment variables for production build
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    console.log('🔍 Checking environment variables...');
    
    const requiredEnvVars = ['NEXTAUTH_SECRET'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.warn('⚠️ Missing environment variables:', missingVars.join(', '));
      console.warn('⚠️ Make sure to set these in your deployment platform');
    }
    
    // DATABASE_URL is checked at runtime, not build time
    if (!process.env.DATABASE_URL) {
      console.warn('⚠️ DATABASE_URL not set - this is expected during build, will be checked at runtime');
    }
  }

  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  console.log('🏗️ Building Next.js application...');
  execSync('next build', { stdio: 'inherit' });

  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
