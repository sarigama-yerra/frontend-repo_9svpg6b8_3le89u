import { useEffect, useMemo, useState } from 'react'

export default function CheckoutSheet({ items, userId = 'demo-user' }) {
  const [balance, setBalance] = useState(0)
  const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [expected, setExpected] = useState(null)
  const total = useMemo(() => items.reduce((s, it) => s + it.product.price * it.qty, 0), [items])

  useEffect(() => {
    const run = async () => {
      const res = await fetch(`${base}/api/wallet/balance?user_id=${userId}`)
      const d = await res.json()
      setBalance(d.balance || 0)
      const cfg = await (await fetch(`${base}/api/config`)).json()
      setExpected(cfg.expected_delivery_date)
    }
    run()
  }, [items])

  const place = async () => {
    const payload = {
      user_id: userId,
      items: items.map(it => ({ product_id: it.product.id, qty: it.qty }))
    }
    const token = localStorage.getItem('token')
    const res = await fetch(`${base}/api/orders/place`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) })
    if (!res.ok) {
      const err = await res.json()
      alert(err.detail?.message || 'Order failed')
      return
    }
    const d = await res.json()
    alert(`Order confirmed for ${d.delivery_date}. New balance: ₹${d.balance}`)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 pb-6 bg-white/80 backdrop-blur border-t border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600">Order by 11 PM for delivery by 7 AM Tomorrow</p>
        <p className="text-sm font-medium">Wallet: ₹{balance.toFixed(2)}</p>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-gray-900 font-semibold">Total: ₹{total.toFixed(2)}</div>
        <button onClick={place} className="px-4 py-3 rounded-xl bg-purple-600 text-white font-medium">
          Pay from Wallet • {expected ? `Delivers ${expected}` : 'Calculating...'}
        </button>
      </div>
    </div>
  )}
