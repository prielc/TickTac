"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ReportStatusButton({ reportId, status }: { reportId: string; status: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const isOpen = status === "open"
  const nextStatus = isOpen ? "resolved" : "open"

  async function handleClick() {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      })
      if (res.ok) {
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap disabled:opacity-50 ${
        isOpen ? "bg-primary text-black" : "bg-gray-100 text-zinc-700"
      }`}
    >
      {isOpen ? "סמן כטופל" : "פתח מחדש"}
    </button>
  )
}
