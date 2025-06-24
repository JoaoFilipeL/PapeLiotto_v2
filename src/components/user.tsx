'use client'

import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { User } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

interface UserDropdownProps {
  className?: string
}

export default function UserDropdown({ className }: UserDropdownProps) {
  const [open, setOpen] = useState(false)
  const {user} = useAuth();

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={cn("rounded-full border-0 bg-transparent hover:bg-gray-800 cursor-pointer", className)}
        >
          <User className="h-5 w-5 text-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60 p-4">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium">
            <span className="text-muted-foreground">Nome: </span>
            {user?.user_metadata.full_name}
          </p>
          <p className="text-sm font-medium">
            <span className="text-muted-foreground">Email: </span>
            {user?.email}
          </p>
          <p className="text-sm font-medium">
            <span className="text-muted-foreground">Cargo: </span>
            {user?.user_metadata.role === 'admin' ? 'Gerente' : 'Funcionário'}
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
