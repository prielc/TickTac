import { prisma } from "@/lib/prisma"
import { games } from "@/lib/mock-data"
import DeleteRatingButton from "@/app/components/admin/DeleteRatingButton"

export default async function AdminRatingsPage() {
  const ratings = await prisma.rating.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      rater: { select: { name: true, email: true } },
      ratedUser: { select: { name: true, email: true } },
      listing: { select: { gameId: true, section: true } },
    },
  })

  return (
    <div>
      <h2 className="text-2xl font-bold text-zinc-900 mb-4">דירוגים ({ratings.length})</h2>

      {ratings.length === 0 ? (
        <p className="text-zinc-500 text-sm">אין דירוגים</p>
      ) : (
        <div className="space-y-3">
          {ratings.map((rating) => {
            const game = games.find((g) => g.id === rating.listing.gameId)

            return (
              <div key={rating.id} className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-zinc-900 text-sm">{"★".repeat(rating.score)}{"☆".repeat(5 - rating.score)}</span>
                  <DeleteRatingButton id={rating.id} />
                </div>

                {rating.comment && <p className="text-zinc-600 text-sm">{rating.comment}</p>}

                <div className="text-xs text-zinc-500 space-y-1 pt-2 border-t border-gray-100">
                  <p>
                    {rating.rater.name ?? "—"} ({rating.rater.email}) דירג את {rating.ratedUser.name ?? "—"} (
                    {rating.ratedUser.email})
                  </p>
                  <p>
                    מודעה: {game ? `${game.homeTeam} נגד ${game.awayTeam}` : `משחק ${rating.listing.gameId}`} —{" "}
                    {rating.listing.section}
                  </p>
                  <p>{rating.createdAt.toLocaleString("he-IL")}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
