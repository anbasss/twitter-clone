#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🔍 Debugging Vercel Deployment Issues...\n');

// Check environment variables
console.log('Environment Variables Check:');
console.log('================================');

const requiredEnvs = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET', 
  'NEXTAUTH_JWT_SECRET',
  'NEXTAUTH_URL'
];

let hasAllEnvs = true;

requiredEnvs.forEach(env => {
  const value = process.env[env];
  if (value) {
    if (env === 'DATABASE_URL') {
      console.log(`✅ ${env}: ${value.substring(0, 30)}...`);
    } else if (env === 'NEXTAUTH_URL') {
      console.log(`${value.includes('localhost') ? '❌' : '✅'} ${env}: ${value}`);
      if (value.includes('localhost')) {
        console.log('   ⚠️  WARNING: NEXTAUTH_URL should be production URL for Vercel');
        hasAllEnvs = false;
      }
    } else {
      console.log(`✅ ${env}: [SET]`);
    }
  } else {
    console.log(`❌ ${env}: [NOT SET]`);
    hasAllEnvs = false;
  }
});

console.log('\n');

if (!hasAllEnvs) {
  console.log('❌ Missing required environment variables!');
  console.log('\nFor Vercel deployment, set these in Vercel Dashboard:');
  console.log('1. Go to Vercel Dashboard > Project Settings > Environment Variables');
  console.log('2. Add the missing variables for Production environment');
  console.log('3. Redeploy the application');
} else {
  console.log('✅ All environment variables are set!');
}

// Test database connection
if (process.env.DATABASE_URL) {
  console.log('\nDatabase Connection Test:');
  console.log('=========================');
  
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    prisma.$connect()
      .then(() => {
        console.log('✅ Database connection successful');
        return prisma.$disconnect();
      })
      .catch((error) => {
        console.log('❌ Database connection failed:', error.message);
      });
  } catch (error) {
    console.log('❌ Prisma client error:', error.message);
  }
}

console.log('\nFor production deployment issues:');
console.log('- Check Vercel Function Logs in dashboard');
console.log('- Ensure all environment variables are set in Vercel');
console.log('- Verify NEXTAUTH_URL matches your Vercel domain');
