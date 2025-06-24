import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from "./ui/input";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface ButtonEditProductProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddNovoFuncionario({ open, setOpen }: ButtonEditProductProps) {

  const [nome, setNome] = useState<string>('');
  const [cargo, setCargo] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [senha, setSenha] = useState<string>('');

async function createNewAccount() {

    const res = await fetch('/api/newUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password: senha,
        fullName: nome,
        role: cargo,
      }),
    });

    const responseData = await res.json();

    if (res.ok) {
      console.log('Usuário criado com sucesso!!');
      setOpen(false)
    } else {
      console.error('Erro ao criar usuário:', responseData.error);
    }
}

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-black rounded-lg border border-gray-600 p-6 w-full max-w-md mx-4 text-white">
        <DialogHeader>
          <DialogTitle className='text-lg'>
            Adicionar um novo funcionario
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <label className="block text-white font-medium mb-2">
            Nome do funcionario
          </label>
          <Input
            placeholder='Funcionario'
            onChange={(e) => setNome(e.target.value)}
            className="w-full bg-black border border-white rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:border-gray-400 focus:outline-none text-left"
          />

          <label className="block text-white font-medium mb-2">
            Cargo do funcionario
          </label>
          <Select onValueChange={setCargo}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Cargo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Gerente</SelectItem>
              <SelectItem value="funcionario">Funcionário</SelectItem>
            </SelectContent>
          </Select>

          <label className="block text-white font-medium mb-2">
            Email do funcionário
          </label>
          <Input
            placeholder='funcionario@papeliotto.com.br'
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black border border-white rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:border-gray-400 focus:outline-none text-left"
          />
        </div>

        <label className="block text-white font-medium mb-2">
            Senha da conta
          </label>
          <Input
            placeholder='*********'
            type="password"
            onChange={(e) => setSenha(e.target.value)}
            className="w-full bg-black border border-white rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:border-gray-400 focus:outline-none text-left"
          />

        <div className='flex flex-row justify-end gap-4 mt-8'>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-lg"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={createNewAccount}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg"
          >
            Criar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
