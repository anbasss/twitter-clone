# Deployment Guide

## Vercel Deployment

### Step 1: Prepare Environment Variables

**IMPORTANT**: Di Vercel dashboard, Anda WAJIB mengset environment variables berikut:

#### Required Variables:
```
DATABASE_URL=postgresql://postgres.pdcomxzhwrolhxyrkzmd:andisulo2007@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1
NEXTAUTH_SECRET=twitter-clone-secret-key-2025-very-secure-random-string
NEXTAUTH_JWT_SECRET=twitter-clone-jwt-secret-key-2025-very-secure-random-string
NEXTAUTH_URL=https://twitter-anbas-projects.vercel.app
```

### Step 2: Setting Environment Variables di Vercel

1. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project "twitter-anbas-projects"
3. Klik tab "Settings"
4. Klik "Environment Variables" di sidebar kiri
5. Tambahkan satu per satu environment variables di atas:
   - **Name**: `DATABASE_URL`
   - **Value**: `postgresql://postgres.pdcomxzhwrolhxyrkzmd:andisulo2007@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres?pgbouncer=true&connection_limit=1`
   - **Environments**: Production, Preview, Development (centang semua)

6. Ulangi untuk `NEXTAUTH_SECRET`, `NEXTAUTH_JWT_SECRET`, dan `NEXTAUTH_URL`

### Step 3: Redeploy

Setelah environment variables diset:
1. Klik tab "Deployments"
2. Klik titik tiga (...) pada deployment terakhir
3. Klik "Redeploy"

### Troubleshooting Error 500

Jika masih ada error 500:

1. **Periksa Vercel Function Logs**:
   - Klik deployment yang error
   - Klik "View Function Logs"
   - Cari error message detail

2. **Common Issues**:
   - `NEXTAUTH_URL` tidak sesuai dengan domain Vercel
   - `DATABASE_URL` tidak bisa diakses
   - `NEXTAUTH_SECRET` tidak diset

3. **Test Database Connection**:
   Pastikan database Supabase bisa diakses dari Vercel

### Current Error Analysis

Error 500 pada `/api/posts` kemungkinan disebabkan:
1. ❌ `NEXTAUTH_URL` masih `localhost:3000` (harus `https://twitter-anbas-projects.vercel.app`)
2. ❌ Environment variables tidak diset di Vercel dashboard
3. ❌ Database connection timeout atau unauthorized

### Next Steps

1. ✅ Set semua environment variables di Vercel dashboard
2. ✅ Pastikan `NEXTAUTH_URL` = `https://twitter-anbas-projects.vercel.app`
3. ✅ Redeploy aplikasi
4. ✅ Test API endpoints
