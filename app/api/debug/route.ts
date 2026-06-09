import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const listings = await prisma.listing.findMany({
      where: { gameId: "1", isAvailable: true },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ ok: true, count: listings.length, listings })
  } catch (e: unknown) {
    const err = e as { message?: string; code?: string; stack?: string }
    return NextResponse.json(
      { ok: false, message: err?.message, code: err?.code, stack: err?.stack?.slice(0, 500) },
      { status: 500 }
    )
  }
}
