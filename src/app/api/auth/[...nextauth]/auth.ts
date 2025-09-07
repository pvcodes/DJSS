// import CredentialsProvider from "next-auth/providers/credentials";

// import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import db from "@/db";

import type { NextAuthOptions } from "next-auth";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.image = token.picture;
      }
      session.user.isAdmin = token.isAdmin;
      return session;
    },
    async signIn({ user }) {
      try {
        // Check if the user exists in the database
        let existingUser = await db.user.findFirst({
          where: {
            email: user.email!,
          },
        });

        // If the user does not exist, create a new user
        if (!existingUser) {
          existingUser = await db.user.create({
            data: {
              email: user.email!,
              name: user.name!,
              ph_no: "0",
            },
          });
        }

        // Proceed with the sign-in process
        return true;
      } catch (error) {
        console.error("Error during sign-in:", error);
        return false;
      }
    },
    async jwt({ token }) {
      if (token.isAdmin == null && token.email) {
        const user = await db.user.findUnique({
          where: { email: token.email },
          select: { isAdmin: true },
        });
        token.isAdmin = user?.isAdmin;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "secr3t",
  pages: {
    signIn: "/signin",
  },
} satisfies NextAuthOptions;
