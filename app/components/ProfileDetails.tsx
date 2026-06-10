"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { isValidIsraeliPhone } from "@/lib/validation"

type Props = {
  email: string
  initialName: string
  initialPhone: string
}

export default function ProfileDetails({ email, initialName, initialPhone }: Props) {
  const { update } = useSession()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(initialName)
  const [phone, setPhone] = useState(initialPhone)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  function handleCancel() {
    setName(initialName)
    setPhone(initialPhone)
    setError("")
    setEditing(false)
  }

  async function handleSave() {
    setError("")

    if (name.trim().length < 2) {
      setError("שם חייב להכיל לפחות 2 תווים")
      return
    }

    if (!isValidIsraeliPhone(phone)) {
      setError("מספר טלפון לא תקין — למשל: 050-1234567")
      return
    }

    setLoading(true)
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone }),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error)
      return
    }

    setName(data.user.name)
    setPhone(data.user.phone)
    await update({ name: data.user.name })
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-4">
        <div>
          <label className="block text-zinc-400 text-xs mb-1">שם מלא</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-zinc-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <div>
          <p className="text-zinc-400 text-xs mb-1">אימייל</p>
          <p className="text-zinc-900 font-bold">{email}</p>
        </div>
        <div>
          <label className="block text-zinc-400 text-xs mb-1">טלפון</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="050-1234567"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-zinc-900 font-bold focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-2 pt-1">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-primary text-black font-bold py-2.5 rounded-xl text-sm disabled:opacity-60"
          >
            {loading ? "שומר..." : "שמור"}
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 border-2 border-gray-200 text-zinc-900 font-bold py-2.5 rounded-xl text-sm disabled:opacity-60"
          >
            ביטול
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-4">
      <div>
        <p className="text-zinc-400 text-xs mb-1">שם מלא</p>
        <p className="text-zinc-900 font-bold">{name || "—"}</p>
      </div>
      <div>
        <p className="text-zinc-400 text-xs mb-1">אימייל</p>
        <p className="text-zinc-900 font-bold">{email}</p>
      </div>
      <div>
        <p className="text-zinc-400 text-xs mb-1">טלפון</p>
        <p className="text-zinc-900 font-bold">{phone || "—"}</p>
      </div>

      <button
        onClick={() => setEditing(true)}
        className="w-full border-2 border-gray-200 text-zinc-900 font-bold py-2.5 rounded-xl text-sm"
      >
        ערוך
      </button>
    </div>
  )
}
