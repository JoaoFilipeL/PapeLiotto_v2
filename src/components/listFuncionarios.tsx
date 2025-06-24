import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState, useEffect } from "react";
import { Button } from './ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface ButtonEditProductProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface User {
  id: string;
  email: string;
  user_metadata: {
    full_name: string;
    role: string;
  }
}

export default function ListaFuncionarioModal({ open, setOpen }: ButtonEditProductProps) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetch('/api/newUser', {
          method: 'GET',
        });

        if (!res.ok) {
          console.error('Erro ao buscar usuários:', await res.text());
          return;
        }

        const data = await res.json();
        setUsers(data.users || []);
      } catch (error) {
        console.error('Erro na requisição:', error);
      }
    }

    if (open) {
      loadUsers();
    }
  }, [open]);

async function removeUser(id: string) {
  try {
    const res = await fetch('/api/newUser', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      console.log("Usuário deletado com sucesso!");
      setUsers((old) => old.filter((u) => u.id !== id));
    } else {
      const errorText = await res.text();
      console.log("Não foi possível deletar o usuário:", errorText);
    }
  } catch (error) {
    console.error("Erro ao tentar deletar usuário:", error);
  }
}

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-black rounded-lg border border-gray-600 p-6 w-full max-w-4xl mx-4 text-white">
        <DialogHeader>
          <DialogTitle className='text-lg'>
            Lista de funcionários
          </DialogTitle>
        </DialogHeader>

        <div className="mt-10 overflow-auto max-h-96 rounded-md border border-gray-700">
          <Table className="min-w-full bg-neutral-800 rounded-md">
            <TableHeader>
              <TableRow className="border-b border-gray-700">
                <TableHead className="px-4 py-2 text-gray-300 font-semibold">Email</TableHead>
                <TableHead className="px-4 py-2 text-gray-300 font-semibold">Nome</TableHead>
                <TableHead className="px-4 py-2 text-gray-300 font-semibold">Cargo</TableHead>
                <TableHead className="px-4 py-2 text-gray-300 font-semibold">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  className="cursor-pointer"
                >
                  <TableCell className="px-4 py-2 text-white text-sm">{user.email}</TableCell>
                  <TableCell className="px-4 py-2 text-white text-sm">{user.user_metadata.full_name}</TableCell>
                  <TableCell className="px-4 py-2 text-white text-sm">{user.user_metadata.role === 'admin' ? 'Gerente' : 'Funcionário'}</TableCell>
                  <TableCell className="px-4 py-2 text-white text-sm">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeUser(user.id)}
                      disabled={user.user_metadata.role === 'admin'}
                    >
                      Remover
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-400 px-4 py-6">
                    Nenhum funcionário cadastrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
