'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { isAdminRole } from '@/lib/supabase/admin-roles'
import { Lock, Mail, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

function AdminLoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/admin'
  const errorParam = searchParams.get('error')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message || 'Invalid login credentials')
        setIsLoading(false)
        return
      }

      // Verify profile role in public.profiles
      const { data: profile, error: profileError } = (await (supabase
        .from('profiles') as any)
        .select('role, status')
        .eq('id', data.user.id)
        .single()) as { data: any, error: any }

      if (profileError || !profile || !isAdminRole(profile.role)) {
        toast.error('Unauthorized: Your account does not have administrative access.')
        await supabase.auth.signOut()
        setIsLoading(false)
        return
      }

      toast.success('Authentication successful! Loading control panel...')
      router.push(redirectTo)
      router.refresh()
    } catch (err: any) {
      console.error('Login error:', err)
      toast.error('An unexpected error occurred during login')
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0056b3] to-[#2ecc71] flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            O
          </div>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-4">
          Staff Portal Login
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Authorized administrative & executive personnel only.
        </p>
      </div>

      {errorParam === 'unauthorized' && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          Access denied: Valid administrative privileges required.
        </div>
      )}

      {/* Login Card */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-8 shadow-2xl text-white">
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Staff Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ocean.lk"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:bg-white/10 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-gray-300">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#2ecc71] focus:bg-white/10 transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#2ecc71] hover:bg-[#27ae60] text-[#001529] font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 active:scale-98"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying Credentials...
                </>
              ) : (
                <>
                  Access Dashboard <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Security Notice */}
      <div className="text-center mt-8 text-[11px] text-gray-500">
        Protected by Supabase Zero-Trust Row-Level Security & PKCE Encryption.
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#001529] via-[#002845] to-[#001529] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <Suspense fallback={<div className="text-white text-xs flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Initializing security context...</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  )
}
