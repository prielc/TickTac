import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 403 })
  }

  const { id } = await params
  const target = await prisma.user.findUnique({ where: { id }, select: { email: true } })
  if (!target) {
    return NextResponse.json({ error: "משתמש לא נמצא" }, { status: 404 })
  }

  if (target.email === session.user.email) {
    return NextResponse.json({ error: "לא ניתן לבצע פעולה זו על המשתמש שלך" }, { status: 400 })
  }

  const { role, isBanned } = await req.json()
  const data: { role?: string; isBanned?: boolean } = {}

  if (role !== undefined) {
    if (role !== "user" && role !== "admin") {
      return NextResponse.json({ error: "תפקיד לא תקין" }, { status: 400 })
    }
    data.role = role
  }

  if (isBanned !== undefined) {
    if (typeof isBanned !== "boolean") {
      return NextResponse.json({ error: "ערך לא תקין" }, { status: 400 })
    }
    data.isBanned = isBanned
  }

  const updated = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, role: true, isBanned: true },
  })

  return NextResponse.json({ user: updated })
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 403 })
  }

  const { id } = await params
  const target = await prisma.user.findUnique({ where: { id }, select: { email: true } })
  if (!target) {
    return NextResponse.json({ error: "משתמש לא נמצא" }, { status: 404 })
  }

  if (target.email === session.user.email) {
    return NextResponse.json({ error: "לא ניתן למחוק את המשתמש שלך" }, { status: 400 })
  }

  await prisma.user.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
