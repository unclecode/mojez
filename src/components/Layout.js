// components/Layout.js
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function Layout({ children }) {
  return (
    <div className={`min-h-screen bg-black text-white ${inter.className}`}>
      <header className="p-4 bg-gray-900">
        <nav className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">Text Condenser</Link>
          <Link href="/settings" className="text-sm">Settings</Link>
        </nav>
      </header>
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  )
}
