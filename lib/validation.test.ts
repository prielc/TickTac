import { describe, it, expect } from "vitest"
import { isValidIsraeliPhone } from "./validation"

describe("isValidIsraeliPhone", () => {
  it("accepts numbers with dashes", () => {
    expect(isValidIsraeliPhone("050-1234567")).toBe(true)
    expect(isValidIsraeliPhone("052-9876543")).toBe(true)
  })

  it("accepts numbers with spaces", () => {
    expect(isValidIsraeliPhone("050 123 4567")).toBe(true)
  })

  it("accepts numbers with no separator", () => {
    expect(isValidIsraeliPhone("0501234567")).toBe(true)
  })

  it("accepts numbers with surrounding whitespace", () => {
    expect(isValidIsraeliPhone("  050-1234567  ")).toBe(true)
  })

  it("rejects numbers with international prefix", () => {
    expect(isValidIsraeliPhone("+972501234567")).toBe(false)
    expect(isValidIsraeliPhone("972501234567")).toBe(false)
  })

  it("rejects numbers that are too short", () => {
    expect(isValidIsraeliPhone("050-123456")).toBe(false)
  })

  it("rejects numbers that are too long", () => {
    expect(isValidIsraeliPhone("050-12345678")).toBe(false)
  })

  it("rejects landline-style numbers", () => {
    expect(isValidIsraeliPhone("02-1234567")).toBe(false)
  })

  it("rejects numbers with letters", () => {
    expect(isValidIsraeliPhone("050-abcd567")).toBe(false)
  })

  it("rejects empty string", () => {
    expect(isValidIsraeliPhone("")).toBe(false)
  })
})
