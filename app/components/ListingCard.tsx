import { type Listing } from "@/lib/mock-data"

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">זמין</span>
            {listing.isFast && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">נמכר מהר!</span>
            )}
          </div>
          <p className="text-zinc-900 font-bold text-base">{listing.section}</p>
          <p className="text-zinc-500 text-sm">שורה {listing.row}, כיסאות {listing.seats}</p>
          <p className="text-zinc-400 text-xs mt-1">{listing.quantity} כרטיסים</p>
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
