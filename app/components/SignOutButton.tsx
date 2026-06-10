"use client"

import { signOut } from "next-auth/react"

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="w-full border-2 border-gray-200 text-zinc-900 font-bold py-3.5 rounded-xl text-base"
    >
      התנתק
    </button>
  )
}
