import { prisma } from "@/lib/prisma"

export const MIN_RATING_SCORE = 1
export const MAX_RATING_SCORE = 5

export function isValidRatingScore(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= MIN_RATING_SCORE &&
    value <= MAX_RATING_SCORE
  )
}

export type SellerRating = {
  average: number
  count: number
}

export async function getSellerRatings(userIds: string[]): Promise<Map<string, SellerRating>> {
  const result = new Map<string, SellerRating>()
  if (userIds.length === 0) return result

  const grouped = await prisma.rating.groupBy({
    by: ["ratedUserId"],
    where: { ratedUserId: { in: userIds } },
    _avg: { score: true },
    _count: { score: true },
  })

  for (const row of grouped) {
    result.set(row.ratedUserId, {
      average: row._avg.score ?? 0,
      count: row._count.score,
    })
  }

  return result
}
