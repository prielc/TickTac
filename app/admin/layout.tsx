import Link from "next/link"
import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/admin"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin()
  if (!session) redirect("/")

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-4 sticky top-0 bg-white/90 backdrop-blur-sm z-10 border-b border-gray-200">
        <Link href="/" className="p-1" aria-label="חזרה לאתר">
          <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-black tracking-tight text-zinc-900">ניהול</h1>
        <div className="w-8" />
      </header>

      <nav className="flex gap-2 px-4 py-3 overflow-x-auto border-b border-gray-200 bg-white">
        <Link href="/admin" className="px-3 py-1.5 rounded-full text-sm font-medium bg-primary text-black whitespace-nowrap">
          דשבורד
        </Link>
        <Link href="/admin/reports" className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-zinc-700 whitespace-nowrap">
          דיווחים
        </Link>
        <Link href="/admin/listings" className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-zinc-700 whitespace-nowrap">
          מודעות
        </Link>
        <Link href="/admin/users" className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-zinc-700 whitespace-nowrap">
          משתמשים
        </Link>
      </nav>

      <main className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">{children}</main>
    </div>
  )
}
