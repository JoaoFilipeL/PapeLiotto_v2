"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Package, FileText, ShoppingCart, BarChart2, Settings, LogOut, UserSearch, UserPlus } from "lucide-react"
import UserDropdown from "./user"
import { useAuth } from "@/context/AuthContext"
import AddNovoFuncionario from "./addNovoFuncionario"
import ListaFuncionarioModal from "./listFuncionarios"
import { Button } from "./ui/button"

const menuItems = [
  { name: "Estoque", icon: Package, path: "/" },
  { name: "Orçamentos", icon: FileText, path: "/orçamentos", disable: true },
  { name: "Pedidos", icon: ShoppingCart, path: "/pedidos", disable: true },
  { name: "Relatórios", icon: BarChart2, path: "/relatorios", disable: true },
  { name: "Configurações", icon: Settings, path: "/configuracoes", disable: true },
]

export default function Header() {
  const [activeItem, setActiveItem] = useState("Estoque")
  const { signOut } = useAuth()
  const router = useRouter()
  const [novoFuncionarioModal, setNovoFuncionarioModal] = useState(false)
  const [listaFuncionariosModal, setListaFuncionarioModal] = useState(false)

  const {user} = useAuth()

  const handleLogout = async () => {
    await signOut()
    router.push("/login")
  }

  return (
    <header className="bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <Package className="w-10 h-10 text-white" strokeWidth={1.5} />
            <h1 className="text-2xl font-bold">Atitude Papelaria</h1>
          </div>
          <div className="flex flex-row gap-2 items-center">
            {user?.user_metadata.role === 'admin' && 
            <div className="flex flex-row gap-2 item-center">
              <Button
              variant="outline"
              size="icon"
              onClick={() => setListaFuncionarioModal(true)} className="rounded-full border-0 bg-transparent hover:bg-gray-800 cursor-pointer">
                <UserSearch className="h-4 w-4 text-white"/> 
              </Button>
              <Button
              variant="outline"
              size="icon"
              onClick={() => setNovoFuncionarioModal(true)} className="rounded-full border-0 bg-transparent hover:bg-gray-800 cursor-pointer">
                <UserPlus className="h-4 w-4 text-white"/> 
              </Button>
            </div>
            }
            <UserDropdown />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-500 w-full"></div>

      <div className="container mx-auto px-4">
        <nav className="py-3 flex justify-between items-center">
          <div className="flex gap-2">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveItem(item.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md border border-white transition-colors ${
                  activeItem === item.name ? "bg-neutral-800" : "hover:bg-neutral-800"
                }`}
              >
                <a href={item.path} className="flex items-center gap-2">
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </a>
              </button>
            ))}
          </div>
          <button onClick={handleLogout} className="p-2 rounded-md hover:bg-gray-800 cursor-pointer" title="Sair">
            <LogOut className="w-5 h-5" />
          </button>
        </nav>
      </div>

      <AddNovoFuncionario open={novoFuncionarioModal} setOpen={setNovoFuncionarioModal}/>
      <ListaFuncionarioModal open={listaFuncionariosModal} setOpen={(setListaFuncionarioModal)}/>

      <div className="border-t border-gray-500 w-full"></div>
    </header>
  )
}
