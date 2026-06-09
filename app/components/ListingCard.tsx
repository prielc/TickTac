type DbListing = {
  id: string
  section: string
  row: string
  seats: string
  price: number
  quantity: number
  phone: string | null
  isAvailable: boolean
}

export default function ListingCard({ listing }: { listing: DbListing }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">זמין</span>
          </div>
          <p className="text-zinc-900 font-bold text-base">{listing.section}</p>
          <p className="text-zinc-500 text-sm">שורה {listing.row}, כיסאות {listing.seats}</p>
          <p className="text-zinc-400 text-xs mt-1">{listing.quantity} כרטיסים</p>
          {listing.phone && (
            <a
              href={`tel:${listing.phone}`}
              className="text-xs text-primary font-semibold mt-1 inline-block"
            >
              📞 {listing.phone}
            </a>
          )}
        </div>

        <div className="flex flex-col items-end gap-3 shrink-0">
          <p className="text-zinc-900 font-black text-2xl">₪{listing.price}</p>
          <button className="bg-primary text-black font-bold px-6 py-2 rounded-xl text-sm">
            קנה
          </button>
        </div>
      </div>
    </div>
  )
}
