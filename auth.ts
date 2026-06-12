import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.email) return false

      let dbUser = await prisma.user.findUnique({ where: { email: user.email } })

      if (!dbUser) {
        dbUser = await prisma.user.create({
          data: {
            email: user.email,
            name: user.name,
            image: user.image,
            emailVerified: new Date(),
          },
        })
      }

      if (dbUser.isBanned) return false

      user.id = dbUser.id
      user.role = dbUser.role
      user.phone = dbUser.phone

      return true
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role
        token.phone = user.phone
      }
      if (trigger === "update" && session?.name) {
        token.name = session.name
      }
      if (trigger === "update" && session?.phone) {
        token.phone = session.phone
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name
        session.user.role = token.role
        session.user.phone = token.phone
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}
