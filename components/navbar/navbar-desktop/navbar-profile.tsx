"use client";

import { removeCookie } from "@/utils/removeCookie";
import { Button } from "../../ui/button";
import { UserAvatar } from "../../user/user-avatar";
import { redirect } from "next/navigation";

export default function ProfileNavbar() {
  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();

    removeCookie();

    redirect("/login");
  };

  return (
    <aside className="pl-16 md:w-[319px] hidden lg:block">
      <div className="mt-6">
        <div className="w-full flex justify-between items-center px-2">
          <UserAvatar />
          <Button
            onClick={handleLogout}
            variant={"link"}
            className="no-underline"
          >
            Sair
          </Button>
        </div>
      </div>
    </aside>
  );
}
