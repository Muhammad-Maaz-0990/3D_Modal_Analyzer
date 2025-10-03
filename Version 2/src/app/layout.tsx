import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '3D File Analyzer',
  description: 'Upload 3D models for quick insights and a live preview',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className="min-h-screen bg-gray-100 text-gray-900">
        {/* Top Navigation Bar */}
        <nav className="bg-black text-white shadow-lg sticky top-0 z-50">
          <div className="mx-auto max-w-6xl px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xl font-bold">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 grid place-items-center text-white text-sm font-bold">
                    3D
                  </div>
                  <span>Analyzer</span>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-8">
                <span className="text-gray-400">Professional 3D Analysis Tool</span>
              </div>
              {/* Mobile menu button */}
              <div className="md:hidden">
                <button className="text-white hover:text-indigo-400 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-1 relative">
          <main className="mx-auto max-w-6xl px-4 py-8">
            {children}
          </main>
        </div>

        {/* Bottom Footer Bar */}
        <footer className="bg-black text-white py-6">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center text-sm text-gray-300">
              © 2025 3D Analyzer. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
