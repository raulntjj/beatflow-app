"use client"

import { useState } from "react";
import LogoNavbar from "../navbar-logo";
import NavbarItems from "./navbar-items";

const [isOpen, setIsOpen] = useState(false);

export default function NavbarDesktop() {

  return (
    <aside className="relative z-10 hidden md:block tablet:w-fit xl:w-[244px] p-1 tablet:p-4 bg-background border-r-[2px] border-zinc-700 ">
      <div className="h-full w-full flex flex-col px-3 pt-2 pb-5">
        <div className="py-6 tablet:pb-6 mb-5">
          <LogoNavbar />
        </div>
        <NavbarItems isOpen={isOpen} setIsOpen={setIsOpen}/>
      </div>
      <div 
        className={`absolute z-0 top-0 left-full h-full tablet:w-[244px] bg-white border-r-[2px] border-zinc-700
        shadow-lg border p-4 
        transition-all duration-300 ease-in-out
        ${isOpen 
          ? 'translate-x-0' 
          : '-translate-x-full'}`}
      >
        <h3 className="text-lg font-bold mb-2">Notificações</h3>
        <p>Conteúdo do menu</p>
      </div>
    </aside>
  )
}