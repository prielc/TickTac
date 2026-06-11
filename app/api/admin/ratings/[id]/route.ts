import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 403 })
  }

  const { id } = await params

  await prisma.rating.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
