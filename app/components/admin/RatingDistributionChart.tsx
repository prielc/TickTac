"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { ScoreCount } from "@/lib/admin-stats"

export default function RatingDistributionChart({ data }: { data: ScoreCount[] }) {
  const chartData = data.map((d) => ({ ...d, label: `${d.score} ★` }))

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h3 className="text-sm font-bold text-zinc-900 mb-3">התפלגות דירוגים</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 10 }} width={24} />
          <Tooltip />
          <Bar dataKey="count" fill="#F5C100" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
