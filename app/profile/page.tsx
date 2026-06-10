import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"
import NavBar from "@/app/components/NavBar"
import SignOutButton from "@/app/components/SignOutButton"
import ProfileDetails from "@/app/components/ProfileDetails"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { name: true, email: true, phone: true },
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-4 sticky top-0 bg-white/90 backdrop-blur-sm z-10 border-b border-gray-200">
        <Link href="/" className="p-1" aria-label="חזור">
          <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-black tracking-tight text-zinc-900">פרופיל</h1>
        <div className="w-8" />
      </header>

      <main className="flex-1 px-4 pt-6 pb-28 max-w-lg mx-auto w-full">
        <ProfileDetails email={user.email} initialName={user.name ?? ""} initialPhone={user.phone ?? ""} />

        <SignOutButton />
      </main>

      <NavBar />
    </div>
  )
}
