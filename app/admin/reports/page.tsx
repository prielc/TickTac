import { prisma } from "@/lib/prisma"
import { games } from "@/lib/mock-data"
import ReportStatusButton from "@/app/components/admin/ReportStatusButton"

export default async function AdminReportsPage() {
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      reporter: { select: { name: true, email: true } },
      listing: { include: { user: { select: { name: true, email: true, phone: true } } } },
    },
  })

  return (
    <div>
      <h2 className="text-2xl font-bold text-zinc-900 mb-4">דיווחים ({reports.length})</h2>

      {reports.length === 0 ? (
        <p className="text-zinc-500 text-sm">אין דיווחים</p>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => {
            const game = games.find((g) => g.id === report.listing.gameId)

            return (
              <div key={report.id} className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-zinc-900 text-sm">{report.reason}</span>
                  <ReportStatusButton reportId={report.id} status={report.status} />
                </div>

                {report.description && <p className="text-zinc-600 text-sm">{report.description}</p>}

                <div className="text-xs text-zinc-500 space-y-1 pt-2 border-t border-gray-100">
                  <p>
                    מודעה: {game ? `${game.homeTeam} נגד ${game.awayTeam}` : `משחק ${report.listing.gameId}`} —{" "}
                    {report.listing.section}, {report.listing.row}, {report.listing.seats} — ₪{report.listing.price}
                  </p>
                  <p>
                    מוכר: {report.listing.user.name ?? "—"} ({report.listing.user.email}
                    {report.listing.user.phone ? `, ${report.listing.user.phone}` : ""})
                  </p>
                  <p>
                    דווח ע"י: {report.reporter.name ?? "—"} ({report.reporter.email})
                  </p>
                  <p>{report.createdAt.toLocaleString("he-IL")}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
