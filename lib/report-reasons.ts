export const REPORT_REASONS = [
  "מודעה מזויפת או לא קיימת",
  "המוכר לא עונה",
  "מחיר מטעה / חשד להונאה",
  "אחר",
] as const

export type ReportReason = (typeof REPORT_REASONS)[number]

export function isValidReportReason(value: string): value is ReportReason {
  return (REPORT_REASONS as readonly string[]).includes(value)
}
