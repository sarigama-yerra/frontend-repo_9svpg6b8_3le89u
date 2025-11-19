import { useEffect, useState } from 'react'

function ProductCard({ product, onAdd, qty }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-3">
      <div className="aspect-square rounded-xl bg-gray-100 overflow-hidden mb-3">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
        )}
      </div>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm text-gray-500">{product.category}</p>
          <h3 className="font-semibold text-gray-900">{product.name}</h3>
          <p className="text-purple-600 font-medium">₹{product.price}</p>
        </div>
        {qty > 0 ? (
          <div className="flex items-center gap-2">
            <button onClick={() => onAdd(product, -1)} className="w-8 h-8 rounded-full bg-gray-100">-</button>
            <span className="min-w-6 text-center">{qty}</span>
            <button onClick={() => onAdd(product, +1)} className="w-8 h-8 rounded-full bg-gray-900 text-white">+</button>
          </div>
        ) : (
          <button onClick={() => onAdd(product, +1)} className="px-4 py-2 rounded-full bg-gray-900 text-white text-sm">Add</button>
        )}
      </div>
    </div>
  )
}

export default function ProductGrid({ onChange }) {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const load = async () => {
      const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${base}/api/products`)
      const data = await res.json()
      setProducts(data)
    }
    load()
  }, [])

  const [cart, setCart] = useState({})

  const handleAdd = (p, delta) => {
    setCart(prev => {
      const next = { ...prev }
      const current = next[p.id] || { product: p, qty: 0 }
      current.qty = Math.max(0, current.qty + delta)
      if (current.qty === 0) delete next[p.id]
      else next[p.id] = current
      onChange && onChange(Object.values(next))
      return next
    })
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {products.map(p => (
        <ProductCard key={p.id} product={p} onAdd={handleAdd} qty={cart[p.id]?.qty || 0} />
      ))}
    </div>
  )
}
