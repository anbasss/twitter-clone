#!/usr/bin/env node

console.log('🔍 Testing Database Connection...\n');

// Load environment variables
require('dotenv').config();

// Check environment variables
console.log('Environment Variables Check:');
console.log('============================');
console.log('NODE_ENV:', process.env.NODE_ENV || 'undefined');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

if (process.env.DATABASE_URL) {
  const url = process.env.DATABASE_URL;
  console.log('DATABASE_URL format:', url.substring(0, 30) + '...');
  
  // Basic URL validation
  if (!url.startsWith('postgresql://')) {
    console.log('❌ DATABASE_URL should start with postgresql://');
  } else {
    console.log('✅ DATABASE_URL format looks correct');
  }
} else {
  console.log('❌ DATABASE_URL is not set!');
  process.exit(1);
}

console.log('\nTesting Prisma Connection:');
console.log('==========================');

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function testConnection() {
  try {
    console.log('Attempting to connect to database...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Successfully connected to database');
    
    // Test a simple query
    console.log('Testing simple query...');
    const userCount = await prisma.user.count();
    console.log(`✅ Found ${userCount} users in database`);
    
    // Test posts query
    console.log('Testing posts query...');
    const postCount = await prisma.post.count();
    console.log(`✅ Found ${postCount} posts in database`);
    
    console.log('\n🎉 All database tests passed!');
    
  } catch (error) {
    console.error('❌ Database test failed:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    if (error.code === 'P1001') {
      console.error('\n💡 This looks like a connection timeout issue.');
      console.error('   - Check if your database is running');
      console.error('   - Verify your DATABASE_URL is correct');
      console.error('   - Check if your network allows connections to the database');
    }
    
    if (error.code === 'P1000') {
      console.error('\n💡 Authentication failed.');
      console.error('   - Check your database username and password');
      console.error('   - Verify the DATABASE_URL credentials');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
