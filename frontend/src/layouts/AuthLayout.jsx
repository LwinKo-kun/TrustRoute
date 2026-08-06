import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 flex items-center justify-center p-4 sm:p-6">
      {/* Decorative background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-40 -left-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
      </div>
      
      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left - Branding */}
        <div className="hidden lg:flex flex-col space-y-8 animate-fade-in-right">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-2xl shadow-purple-500/40">
                <span className="text-white font-bold text-2xl">TR</span>
              </div>
              <span className="text-3xl font-bold text-white tracking-tight">TrustRoute</span>
            </div>
            <h1 className="text-5xl font-bold text-white leading-tight">
              Buy & Sell <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300">With Confidence</span>
            </h1>
            <p className="text-purple-100 text-lg max-w-md leading-relaxed">
              The decentralized marketplace for secure transactions. Verified sellers, escrow protection, and direct peer-to-peer connections.
            </p>
            <div className="flex items-center gap-8 pt-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-purple-900 bg-gray-300 flex items-center justify-center text-xs font-bold text-gray-600">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-purple-200">
                <span className="text-white font-bold text-xl">500+</span> verified shops
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
            {[
              { icon: '🔒', title: 'Secure Escrow', desc: 'Funds protected' },
              { icon: '✅', title: 'Verified Shops', desc: 'Background checked' },
              { icon: '⚡', title: 'Fast Payouts', desc: 'Quick settlements' },
            ].map((feature, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="text-3xl">{feature.icon}</div>
                <div className="text-white font-semibold">{feature.title}</div>
                <div className="text-sm text-purple-200">{feature.desc}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Right - Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl shadow-purple-900/40 p-8 sm:p-10 backdrop-blur-xl border border-white/20">
            <div className="mb-8 text-center lg:text-left">
              <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">TR</span>
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">TrustRoute</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h2>
              <p className="text-gray-500 dark:text-gray-400">Sign in to access your TrustRoute account</p>
            </div>
            <Outlet />
          </div>
          
          {/* Trust badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Secure payment
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              encrypted
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Private
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
