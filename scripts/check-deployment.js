#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking deployment readiness...\n');

const checks = [
  {
    name: 'Prisma Schema',
    check: () => fs.existsSync(path.join(process.cwd(), 'prisma', 'schema.prisma')),
    message: 'Prisma schema file exists'
  },
  {
    name: 'Package.json',
    check: () => {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return pkg.dependencies['@prisma/client'] && pkg.devDependencies['prisma'];
    },
    message: 'Prisma packages are properly configured'
  },
  {
    name: 'NextAuth Config',
    check: () => fs.existsSync(path.join(process.cwd(), 'src', 'libs', 'auth.ts')),
    message: 'NextAuth configuration exists'
  },
  {
    name: 'API Routes',
    check: () => fs.existsSync(path.join(process.cwd(), 'src', 'app', 'api', 'auth', '[...nextauth]', 'route.ts')),
    message: 'NextAuth API route exists'
  },
  {
    name: 'Build Scripts',
    check: () => {
      const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      return pkg.scripts.build && pkg.scripts['vercel-build'] && pkg.scripts.postinstall;
    },
    message: 'Build scripts are configured'
  },
  {
    name: 'Vercel Config',
    check: () => fs.existsSync('vercel.json'),
    message: 'Vercel configuration exists'
  },
  {
    name: 'Environment Template',
    check: () => fs.existsSync('.env.example'),
    message: 'Environment template exists'
  }
];

let allPassed = true;

checks.forEach(({ name, check, message }) => {
  const passed = check();
  const status = passed ? '✅' : '❌';
  console.log(`${status} ${name}: ${message}`);
  if (!passed) allPassed = false;
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('🎉 All checks passed! Your app is ready for deployment.');
  console.log('\nDeployment checklist:');
  console.log('1. Set up your PostgreSQL database (Supabase, Railway, etc.)');
  console.log('2. Set environment variables in your deployment platform');
  console.log('3. Deploy to Vercel, Netlify, or your preferred platform');
} else {
  console.log('⚠️  Some checks failed. Please fix the issues above before deploying.');
  process.exit(1);
}
