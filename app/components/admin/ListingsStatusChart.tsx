"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import type { ListingsStatusCounts } from "@/lib/admin-stats"

export default function ListingsStatusChart({ counts }: { counts: ListingsStatusCounts }) {
  const data = [
    { name: "זמין", value: counts.available },
    { name: "נמכר/מוסתר", value: counts.unavailable },
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h3 className="text-sm font-bold text-zinc-900 mb-3">סטטוס מודעות</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 10 }} width={24} />
          <Tooltip />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            <Cell fill="#22c55e" />
            <Cell fill="#9ca3af" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
