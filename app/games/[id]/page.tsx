import Link from "next/link"
import { notFound } from "next/navigation"
import { games, listings } from "@/lib/mock-data"
import ListingCard from "@/app/components/ListingCard"

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const game = games.find((g) => g.id === id)

  if (!game) notFound()

  const gameListings = listings.filter((l) => l.gameId === id)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 sticky top-0 bg-white/90 backdrop-blur-sm z-10 border-b border-gray-200">
        <Link href="/" className="p-1" aria-label="חזור">
          <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-black tracking-tight text-zinc-900">TickTac</h1>
        <button className="p-1" aria-label="התראות">
          <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
      </header>

      <main className="flex-1 pb-28">
        {/* Game hero */}
        <div className="bg-white border-b border-gray-200 px-4 py-5">
          <p className="text-center text-xs text-zinc-400 mb-4">{game.competition}</p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col items-center gap-2 flex-1">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-base text-black"
                style={{ backgroundColor: game.homeColor }}
              >
                {game.homeInitials}
              </div>
              <span className="text-zinc-900 text-sm font-semibold text-center">{game.homeTeam}</span>
            </div>
            <span className="text-zinc-400 text-2xl font-black">VS</span>
            <div className="flex flex-col items-center gap-2 flex-1">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-base text-white"
                style={{ backgroundColor: game.awayColor }}
              >
                {game.awayInitials}
              </div>
              <span className="text-zinc-900 text-sm font-semibold text-center">{game.awayTeam}</span>
            </div>
          </div>

          <div className="text-center space-y-1">
            <p className="text-zinc-600 text-sm">{game.date} | {game.time}</p>
            <p className="text-zinc-400 text-xs">{game.stadium}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 py-3 flex gap-2 overflow-x-auto border-b border-gray-100">
          {["מחיר", "יציע", "כמות"].map((filter) => (
            <button
              key={filter}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-300 text-sm text-zinc-600 whitespace-nowrap bg-white"
            >
              {filter}
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          ))}
        </div>

        {/* Listings */}
        <div className="px-4 pt-4">
          <h2 className="text-lg font-bold text-zinc-900 mb-3">
            כרטיסים זמינים ({gameListings.length})
          </h2>
          <div className="space-y-3">
            {gameListings.length > 0 ? (
              gameListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))
            ) : (
              <p className="text-zinc-400 text-center py-10">אין כרטיסים זמינים כרגע</p>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 right-0 left-0 z-20">
        <div className="bg-white border-t border-gray-200">
          <div className="flex items-center justify-around px-2 py-2">
            <Link href="/" className="flex flex-col items-center gap-1 px-3 py-1" aria-label="בית">
              <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs text-zinc-500">בית</span>
            </Link>
            <button className="flex flex-col items-center gap-1 px-3 py-1" aria-label="חיפוש">
              <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-xs text-zinc-500">חיפוש</span>
            </button>
            <button className="flex flex-col items-center -mt-5" aria-label="מכירה">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-xs text-zinc-500 mt-1">מכירה</span>
            </button>
            <button className="flex flex-col items-center gap-1 px-3 py-1" aria-label="כרטיסים">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <span className="text-xs text-primary font-medium">כרטיסים</span>
            </button>
            <button className="flex flex-col items-center gap-1 px-3 py-1" aria-label="פרופיל">
              <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs text-zinc-500">פרופיל</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}
