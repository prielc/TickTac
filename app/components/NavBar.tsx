"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"

export default function NavBar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const isHome = pathname === "/"
  const isTickets = pathname.startsWith("/games")

  return (
    <nav className="fixed bottom-0 right-0 left-0 z-20">
      <div className="bg-white border-t border-gray-200">
        <div className="flex items-center justify-around px-2 py-2">
          <Link href="/" className="flex flex-col items-center gap-1 px-3 py-1" aria-label="בית">
            <svg className={`w-6 h-6 ${isHome ? "text-primary" : "text-zinc-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className={`text-xs ${isHome ? "text-primary font-medium" : "text-zinc-500"}`}>בית</span>
          </Link>

          <button className="flex flex-col items-center gap-1 px-3 py-1" aria-label="חיפוש">
            <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-xs text-zinc-500">חיפוש</span>
          </button>

          <Link href="/sell" className="flex flex-col items-center -mt-5" aria-label="מכירה">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <span className="text-xs text-zinc-500 mt-1">מכירה</span>
          </Link>

          <button className="flex flex-col items-center gap-1 px-3 py-1" aria-label="כרטיסים">
            <svg className={`w-6 h-6 ${isTickets ? "text-primary" : "text-zinc-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <span className={`text-xs ${isTickets ? "text-primary font-medium" : "text-zinc-500"}`}>כרטיסים</span>
          </button>

          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex flex-col items-center gap-1 px-3 py-1"
              aria-label="יציאה"
            >
              <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs text-zinc-500 max-w-[48px] truncate">{session.user?.name ?? "פרופיל"}</span>
            </button>
          ) : (
            <Link href="/login" className="flex flex-col items-center gap-1 px-3 py-1" aria-label="כניסה">
              <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs text-zinc-500">כניסה</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
