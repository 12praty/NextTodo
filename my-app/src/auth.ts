import NextAuth from "next-auth";//Imports NextAuth, the main authentication system.
import { PrismaAdapter } from "@auth/prisma-adapter";//Connects NextAuth with your Prisma database.
import Credentials from "next-auth/providers/credentials";//Adds email/password login.
import GitHub from "next-auth/providers/github";//Adds GitHub login.
import argon2 from "argon2";//Used to hash and verify passwords securely.
import { prisma } from "@/lib/prisma";//Imports your Prisma client to communicate with the database.
import { loginSchema } from "@/lib/schemas";//Imports your Zod validation schema to check login data before using it.
import { use } from "react";
import { Session } from "inspector/promises";
import { User } from "lucide-react";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    // Controls how session data is stored/read
    session: { strategy: "jwt" },
    providers: [
        GitHub
     
     Credentials({
            async authorize(Credentials) {
                // 1. Validate with Zod before touching the DB
                const parsed = loginSchema.safeParse(this.credentials);
                if (!parsed.success) return null;
                const { email, password } = parsed.data;
                // 2. Find user
                const user = await prisma.user.findUnique({ where: { email } });
                if (!user || !user.password) return null;// OAuth users have no password
                // 3. Verify password
                const Valid = await argon2.verify(user.password, password);
                if (!Valid) {
                    return null;

                }
                // Return the user object — NextAuth stores it in the JWT
                return { id: user.id, email: user.email, name: user.name };

            },
        }),
    ],
    callbacks: {
        // Add user.id to the JWT token (not there by default)
        async jwt({ token, user }{
            if(user){
    token.id = User.id;
    token.role = user.role;  // Add any custom field
    return token
})
        // Expose token.id on session.user so components can access it
        async Session({ session, token }{
    if(token.id)Session.user.id = token.id as string
return Session;
        })
    }
pages: {
    signIn: "/login",   // Custom sign-in page (optional)
  },
})