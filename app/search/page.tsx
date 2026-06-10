"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import GameCard from "@/app/components/GameCard"
import NavBar from "@/app/components/NavBar"
import { games } from "@/lib/mock-data"

export default function SearchPage() {
  const [query, setQuery] = useState("")

  const results = useMemo(() => {
    const q = query.trim()
    if (!q) return games

    return games.filter((game) =>
      [game.homeTeam, game.awayTeam, game.stadium, game.competition].some((field) =>
        field.includes(q)
      )
    )
  }, [query])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-4 sticky top-0 bg-white/90 backdrop-blur-sm z-10 border-b border-gray-200">
        <Link href="/" className="p-1" aria-label="חזור">
          <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-black tracking-tight text-zinc-900">חיפוש</h1>
        <div className="w-8" />
      </header>

      <main className="flex-1 px-4 pt-5 pb-28 max-w-2xl mx-auto w-full">
        <div className="relative mb-5">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="חיפוש לפי קבוצה, אצטדיון או תחרות"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            autoFocus
          />
        </div>

        {results.length > 0 ? (
          <div className="space-y-4">
            {results.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-zinc-400 mb-4">לא נמצאו משחקים תואמים</p>
            <Link href="/" className="text-primary font-bold">
              חזרה לדף הבית
            </Link>
          </div>
        )}
      </main>

      <NavBar />
    </div>
  )
}
