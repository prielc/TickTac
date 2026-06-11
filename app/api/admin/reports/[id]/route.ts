import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: "אין הרשאה" }, { status: 403 })
  }

  const { id } = await params
  const { status } = await req.json()

  if (status !== "open" && status !== "resolved") {
    return NextResponse.json({ error: "סטטוס לא תקין" }, { status: 400 })
  }

  const updated = await prisma.report.update({
    where: { id },
    data: { status },
    select: { id: true, status: true },
  })

  return NextResponse.json({ report: updated })
}
