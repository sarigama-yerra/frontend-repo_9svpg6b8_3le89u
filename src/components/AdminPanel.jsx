import { useEffect, useState } from 'react'

export default function AdminPanel() {
  const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const token = localStorage.getItem('token')
  const [form, setForm] = useState({ name: '', price: '', category: '', image_url: '', available: true })
  const [list, setList] = useState([])

  const load = async () => {
    const res = await fetch(`${base}/api/products`)
    setList(await res.json())
  }

  useEffect(() => { load() }, [])

  const save = async (e) => {
    e.preventDefault()
    const payload = { ...form, price: Number(form.price) }
    await fetch(`${base}/api/products`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) })
    setForm({ name: '', price: '', category: '', image_url: '', available: true })
    load()
  }

  const toggle = async (id, available) => {
    await fetch(`${base}/api/products/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ available }) })
    load()
  }

  const remove = async (id) => {
    await fetch(`${base}/api/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    load()
  }

  return (
    <div className="space-y-4">
      <form onSubmit={save} className="bg-white border border-gray-200 rounded-2xl p-4">
        <h3 className="font-semibold mb-3">Add Product</h3>
        <div className="grid grid-cols-2 gap-3">
          <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
          <input className="input" placeholder="Price" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} />
          <input className="input col-span-2" placeholder="Category" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} />
          <input className="input col-span-2" placeholder="Image URL" value={form.image_url} onChange={e=>setForm(f=>({...f,image_url:e.target.value}))} />
          <label className="col-span-2 text-sm flex items-center gap-2">
            <input type="checkbox" checked={form.available} onChange={e=>setForm(f=>({...f,available:e.target.checked}))} />
            Available
          </label>
        </div>
        <button className="mt-3 px-4 py-2 rounded-lg bg-gray-900 text-white">Save</button>
      </form>

      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <h3 className="font-semibold mb-3">Products</h3>
        <div className="space-y-3">
          {list.map(p => (
            <div key={p.id} className="flex items-center justify-between border rounded-lg p-3">
              <div>
                <div className="font-medium">{p.name} <span className="text-gray-500">₹{p.price}</span></div>
                <div className="text-xs text-gray-500">{p.category}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggle(p.id, !p.available)} className="px-3 py-1 text-sm rounded bg-gray-100">{p.available ? 'Disable' : 'Enable'}</button>
                <button onClick={() => remove(p.id)} className="px-3 py-1 text-sm rounded bg-red-50 text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
