"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { isValidEmail, isValidIsraeliPhone } from "@/lib/validation"

type FieldErrors = {
  name?: string
  email?: string
  phone?: string
  password?: string
}

function validate(name: string, email: string, phone: string, password: string): FieldErrors {
  const errors: FieldErrors = {}
  if (name.trim().length < 2) errors.name = "שם חייב להכיל לפחות 2 תווים"
  if (!isValidEmail(email)) errors.email = "כתובת אימייל לא תקינה"
  if (!isValidIsraeliPhone(phone)) errors.phone = "מספר טלפון לא תקין — למשל: 050-1234567"
  if (password.length < 6) errors.password = "הסיסמה חייבת להכיל לפחות 6 תווים"
  return errors
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-red-500 text-xs mt-1">{message}</p>
}

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<FieldErrors>({})
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(false)

  function clearError(field: keyof FieldErrors) {
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function inputClass(hasError: boolean) {
    return `w-full px-4 py-3 rounded-xl border bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
      hasError ? "border-red-400" : "border-gray-200"
    }`
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError("")

    const fieldErrors = validate(name, email, phone, password)
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setLoading(true)

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setServerError(data.error)
      setLoading(false)
      return
    }

    await signIn("credentials", { email, password, redirect: false })
    router.push("/")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between px-4 py-4 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <Link href="/" className="p-1">
          <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-xl font-black tracking-tight text-zinc-900">TickTac</h1>
        <div className="w-8" />
      </header>

      <main className="flex-1 flex flex-col justify-center px-6 pb-16 max-w-md mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-zinc-900">הרשמה</h2>
          <p className="text-zinc-500 mt-1">צור חשבון חדש</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">שם מלא</label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); clearError("name") }}
              placeholder="ישראל ישראלי"
              className={inputClass(!!errors.name)}
            />
            <FieldError message={errors.name} />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">אימייל</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError("email") }}
              placeholder="your@email.com"
              className={inputClass(!!errors.email)}
            />
            <FieldError message={errors.email} />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">
              טלפון
              <span className="text-zinc-400 font-normal mr-1">(לצורך יצירת קשר בקניה/מכירה)</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); clearError("phone") }}
              placeholder="050-1234567"
              className={inputClass(!!errors.phone)}
            />
            <FieldError message={errors.phone} />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearError("password") }}
              placeholder="לפחות 6 תווים"
              className={inputClass(!!errors.password)}
            />
            <FieldError message={errors.password} />
          </div>

          {serverError && (
            <p className="text-red-500 text-sm text-center">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-black font-bold py-3 rounded-xl text-base disabled:opacity-60 mt-2"
          >
            {loading ? "יוצר חשבון..." : "צור חשבון"}
          </button>
        </form>

        <p className="text-center text-zinc-500 text-sm mt-6">
          כבר יש לך חשבון?{" "}
          <Link href="/login" className="text-zinc-900 font-bold underline">
            התחבר
          </Link>
        </p>
      </main>
    </div>
  )
}
