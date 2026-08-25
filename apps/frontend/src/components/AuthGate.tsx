'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { NEXT_PUBLIC_API_BASE_URL } from '../utils/api'

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [status, setStatus] = useState<'checking' | 'ok' | 'denied'>('checking')

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken')
    if (!token) {
      setStatus('denied')
      router.replace('/admin')
      return
    }
    fetch(NEXT_PUBLIC_API_BASE_URL.VALIDATE_TOKEN, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (res.ok) return setStatus('ok')
        sessionStorage.removeItem('adminToken')
        sessionStorage.removeItem('adminUser')
        setStatus('denied')
        router.replace('/admin')
      })
      .catch(() => {
        setStatus('denied')
        router.replace('/admin')
      })
  }, [router])

  if (status !== 'ok') {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    )
  }
  return <>{children}</>
}
