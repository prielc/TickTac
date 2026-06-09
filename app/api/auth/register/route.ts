import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidIsraeliPhone(phone: string) {
  return /^05\d[-\s]?\d{3}[-\s]?\d{4}$/.test(phone.trim())
}

export async function POST(req: Request) {
  const { name, email, password, phone } = await req.json()

  if (!name || name.trim().length < 2) {
    return NextResponse.json({ error: "שם חייב להכיל לפחות 2 תווים" }, { status: 400 })
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "כתובת אימייל לא תקינה" }, { status: 400 })
  }

  if (!phone || !isValidIsraeliPhone(phone)) {
    return NextResponse.json({ error: "מספר טלפון לא תקין — למשל: 050-1234567" }, { status: 400 })
  }

  if (!password || password.length < 6) {
    return NextResponse.json({ error: "הסיסמה חייבת להכיל לפחות 6 תווים" }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: "כתובת האימייל כבר רשומה במערכת" }, { status: 409 })
  }

  const hashed = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: { name: name.trim(), email, password: hashed, phone: phone.trim() },
  })

  return NextResponse.json({ success: true }, { status: 201 })
}
