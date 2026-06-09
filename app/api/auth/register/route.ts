import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const { name, email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: "אימייל וסיסמה הם שדות חובה" }, { status: 400 })
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "הסיסמה חייבת להכיל לפחות 6 תווים" }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: "כתובת האימייל כבר רשומה במערכת" }, { status: 409 })
  }

  const hashed = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: { name: name || null, email, password: hashed },
  })

  return NextResponse.json({ success: true }, { status: 201 })
}
