import type { Metadata } from "next"
import "./global.css"

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
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}