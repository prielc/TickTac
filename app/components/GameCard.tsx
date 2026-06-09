import Link from "next/link"
import { type Game } from "@/lib/mock-data"

export default function GameCard({ game }: { game: Game }) {
  return (
    <Link href={`/games/${game.id}`} className="block">
      <div className="bg-white rounded-2xl p-4 relative border border-gray-200 shadow-sm active:border-gray-300 transition-colors">
        {game.isSelling && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            נמכר מהר!
          </span>
        )}

        <p className="text-center text-xs text-zinc-400 mb-4">{game.competition}</p>

        <div className="flex items-center justify-between mb-5">
          <div className="flex flex-col items-center gap-2 flex-1">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-sm text-black"
              style={{ backgroundColor: game.homeColor }}
            >
              {game.homeInitials}
            </div>
            <span className="text-zinc-900 text-sm font-semibold text-center leading-tight">{game.homeTeam}</span>
          </div>

          <span className="text-zinc-400 text-xl font-black">VS</span>

          <div className="flex flex-col items-center gap-2 flex-1">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-sm text-white"
              style={{ backgroundColor: game.awayColor }}
            >
              {game.awayInitials}
            </div>
            <span className="text-zinc-900 text-sm font-semibold text-center leading-tight">{game.awayTeam}</span>
          </div>
        </div>

        <div className="text-center space-y-1 mb-4">
          <p className="text-zinc-600 text-sm">{game.date} | {game.time}</p>
          <p className="text-zinc-400 text-xs">{game.stadium}</p>
        </div>

        <div className="flex items-center justify-center mb-4">
          <span className="text-green-500 text-sm font-semibold">{game.availableTickets} כרטיסים זמינים</span>
        </div>

        <button className="w-full bg-primary text-black font-bold py-3 rounded-xl text-base">
          קנה כרטיסים
        </button>
      </div>
    </Link>
  )
}
