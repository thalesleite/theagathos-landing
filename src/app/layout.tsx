import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: " The Agathos Bookstore — Livros em português, direto pra Irlanda",
  description:
    "Estou montando o primeiro catálogo da The Agathos Bookstore. Indique livros, ganhe 10% no lançamento e ajude a construir a livraria da comunidade.",
  icons: [{ rel: "icon", url: "/icon.png" }],
  openGraph: {
    title: "The Agathos Bookstore",
    description:
      "Livros em português, direto pra Irlanda. Indique títulos e ganhe 10% no lançamento.",
    url: "https://agathosbooks.ie",
    siteName: "The Agathos Bookstore",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
    locale: "pt_PT",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body
        className={`${inter.className} min-h-screen bg-[var(--brand-bg)] text-slate-900 antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
