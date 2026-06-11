"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function DeleteRatingButton({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm("למחוק את הדירוג? הפעולה אינה הפיכה.")) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/ratings/${id}`, { method: "DELETE" })
      if (res.ok) router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-3 py-1.5 rounded-full text-xs font-bold bg-red-50 text-red-600 disabled:opacity-50 whitespace-nowrap"
    >
      מחק
    </button>
  )
}
