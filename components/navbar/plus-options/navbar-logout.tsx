import { LogOut } from "lucide-react";
import { DropdownMenuItem, DropdownMenuShortcut } from "../../ui/dropdown-menu";

export default function NavbarLogout(){
  return(
    <DropdownMenuItem className="text-foreground cursor-pointer">
      <LogOut />
      <span>Sair</span>
      <DropdownMenuShortcut>⇧</DropdownMenuShortcut>
    </DropdownMenuItem>
  )
}