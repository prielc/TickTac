import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "יש להתחבר" }, { status: 401 })
  }

  const { id } = await params
  const { isAvailable } = await req.json()

  if (typeof isAvailable !== "boolean") {
    return NextResponse.json({ error: "ערך isAvailable לא תקין" }, { status: 400 })
  }

  const listing = await prisma.listing.findUnique({ where: { id } })
  if (!listing) {
    return NextResponse.json({ error: "מודעה לא נמצאה" }, { status: 404 })
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user || listing.userId !== user.id) {
    return NextResponse.json({ error: "אין הרשאה לעדכן מודעה זו" }, { status: 403 })
  }

  const updated = await prisma.listing.update({
    where: { id },
    data: { isAvailable },
    select: { id: true, isAvailable: true },
  })

  return NextResponse.json({ listing: updated })
}
