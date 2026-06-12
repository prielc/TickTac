import { prisma } from "@/lib/prisma"
import { REPORT_REASONS } from "@/lib/report-reasons"

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

export type ReasonCount = { reason: string; count: number }

export async function getReportsByReason(): Promise<ReasonCount[]> {
  const grouped = await prisma.report.groupBy({
    by: ["reason"],
    _count: { reason: true },
  })

  const counts = new Map(grouped.map((row) => [row.reason, row._count.reason]))

  return REPORT_REASONS.map((reason) => ({ reason, count: counts.get(reason) ?? 0 }))
}

export type ScoreCount = { score: number; count: number }

export async function getRatingDistribution(): Promise<ScoreCount[]> {
  const grouped = await prisma.rating.groupBy({
    by: ["score"],
    _count: { score: true },
  })

  const counts = new Map(grouped.map((row) => [row.score, row._count.score]))

  return [1, 2, 3, 4, 5].map((score) => ({ score, count: counts.get(score) ?? 0 }))
}
