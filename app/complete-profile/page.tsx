"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { isValidIsraeliPhone } from "@/lib/validation"

export default function CompleteProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login")
    }
  }, [status, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!isValidIsraeliPhone(phone)) {
      setError("מספר טלפון לא תקין — למשל: 050-1234567")
      return
    }

    setLoading(true)
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: session?.user?.name, phone }),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error)
      return
    }

    await update({ phone: data.user.phone })
    router.replace("/")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-center px-4 py-4 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <h1 className="text-xl font-black tracking-tight text-zinc-900">TickTac</h1>
      </header>

      <main className="flex-1 flex flex-col justify-center px-6 pb-16 max-w-md mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-zinc-900">עוד צעד אחד</h2>
          <p className="text-zinc-500 mt-1">
            כדי להמשיך, השלם מספר טלפון — כך קונים ומוכרים יוכלו ליצור איתך קשר בוואטסאפ.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">טלפון</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="050-1234567"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-black font-bold py-3 rounded-xl text-base disabled:opacity-60 mt-2"
          >
            {loading ? "שומר..." : "המשך"}
          </button>
        </form>
      </main>
    </div>
  )
}
