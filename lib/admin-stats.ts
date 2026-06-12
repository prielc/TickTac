import { prisma } from "@/lib/prisma"

export type DailyCount = { date: string; count: number }

export async function getSignupsByDay(days = 30): Promise<DailyCount[]> {
  const since = new Date()
  since.setDate(since.getDate() - (days - 1))
  since.setHours(0, 0, 0, 0)

  const users = await prisma.user.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true },
  })

  const counts = new Map<string, number>()
  for (let i = 0; i < days; i++) {
    const d = new Date(since)
    d.setDate(d.getDate() + i)
    counts.set(d.toISOString().slice(0, 10), 0)
  }

  for (const user of users) {
    const key = user.createdAt.toISOString().slice(0, 10)
    if (counts.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  return Array.from(counts.entries()).map(([date, count]) => ({ date, count }))
}

export type ListingsStatusCounts = { available: number; unavailable: number }

export async function getListingsStatusCounts(): Promise<ListingsStatusCounts> {
  const [available, unavailable] = await Promise.all([
    prisma.listing.count({ where: { isAvailable: true } }),
    prisma.listing.count({ where: { isAvailable: false } }),
  ])

  return { available, unavailable }
}

export type OverviewStats = {
  totalUsers: number
  activeListings: number
  openReports: number
  totalRatings: number
}

export async function getOverviewStats(): Promise<OverviewStats> {
  const [totalUsers, activeListings, openReports, totalRatings] = await Promise.all([
    prisma.user.count(),
    prisma.listing.count({ where: { isAvailable: true } }),
    prisma.report.count({ where: { status: "open" } }),
    prisma.rating.count(),
  ])

  return { totalUsers, activeListings, openReports, totalRatings }
}
