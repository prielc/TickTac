"use client"

import { useMemo, useState } from "react"
import ListingCard from "./ListingCard"

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

type Props = {
  listings: DbListing[]
  gameName: string
}

type SortOption = "default" | "price-asc" | "price-desc"

export default function GameListings({ listings, gameName }: Props) {
  const [sortBy, setSortBy] = useState<SortOption>("default")
  const [sectionFilter, setSectionFilter] = useState("all")
  const [quantityFilter, setQuantityFilter] = useState("all")

  const sections = useMemo(
    () => Array.from(new Set(listings.map((l) => l.section))),
    [listings]
  )

  const quantities = useMemo(
    () => Array.from(new Set(listings.map((l) => l.quantity))).sort((a, b) => a - b),
    [listings]
  )

  const filteredListings = useMemo(() => {
    let result = listings

    if (sectionFilter !== "all") {
      result = result.filter((l) => l.section === sectionFilter)
    }

    if (quantityFilter !== "all") {
      result = result.filter((l) => l.quantity === Number(quantityFilter))
    }

    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price)
    }

    return result
  }, [listings, sectionFilter, quantityFilter, sortBy])

  return (
    <>
      {/* Filters */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto border-b border-gray-100">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="px-3 py-1.5 rounded-full border border-gray-300 text-sm text-zinc-600 bg-white whitespace-nowrap"
        >
          <option value="default">מחיר</option>
          <option value="price-asc">מהזול ליקר</option>
          <option value="price-desc">מהיקר לזול</option>
        </select>

        <select
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
          className="px-3 py-1.5 rounded-full border border-gray-300 text-sm text-zinc-600 bg-white whitespace-nowrap"
        >
          <option value="all">יציע: הכל</option>
          {sections.map((section) => (
            <option key={section} value={section}>
              {section}
            </option>
          ))}
        </select>

        <select
          value={quantityFilter}
          onChange={(e) => setQuantityFilter(e.target.value)}
          className="px-3 py-1.5 rounded-full border border-gray-300 text-sm text-zinc-600 bg-white whitespace-nowrap"
        >
          <option value="all">כמות: הכל</option>
          {quantities.map((quantity) => (
            <option key={quantity} value={quantity}>
              {quantity} כרטיסים
            </option>
          ))}
        </select>
      </div>

      {/* Listings */}
      <div className="px-4 pt-4">
        <h2 className="text-lg font-bold text-zinc-900 mb-3">
          כרטיסים זמינים ({filteredListings.length})
        </h2>
        <div className="space-y-3">
          {listings.length === 0 ? (
            <p className="text-zinc-400 text-center py-10">אין כרטיסים זמינים כרגע</p>
          ) : filteredListings.length > 0 ? (
            filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} gameName={gameName} />
            ))
          ) : (
            <p className="text-zinc-400 text-center py-10">אין כרטיסים התואמים לסינון שבחרת</p>
          )}
        </div>
      </div>
    </>
  )
}
