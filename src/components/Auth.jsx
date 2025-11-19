import { useEffect, useState } from 'react'

export default function Auth({ onAuth }) {
  const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) onAuth({ token })
  }, [])

  const login = async (e) => {
    e.preventDefault()
    setError('')
    const body = new URLSearchParams()
    body.append('username', form.email)
    body.append('password', form.password)
    const res = await fetch(`${base}/api/auth/token`, { method: 'POST', body })
    if (!res.ok) { setError('Invalid credentials'); return }
    const d = await res.json()
    localStorage.setItem('token', d.access_token)
    onAuth({ token: d.access_token })
  }

  const register = async (e) => {
    e.preventDefault()
    setError('')
    const res = await fetch(`${base}/api/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.name, email: form.email, password: form.password }) })
    if (!res.ok) { const x = await res.json(); setError(x.detail||'Failed to register'); return }
    // auto login
    await login(e)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4">
      <div className="flex items-center gap-3 mb-4">
        <button className={`px-3 py-1 rounded ${mode==='login'?'bg-gray-900 text-white':'bg-gray-100'}`} onClick={()=>setMode('login')}>Login</button>
        <button className={`px-3 py-1 rounded ${mode==='register'?'bg-gray-900 text-white':'bg-gray-100'}`} onClick={()=>setMode('register')}>Register</button>
      </div>
      <form onSubmit={mode==='login'?login:register} className="space-y-3">
        {mode==='register' && (
          <input className="input w-full" placeholder="Full name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
        )}
        <input className="input w-full" placeholder="Email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
        <input className="input w-full" placeholder="Password" type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} />
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button className="w-full px-4 py-2 rounded-lg bg-purple-600 text-white">{mode==='login'?'Login':'Create account'}</button>
      </form>
    </div>
  )
}
