import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"
import { isValidRatingScore } from "@/lib/ratings"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "יש להתחבר כדי לדרג" }, { status: 401 })
  }

  const { listingId, score, comment } = await req.json()

  if (typeof listingId !== "string" || !listingId) {
    return NextResponse.json({ error: "מודעה לא תקינה" }, { status: 400 })
  }

  if (!isValidRatingScore(score)) {
    return NextResponse.json({ error: "ציון לא תקין" }, { status: 400 })
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
    return NextResponse.json({ error: "לא ניתן לדרג מודעה שפרסמת" }, { status: 400 })
  }

  await prisma.rating.upsert({
    where: { raterId_listingId: { raterId: user.id, listingId: listing.id } },
    create: {
      raterId: user.id,
      ratedUserId: listing.userId,
      listingId: listing.id,
      score,
      comment: typeof comment === "string" && comment.trim() ? comment.trim() : null,
    },
    update: {
      score,
      comment: typeof comment === "string" && comment.trim() ? comment.trim() : null,
    },
  })

  return NextResponse.json({ success: true })
}
