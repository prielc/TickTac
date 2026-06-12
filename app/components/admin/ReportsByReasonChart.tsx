"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import type { ReasonCount } from "@/lib/admin-stats"

export default function ReportsByReasonChart({ data }: { data: ReasonCount[] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <h3 className="text-sm font-bold text-zinc-900 mb-3">דיווחים לפי סיבה</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical" margin={{ left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10 }} />
          <YAxis type="category" dataKey="reason" tick={{ fontSize: 9 }} width={130} />
          <Tooltip />
          <Bar dataKey="count" fill="#F5C100" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
