import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 403 })
  }

  const { id } = await params
  const { isAvailable } = await req.json()

  if (typeof isAvailable !== "boolean") {
    return NextResponse.json({ error: "ערך לא תקין" }, { status: 400 })
  }

  const updated = await prisma.listing.update({
    where: { id },
    data: { isAvailable },
    select: { id: true, isAvailable: true },
  })

  return NextResponse.json({ listing: updated })
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 403 })
  }

  const { id } = await params

  await prisma.listing.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
