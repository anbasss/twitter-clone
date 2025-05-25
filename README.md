# Twitter Clone

A Twitter clone built with Next.js, Prisma, and NextAuth.

## Features

- User authentication (login/register)
- User profiles with following functionality
- Tweet posting and viewing
- Comments on tweets
- Likes on tweets
- Notifications
- Responsive UI with sidebar and follow bar

## Technologies

- Next.js 15
- Prisma
- NextAuth
- TypeScript
- Tailwind CSS
- SWR for data fetching
- Zustand for state management
- React Hot Toast for notifications

## Getting Started

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Setup environment variables
   Create a `.env.local` file with the following:
   ```
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-nextauth-secret-key"
   NEXTAUTH_JWT_SECRET="your-jwt-secret-key"  
   NEXTAUTH_URL="http://localhost:3000"
   ```
4. Push the Prisma schema to the database
   ```bash
   npx prisma db push
   ```
5. Start the development server
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
