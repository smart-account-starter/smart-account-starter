import { Inter } from "next/font/google"
import "../styles/globals.css"
import { Header } from "@repo/ui/smart-account-starter/header"
// import { Header } from "@repo/ui/src/smart-account-starter/header"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="container mx-auto">
          <Header />
          {children}
        </div>
      </body>
    </html>
  )
}
