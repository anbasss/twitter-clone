#!/usr/bin/env node

// Load environment variables
require('dotenv').config();

const fs = require('fs');
const path = require('path');

console.log('🚀 Twitter Clone - Deployment Readiness Checker');
console.log('='.repeat(50));

// Check 1: Environment variables
console.log('\n1. 📋 Checking Environment Variables...');
const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_JWT_SECRET',
  'NEXTAUTH_URL'
];

let envComplete = true;
requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`   ✅ ${envVar}: Present`);
  } else {
    console.log(`   ❌ ${envVar}: Missing`);
    envComplete = false;
  }
});

// Check 2: Critical files
console.log('\n2. 📁 Checking Critical Files...');
const criticalFiles = [
  'package.json',
  'vercel.json', 
  'src/libs/prismadb.ts',
  'src/app/api/posts/route.ts',
  'src/app/api/debug/route.ts',
  'prisma/schema.prisma'
];

let filesComplete = true;
criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}: Exists`);
  } else {
    console.log(`   ❌ ${file}: Missing`);
    filesComplete = false;
  }
});

// Check 3: Package.json scripts
console.log('\n3. 📦 Checking Package Scripts...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = ['build', 'postinstall'];

let scriptsComplete = true;
requiredScripts.forEach(script => {
  if (packageJson.scripts && packageJson.scripts[script]) {
    console.log(`   ✅ ${script}: Present`);
  } else {
    console.log(`   ❌ ${script}: Missing`);
    scriptsComplete = false;
  }
});

// Check 4: Database URL format
console.log('\n4. 🗄️ Checking Database URL Format...');
if (process.env.DATABASE_URL) {
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl.startsWith('postgresql://') && dbUrl.includes('supabase.com')) {
    console.log('   ✅ Database URL format looks correct');
  } else {
    console.log('   ⚠️ Database URL format may be incorrect');
  }
} else {
  console.log('   ❌ DATABASE_URL not found');
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 DEPLOYMENT READINESS SUMMARY');
console.log('='.repeat(50));

if (envComplete && filesComplete && scriptsComplete) {
  console.log('🎉 ✅ READY FOR DEPLOYMENT!');
  console.log('\nNext steps:');
  console.log('1. Set environment variables in Vercel dashboard');
  console.log('2. Update NEXTAUTH_URL to your Vercel domain');
  console.log('3. Deploy: npx vercel --prod');
  console.log('4. Test: https://your-domain.vercel.app/api/debug');
} else {
  console.log('❌ NOT READY - Please fix the issues above');
  
  if (!envComplete) {
    console.log('\n🔧 To fix environment variables:');
    console.log('   - Copy .env.example to .env');
    console.log('   - Add your database credentials');
  }
  
  if (!filesComplete) {
    console.log('\n🔧 To fix missing files:');
    console.log('   - Ensure all required files exist');
    console.log('   - Check for typos in file paths');
  }
}

console.log('\n📖 For detailed instructions, see DEPLOYMENT_UPDATED.md');
