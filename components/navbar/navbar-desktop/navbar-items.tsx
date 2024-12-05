import { UserContext } from "@/context/user-context";
import { Heart, Home } from "lucide-react";
import Link from "next/link";
import { useContext, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { GoHome, GoHomeFill } from "react-icons/go";
import { HiOutlineUserGroup, HiUserGroup } from "react-icons/hi2";
import CreatePost from "../../user/create-post";
import ProfilePhoto from "../../user/profile-photo";
import PlusOptions from "../plus-options";
import { usePathname } from "next/navigation";
import CreateProjects from "../../user/create-projects";





interface NavbarItemsProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function NavbarItems({ isOpen, setIsOpen }: NavbarItemsProps) {
  const userData = useContext(UserContext);
  const pathname = usePathname(); 

  return (
    <nav className="h-full w-full flex flex-col justify-between space-y-7">
      <div className="flex flex-col space-y-7">
        <Link
          key={'home'}
          href={`/feed`}
          className={`flex w-full justify-center tablet:justify-start items-center`}
        >
          { pathname === "/feed" ? <GoHomeFill className="tablet:mr-3 h-7 w-7" /> : <GoHome className="tablet:mr-3 h-7 w-7" />}
          
          <span className="hidden tablet:block">Página inicial</span>
        </Link>
        <Link
          key={'projects'}
          href={`/projects`}
          className={`flex w-full justify-center tablet:justify-start items-center`}
          >
          { pathname === "/projects" ? <HiUserGroup className="tablet:mr-3 h-7 w-7" /> : <HiOutlineUserGroup className="tablet:mr-3 h-7 w-7" />}
          
          <span className="hidden tablet:block">Projetos</span>
        </Link>
        <button className="flex w-full justify-center tablet:justify-start items-center" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ?  <FaHeart className="tablet:mr-3 h-7 w-7" /> : <Heart className="tablet:mr-3 h-7 w-7" />} 
          <span className="hidden tablet:block">Notificações</span>
        </button>
        <CreatePost />
        <CreateProjects />
        <Link
          href={`/profile/` + userData?.user?.user}
          className="flex w-full justify-center tablet:justify-start items-center"
        >
          <ProfilePhoto
            src={userData?.user?.profile_photo_temp || ""}
            alt={userData?.user?.name || ""}
            className="tablet:mr-3"
          />
          <span className="hidden tablet:block">Perfil</span>
        </Link>
      </div>
      <PlusOptions />
    </nav>
  );
}
