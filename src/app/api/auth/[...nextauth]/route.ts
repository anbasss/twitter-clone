import NextAuth from "next-auth";
import { authOptions } from "@/libs/auth";

// Create the handler
const handler = NextAuth(authOptions);

// Export the handler for both GET and POST requests
export { handler as GET, handler as POST };

// Add runtime configuration to prevent static optimization issues
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
