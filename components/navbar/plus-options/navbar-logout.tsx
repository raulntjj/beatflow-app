import { LogOut } from "lucide-react";
import { DropdownMenuItem, DropdownMenuShortcut } from "../../ui/dropdown-menu";
import { removeCookie } from "@/utils/removeCookie";
import { redirect } from "next/navigation";

export default function NavbarLogout() {
  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();

    removeCookie();

    redirect("/login");
  };

  return (
    <DropdownMenuItem className="text-foreground cursor-pointer">
      <LogOut />
      <button onClick={handleLogout}>Sair</button>
      <DropdownMenuShortcut>⇧</DropdownMenuShortcut>
    </DropdownMenuItem>
  );
}
