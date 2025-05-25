import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string | null;
    profileImage?: string | null;
    hasNotification?: boolean | null;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username?: string | null;
      hasNotification?: boolean | null;
      // profileImage removed from session - will be fetched via useCurrentUser
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username?: string | null;
    hasNotification?: boolean | null;
    // profileImage removed from JWT to prevent token size issues
  }
}
