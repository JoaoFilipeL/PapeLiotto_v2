'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function ResetarSenha() {
  const router = useRouter()
  const supabase = createClient()
  const searchParams = useSearchParams()

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const accessToken = searchParams.get('access_token')
    if (!accessToken) {
      setError('Token de redefinição inválido.')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/login'), 3000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-md bg-neutral-800 p-8 rounded-lg border border-gray-600">
        <h1 className="text-2xl font-semibold mb-6">Redefinir Senha</h1>

        {success ? (
          <p className="text-green-400">Senha atualizada com sucesso! Redirecionando para o login...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Nova senha:</label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Confirme a nova senha:</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <Button type="submit" className="cursor-pointer w-full bg-white text-black hover:bg-gray-100">
              Redefinir Senha
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
