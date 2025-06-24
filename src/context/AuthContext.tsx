'use client'

import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null
  user: User | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<string | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const supabase = createClient()
  const router = useRouter()

  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      setLoading(false)
    }

    getSession()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [supabase])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    const { error, data } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
    } else if (data.session) {
      setSession(data.session)
      router.push('/')
    }

    setLoading(false)
  }

  const signOut = async () => {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signOut()

    if (error) {
      setError(error.message)
    } else {
      setSession(null)
      router.push('/login')
    }

    setLoading(false)
  }

  const resetPassword = async (email: string): Promise<string | null> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/resetPassword' 
    })

    if (error) return error.message
    return null
  }

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, error, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um <AuthProvider>')
  }
  return context
}
