export function formatSeatInfo(row: string, seats: string): string | null {
  if (row && seats) return `שורה ${row}, כיסאות ${seats}`
  if (row) return `שורה ${row}`
  if (seats) return `כיסאות ${seats}`
  return null
}
