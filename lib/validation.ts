export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export function isValidIsraeliPhone(phone: string) {
  return /^05\d[-\s]?\d{3}[-\s]?\d{4}$/.test(phone.trim())
}
