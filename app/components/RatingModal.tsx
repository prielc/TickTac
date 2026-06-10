"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

type Props = {
  isOpen: boolean
  onClose: () => void
  listingId: string
}

export default function RatingModal({ isOpen, onClose, listingId }: Props) {
  const { data: session } = useSession()
  const router = useRouter()
  const [score, setScore] = useState(0)
  const [hoverScore, setHoverScore] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleClose = () => {
    setScore(0)
    setHoverScore(0)
    setComment("")
    setError("")
    setSubmitted(false)
    onClose()
  }

  const handleSubmit = async () => {
    if (score === 0) {
      setError("יש לבחור דירוג בכוכבים")
      return
    }

    setSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, score, comment }),
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
            <h2 className="text-xl font-black text-zinc-900 mb-2">יש להתחבר כדי לדרג</h2>
            <p className="text-sm text-zinc-500 mb-5">כדי לדרג את המוכר יש להתחבר תחילה לחשבון שלך.</p>
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
            <h2 className="text-xl font-black text-zinc-900 mb-2">תודה על הדירוג!</h2>
            <p className="text-sm text-zinc-500 mb-5">הדירוג שלך נשמר ויעזור לקונים אחרים.</p>
            <button
              onClick={handleClose}
              className="w-full bg-primary text-black font-bold py-3.5 rounded-xl text-base"
            >
              סגירה
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-black text-zinc-900 mb-1">דרגו את המוכר</h2>
            <p className="text-sm text-zinc-500 mb-5">איך הייתה החוויה מול המוכר הזה?</p>

            <div className="flex justify-center gap-2 mb-4" dir="ltr">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setScore(value)}
                  onMouseEnter={() => setHoverScore(value)}
                  onMouseLeave={() => setHoverScore(0)}
                  className="text-4xl leading-none"
                  aria-label={`${value} כוכבים`}
                >
                  <span className={(hoverScore || score) >= value ? "text-primary" : "text-gray-200"}>
                    ★
                  </span>
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="הערה (לא חובה)"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-2"
            />

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-primary text-black font-bold py-3.5 rounded-xl text-base disabled:opacity-50 mb-2"
            >
              {submitting ? "שולח..." : "שליחת דירוג"}
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
