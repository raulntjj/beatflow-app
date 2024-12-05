"use client";

import { useState } from "react";
import LogoNavbar from "../navbar-logo";
import NavbarItems from "./navbar-items";
import Notifications from "../../../app/notifications/page";

export default function NavbarDesktop() {
  const [isOpen, setIsOpen] = useState(false); // Estado movido para o componente pai

  return (
    <aside className="relative hidden md:block tablet:w-fit xl:w-[244px]">
      <div className="relative z-50 h-full p-1 tablet:p-4 bg-background border-r-[2px] border-zinc-700 ">
        <div className="relative z-10 h-full w-full flex flex-col px-3 pt-2 pb-5">
          <div className="pb-6 tablet:pb-6 mb-5">
            <LogoNavbar />
          </div>
          {/* Passando o estado e a função para o NavbarItems */}
          <NavbarItems isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </div>
      <div
        className={`absolute z-10 top-0 left-full h-full w-[350px] bg-background 
          border-r-[2px] border-zinc-700 shadow-lg py-4 transition-all duration-300 ease-in-out 
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Notifications />
      </div>
    </aside>
  );
}
