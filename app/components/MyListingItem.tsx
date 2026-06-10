"use client"

import { useState } from "react"
import { formatSeatInfo } from "@/lib/format"

type Props = {
  id: string
  gameName: string
  section: string
  row: string
  seats: string
  price: number
  quantity: number
  isAvailable: boolean
}

export default function MyListingItem({ id, gameName, section, row, seats, price, quantity, isAvailable: initialAvailable }: Props) {
  const [isAvailable, setIsAvailable] = useState(initialAvailable)
  const [loading, setLoading] = useState(false)
  const seatInfo = formatSeatInfo(row, seats)

  async function toggleAvailable() {
    setLoading(true)
    const res = await fetch(`/api/listings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAvailable: !isAvailable }),
    })
    setLoading(false)

    if (res.ok) {
      setIsAvailable(!isAvailable)
    }
  }

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {isAvailable ? (
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">זמין</span>
            ) : (
              <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-2 py-0.5 rounded-full">נמכר</span>
            )}
          </div>
          <p className="text-zinc-900 font-bold text-base">{gameName}</p>
          <p className="text-zinc-500 text-sm">{section}</p>
          {seatInfo && <p className="text-zinc-400 text-xs">{seatInfo}</p>}
          <p className="text-zinc-400 text-xs mt-1">{quantity} כרטיסים</p>
        </div>

        <div className="flex flex-col items-end gap-3 shrink-0">
          <p className="text-zinc-900 font-black text-2xl">₪{price}</p>
          <button
            onClick={toggleAvailable}
            disabled={loading}
            className="border-2 border-gray-200 text-zinc-900 font-bold px-4 py-2 rounded-xl text-sm disabled:opacity-60"
          >
            {loading ? "מעדכן..." : isAvailable ? "סמן כנמכר" : "סמן כזמין"}
          </button>
        </div>
      </div>
    </div>
  )
}
