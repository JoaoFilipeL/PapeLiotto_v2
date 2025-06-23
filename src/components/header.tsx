'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Package, FileText, ShoppingCart, BarChart2, Settings, LogOut } from "lucide-react"
import UserDropdown from "./user"
import { useAuth } from "@/context/AuthContext"

const menuItems = [
  { name: "Estoque", icon: Package, path: "/" },
  { name: "Orçamentos", icon: FileText, path: "/orçamentos" },
  { name: "Pedidos", icon: ShoppingCart, path: "/pedidos" },
  { name: "Relatórios", icon: BarChart2, path: "/relatorios" },
  { name: "Configurações", icon: Settings, path: "/configuracoes" },
]

export default function Header() {
  const [activeItem, setActiveItem] = useState("Estoque")
  const {user, signOut} = useAuth();
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push("/login")
  }

  const userData = {
    name: user?.user_metadata.full_name ||  "Usuário",
    email: user?.email || "",
  }

  return (
    <header className="bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <Package className="w-10 h-10 text-white" strokeWidth={1.5} />
            <h1 className="text-2xl font-bold">Atitude Papelaria</h1>
          </div>
          <UserDropdown userName={userData.name} userEmail={userData.email} />
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
          <button onClick={handleLogout} className="p-2 rounded-md hover:bg-gray-800" title="Sair">
            <LogOut className="w-5 h-5" />
          </button>
        </nav>
      </div>

      <div className="border-t border-gray-500 w-full"></div>
    </header>
  )
}
