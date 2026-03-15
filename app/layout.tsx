import type { Metadata } from "next"
import { Inter, Jost } from "next/font/google"
import "./global.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const jost = Jost({ subsets: ["latin"], variable: "--font-jost", weight: ["400","500","600","700","800","900"] })

export const metadata: Metadata = {
  title: "Highfox - Fintech Product Builders",
  description: "We don't consult. We build fintech products that scale.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jost.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}