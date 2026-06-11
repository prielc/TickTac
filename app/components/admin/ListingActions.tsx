"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ListingActions({ id, isAvailable }: { id: string; isAvailable: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function toggleAvailable() {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !isAvailable }),
      })
      if (res.ok) router.refresh()
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm("למחוק את המודעה לצמיתות? הפעולה אינה הפיכה.")) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/listings/${id}`, { method: "DELETE" })
      if (res.ok) router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={toggleAvailable}
        disabled={loading}
        className="px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 text-zinc-700 disabled:opacity-50 whitespace-nowrap"
      >
        {isAvailable ? "הסתר" : "הצג"}
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="px-3 py-1.5 rounded-full text-xs font-bold bg-red-50 text-red-600 disabled:opacity-50 whitespace-nowrap"
      >
        מחק
      </button>
    </div>
  )
}
