import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      role: string
      phone: string | null
    } & DefaultSession["user"]
  }

  interface User {
    role: string
    phone: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    phone: string | null
  }
}
