import './globals.css';
import { AuthProvider } from '../context/AuthContext'
import AuthButtons      from '../components/AuthButtons'

export const metadata = {
  title: 'NFC Profile',
  description: 'Create and preview styled NFC profile cards',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-spin duration-[20s]"></div>
        </div>

        <AuthProvider>
          {/* Modern glassmorphism header */}
          <header className="relative z-10 backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-2xl">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                {/* NFC Icon */}
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                    </svg>
                  </div>
                  {/* Pulsing ring effect */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl opacity-20 animate-ping"></div>
                </div>
                
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    NFC DIGITAL PROFILE
                  </h1>
                  <p className="text-sm text-gray-400 hidden sm:block">Create stunning digital business cards</p>
                </div>
              </div>

              <div className="relative">
                <AuthButtons />
              </div>
            </div>
          </header>

          {/* Enhanced main content area */}
          <main className="relative z-10 flex-1">
            {/* Content container with subtle animations */}
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-2xl -z-10"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-cyan-500/20 to-transparent rounded-full blur-2xl -z-10"></div>
                
                {/* Main content with enhanced styling */}
                <div className="backdrop-blur-sm bg-white/5 rounded-3xl border border-white/10 shadow-2xl p-8 hover:bg-white/10 transition-all duration-500">
                  {children}
                </div>
              </div>
            </div>
          </main>

          {/* Floating elements for visual interest */}
          <div className="fixed bottom-8 right-8 pointer-events-none">
            <div className="relative">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-cyan-500 rounded-full absolute -top-4 -left-2 animate-bounce delay-300"></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full absolute -top-2 -right-3 animate-bounce delay-700"></div>
            </div>
          </div>
        </AuthProvider>


      </body>
    </html>
  )
}