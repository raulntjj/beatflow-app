import { PlusSquare, User, Users } from "lucide-react";
import Home from "../../../app/page";
import { useState } from "react";
import NavbarHeader from "./navbar-header";
import NavbarMobileItems from "./navbar-items";



export default function NavbarMobile(){

  return (
    <div>
      <NavbarHeader />
      <NavbarMobileItems />
    </div>
  );
};