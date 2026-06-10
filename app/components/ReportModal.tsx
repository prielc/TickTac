"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { REPORT_REASONS } from "@/lib/report-reasons"

type Props = {
  isOpen: boolean
  onClose: () => void
  listingId: string
}

export default function ReportModal({ isOpen, onClose, listingId }: Props) {
  const { data: session } = useSession()
  const router = useRouter()
  const [reason, setReason] = useState<string>("")
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleClose = () => {
    setReason("")
    setDescription("")
    setError("")
    setSubmitted(false)
    onClose()
  }

  const handleSubmit = async () => {
    if (!reason) {
      setError("יש לבחור סיבה לדיווח")
      return
    }

    setSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, reason, description }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "אירעה שגיאה, נסו שוב")
        return
      }

      setSubmitted(true)
    } catch {
      setError("אירעה שגיאה, נסו שוב")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={handleClose}>
      <div className="absolute inset-0 bg-black/40" />

      <div
        className="relative w-full max-w-lg bg-white rounded-t-2xl px-5 pt-5 pb-10 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

        {!session ? (
          <>
            <h2 className="text-xl font-black text-zinc-900 mb-2">יש להתחבר כדי לדווח</h2>
            <p className="text-sm text-zinc-500 mb-5">כדי לדווח על מודעה חשודה יש להתחבר תחילה לחשבון שלך.</p>
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-primary text-black font-bold py-3.5 rounded-xl text-base mb-2"
            >
              התחברות
            </button>
            <button onClick={handleClose} className="w-full text-zinc-400 text-sm py-2">
              ביטול
            </button>
          </>
        ) : submitted ? (
          <>
            <h2 className="text-xl font-black text-zinc-900 mb-2">הדיווח נשלח</h2>
            <p className="text-sm text-zinc-500 mb-5">תודה, נבדוק את הדיווח בהקדם.</p>
            <button
              onClick={handleClose}
              className="w-full bg-primary text-black font-bold py-3.5 rounded-xl text-base"
            >
              סגירה
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-black text-zinc-900 mb-1">דיווח על מודעה</h2>
            <p className="text-sm text-zinc-500 mb-5">בחרו את הסיבה לדיווח, הפרטים יישלחו לבדיקה ידנית.</p>

            <div className="space-y-2 mb-4">
              {REPORT_REASONS.map((option) => (
                <label
                  key={option}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer ${
                    reason === option ? "border-primary bg-primary/10" : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={option}
                    checked={reason === option}
                    onChange={(e) => setReason(e.target.value)}
                    className="accent-primary"
                  />
                  <span className="text-sm text-zinc-900">{option}</span>
                </label>
              ))}
            </div>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="פרטים נוספים (לא חובה)"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
            />

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-primary text-black font-bold py-3.5 rounded-xl text-base disabled:opacity-50 mb-2"
            >
              {submitting ? "שולח..." : "שליחת דיווח"}
            </button>
            <button onClick={handleClose} className="w-full text-zinc-400 text-sm py-2">
              ביטול
            </button>
          </>
        )}
      </div>
    </div>
  )
}
