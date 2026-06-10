import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"
import { isValidReportReason } from "@/lib/report-reasons"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "יש להתחבר כדי לדווח" }, { status: 401 })
  }

  const { listingId, reason, description } = await req.json()

  if (typeof listingId !== "string" || !listingId) {
    return NextResponse.json({ error: "מודעה לא תקינה" }, { status: 400 })
  }

  if (typeof reason !== "string" || !isValidReportReason(reason)) {
    return NextResponse.json({ error: "סיבת דיווח לא תקינה" }, { status: 400 })
  }

  const listing = await prisma.listing.findUnique({ where: { id: listingId } })
  if (!listing) {
    return NextResponse.json({ error: "מודעה לא נמצאה" }, { status: 404 })
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) {
    return NextResponse.json({ error: "משתמש לא נמצא" }, { status: 404 })
  }

  if (listing.userId === user.id) {
    return NextResponse.json({ error: "לא ניתן לדווח על מודעה שפרסמת" }, { status: 400 })
  }

  await prisma.report.create({
    data: {
      reporterId: user.id,
      listingId: listing.id,
      reason,
      description: typeof description === "string" && description.trim() ? description.trim() : null,
    },
  })

  return NextResponse.json({ success: true })
}
