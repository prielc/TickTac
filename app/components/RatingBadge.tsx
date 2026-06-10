type Props = {
  average: number
  count: number
}

export default function RatingBadge({ average, count }: Props) {
  if (count === 0) return null

  return (
    <div className="flex items-center gap-1" dir="ltr">
      <span className="text-primary text-sm">★</span>
      <span className="text-zinc-700 text-xs font-semibold">{average.toFixed(1)}</span>
      <span className="text-zinc-400 text-xs">({count})</span>
    </div>
  )
}
