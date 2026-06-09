export type Game = {
  id: string
  homeTeam: string
  awayTeam: string
  homeInitials: string
  awayInitials: string
  homeColor: string
  awayColor: string
  date: string
  time: string
  stadium: string
  availableTickets: number
  isSelling: boolean
  competition: string
}

export type Listing = {
  id: string
  gameId: string
  section: string
  row: string
  seats: string
  price: number
  quantity: number
  isAvailable: boolean
  isFast?: boolean
}

export const games: Game[] = [
  {
    id: "1",
    homeTeam: "ביתר ירושלים",
    awayTeam: "מכבי חיפה",
    homeInitials: "ב״י",
    awayInitials: "מ״ח",
    homeColor: "#F5C100",
    awayColor: "#009900",
    date: "יום שני, 26.08.2024",
    time: "20:30",
    stadium: "אצטדיון טדי, ירושלים",
    availableTickets: 24,
    isSelling: true,
    competition: "ליגת העל",
  },
  {
    id: "2",
    homeTeam: "ביתר ירושלים",
    awayTeam: "מכבי תל אביב",
    homeInitials: "ב״י",
    awayInitials: "מ״ת",
    homeColor: "#F5C100",
    awayColor: "#0066CC",
    date: "שבת, 07.09.2024",
    time: "19:00",
    stadium: "אצטדיון טדי, ירושלים",
    availableTickets: 8,
    isSelling: true,
    competition: "ליגת העל",
  },
  {
    id: "3",
    homeTeam: "ביתר ירושלים",
    awayTeam: "הפועל תל אביב",
    homeInitials: "ב״י",
    awayInitials: "ה״ת",
    homeColor: "#F5C100",
    awayColor: "#CC0000",
    date: "שבת, 21.09.2024",
    time: "20:00",
    stadium: "אצטדיון טדי, ירושלים",
    availableTickets: 31,
    isSelling: false,
    competition: "ליגת העל",
  },
  {
    id: "4",
    homeTeam: "ביתר ירושלים",
    awayTeam: "הפועל באר שבע",
    homeInitials: "ב״י",
    awayInitials: "ה״ב",
    homeColor: "#F5C100",
    awayColor: "#FF6600",
    date: "שבת, 05.10.2024",
    time: "20:00",
    stadium: "אצטדיון טדי, ירושלים",
    availableTickets: 15,
    isSelling: false,
    competition: "ליגת העל",
  },
]

export const listings: Listing[] = [
  { id: "l1", gameId: "1", section: "יציע מזרחי", row: "12", seats: "44-45", price: 150, quantity: 2, isAvailable: true },
  { id: "l2", gameId: "1", section: "יציע מערבי VIP", row: "3", seats: "10-13", price: 450, quantity: 4, isAvailable: true, isFast: true },
  { id: "l3", gameId: "1", section: "יציע צפוני", row: "1", seats: "15-18", price: 100, quantity: 4, isAvailable: true },
  { id: "l4", gameId: "1", section: "יציע דרומי", row: "7", seats: "22-23", price: 200, quantity: 2, isAvailable: true },
  { id: "l5", gameId: "2", section: "יציע מזרחי", row: "5", seats: "10-11", price: 220, quantity: 2, isAvailable: true, isFast: true },
  { id: "l6", gameId: "2", section: "יציע מערבי VIP", row: "2", seats: "5-8", price: 600, quantity: 4, isAvailable: true },
  { id: "l7", gameId: "3", section: "יציע מזרחי", row: "8", seats: "30-32", price: 180, quantity: 3, isAvailable: true },
  { id: "l8", gameId: "3", section: "יציע צפוני", row: "3", seats: "15-16", price: 120, quantity: 2, isAvailable: true },
  { id: "l9", gameId: "4", section: "יציע מזרחי", row: "10", seats: "20-21", price: 160, quantity: 2, isAvailable: true },
]
