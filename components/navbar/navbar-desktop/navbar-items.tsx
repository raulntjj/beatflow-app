import { Heart, Home } from "lucide-react";
import Link from "next/link";
import { useContext, useState } from "react";
import { HiOutlineUserGroup } from "react-icons/hi2";
import ProfilePhoto from "../../user/profile-photo";
import CreatePost from "../../user/create-post";
import PlusOptions from "../plus-options";
import { UserContext } from "@/context/user-context";

export default function NavbarItems() {

  const userData = useContext(UserContext);

  const navbarItems = [
    { icon: Home, label: "Página inicial", href: "/", key: "home" },
    {
      icon: HiOutlineUserGroup,
      label: "Projetos",
      href: "projects",
      key: "projects",
    },
    { icon: Heart, label: "Notificações", href: "/", key: "notifications" },
  ];

  const [activeTab, setActiveTab] = useState("home");

  return (
    <nav className="h-full w-full flex flex-col justify-between space-y-7">
      <div className="flex flex-col space-y-7">
        {navbarItems.map((item) => (
          <Link
            key={item.key}
            href={`/${item.href}`}
            className={`flex w-full justify-center tablet:justify-start items-center ${
              activeTab === item.key ? "secondary" : "ghost"
            }`}
            onClick={() => setActiveTab(item.key)}
          >
            <item.icon className="tablet:mr-3 h-7 w-7" />
            <span className="hidden tablet:block">{item.label}</span>
          </Link>
        ))}
        <CreatePost />
        <Link
          href={`/profile/` + userData?.user?.user}
          className="flex w-full justify-center tablet:justify-start items-center"
        >
          <ProfilePhoto src="" alt="" className="tablet:mr-3" />
          <span className="hidden tablet:block">Perfil</span>
        </Link>
      </div>
      <PlusOptions />
    </nav>
  );
}