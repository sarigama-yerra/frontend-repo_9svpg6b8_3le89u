import { useEffect, useState } from 'react'
import Hero3D from './components/Hero3D'
import Navbar from './components/Navbar'
import ProductGrid from './components/ProductGrid'
import CheckoutSheet from './components/CheckoutSheet'
import AdminPanel from './components/AdminPanel'

function App() {
  const [cartItems, setCartItems] = useState([])
  const [balance, setBalance] = useState(0)
  const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  useEffect(() => {
    const run = async () => {
      const res = await fetch(`${base}/api/wallet/balance?user_id=demo-user`)
      const d = await res.json()
      setBalance(d.balance || 0)
    }
    run()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Navbar balance={balance} />

      <div className="max-w-md mx-auto px-4 py-5 space-y-5">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Daily Essentials, Delivered</h1>
          <p className="text-gray-500 text-sm">Order by 11 PM for delivery by 7 AM</p>
        </div>

        <Hero3D />

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Products</h2>
          <ProductGrid onChange={setCartItems} />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Admin</h2>
          <AdminPanel />
        </div>
      </div>

      {cartItems.length > 0 && (
        <CheckoutSheet items={cartItems} />
      )}
    </div>
  )
}

export default App
