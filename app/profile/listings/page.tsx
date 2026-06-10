import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"
import { games } from "@/lib/mock-data"
import NavBar from "@/app/components/NavBar"
import MyListingItem from "@/app/components/MyListingItem"

export default async function MyListingsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user) {
    redirect("/login")
  }

  const listings = await prisma.listing.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-4 sticky top-0 bg-white/90 backdrop-blur-sm z-10 border-b border-gray-200">
        <Link href="/profile" className="p-1" aria-label="חזור">
          <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-black tracking-tight text-zinc-900">המודעות שלי</h1>
        <div className="w-8" />
      </header>

      <main className="flex-1 px-4 pt-6 pb-28 max-w-2xl mx-auto w-full">
        <div className="space-y-3">
          {listings.length > 0 ? (
            listings.map((listing) => {
              const game = games.find((g) => g.id === listing.gameId)
              const gameName = game ? `${game.homeTeam} נגד ${game.awayTeam}` : "משחק לא ידוע"
              return (
                <MyListingItem
                  key={listing.id}
                  id={listing.id}
                  gameName={gameName}
                  section={listing.section}
                  row={listing.row}
                  seats={listing.seats}
                  price={listing.price}
                  quantity={listing.quantity}
                  isAvailable={listing.isAvailable}
                />
              )
            })
          ) : (
            <p className="text-zinc-400 text-center py-10">עדיין לא פרסמת מודעות</p>
          )}
        </div>
      </main>

      <NavBar />
    </div>
  )
}
