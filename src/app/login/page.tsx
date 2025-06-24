'use client'

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Package, Eye, EyeOff } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"

export default function Login() {
  const { signIn, resetPassword } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [resetModalOpen, setResetModalOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState("")
  const [resetError, setResetError] = useState("")
  const [resetSuccess, setResetSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    setIsLoading(true)
    setError("")

    try {
      await signIn(email, password)
    } catch {
      setError("Email ou senha inválidos")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setResetError("")
    setResetSuccess(false)
    const error = await resetPassword(resetEmail)
    if (error) setResetError(error)
    else setResetSuccess(true)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-neutral-700 rounded-2xl p-12 w-full max-w-4xl">
        <div className="flex items-center gap-16">
          <div className="flex-shrink-0">
            <Package className="text-white" size={300} strokeWidth={1.5} />
          </div>

          <div className="flex-1">
            <h1 className="text-white text-5xl font-normal mb-12">Atitude Papelaria</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label htmlFor="email" className="block text-white text-lg mb-3">Email</label>
                <Input id="email" name="email" type="email" placeholder="usuario@email.com" className="bg-black border-gray-600 text-white placeholder-gray-400 h-12 text-lg rounded-lg" required />
              </div>

              <div>
                <label htmlFor="password" className="block text-white text-lg mb-3">Senha</label>
                <div className="relative">
                  <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••••••••" className="bg-black border-gray-600 text-white placeholder-gray-400 h-12 text-lg rounded-lg pr-12" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="flex justify-end mt-2 cursor-pointer hover:underline">
                  <button onClick={() => setResetModalOpen(true)} type="button" className="text-white text-sm hover:underline">
                    Esqueceu sua senha?
                  </button>
                </div>
              </div>

              <Dialog open={resetModalOpen} onOpenChange={setResetModalOpen}>
                <DialogContent className="bg-neutral-700 border-gray-600">
                  <DialogHeader>
                    <DialogTitle className="text-white text-xl">Redefinir Senha</DialogTitle>
                  </DialogHeader>
                  {resetSuccess ? (
                    <div className="text-white text-center p-4">
                      Um email foi enviado com instruções para redefinir sua senha.
                    </div>
                  ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <div>
                        <label htmlFor="resetEmail" className="block text-white text-sm mb-2">Email:</label>
                        <Input id="resetEmail" name="resetEmail" type="email" placeholder="usuario@email.com" className="bg-black border-gray-600 text-white placeholder-gray-400" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required />
                      </div>
                      {resetError && <p className="text-red-400 text-sm">{resetError}</p>}
                      <Button type="submit" className="cursor-pointer w-full bg-white text-black hover:bg-gray-100">
                        Enviar email de recuperação
                      </Button>
                    </form>
                  )}
                </DialogContent>
              </Dialog>

              {error && <div className="text-red-400 text-sm text-center">{error}</div>}
              <div className="pt-4">
                <Button type="submit" disabled={isLoading} className="cursor-pointer w-full bg-white text-black hover:bg-gray-100 h-12 mb-3 text-lg font-medium rounded-lg disabled:opacity-50">
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </div>
              </form>
            </div>
          </div>
        </div>
      </div>
  )
}
