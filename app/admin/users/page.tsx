import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"
import { getSellerRatings } from "@/lib/ratings"
import UserActions from "@/app/components/admin/UserActions"

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isBanned: true,
      createdAt: true,
      _count: { select: { listings: true } },
    },
  })

  const ratings = await getSellerRatings(users.map((u) => u.id))

  return (
    <div>
      <h2 className="text-2xl font-bold text-zinc-900 mb-4">משתמשים ({users.length})</h2>

      <div className="space-y-3">
        {users.map((user) => {
          const rating = ratings.get(user.id)
          const isSelf = user.email === session?.user?.email

          return (
            <div key={user.id} className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-zinc-900 text-sm">{user.name ?? "—"}</span>
                  {user.role === "admin" && (
                    <span className="bg-primary text-black text-xs font-semibold px-2 py-0.5 rounded-full">אדמין</span>
                  )}
                  {user.isBanned && (
                    <span className="bg-red-50 text-red-600 text-xs font-semibold px-2 py-0.5 rounded-full">חסום</span>
                  )}
                </div>
                {!isSelf && <UserActions id={user.id} role={user.role} isBanned={user.isBanned} />}
              </div>

              <p className="text-zinc-600 text-sm">
                {user.email}
                {user.phone ? ` · ${user.phone}` : ""}
              </p>

              <div className="text-xs text-zinc-500 space-y-1 pt-2 border-t border-gray-100">
                <p>
                  {user._count.listings} מודעות
                  {rating ? ` · דירוג ${rating.average.toFixed(1)} (${rating.count})` : ""}
                </p>
                <p>נרשם ב-{user.createdAt.toLocaleDateString("he-IL")}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
