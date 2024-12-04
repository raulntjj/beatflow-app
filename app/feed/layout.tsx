import React from "react";
import NavbarDesktop from "../../components/navbar/navbar-desktop";
import SearchUsers from "../../components/navbar/search-users";
import { ScrollArea } from "../../components/ui/scroll-area";
import ProfileNavbar from "../../components/navbar/navbar-desktop/navbar-profile";
import NavbarMobile from "../../components/navbar/navbar-mobile";

export default function FeedLayout({
  children,
  userToken,
}: {
  children: React.ReactNode;
  userToken: string;
}) {
  return (
    <main className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        <NavbarDesktop />
        <NavbarMobile />
        <ScrollArea className="flex flex-1">
          <div className="h-full w-full flex flex-row justify-center items-stretch">
            <div className="mt-4 w-full max-w-[630px]">
              <div className="flex-1 w-full">
                <div className="hidden md:block">
                  <SearchUsers />
                </div>
                <div className="container mx-auto mt-[70px] tablet:mt-0 p-4">{children}</div>
              </div>
            </div>
            <ProfileNavbar />
          </div>
        </ScrollArea>
      </div>
    </main>
  );
}
