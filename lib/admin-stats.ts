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

export type TableStats = { table: string; total: number; last7Days: number; last30Days: number }

export async function getTechnicalStats(): Promise<TableStats[]> {
  const now = new Date()
  const sevenDaysAgo = new Date(now)
  sevenDaysAgo.setDate(now.getDate() - 7)
  const thirtyDaysAgo = new Date(now)
  thirtyDaysAgo.setDate(now.getDate() - 30)

  const [users, listings, reports, ratings] = await Promise.all([
    Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    ]),
    Promise.all([
      prisma.listing.count(),
      prisma.listing.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.listing.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    ]),
    Promise.all([
      prisma.report.count(),
      prisma.report.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.report.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    ]),
    Promise.all([
      prisma.rating.count(),
      prisma.rating.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.rating.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    ]),
  ])

  return [
    { table: "משתמשים", total: users[0], last7Days: users[1], last30Days: users[2] },
    { table: "מודעות", total: listings[0], last7Days: listings[1], last30Days: listings[2] },
    { table: "דיווחים", total: reports[0], last7Days: reports[1], last30Days: reports[2] },
    { table: "דירוגים", total: ratings[0], last7Days: ratings[1], last30Days: ratings[2] },
  ]
}

export async function getDbHealth(): Promise<{ ok: boolean; latencyMs: number }> {
  const start = Date.now()
  try {
    await prisma.$queryRaw`SELECT 1`
    return { ok: true, latencyMs: Date.now() - start }
  } catch {
    return { ok: false, latencyMs: Date.now() - start }
  }
}
