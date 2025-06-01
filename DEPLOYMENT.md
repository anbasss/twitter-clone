# Deployment Guide

## Vercel Deployment

### Step 1: Prepare Environment Variables

In your Vercel dashboard, set the following environment variables:

#### Required Variables:
- `DATABASE_URL` - Your PostgreSQL database connection string
- `NEXTAUTH_SECRET` - A secure random string (use: `openssl rand -base64 32`)
- `NEXTAUTH_JWT_SECRET` - Another secure random string

#### Optional Variables:
- `NEXTAUTH_URL` - Vercel will auto-detect this, but you can set it manually if needed
- `NEXT_PUBLIC_SUPABASE_URL` - If using Supabase for file uploads
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

### Step 2: Database Setup

1. Create a PostgreSQL database (recommended: Railway, Supabase, or PlanetScale)
2. Copy your database URL to the `DATABASE_URL` environment variable
3. The deployment will automatically run `npx prisma generate` during build

### Step 3: Deploy

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect Next.js and use the correct build settings
3. The `vercel.json` configuration will handle the build process

### Common Issues:

#### 1. "NEXTAUTH_URL references Secret vercel-url which does not exist"
This has been fixed by removing the hardcoded reference in vercel.json. Vercel will automatically set the correct URL.

#### 2. Prisma Client Generation
The `vercel-build` script ensures Prisma client is generated before building:
```bash
npx prisma generate && next build
```

#### 3. Build Timeouts
Function timeout has been set to 30 seconds in vercel.json for API routes.

### Testing Deployment

Before deploying, test locally:
```bash
npm run build
npm start
```

If the build succeeds locally, it should work on Vercel.
