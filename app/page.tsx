import GameCard, { type Game } from "./components/GameCard"

const mockGames: Game[] = [
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

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 sticky top-0 bg-zinc-950/90 backdrop-blur-sm z-10 border-b border-zinc-800">
        <button className="p-1" aria-label="תפריט">
          <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-black tracking-tight text-white">TickTac</h1>
        <button className="p-1" aria-label="התראות">
          <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 pt-5 pb-28">
        <div className="mb-5">
          <h2 className="text-2xl font-bold text-white">משחקים קרובים</h2>
          <p className="text-zinc-500 text-sm mt-1">ביתר ירושלים</p>
        </div>

        <div className="space-y-4">
          {mockGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 right-0 left-0 z-20">
        <div className="max-w-2xl mx-auto bg-zinc-900 border-t border-zinc-800">
          <div className="flex items-center justify-around px-2 py-2">
            <button className="flex flex-col items-center gap-1 px-3 py-1" aria-label="בית">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs text-primary font-medium">בית</span>
            </button>

            <button className="flex flex-col items-center gap-1 px-3 py-1" aria-label="חיפוש">
              <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-xs text-zinc-500">חיפוש</span>
            </button>

            <button className="flex flex-col items-center -mt-5" aria-label="מכירה">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-xs text-zinc-500 mt-1">מכירה</span>
            </button>

            <button className="flex flex-col items-center gap-1 px-3 py-1" aria-label="כרטיסים">
              <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              <span className="text-xs text-zinc-500">כרטיסים</span>
            </button>

            <button className="flex flex-col items-center gap-1 px-3 py-1" aria-label="פרופיל">
              <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs text-zinc-500">פרופיל</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}
