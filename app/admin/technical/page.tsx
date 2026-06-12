import { getTechnicalStats, getDbHealth } from "@/lib/admin-stats"

export default async function AdminTechnicalPage() {
  const [stats, dbHealth] = await Promise.all([getTechnicalStats(), getDbHealth()])

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-zinc-900 mb-2">דשבורד טכני</h2>

      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
        <span className="text-sm font-bold text-zinc-900">חיבור למסד הנתונים</span>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            dbHealth.ok ? "bg-green-100 text-green-700" : "bg-red-50 text-red-600"
          }`}
        >
          {dbHealth.ok ? `תקין (${dbHealth.latencyMs}ms)` : "שגיאה"}
        </span>
      </div>

      <div className="space-y-3">
        {stats.map((s) => (
          <div key={s.table} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="font-bold text-zinc-900 text-sm mb-2">{s.table}</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xl font-black text-zinc-900">{s.total}</p>
                <p className="text-xs text-zinc-500">סה&quot;כ</p>
              </div>
              <div>
                <p className="text-xl font-black text-zinc-900">{s.last7Days}</p>
                <p className="text-xs text-zinc-500">7 ימים</p>
              </div>
              <div>
                <p className="text-xl font-black text-zinc-900">{s.last30Days}</p>
                <p className="text-xs text-zinc-500">30 ימים</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
