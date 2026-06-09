import type { Metadata } from "next"
import { Rubik } from "next/font/google"
import "./globals.css"
import Providers from "./providers"

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin", "hebrew"],
  weight: ["400", "500", "700", "900"],
})

export const metadata: Metadata = {
  title: "TickTac",
  description: "קנה ומכור כרטיסים לאירועי ספורט בישראל",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl" className={`${rubik.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
