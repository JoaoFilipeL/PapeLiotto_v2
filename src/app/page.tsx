"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Header from "@/components/header"
import Stock from "@/components/stock"
import { useAuth } from "@/context/AuthContext"

export default function Estoque() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-lg">Carregando...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <Stock />
      </main>
    </div>
  )
}
