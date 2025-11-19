import { Wallet, Home, Search, User } from 'lucide-react'

export default function Navbar({ balance = 0 }) {
  return (
    <div className="sticky top-0 z-20 bg-white/70 backdrop-blur border-b border-gray-200">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 text-purple-700">
            <Wallet size={16} /> Wallet: ₹{balance.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-6 text-gray-700">
          <Home size={22} />
          <Search size={22} />
          <Wallet size={22} />
          <User size={22} />
        </div>
      </div>
    </div>
  )
}
