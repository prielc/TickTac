export type Game = {
  id: string
  homeTeam: string
  awayTeam: string
  homeLogo: string
  awayLogo: string
  date: string
  time: string
  stadium: string
  competition: string
}

export const games: Game[] = [
  {
    id: "1",
    homeTeam: "ביתר ירושלים",
    awayTeam: "מכבי חיפה",
    homeLogo: "/teams/beitar-jerusalem.svg",
    awayLogo: "/teams/maccabi-haifa.png",
    date: "יום שני, 26.08.2024",
    time: "20:30",
    stadium: "אצטדיון טדי, ירושלים",
    competition: "ליגת העל",
  },
  {
    id: "2",
    homeTeam: "ביתר ירושלים",
    awayTeam: "מכבי תל אביב",
    homeLogo: "/teams/beitar-jerusalem.svg",
    awayLogo: "/teams/maccabi-tel-aviv.png",
    date: "שבת, 07.09.2024",
    time: "19:00",
    stadium: "אצטדיון טדי, ירושלים",
    competition: "ליגת העל",
  },
  {
    id: "3",
    homeTeam: "ביתר ירושלים",
    awayTeam: "הפועל תל אביב",
    homeLogo: "/teams/beitar-jerusalem.svg",
    awayLogo: "/teams/hapoel-tel-aviv.png",
    date: "שבת, 21.09.2024",
    time: "20:00",
    stadium: "אצטדיון טדי, ירושלים",
    competition: "ליגת העל",
  },
  {
    id: "4",
    homeTeam: "ביתר ירושלים",
    awayTeam: "הפועל באר שבע",
    homeLogo: "/teams/beitar-jerusalem.svg",
    awayLogo: "/teams/hapoel-beer-sheva.svg",
    date: "שבת, 05.10.2024",
    time: "20:00",
    stadium: "אצטדיון טדי, ירושלים",
    competition: "ליגת העל",
  },
]
