"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function UserActions({ id, role, isBanned }: { id: string; role: string; isBanned: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function patch(body: object) {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (res.ok) router.refresh()
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm("למחוק את המשתמש לצמיתות? כל המודעות, הדיווחים והדירוגים שלו יימחקו גם הם.")) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
      if (res.ok) router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2 flex-wrap justify-end">
      <button
        onClick={() => patch({ isBanned: !isBanned })}
        disabled={loading}
        className="px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 text-zinc-700 disabled:opacity-50 whitespace-nowrap"
      >
        {isBanned ? "בטל חסימה" : "חסום"}
      </button>
      <button
        onClick={() => patch({ role: role === "admin" ? "user" : "admin" })}
        disabled={loading}
        className="px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 text-zinc-700 disabled:opacity-50 whitespace-nowrap"
      >
        {role === "admin" ? "הסר הרשאת אדמין" : "הפוך לאדמין"}
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
