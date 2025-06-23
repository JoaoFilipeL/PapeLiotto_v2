'use client'

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Package, Eye, EyeOff, Mail } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"

export default function Login() {
  const {signIn} = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // const [isResetting, setIsResetting] = useState(false)
  // const [resetSuccess, setResetSuccess] = useState(false)

  const [accessRequestOpen, setAccessRequestOpen] = useState(false)
  const [isRequestLoading, setIsRequestLoading] = useState(false)
  const [requestSuccess, setRequestSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    console.log(formData.values())
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

  // const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault()
  //   if (!loading) return

  //   const formData = new FormData(e.currentTarget)
  //   const resetEmail = formData.get('resetEmail') as string

  //   setIsResetting(true)
  //   setError("")

  //   try {
  //     await signIn.create({
  //       strategy: "reset_password_email_code",
  //       identifier: resetEmail,
  //     })
  //     setResetSuccess(true)
  //   } catch {
  //     setError("Erro ao enviar email de recuperação")
  //   } finally {
  //     setIsResetting(false)
  //   }
  // }

  const handleAccessRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsRequestLoading(true)

    // const formData = new FormData(e.currentTarget)
    // const requestName = formData.get('requestName')
    // const requestEmail = formData.get('requestEmail')
    // const requestMessage = formData.get('requestMessage')

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setRequestSuccess(true)
      setTimeout(() => {
        setAccessRequestOpen(false)
        setRequestSuccess(false)
      }, 2000)
    } catch (err) {
      console.error("Erro ao enviar solicitação:", err)
    } finally {
      setIsRequestLoading(false)
    }
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
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="usuario@email.com"
                  className="bg-black border-gray-600 text-white placeholder-gray-400 h-12 text-lg rounded-lg"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-white text-lg mb-3">Senha</label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••••"
                    className="bg-black border-gray-600 text-white placeholder-gray-400 h-12 text-lg rounded-lg pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && <div className="text-red-400 text-sm text-center">{error}</div>}

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-white text-black hover:bg-gray-100 h-12 text-lg font-medium rounded-lg disabled:opacity-50"
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </div>
            </form>

            <div className="text-right mt-2">
              <Dialog>
                <DialogTrigger asChild>
                  <button type="button" className="text-white text-sm hover:underline">
                    Esqueceu sua senha?
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-neutral-700 border-gray-600">
                  <DialogHeader>
                    <DialogTitle className="text-white text-xl">Recuperar Senha</DialogTitle>
                  </DialogHeader>
                  {/* {!resetSuccess ? (
                    <form onSubmit={handlePasswordReset} className="space-y-4">
                      <div>
                        <label htmlFor="resetEmail" className="block text-white text-sm mb-2">
                          Digite seu email para recuperar a senha:
                        </label>
                        <Input
                          id="resetEmail"
                          name="resetEmail"
                          type="email"
                          placeholder="usuario@email.com"
                          className="bg-black border-gray-600 text-white placeholder-gray-400"
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={isResetting}
                        className="w-full bg-white text-black hover:bg-gray-100"
                      >
                        {isResetting ? "Enviando..." : "Enviar Email de Recuperação"}
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center py-4">
                      <Mail className="w-12 h-12 text-green-400 mx-auto mb-4" />
                      <p className="text-white">Email de recuperação enviado! Verifique sua caixa de entrada.</p>
                    </div>
                  )} */}
                </DialogContent>
              </Dialog>
            </div>

            <div className="text-center mt-6">
              <Dialog open={accessRequestOpen} onOpenChange={setAccessRequestOpen}>
                <DialogTrigger asChild>
                  <button type="button" className="text-white text-sm hover:underline">
                    Não tem conta? Entre em contato aqui!
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-neutral-700 border-gray-600">
                  <DialogHeader>
                    <DialogTitle className="text-white text-xl">Solicitar Acesso</DialogTitle>
                  </DialogHeader>
                  {!requestSuccess ? (
                    <form onSubmit={handleAccessRequest} className="space-y-4">
                      <div>
                        <label htmlFor="requestName" className="block text-white text-sm mb-2">Nome Completo:</label>
                        <Input
                          id="requestName"
                          name="requestName"
                          type="text"
                          placeholder="Seu nome completo"
                          className="bg-black border-gray-600 text-white placeholder-gray-400"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="requestEmail" className="block text-white text-sm mb-2">Email:</label>
                        <Input
                          id="requestEmail"
                          name="requestEmail"
                          type="email"
                          placeholder="usuario@email.com"
                          className="bg-black border-gray-600 text-white placeholder-gray-400"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="requestMessage" className="block text-white text-sm mb-2">Motivo da solicitação:</label>
                        <Textarea
                          id="requestMessage"
                          name="requestMessage"
                          placeholder="Explique por que precisa de acesso ao sistema..."
                          className="bg-black border-gray-600 text-white placeholder-gray-400 min-h-[100px]"
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={isRequestLoading}
                        className="w-full bg-white text-black hover:bg-gray-100"
                      >
                        {isRequestLoading ? "Enviando..." : "Enviar Solicitação"}
                      </Button>
                    </form>
                  ) : (
                    <div className="text-center py-4">
                      <Mail className="w-12 h-12 text-green-400 mx-auto mb-4" />
                      <p className="text-white">Solicitação enviada com sucesso! Entraremos em contato em breve.</p>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
