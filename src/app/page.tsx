'use client'

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Header from "@/components/header"
import Stock from "@/components/stock"

import { useAuth } from "@/context/AuthContext"

export default function Estoque() {
  const router = useRouter()
  const {user} = useAuth();

  // if (!isLoaded) {
  //   return (
  //     <div className="min-h-screen bg-black flex items-center justify-center">
  //       <div className="text-white text-xl">Carregando...</div>
  //     </div>
  //   )
  // }

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [])

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <Stock />
      </main>
    </div>
  )
}
