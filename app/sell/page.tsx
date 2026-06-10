"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { games } from "@/lib/mock-data"

const SECTIONS = ["יציע מזרחי", "יציע מערבי", "יציע צפוני", "יציע דרומי", "יציע מערבי VIP", "יציע מזרחי VIP"]

export default function SellPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [gameId, setGameId] = useState("")
  const [section, setSection] = useState("")
  const [row, setRow] = useState("")
  const [seats, setSeats] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("1")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  if (status === "loading") return null

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
          <button onClick={() => router.back()} className="p-1">
            <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-black tracking-tight text-zinc-900">פרסום כרטיס</h1>
          <div className="w-8" />
        </header>
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <p className="text-zinc-600 mb-4">יש להתחבר כדי לפרסם כרטיס</p>
          <Link href="/login" className="bg-primary text-black font-bold px-6 py-3 rounded-xl">
            כניסה
          </Link>
        </div>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId, section, row, seats, price, quantity }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error)
      return
    }

    router.push(`/games/${gameId}`)
  }

  const selectedGame = games.find((g) => g.id === gameId)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-4 sticky top-0 bg-white/90 backdrop-blur-sm z-10 border-b border-gray-200">
        <Link href="/" className="p-1">
          <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-black tracking-tight text-zinc-900">פרסום כרטיס</h1>
        <div className="w-8" />
      </header>

      <main className="flex-1 px-4 pt-6 pb-28 max-w-lg mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Game selection */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">בחירת משחק</label>
            <div className="space-y-2">
              {games.map((game) => (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => setGameId(game.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border text-right transition-colors ${
                    gameId === game.id
                      ? "border-primary bg-yellow-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                    <Image src={game.homeLogo} alt={game.homeTeam} width={28} height={28} className="object-contain" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-zinc-900">
                      {game.homeTeam} נגד {game.awayTeam}
                    </p>
                    <p className="text-xs text-zinc-500">{game.date} | {game.time}</p>
                  </div>
                  {gameId === game.id && (
                    <svg className="w-5 h-5 text-primary shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Section */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-2">יציע</label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">בחר יציע</option>
              {SECTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Row + Seats */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2">שורה <span className="text-zinc-400 font-normal">(לא חובה)</span></label>
              <input
                type="text"
                value={row}
                onChange={(e) => setRow(e.target.value)}
                placeholder="למשל: 12"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2">כיסאות <span className="text-zinc-400 font-normal">(לא חובה)</span></label>
              <input
                type="text"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                placeholder="למשל: 44-45"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Price + Quantity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2">מחיר לכרטיס (₪)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="150"
                min="1"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-2">כמות כרטיסים</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading || !gameId}
            className="w-full bg-primary text-black font-bold py-3 rounded-xl text-base disabled:opacity-50"
          >
            {loading ? "מפרסם..." : "פרסם כרטיס למכירה"}
          </button>
        </form>
      </main>
    </div>
  )
}
