import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { games } from "@/lib/mock-data"
import { prisma } from "@/lib/prisma"
import GameListings from "@/app/components/GameListings"
import NavBar from "@/app/components/NavBar"

export default async function GamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const game = games.find((g) => g.id === id)

  if (!game) notFound()

  const gameListings = await prisma.listing.findMany({
    where: { gameId: id, isAvailable: true },
    orderBy: { createdAt: "desc" },
  })

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

      <main className="flex-1 pb-28 max-w-2xl mx-auto w-full">
        {/* Game hero */}
        <div className="bg-white border-b border-gray-200 px-4 py-5">
          <p className="text-center text-xs text-zinc-400 mb-4">{game.competition}</p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-16 h-16 rounded-full bg-white border border-gray-100 flex items-center justify-center overflow-hidden shadow-sm">
                <Image src={game.homeLogo} alt={game.homeTeam} width={56} height={56} className="object-contain" />
              </div>
              <span className="text-zinc-900 text-sm font-semibold text-center">{game.homeTeam}</span>
            </div>
            <span className="text-zinc-400 text-2xl font-black">VS</span>
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-16 h-16 rounded-full bg-white border border-gray-100 flex items-center justify-center overflow-hidden shadow-sm">
                <Image src={game.awayLogo} alt={game.awayTeam} width={56} height={56} className="object-contain" />
              </div>
              <span className="text-zinc-900 text-sm font-semibold text-center">{game.awayTeam}</span>
            </div>
          </div>

          <div className="text-center space-y-1">
            <p className="text-zinc-600 text-sm">{game.date} | {game.time}</p>
            <p className="text-zinc-400 text-xs">{game.stadium}</p>
          </div>
        </div>

        <GameListings listings={gameListings} gameName={`${game.homeTeam} נגד ${game.awayTeam}`} />
      </main>

      <NavBar />
    </div>
  )
}
