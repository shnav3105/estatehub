import "./globals.css"
import { ReactNode } from "react"
import Link from "next/link"

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <div className="flex min-h-screen">
          
          {/* Sidebar */}
          <aside className="w-64 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col justify-between">
            <div>
              <h1 className="text-xl font-bold mb-8">EstateHub</h1>

              <nav className="space-y-4">
                <Link href="/companies" className="block hover:text-gray-300">
                  Companies
                </Link>
                <Link href="/companies" className="block hover:text-gray-300">
                  Buildings
                </Link>
                <Link href="/companies" className="block hover:text-gray-300">
                  Units
                </Link>
              </nav>
            </div>

            <button className="text-sm text-gray-400 hover:text-white">
              Logout
            </button>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-10">
            {children}
          </main>

        </div>
      </body>
    </html>
  )
}