import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "יש להתחבר כדי לפרסם כרטיס" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "משתמש לא נמצא" }, { status: 404 })

  const { gameId, section, row, seats, price, quantity, phone } = await req.json()

  if (!gameId || !section || !row || !seats || !price || !quantity) {
    return NextResponse.json({ error: "כל השדות הם חובה" }, { status: 400 })
  }

  const listing = await prisma.listing.create({
    data: {
      gameId,
      userId: user.id,
      section,
      row,
      seats,
      price: Number(price),
      quantity: Number(quantity),
      phone: phone || null,
    },
  })

  return NextResponse.json(listing, { status: 201 })
}
