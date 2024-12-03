import { MenuIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import NavbarLogout from "./navbar-logout";

export default function PlusOptions(){
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full justify-center tablet:justify-start items-center">
          <MenuIcon className="tablet:mr-3 h-7 w-7" />
          <span className="hidden tablet:block">
            Mais
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="tablet:w-[200px] bg-background border-zinc-700 p-2">
        <DropdownMenuGroup>
          <NavbarLogout />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}