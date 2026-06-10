import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"
import { isValidIsraeliPhone } from "@/lib/validation"

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json({ error: "יש להתחבר" }, { status: 401 })
  }

  const { name, phone } = await req.json()

  if (!name || name.trim().length < 2) {
    return NextResponse.json({ error: "שם חייב להכיל לפחות 2 תווים" }, { status: 400 })
  }

  if (!phone || !isValidIsraeliPhone(phone)) {
    return NextResponse.json({ error: "מספר טלפון לא תקין — למשל: 050-1234567" }, { status: 400 })
  }

  const user = await prisma.user.update({
    where: { email: session.user.email },
    data: { name: name.trim(), phone: phone.trim() },
    select: { name: true, email: true, phone: true },
  })

  return NextResponse.json({ user })
}
