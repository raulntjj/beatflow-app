"use client"

import React from "react";
import NavbarDesktop from "../../components/navbar/navbar-desktop";
import SearchUsers from "../../components/navbar/search-users";
import { ScrollArea } from "../../components/ui/scroll-area";
import ProfileNavbar from "../../components/navbar/navbar-desktop/navbar-profile";
import NavbarMobile from "../../components/navbar/navbar-mobile";

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const users = [
    {
      id: 1,
      name: "Gustavim da 12",
      username: "gustavimda12",
      avatarSrc: "",
    },
    {
      id: 2,
      name: "Medina do B da Mirage",	
      username: "medinamirage",
      avatarSrc: "",
    },
    {
      id: 3,
      name: "Raul do DDos",
      username: "raulntjj",
      avatarSrc: "",
    },
    {
      id: 4,
      name: "Brunin VeryXit",
      username: "bruninho",
      avatarSrc: "",
    },
    {
      id: 5,
      name: "Brunin VeryXit",
      username: "bruninho",
      avatarSrc: "",
    },
    {
      id: 6,
      name: "Brunin VeryXit",
      username: "bruninho",
      avatarSrc: "",
    },
    {
      id: 7,
      name: "Brunin VeryXit",
      username: "bruninho",
      avatarSrc: "",
    },
    {
      id: 8,
      name: "Jonao Bazucador",
      username: "reazew",
      avatarSrc: "",
    },
  ];

  return (
    <main className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* Barra Lateral */}
        <NavbarDesktop />
        <NavbarMobile />
        <ScrollArea className="flex flex-1">
          <div className="h-full w-full flex flex-row justify-center items-stretch">
            {/* Conteúdo Principal */}
            <div className="mt-4 w-full max-w-[630px]">
              <div className="flex-1 w-full">
                <div className="hidden md:block">
                  <SearchUsers users={users} />
                </div>
                <div className="container mx-auto mt-[70px] tablet:mt-6 p-4">{children}</div>
              </div>
            </div>

            {/* Perfil */}
            <ProfileNavbar />
          </div>
        </ScrollArea>
      </div>
    </main>
  );
}
