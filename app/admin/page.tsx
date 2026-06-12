import { getOverviewStats, getSignupsByDay, getListingsStatusCounts } from "@/lib/admin-stats"
import SignupsChart from "@/app/components/admin/SignupsChart"
import ListingsStatusChart from "@/app/components/admin/ListingsStatusChart"

export default async function AdminDashboardPage() {
  const [overview, signups, listingsStatus] = await Promise.all([
    getOverviewStats(),
    getSignupsByDay(),
    getListingsStatusCounts(),
  ])

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-zinc-900 mb-2">דשבורד ניהול</h2>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="משתמשים" value={overview.totalUsers} />
        <StatCard label="מודעות פעילות" value={overview.activeListings} />
        <StatCard label="דיווחים פתוחים" value={overview.openReports} />
        <StatCard label="דירוגים" value={overview.totalRatings} />
      </div>

      <SignupsChart data={signups} />
      <ListingsStatusChart counts={listingsStatus} />
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
      <p className="text-2xl font-black text-zinc-900">{value}</p>
      <p className="text-xs text-zinc-500 mt-1">{label}</p>
    </div>
  )
}
