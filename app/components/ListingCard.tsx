"use client"

import { useState } from "react"
import ContactModal from "./ContactModal"
import ReportModal from "./ReportModal"
import RatingBadge from "./RatingBadge"
import { formatSeatInfo } from "@/lib/format"

type DbListing = {
  id: string
  section: string
  row: string
  seats: string
  price: number
  quantity: number
  phone: string | null
  isAvailable: boolean
  sellerRating: { average: number; count: number } | null
}

type Props = {
  listing: DbListing
  gameName: string
}

export default function ListingCard({ listing, gameName }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const seatInfo = formatSeatInfo(listing.row, listing.seats)

  return (
    <>
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">זמין</span>
              {listing.sellerRating && (
                <RatingBadge average={listing.sellerRating.average} count={listing.sellerRating.count} />
              )}
            </div>
            <p className="text-zinc-900 font-bold text-base">{listing.section}</p>
            {seatInfo && <p className="text-zinc-500 text-sm">{seatInfo}</p>}
            <p className="text-zinc-400 text-xs mt-1">{listing.quantity} כרטיסים</p>
          </div>

          <div className="flex flex-col items-end gap-3 shrink-0">
            <p className="text-zinc-900 font-black text-2xl">₪{listing.price}</p>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-primary text-black font-bold px-6 py-2 rounded-xl text-sm"
            >
              קנה
            </button>
          </div>
        </div>

        <div className="mt-2 text-left">
          <button
            onClick={() => setReportOpen(true)}
            className="text-zinc-400 text-xs underline"
          >
            דיווח על מודעה
          </button>
        </div>
      </div>

      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        listing={listing}
        gameName={gameName}
      />

      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        listingId={listing.id}
      />
    </>
  )
}
