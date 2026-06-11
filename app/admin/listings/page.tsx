import { prisma } from "@/lib/prisma"
import { games } from "@/lib/mock-data"
import { formatSeatInfo } from "@/lib/format"
import ListingActions from "@/app/components/admin/ListingActions"

export default async function AdminListingsPage() {
  const listings = await prisma.listing.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true, phone: true } } },
  })

  return (
    <div>
      <h2 className="text-2xl font-bold text-zinc-900 mb-4">מודעות ({listings.length})</h2>

      {listings.length === 0 ? (
        <p className="text-zinc-500 text-sm">אין מודעות</p>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => {
            const game = games.find((g) => g.id === listing.gameId)
            const seatInfo = formatSeatInfo(listing.row, listing.seats)

            return (
              <div key={listing.id} className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      listing.isAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {listing.isAvailable ? "זמין" : "מוסתר/נמכר"}
                  </span>
                  <ListingActions id={listing.id} isAvailable={listing.isAvailable} />
                </div>

                <p className="text-zinc-900 font-bold text-sm">
                  {game ? `${game.homeTeam} נגד ${game.awayTeam}` : `משחק ${listing.gameId}`}
                </p>
                <p className="text-zinc-600 text-sm">
                  {listing.section}
                  {seatInfo ? `, ${seatInfo}` : ""} — ₪{listing.price} × {listing.quantity}
                </p>

                <div className="text-xs text-zinc-500 space-y-1 pt-2 border-t border-gray-100">
                  <p>
                    מוכר: {listing.user.name ?? "—"} ({listing.user.email}
                    {listing.user.phone ? `, ${listing.user.phone}` : ""})
                  </p>
                  <p>{listing.createdAt.toLocaleString("he-IL")}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
