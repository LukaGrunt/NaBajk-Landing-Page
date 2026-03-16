'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, getSession } from '@/lib/supabase'
import '../admin.css'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    // Check if already logged in
    async function checkSession() {
      const { session } = await getSession()
      if (session) {
        router.push('/admin')
      } else {
        setCheckingSession(false)
      }
    }
    checkSession()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { data, error: signInError } = await signIn(email, password)

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    if (data.session) {
      router.push('/admin')
    }
  }

  if (checkingSession) {
    return (
      <div className="loginContainer">
        <div className="loading">
          <div className="spinner" />
        </div>
      </div>
    )
  }

  return (
    <div className="loginContainer">
      <div className="loginCard">
        <div className="loginLogo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="NaBajk" />
          <h1 className="loginTitle">Admin Dashboard</h1>
          <p className="loginSubtitle">Sign in to manage NaBajk</p>
        </div>

        <form onSubmit={handleSubmit} className="loginForm">
          {error && <div className="loginError">{error}</div>}

          <div className="formGroup">
            <label htmlFor="email" className="formLabel">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="formInput"
              placeholder="admin@nabajk.si"
              required
              autoComplete="email"
            />
          </div>

          <div className="formGroup">
            <label htmlFor="password" className="formLabel">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="formInput"
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="loginBtn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
