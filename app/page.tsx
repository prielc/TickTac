import GameCard from "./components/GameCard"
import NavBar from "./components/NavBar"
import { games } from "@/lib/mock-data"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 sticky top-0 bg-white/90 backdrop-blur-sm z-10 border-b border-gray-200">
        <button className="p-1" aria-label="תפריט">
          <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-black tracking-tight text-zinc-900">TickTac</h1>
        <button className="p-1" aria-label="התראות">
          <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 pt-5 pb-28 max-w-2xl mx-auto w-full">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-zinc-900">משחקים קרובים</h2>
          <p className="text-zinc-500 text-sm mt-1">ביתר ירושלים</p>
        </div>

        <div className="space-y-4">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </main>

      <NavBar />
    </div>
  )
}
